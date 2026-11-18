import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {boardSvg,boardNames} from '../assets/boards.mjs';
await mkdir('public/visuals',{recursive:true});
await sharp('docs/01_Logos/GIGI_Cloud_Solutions_Transparent.png').resize({width:600}).webp({lossless:true}).toFile('public/visuals/gigi-wordmark.webp');
// At 600px wide the approved artwork has a transparent gutter at x=198..201.
// Preserve the shield byte-for-byte and the anti-aliased alpha of the lettering.
const {data: pixels,info: raw}=await sharp('public/visuals/gigi-wordmark.webp').ensureAlpha().raw().toBuffer({resolveWithObject:true});
for(let y=0;y<raw.height;y++) for(let x=202;x<raw.width;x++) {
  const i=(y*raw.width+x)*4;
  if(pixels[i+3]) pixels.fill(255,i,i+3);
}
await sharp(pixels,{raw}).png().toFile('public/visuals/gigi-wordmark-dark.png');
await sharp('docs/01_Logos/GIGI_Cloud_Solutions_Transparent.png').extract({left:70,top:50,width:590,height:700}).resize({height:480}).png().toFile('public/visuals/gigi-shield.png');
const shield=`data:image/png;base64,${(await readFile('public/visuals/gigi-shield.png')).toString('base64')}`;
for(const [i,name] of [...boardNames,'connected-gigi'].entries()) await writeFile(`public/visuals/${name}.svg`,boardSvg(i,`static-${i}`,shield).replace(/>\s+</g,'><'));
console.log('Generated five static SVG scenes and an accurate shield texture.');
