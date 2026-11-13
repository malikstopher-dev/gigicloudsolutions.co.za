import {mkdir,writeFile,readFile} from 'node:fs/promises';
import sharp from 'sharp';
import {boardSvg,boardNames} from '../assets/boards.mjs';
await mkdir('public/visuals',{recursive:true});
await sharp('01_Logos/GIGI_Cloud_Solutions_Transparent.png').resize({width:600}).webp({lossless:true}).toFile('public/visuals/gigi-wordmark.webp');
await sharp('01_Logos/GIGI_Cloud_Solutions_Transparent.png').extract({left:70,top:50,width:590,height:700}).resize({height:480}).png().toFile('public/visuals/gigi-shield.png');
const shield=`data:image/png;base64,${(await readFile('public/visuals/gigi-shield.png')).toString('base64')}`;
for(const [i,name] of [...boardNames,'connected-gigi'].entries()) await writeFile(`public/visuals/${name}.svg`,boardSvg(i,`static-${i}`,shield).replace(/>\s+</g,'><'));
console.log('Generated five static SVG scenes and an accurate shield texture.');
