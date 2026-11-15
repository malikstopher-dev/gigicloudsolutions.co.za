import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

async function snapshot(page: Page) {
  const box = await page.locator('.board-art .scene-ready canvas').boundingBox();
  expect(box).not.toBeNull();
  return sharp(await page.screenshot({clip: box!})).resize(160,120).removeAlpha().raw().toBuffer();
}

function changedPixels(a: Buffer, b: Buffer) {
  let changed = 0;
  for (let i = 0; i < a.length; i += 3)
    if (Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]) > 45) changed++;
  return changed / (a.length / 3);
}

test.describe('Live 3D boards', () => {
  test.use({viewport:{width:1440,height:1100}});

  test('IT board animates, rotates by drag and supports backup selection', async ({page}) => {
    test.setTimeout(420000);
    const errors: string[]=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto('/services/it-connectivity',{waitUntil:'domcontentloaded'});
    await page.locator('.board-art').scrollIntoViewIfNeeded();
    const scene = page.getByRole('group',{name:'IT & Connectivity interactive 3D concept',exact:true});
    await expect(page.locator('.board-art .scene-ready canvas')).toBeVisible({timeout:120000});
    await page.evaluate(()=>document.fonts.ready);
    await scene.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    // The static artwork must hand over to the live canvas.
    await expect(page.locator('.board-art > img')).toBeHidden();
    const first=await snapshot(page);
    await page.waitForTimeout(1800);
    expect(changedPixels(first,await snapshot(page))).toBeGreaterThan(0.02);
    // Dragging rotates the model through the same full-turn gesture as the hero.
    const box=(await scene.boundingBox())!;
    const x=box.x+box.width*0.3, y=box.y+box.height*0.5;
    await page.mouse.move(x,y);
    await page.mouse.down();
    await page.waitForTimeout(1800);
    const held=await snapshot(page);
    await page.mouse.move(x+box.width*0.3,y,{steps:8});
    await expect.poll(async()=>changedPixels(held,await snapshot(page)),{timeout:30000}).toBeGreaterThan(0.025);
    await page.mouse.up();
    // Switching to the backup route keeps the live scene running.
    await page.getByRole('button',{name:'Data backup'}).click();
    await expect(page.getByRole('button',{name:'Data backup'})).toHaveAttribute('aria-pressed','true');
    await expect(scene).toBeVisible();
    await page.waitForTimeout(600);
    const before=await snapshot(page);
    await page.waitForTimeout(1200);
    expect(changedPixels(before,await snapshot(page))).toBeGreaterThan(0.01);
    expect(errors).toEqual([]);
  });

  test('Solar board switches to the live night scene', async ({page}) => {
    test.setTimeout(420000);
    const errors: string[]=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto('/services/electrical-solar',{waitUntil:'domcontentloaded'});
    await page.locator('.board-art').scrollIntoViewIfNeeded();
    await expect(page.locator('.board-art .scene-ready canvas')).toBeVisible({timeout:120000});
    await expect(page.locator('.board-art > img')).toBeHidden();
    await page.getByRole('button',{name:'Night'}).click();
    // Mode change remounts the world as the night scene.
    await expect(page.locator('.board-art .scene-ready canvas')).toBeVisible({timeout:120000});
    const night=await snapshot(page);
    await page.waitForTimeout(1500);
    expect(changedPixels(night,await snapshot(page))).toBeGreaterThan(0.01);
    expect(await page.locator('.board-art .scene-ready canvas').count()).toBe(1);
    expect(errors).toEqual([]);
  });
});

test('Reduced motion keeps service boards on their static artwork',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/services/it-connectivity',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.board-art > img')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
});

test('Access reader confirmation stays readable above the live canvas',async({page})=>{
  test.setTimeout(420000);
  await page.goto('/services/security-access',{waitUntil:'domcontentloaded'});
  await page.locator('.board-art').scrollIntoViewIfNeeded();
  await expect(page.locator('.board-art .scene-ready canvas')).toBeVisible({timeout:120000});
  await page.getByRole('button',{name:'Access control'}).click();
  // Hold the short-lived confirmation while checking its stacking and expiry.
  await page.clock.install({time:0});
  await page.clock.pauseAt(1000);
  await page.getByRole('button',{name:'Try access reader'}).click();
  const note=page.locator('.reader-confirmation');
  await expect(note).toBeVisible();
  expect(await note.evaluate(el=>{
    const r=el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
  })).toBe(true);
  await page.clock.fastForward(2300);
  await expect(note).toHaveCount(0);
});

for (const width of [390,1440]) test(`Every service card has a live model and working link at ${width}px`,async({page})=>{
  test.setTimeout(420000);
  await page.setViewportSize({width,height:1000});
  await page.goto('/services',{waitUntil:'domcontentloaded'});
  const cards=page.locator('.service-card');
  await expect(cards).toHaveCount(5);
  for(let i=0;i<5;i++) {
    const card=cards.nth(i);
    await card.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    await expect(card.locator('.scene-ready canvas')).toBeVisible({timeout:120000});
    const scene=card.locator('.scene-canvas');
    await scene.focus();
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(/\/services$/);
    await expect(card.getByRole('link')).toHaveAttribute('href',/\/services\/.+/);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await cards.last().getByRole('link').click();
  await expect(page).toHaveURL(/\/services\/cloud-solutions$/);
});
