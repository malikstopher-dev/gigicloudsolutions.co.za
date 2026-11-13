import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

async function snapshot(page: Page) {
  const box = await page.locator('.scene-ready canvas').boundingBox();
  expect(box).not.toBeNull();
  return sharp(await page.screenshot({clip: box!})).resize(160,120).removeAlpha().raw().toBuffer();
}

function changedPixels(a: Buffer, b: Buffer) {
  let changed = 0;
  for (let i = 0; i < a.length; i += 3)
    if (Math.abs(a[i]-b[i])+Math.abs(a[i+1]-b[i+1])+Math.abs(a[i+2]-b[i+2]) > 45) changed++;
  return changed / (a.length / 3);
}

for (const width of [390,1440]) test.describe(`Active hero at ${width}px`, () => {
  test.use({viewport:{width,height:1000},hasTouch:width===390});
  test('Visible motion, pause, rotation, equipment separation and reset', async ({page}) => {
    // Several GPU readbacks plus touch/keyboard checks run sequentially in software-rendered CI.
    test.setTimeout(420000);
    const errors: string[]=[];
    page.on('pageerror', e=>errors.push(e.message));
    await page.goto('/',{waitUntil:'domcontentloaded'});
    const scene=page.getByRole('group',{name:'Interactive 3D equipment model',exact:true});
    await expect(page.locator('.scene-ready canvas')).toBeVisible({timeout:120000});
    await page.evaluate(()=>document.fonts.ready);
    await scene.evaluate(el=>el.scrollIntoView({block:'center',behavior:'instant'}));
    const first=await snapshot(page);
    await page.waitForTimeout(1800);
    // A substantial part of the image must move, not just a tiny connection light.
    expect(changedPixels(first,await snapshot(page))).toBeGreaterThan(0.025);

    await scene.getByRole('button',{name:'Pause animation'}).click();
    await expect(scene.getByRole('button',{name:'Resume animation'})).toBeVisible();
    await expect.poll(async()=>{
      const a=await snapshot(page);
      await page.waitForTimeout(300);
      return changedPixels(a,await snapshot(page));
    },{timeout:60000}).toBeLessThan(0.001);
    const paused=await snapshot(page);
    const box=(await scene.boundingBox())!;
    const x=box.x+box.width*0.35, y=box.y+box.height*0.5;
    if(width===390) {
      const session=await page.context().newCDPSession(page);
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
      for(let i=1;i<=6;i++) await session.send('Input.dispatchTouchEvent',{
        type:'touchMove',touchPoints:[{x:x+box.width*0.035*i,y}],
      });
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await session.detach();
    } else {
      await page.mouse.move(x,y);
      await page.mouse.down();
      await page.mouse.move(x+box.width*0.25,y,{steps:8});
      await page.mouse.up();
    }
    await expect.poll(async()=>changedPixels(paused,await snapshot(page)),{timeout:30000}).toBeGreaterThan(0.025);
    await scene.getByRole('button',{name:'Reset view'}).click();
    await scene.focus();
    const beforeKey=await snapshot(page);
    await page.keyboard.press('ArrowRight');
    await expect.poll(async()=>changedPixels(beforeKey,await snapshot(page)),{timeout:30000}).toBeGreaterThan(0.01);
    await scene.getByRole('button',{name:'Separate equipment'}).click();
    await expect(scene.getByRole('button',{name:'Assemble'})).toHaveAttribute('aria-pressed','true');
    await scene.getByRole('button',{name:'Reset view'}).click();
    await expect(scene.getByRole('button',{name:'Separate equipment'})).toHaveAttribute('aria-pressed','false');
    await scene.getByRole('button',{name:'Resume animation'}).click();
    await expect(scene.getByRole('button',{name:'Pause animation'})).toBeVisible();
    await page.screenshot({path:`test-results/active-hero-${width}.png`});
    if(width===390) {
      const current=(await scene.boundingBox())!;
      const x=current.x+current.width/2, y=current.y+current.height/2;
      const scrollBefore=await page.evaluate(()=>scrollY);
      const session=await page.context().newCDPSession(page);
      await session.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});
      for(let i=1;i<=6;i++) {
        await session.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y-i*20}]});
        await page.waitForTimeout(50);
      }
      await session.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBeGreaterThan(scrollBefore+20);
      await session.detach();
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    expect(errors).toEqual([]);
  });
});

test('Reduced motion retains the fallback and removes motion controls',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.static-sculpture img')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'Pause animation'})).toHaveCount(0);
  await expect(page.getByRole('link',{name:'Request a Quote'}).first()).toBeVisible();
});
