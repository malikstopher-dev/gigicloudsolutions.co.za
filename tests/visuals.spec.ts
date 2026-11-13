import {test,expect} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
const slugs=['it-connectivity','security-access','electrical-solar','web-graphic-design','cloud-solutions'];
for(const width of [390,768,1440])test(`Product artwork and controls at ${width}px`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width===390});const page=await context.newPage();
 for(const [i,slug] of slugs.entries()){
  await page.goto(`/services/${slug}`,{waitUntil:'domcontentloaded'});const board=page.locator('.visual-board');await board.scrollIntoViewIfNeeded();const last=board.locator('.board-controls button').last();if(width===390)await last.tap();else{await last.focus();await page.keyboard.press('Enter');}await expect(last).toHaveAttribute('aria-pressed','true');
  if(i===0)await expect(board.locator('.board-description')).toContainText('backup copy');
  if(i===1){await board.getByRole('button',{name:'Try access reader'}).click();await expect(board.getByRole('status')).toHaveText('Demo: access confirmed.');await expect(board.locator('.board-art img')).toHaveAttribute('src','/artwork/security-confirmed.webp');}
  if(i===2){await expect(board).toHaveClass(/night-state/);await expect(board.locator('.board-art img')).toHaveAttribute('src','/artwork/solar-night.webp');}
  if(i===3)await expect(board.locator('.board-art img')).toHaveAttribute('src','/artwork/branding.webp');
  if(i===4)await expect(board.locator('.board-description')).toContainText('cloud tools');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);await expect(board.locator('.board-art img')).toBeVisible();await expect.poll(async()=>board.locator('.board-art img').evaluate((e:HTMLImageElement)=>e.complete&&e.naturalWidth>0)).toBe(true);
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`test-results/redesign-${width}-${slug}.png`,fullPage:true,animations:'disabled'});
 }
 await context.close();
});
test('Cloud Solutions has navigation, metadata and quote prefilling',async({page,request})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Show service pages'}).click();await page.locator('#service-menu').getByRole('link',{name:'Cloud Solutions',exact:true}).click();await expect(page).toHaveURL(/cloud-solutions/);await expect(page.locator('h1')).toContainText('cloud requirements');await page.getByRole('link',{name:'Discuss your project',exact:true}).click();await expect(page.getByLabel('Service of interest')).toHaveValue('Cloud Solutions');
 const response=await request.get('/services/cloud-solutions/');expect(await response.text()).toContain('<title>Cloud Solutions | GIGI Cloud Solutions</title>');expect(await (await request.get('/sitemap.xml')).text()).toContain('/services/cloud-solutions');
});
test('Motion pauses offscreen and reduced motion retains controls',async({page})=>{
 await page.goto('/services/it-connectivity',{waitUntil:'domcontentloaded'});const board=page.locator('.visual-board');await board.scrollIntoViewIfNeeded();await expect(board).toHaveClass(/motion-active/);await expect(board.locator('.connection-pulse')).toHaveCSS('animation-play-state','running');await page.locator('footer').scrollIntoViewIfNeeded();await expect(board).not.toHaveClass(/motion-active/);await expect(board.locator('.connection-pulse')).toHaveCSS('animation-play-state','paused');
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/services/electrical-solar',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Night',exact:true}).click();await expect(page.locator('.night-state')).toBeVisible();await expect(page.locator('.connection-pulse')).toHaveCSS('animation-name','none');
});
test('WebGL context loss reveals the product fallback',async({browser})=>{
 const b=await browser.browserType().launch();const page=await (await b.newContext()).newPage();
 await page.goto('/',{waitUntil:'domcontentloaded'});test.skip(!await page.evaluate(()=>!!document.createElement('canvas').getContext('webgl2')),'WebGL2 unavailable');const canvas=page.locator('.scene-ready canvas');await expect(canvas).toBeVisible({timeout:120000});const lost=await canvas.evaluate((el:HTMLCanvasElement)=>{const ext=el.getContext('webgl2')?.getExtension('WEBGL_lose_context');if(ext){ext.loseContext();return true;}return false;});if(lost){await expect(page.locator('.scene-ready')).toHaveCount(0);await expect(page.locator('.static-sculpture')).toBeVisible();}await expect(page.getByRole('link',{name:'Request a Quote'}).first()).toBeVisible();
 await b.close();
});
test('Capture finished hero and service at desktop and mobile sizes',async({page})=>{
 await mkdir('docs/screenshots',{recursive:true});
 for(const [size,width,height] of [['desktop',1440,1000],['mobile',390,844]] as const){
   await page.setViewportSize({width,height});await page.goto('/',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await expect(page.locator('.hero-visual img')).toHaveJSProperty('complete',true);await page.waitForTimeout(1400);const heroBox=await page.locator('.hero').boundingBox();await page.screenshot({path:`docs/screenshots/hero-${size}.png`,animations:'disabled',clip:heroBox});
   await page.goto('/services/electrical-solar',{waitUntil:'domcontentloaded'});await page.evaluate(()=>document.fonts.ready);await page.getByRole('button',{name:'Night',exact:true}).click();await page.getByRole('heading',{level:1}).click();await page.evaluate(()=>window.scrollTo(0,0));const serviceBox=await page.locator('.service-page-hero').boundingBox();await page.screenshot({path:`docs/screenshots/service-${size}.png`,animations:'disabled',clip:serviceBox});
 }
});
