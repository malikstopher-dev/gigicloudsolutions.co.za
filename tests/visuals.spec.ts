import {test,expect} from '@playwright/test';
const slugs=['it-connectivity','security-access','electrical-solar','web-graphic-design'];
test('Hero controls work with keyboard and update the service destination',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const group=page.getByRole('group',{name:'Explore the connected GIGI environment'});
 await group.getByRole('button',{name:'Protect'}).focus();await page.keyboard.press('Enter');
 await expect(group.getByRole('button',{name:'Protect'})).toHaveAttribute('aria-pressed','true');
 await expect(page.locator('#hero-service-description')).toContainText('Security & Access');
 await expect(page.locator('#hero-service-description a')).toHaveAttribute('href','/services/security-access');
 await group.getByRole('button',{name:'Create'}).click();await expect(page.locator('#hero-service-description')).toContainText('Web & Graphic Design');
});
for(const width of [390,768,1440])test(`Interactive boards and artwork at ${width}px`,async({browser})=>{
 const context=await browser.newContext({viewport:{width,height:1000},hasTouch:width===390});const page=await context.newPage();
 for(const [i,slug] of slugs.entries()){
  await page.goto(`/services/${slug}`,{waitUntil:'domcontentloaded'});const board=page.locator('.visual-board');await board.scrollIntoViewIfNeeded();
  const last=board.locator('.board-controls button').last();if(width===390)await last.tap();else{await last.focus();await page.keyboard.press('Enter');}
  await expect(last).toHaveAttribute('aria-pressed','true');
  if(i===0){await expect(board).toHaveClass(/selected-backup/);await expect(board.locator('.board-description')).toContainText('backup storage');}
  if(i===1){await board.getByRole('button',{name:'Try access reader'}).click();await expect(board.getByRole('status')).toHaveText('Demo: access confirmed.');await expect(board).toHaveClass(/access-confirmed/);}
  if(i===2){await expect(board).toHaveClass(/selected-night/);await expect(board.locator('.night-sky')).toHaveCSS('opacity','1');}
  if(i===3){await expect(board).toHaveClass(/selected-branding/);await expect(board.locator('.branding-concept')).toHaveCSS('opacity','1');}
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:`test-results/board-${width}-${slug}.png`,fullPage:true,animations:'disabled'});
 }
 await context.close();
});
test('Static fallbacks are valid and reduced motion retains board interactions',async({page,request})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/',{waitUntil:'domcontentloaded'});await expect(page.locator('canvas')).toHaveCount(0);
 for(const slug of [...slugs,'connected-gigi']){const response=await request.get(`/visuals/${slug}.svg`);expect(response.ok()).toBe(true);const source=await response.text();expect(await page.evaluate(svg=>new DOMParser().parseFromString(svg,'image/svg+xml').querySelector('parsererror')===null,source)).toBe(true);}
 const image=page.locator('.static-sculpture img');await expect(image).toBeVisible();expect(await image.evaluate((img:HTMLImageElement)=>img.complete&&img.naturalWidth>0)).toBe(true);
 await page.locator('.hero-service-controls button').last().click();await expect(page.locator('#hero-service-description')).toContainText('Web & Graphic Design');
 await page.goto('/services/electrical-solar',{waitUntil:'domcontentloaded'});await page.getByRole('button',{name:'Night',exact:true}).click();await expect(page.locator('.visual-board')).toHaveClass(/selected-night/);await expect(page.locator('.stored-pulse')).toHaveCSS('animation-name','none');
 await page.screenshot({path:'test-results/reduced-motion-energy.png'});
});
test('Board animations pause outside the viewport',async({page})=>{
 await page.goto('/services/it-connectivity',{waitUntil:'domcontentloaded'});const board=page.locator('.visual-board');await board.scrollIntoViewIfNeeded();await expect(board).toHaveClass(/motion-active/);await expect(board.locator('.connection-pulse')).toHaveCSS('animation-play-state','running');await page.locator('footer').scrollIntoViewIfNeeded();await expect(board).not.toHaveClass(/motion-active/);await expect(board.locator('.connection-pulse')).toHaveCSS('animation-play-state','paused');
});
test('WebGL pointer selection and context-loss fallback',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const supported=await page.evaluate(()=>!!document.createElement('canvas').getContext('webgl2'));test.skip(!supported,'WebGL2 unavailable in this browser');
 const canvas=page.locator('.scene-ready canvas');await expect(canvas).toBeVisible();const bounds=await canvas.boundingBox();expect(bounds).not.toBeNull();
 await canvas.click({position:{x:bounds!.width*.72,y:bounds!.height*.3}});
 await expect(page.locator('#hero-service-description strong')).toHaveText('Security & Access');
 await page.screenshot({path:'test-results/hero-security-selected.png'});
 const canLose=await canvas.evaluate((el:HTMLCanvasElement)=>{const ext=el.getContext('webgl2')?.getExtension('WEBGL_lose_context');if(ext){ext.loseContext();return true;}return false;});
 if(canLose){await expect(page.locator('.scene-ready')).toHaveCount(0);await expect(page.locator('.static-sculpture')).toBeVisible();await page.locator('.hero-service-controls button').last().click();await expect(page.locator('#hero-service-description strong')).toHaveText('Web & Graphic Design');}
});
