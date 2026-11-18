import { test, expect } from '@playwright/test';

for (const [width,device] of [[375,'mobile'],[1280,'desktop']] as const) {
  test(`Visible ${device} film plays without requesting the other version`, async ({page}) => {
    const requested = new Set<string>();
    page.on('request', req=>{if(req.url().includes('.mp4')) requested.add(new URL(req.url()).pathname)});
    await page.setViewportSize({width,height:800});
    await page.goto('/', {waitUntil:'domcontentloaded'});
    const video = page.locator('.gc-hero video');
    await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.currentTime),{timeout:15000}).toBeGreaterThan(0);
    await page.getByRole('button',{name:'Pause background video'}).click();
    await expect(video).toHaveJSProperty('paused',true);
    expect([...requested]).toEqual([`/enterprise/videos/hero-home-${device}.mp4`]);
  });
}

test('Language changes fit short phones through wide desktops and persist after navigation',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/',{waitUntil:'domcontentloaded'});
  for(const [i,width] of [320,360,375,390,414,430,768,1024,1280,1440,1920].entries()) {
    const height=width<768? (width===320?568:800):900;
    await page.setViewportSize({width,height});
    const code=['zu','af','sw','ln','pt','en','zu','af','en','pt','fr'][i];
    if(width<=900) await expect(page.locator('.gc-menu-btn')).toHaveAttribute('aria-expanded','false');
    await page.locator(width<=900?'.gc-header__language select':'.gc-nav select').selectOption(code);
    await expect(page.locator('html')).toHaveAttribute('lang',new RegExp('^'+code));
    const button=await page.locator('.gc-hero__actions a').first().boundingBox();
    expect(button!.y+button!.height).toBeLessThanOrEqual(height);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    if(width===320||width===1440) await page.screenshot({path:test.info().outputPath(`hero-${width}.jpg`),animations:'disabled'});
  }
  await page.goto('/about',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.gc-hero__title-wide')).toHaveText('Découvrez GIGI Cloud Solutions.');
});
