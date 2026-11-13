import { test, expect } from '@playwright/test';
const routes=['/','/about','/services','/services/it-connectivity','/services/security-access','/services/electrical-solar','/services/web-graphic-design','/services/cloud-solutions','/contact'];
for(const width of [360,390,768,1024,1440]){
 test(`All routes render cleanly at ${width}px`,async({page})=>{
  await page.setViewportSize({width,height:900});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
   await page.goto(route,{waitUntil:'domcontentloaded'});await expect(page.locator('h1')).toBeVisible();await expect(page).toHaveTitle(/GIGI/);
   await expect(page.locator('header img')).toBeVisible();
   expect(await page.locator('body').innerText()).not.toMatch(/[\u2013\u2014]|---/);
   const headingColours=await page.locator('h1,h2,h3').evaluateAll(els=>els.map(el=>getComputedStyle(el).color));expect(headingColours.every(c=>c==='rgb(6, 27, 67)'||c==='rgb(255, 255, 255)')).toBe(true);
   const overflow=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className,right:e.getBoundingClientRect().right})));expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow at ${route}: ${JSON.stringify(overflow)}`).toBe(true);
   expect(await page.locator('h1').evaluate(el=>el.getBoundingClientRect().right<=innerWidth)).toBe(true);
   await page.locator('footer').scrollIntoViewIfNeeded();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   if((width===390||width===1440)&&['/','/contact','/services/security-access','/about'].includes(route)){
    await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`test-results/${width}-${route.replaceAll('/','-')||'home'}.png`,fullPage:true,animations:'disabled'});
   }
  }
  expect(errors).toEqual([]);
 });
}
test('Mobile menu, dropdown and service quote prefill',async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto('/',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'Open menu'}).click();await expect(page.getByRole('navigation')).toBeVisible();
 await page.getByRole('button',{name:'Show service pages'}).click();await page.locator('#service-menu').getByRole('link',{name:'Security & Access'}).click();
 await expect(page).toHaveURL(/security-access/);await expect(page.getByRole('button',{name:'Open menu'})).toBeVisible();
 await page.getByRole('link',{name:'Discuss your project',exact:true}).click();await expect(page.getByLabel('Service of interest')).toHaveValue('Security & Access');
 await page.getByRole('button',{name:'Open menu'}).click();await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'Open menu'})).toBeFocused();
});
test('Form validates and transfers the complete enquiry to WhatsApp',async({page,context})=>{
 await page.goto('/contact?service=IT%20%26%20Connectivity');await page.getByRole('button',{name:'Send enquiry via WhatsApp'}).click();expect(await page.locator('input[name=name]').evaluate((e:HTMLInputElement)=>e.validity.valueMissing)).toBe(true);
 await page.getByLabel('Full name').fill('Test & Example');await page.getByLabel('Email address').fill('person@example.com');await page.getByLabel('Phone number').fill('+27 73 168 0832');await page.getByLabel('Project location').fill('Kensington');await page.getByLabel('What do you have in mind?').fill('Fibre & backup for our office.');
 await context.route('https://wa.me/**',route=>route.fulfill({status:200,body:'WhatsApp handoff intercepted for test'}));
 const popupPromise=page.waitForEvent('popup');await page.getByRole('button',{name:'Send enquiry via WhatsApp'}).click();const popup=await popupPromise;await popup.waitForLoadState();const url=new URL(popup.url());expect(url.hostname).toBe('wa.me');expect(url.pathname).toBe('/27731680832');const text=url.searchParams.get('text');for(const part of ['Test & Example','person@example.com','+27 73 168 0832','IT & Connectivity','Kensington','Fibre & backup for our office.'])expect(text).toContain(part);
 await expect(page.getByRole('status')).toContainText('press Send');await expect(page.getByRole('status')).not.toContainText('successfully sent');await popup.close();
});
test('Reduced motion keeps static visual and links accessible',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');await expect(page.locator('.static-sculpture')).toBeVisible();await expect(page.locator('canvas')).toHaveCount(0);
 await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 const links=await page.locator('a[href^="tel:"]').evaluateAll(els=>els.map(e=>e.getAttribute('href')));expect(links.every(x=>x==='tel:+27731680832')).toBe(true);
});
test('WebGL hero loads when supported and metadata is route-specific',async({browser})=>{
 const b=await browser.browserType().launch();const page=await (await b.newContext({viewport:{width:1280,height:720}})).newPage();
 await page.goto('/',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1800);const supported=await page.evaluate(()=>{try{return !!document.createElement('canvas').getContext('webgl2');}catch{return false;}});if(supported)await expect(page.locator('.scene-ready canvas')).toBeVisible({timeout:120000});else await expect(page.locator('.static-sculpture')).toBeVisible();
 await page.screenshot({path:'test-results/hero-webgl.png'});
 expect(await page.evaluate(async()=>(await fetch('/services/security-access/')).text())).toContain('<title>Security &amp; Access | GIGI Cloud Solutions</title>'); expect(await page.evaluate(async()=>(await fetch('/sitemap.xml')).ok)).toBe(true);expect(await page.evaluate(async()=>(await fetch('/favicon.png')).ok)).toBe(true);
 await b.close();
});
