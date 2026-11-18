import { readFile, writeFile, mkdir } from 'node:fs/promises';
import localeConfig from '../src/locales.json' with { type: 'json' };
const domain = 'https://www.gigicloudsolutions.co.za';
const routes = [
  ['/', 'GIGI Cloud Solutions | Enterprise Security, IT and Energy', 'Integrated access control, CCTV, networking, data backup, electrical and solar solutions for businesses and residential estates in Johannesburg.', 'home'],
  ['/about', 'About Us | GIGI Cloud Solutions', 'GIGI Cloud Solutions provides security, access control, IT connectivity, electrical, solar and design solutions to businesses and residential customers.', 'about'],
  ['/services', 'Our Services | GIGI Cloud Solutions', 'Explore all 11 GIGI Cloud Solutions offerings, from access control and CCTV to fibre, networking, solar, electrical and design services.', 'services'],
  ['/services/it-connectivity', 'IT & Connectivity | GIGI Cloud Solutions', 'Request fibre, structured networking, Wi-Fi and data backup for your business or residential property.', 'it-connectivity'],
  ['/services/security-access', 'Security & Access | GIGI Cloud Solutions', 'Discuss access control, CCTV, alarms and electric fencing for commercial or residential premises.', 'enterprise-security'],
  ['/services/electrical-solar', 'Electrical & Solar | GIGI Cloud Solutions', 'Request commercial electrical work or discuss solar, inverter and battery systems for your premises.', 'solar-energy'],
  ['/services/web-graphic-design', 'Web & Graphic Design | GIGI Cloud Solutions', 'Request a website, brand system or graphic design that explains your business clearly.', 'web-graphic-design'],
  ['/services/cloud-solutions', 'Cloud Solutions | GIGI Cloud Solutions', 'Discuss cloud access, shared files and data recovery requirements for your team.', 'data-backup'],
  ['/contact', 'Contact and Request a Quote | GIGI Cloud Solutions', 'Send your project requirements and location to GIGI Cloud Solutions by WhatsApp, phone or email.', 'contact'],
];
const template = await readFile('dist/index.html', 'utf8');
const copy = JSON.parse(await readFile('src/locale-copy.json', 'utf8'));
const locales = Object.entries(localeConfig).map(([code, { tag }]) => [code, tag]);
const localized = (code, path) => code === 'en' ? path : `/${code}${path}`;
const alternates = path => [...locales, ['en','x-default']].map(([code, tag]) => `<link rel="alternate" hreflang="${tag}" href="${domain}${localized(code,path)}">`).join('');
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const setContent = (html, selector, value) => html.replace(new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`), `$1${escape(value)}$2`);
for (const [path, title, description, hero] of routes) for (const [code, tag] of locales) {
  const url = localized(code,path);
  const dir = `dist${url}`;
  const translatedTitle = code === 'en' ? title : copy[title][code];
  const translatedDescription = code === 'en' ? description : copy[description][code];
  await mkdir(dir, { recursive: true });
  let html = template
    .replace('lang="en-ZA"', `lang="${tag}"`)
    .replace(/<title>.*?<\/title>/, `<title>${escape(translatedTitle)}</title>`)
    .replaceAll('hero-home-desktop-1440.webp', `hero-${hero}-desktop-1440.webp`)
    .replaceAll('hero-home-mobile-720.webp', `hero-${hero}-mobile-720.webp`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${domain}${url}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${domain}${url}$2`);
  html = setContent(html, 'name="description"', translatedDescription);
  html = setContent(html, 'property="og:title"', translatedTitle);
  html = setContent(html, 'property="og:description"', translatedDescription);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GIGI CLOUD SOLUTIONS (Pty) Ltd',
    url: domain,
    logo: `${domain}/brand/gigi-on-navy.webp`,
    image: `${domain}/social.png`,
    telephone: '+27731680832',
    email: 'info@gigicloudsolutions.co.za',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '339 Highland Road, Kensington',
      addressLocality: 'Johannesburg',
      postalCode: '2094',
      addressCountry: 'ZA',
    },
    areaServed: 'Johannesburg and surrounding areas',
  };
  html = html.replace('</head>', `${alternates(path)}<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
  await writeFile(`${dir}/index.html`, html);
}
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.flatMap(([path]) => locales.map(([code])=>`<url><loc>${domain}${localized(code,path)}</loc></url>`)).join('')}</urlset>`,
);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${domain}/sitemap.xml\n`);
await writeFile(
  'dist/404.html',
  template.replace(/<title>.*?<\/title>/, '<title>Page Not Found | GIGI Cloud Solutions</title>'),
);
console.log(`Generated metadata for ${routes.length} routes in ${locales.length} languages, sitemap and robots.txt.`);
