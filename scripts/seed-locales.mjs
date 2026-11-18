// Optional, one-time import of machine drafts for public website copy. Review before publishing.
// npm builds never contact a translation service.
import {readFile,writeFile} from 'node:fs/promises';
import {listMessages} from './locale-source.mjs';
import localeConfig from '../src/locales.json' with { type: 'json' };

const target = 'src/locale-copy.json';
const current = await readFile(target,'utf8').then(JSON.parse,()=>({}));
const languages = Object.keys(localeConfig).filter(code => code !== 'en');
const result = Object.fromEntries(listMessages().map(key=>[key,{...current[key]}]));
async function translate(language,batch) {
  const payload=batch.length === 1 ? batch[0][0] : batch.map(([value,i])=>`${10000+i}: ${value}`.replaceAll('\n',' ')).join('\n');
  const url=new URL('https://translate.googleapis.com/translate_a/single');
  url.search=new URLSearchParams({client:'gtx',sl:'en',tl:language,dt:'t',q:payload}).toString();
  const response=await fetch(url,{signal:AbortSignal.timeout(12000)});
  if(!response.ok) throw Error(`${response.status}: ${language}`);
  const text=(await response.json())[0].map(segment=>segment[0]).join('');
  if (batch.length === 1 && text.trim()) {
    result[batch[0][0]][language] = text.trim();
    return;
  }
  const blocks=text.split(/(?:^|\n)\s*(1\d{4})\s*:\s*/);
  const answers=new Map();
  for(let i=1;i<blocks.length;i+=2) answers.set(Number(blocks[i])-10000,blocks[i+1].trim());
  if(batch.some(([key,id])=>!answers.get(id))) throw Error(`Unaligned batch for ${language}`);
  for(const [key,id] of batch) result[key][language]=answers.get(id);
}
async function attempt(language,batch){
  try {await translate(language,batch);} catch(error){
    if(batch.length>1){const mid=Math.ceil(batch.length/2);await attempt(language,batch.slice(0,mid));await attempt(language,batch.slice(mid));return;}
    try {await translate(language,batch);}catch{console.error(batch[0][0],String(error));}
  }
}
const queue=languages.flatMap(language=>{
  const missing=Object.entries(result).filter(([,value])=>!value[language]).map(([key],i)=>[key,i]);
  const batches=[]; let batch=[], bytes=0;
  for(const entry of missing){
    if(bytes+entry[0].length>1350 || batch.length>=20){batches.push([language,batch]);batch=[];bytes=0;}
    batch.push(entry);bytes+=entry[0].length;
  }
  if(batch.length)batches.push([language,batch]);return batches;
});
await Promise.all(Array.from({length:8},async()=>{while(queue.length) await attempt(...queue.shift());}));
// Apply project terminology to draft text. Preserve trademarks in headings and SEO.
const brand = /soluções (?:em nuvem (?:da )?GIGI|GIGI Cloud)|solutions cloud GIGI|suluhisho la wingu la GIGI|ba solutions ya (?:cloud|lipata) ya GIGI|solutions ya cloud ya GIGI|GIGI Wolk-?oplossings/gi;
const angolan = [ [/\bprojet([oa]s?)\b/gi,'project$1'], [/\bequipe(s?)\b/gi,'equipa$1'], [/\bcontato(s?)\b/gi,'contacto$1'], [/\belétric([oa]s?)\b/gi,'eléctric$1'], [/\bcontrole(s?)\b/gi,'controlo$1'], [/\busuári([oa]s?)\b/gi,'utilizador$1'], [/\bCFTV\b/g,'CCTV'] ];
for (const [key, entry] of Object.entries(result)) {
  for (const language of languages) {
    if (!entry[language] || current[key]?.[language]) continue;
    if (/GIGI Cloud Solutions/i.test(key)) entry[language] = entry[language].replace(brand,'GIGI Cloud Solutions');
    if (language === 'pt') entry.pt = angolan.reduce((value,[from,to])=>value.replace(from,(match,...args)=>{
      const word=to.replace('$1',typeof args[0]==='string'?args[0].toLowerCase():'');
      return match[0]===match[0].toUpperCase()?word[0].toUpperCase()+word.slice(1):word;
    }), entry.pt);
  }
}
await writeFile(target,JSON.stringify(result,null,2)+'\n');
console.log(`${Object.keys(result).length} English keys; ${Object.values(result).reduce((n,v)=>n+languages.filter(l=>!v[l]).length,0)} missing translations`);
