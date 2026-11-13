import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import sharp from 'sharp';
const domain='https://www.gigicloudsolutions.co.za';
const routes=[
 ['/', 'GIGI Cloud Solutions | IT, Cloud, Security, Solar & Design','IT, cloud, security, electrical, solar and design services for homes and businesses. Based in Johannesburg.'],
 ['/about','About Us | GIGI Cloud Solutions','GIGI Cloud Solutions provides IT, cloud, security, electrical, solar and design services to homes and businesses.'],
 ['/services','Our Services | GIGI Cloud Solutions','Explore IT, cloud solutions, CCTV, access control, electrical, solar, web and graphic design services.'],
 ['/services/it-connectivity','IT & Connectivity | GIGI Cloud Solutions','Request IT services, fibre, networking and data backup for your home or business.'],
 ['/services/security-access','Security & Access | GIGI Cloud Solutions','Discuss CCTV, alarms, electric fencing and access control for your property.'],
 ['/services/electrical-solar','Electrical & Solar | GIGI Cloud Solutions','Request electrical work or discuss a solar system based on your property and energy use.'],
 ['/services/web-graphic-design','Web & Graphic Design | GIGI Cloud Solutions','Request a website or graphic design that explains your business clearly.'],
 ['/services/cloud-solutions','Cloud Solutions | GIGI Cloud Solutions','Discuss cloud tools, files and access requirements for your home or business.'],
 ['/contact','Contact & Request a Quote | GIGI Cloud Solutions','Send your requirements and location to GIGI by WhatsApp, phone or email.'],
];
const template=await readFile('dist/index.html','utf8');const escape=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;');
for(const [path,title,description] of routes){const dir=path==='/'?'dist':`dist${path}`;await mkdir(dir,{recursive:true});let html=template.replace(/<title>.*?<\/title>/,`<title>${escape(title)}</title>`).replace(/(<meta name="description" content=")[^"]*/,`$1${escape(description)}`).replace(/(<meta property="og:title" content=")[^"]*/,`$1${escape(title)}`).replace(/(<meta property="og:description" content=")[^"]*/,`$1${escape(description)}`).replace(/(<meta property="og:url" content=")[^"]*/,`$1${domain}${path}`).replace(/(<link rel="canonical" href=")[^"]*/,`$1${domain}${path}`);const schema={'@context':'https://schema.org','@type':'Organization',name:'GIGI CLOUD SOLUTIONS (Pty) Ltd',url:domain,logo:`${domain}/social.png`,telephone:'+27731680832',email:'info@gigicloudsolutions.co.za',address:{'@type':'PostalAddress',streetAddress:'339 Highland Road, Kensington',addressLocality:'Johannesburg',postalCode:'2094',addressCountry:'ZA'}};html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);await writeFile(`${dir}/index.html`,html);}
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(([path])=>`<url><loc>${domain}${path}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);
await copyFile('01_Logos/GIGI_Cloud_Solutions_Approved_Logo.png','dist/social.png');
await sharp('01_Logos/GIGI_Cloud_Solutions_Transparent.png').extract({left:70,top:50,width:590,height:700}).resize(64,64,{fit:'contain',background:'#ffffff'}).png().toFile('dist/favicon.png');
await writeFile('dist/404.html',template.replace(/<title>.*?<\/title>/,'<title>Page Not Found | GIGI Cloud Solutions</title>'));
console.log(`Generated metadata for ${routes.length} routes, sitemap, robots.txt and brand assets.`);
