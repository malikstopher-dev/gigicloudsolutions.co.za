import {createServer} from 'vite';
import {chromium} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import sharp from 'sharp';
const server=await createServer({server:{port:4181,host:'127.0.0.1'}});await server.listen();
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage();page.on('pageerror',e=>console.error(e));await page.goto('http://127.0.0.1:4181/scripts/render-artwork.html',{waitUntil:'domcontentloaded',timeout:120000});await page.waitForFunction(()=>typeof window.renderArtwork==='function',{},{timeout:120000});
 await mkdir('public/artwork',{recursive:true});const manifest={};
 for(const [index,name,mode] of [[0,'it','default'],[1,'security','default'],[1,'security-confirmed','confirmed'],[2,'solar','default'],[2,'solar-night','night'],[3,'design','default'],[3,'branding','branding'],[4,'cloud','default'],[5,'hero','default']]){
  const result=await page.evaluate(async([index,mode])=>window.renderArtwork(index,mode),[index,mode]);const data=Buffer.from(result.data.split(',')[1],'base64');await sharp(data).webp({quality:91}).toFile(`public/artwork/${name}.webp`);manifest[name]=result.paths;console.log(`Rendered ${name}`);
 }
 await writeFile('src/artwork-paths.json',JSON.stringify(manifest,null,2));
}finally{await browser.close();await server.close();}
