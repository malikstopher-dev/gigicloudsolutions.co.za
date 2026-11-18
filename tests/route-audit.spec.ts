import {test,expect} from '@playwright/test';
const paths=['/','/about','/contact','/services',...['it-connectivity','security-access','electrical-solar','web-graphic-design','cloud-solutions'].map(s=>'/services/'+s)];
for(const [width,height] of [[360,640],[390,844],[400,800],[430,932],[768,1024],[1366,768],[1440,900]]) test(`Route review ${width}x${height}`,async({page})=>{
  await page.setViewportSize({width,height});
  for(const path of paths){
    await page.goto(path); await page.evaluate(()=>document.fonts.ready);
    const hero=page.locator('main > section').first(), copy=hero.locator('.photo-hero-inner,.route-copy');
    if(path==='/') await expect.poll(()=>hero.locator('video').evaluate((v:HTMLVideoElement)=>v.currentTime)).toBeGreaterThan(0);
    if(path!=='/') {
      await hero.locator('figure img').evaluate((im:HTMLImageElement)=>im.decode());
    }
    const media=hero.locator(path==='/'?'video':'figure img');
    expect(await media.boundingBox()).toEqual({x:0,y:0,width,height});
    expect(await copy.locator('p,h1,span,li,ul').evaluateAll(els=>els.every(el=>getComputedStyle(el).backgroundColor==='rgba(0, 0, 0, 0)' && getComputedStyle(el).boxShadow==='none'))).toBe(true);
    if(width<768){
      const b=(await hero.boundingBox())!,c=(await copy.boundingBox())!;
      expect(c.height/b.height,`${path} copy fraction`).toBeLessThanOrEqual(.42);
      expect(b.y+b.height,`${path} hero fold`).toBeLessThanOrEqual(height+1);
      expect(c.y+c.height).toBeLessThanOrEqual(height);
      await expect(hero.locator('a:visible')).toHaveCount(1);
      for(const selector of ['h1','p:not(.route-label):not(.hero-kicker)']){
        const lines=await copy.locator(selector).evaluate(e=>e.getBoundingClientRect().height/parseFloat(getComputedStyle(e).lineHeight));expect(lines).toBeLessThan(3.05);
      }
    }
    const dir=`docs/screenshots/routes/${width}x${height}`,slug=path.split('/').pop()||'home';
    await page.screenshot({path:`${dir}/${slug}-hero.jpg`,quality:85});
    for(const section of await page.locator('main section, main .reveal').all()) await section.evaluate(e=>e.scrollIntoView({behavior:'instant',block:'center'}));
    await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode()}));scrollTo({top:0,behavior:'instant'})});
    await page.waitForTimeout(700);await expect(page.locator('main h1')).toHaveCount(1);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.screenshot({path:`${dir}/${slug}.jpg`,quality:72,fullPage:true});
  }
});
