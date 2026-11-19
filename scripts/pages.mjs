import { readFile, writeFile, mkdir } from 'node:fs/promises';
import locales from '../src/locales.json' with { type: 'json' };
import { company, origin, publicPages, publicPath, pageLanguage, notFound, renderSite, services, lastMeaningfulUpdate, translateText as translate } from '../.seo-build/prerender.js';

const entry = await readFile('dist/index.html', 'utf8');
const templatePath = '.seo-build/client-template.html';
const template = entry.includes('<div id="root"></div>') ? entry : await readFile(templatePath, 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('Missing the Vite client HTML template. Run npm run build.');
await writeFile(templatePath, template);
const escape = value => value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const entries = Object.entries(locales);
const canonical = (code, path) => `${origin}${publicPath(code,path)}`;
const alternates = path => [...entries.map(([code, {tag}]) => [pageLanguage(code,tag,path),canonical(code,path)]), ['x-default',canonical('en',path)]];
const organization = {
  '@type': 'Organization', '@id': `${origin}/#organization`, name: company.name,
  url: `${origin}/`, logo: `${origin}/brand/gigi-on-navy.webp`, email: company.email, telephone: company.tel,
  address: { '@type': 'PostalAddress', streetAddress: '339 Highland Road, Kensington', addressLocality: 'Johannesburg', postalCode: '2094', addressRegion: 'Gauteng', addressCountry: 'ZA' },
};
const website = { '@type': 'WebSite', '@id': `${origin}/#website`, name: company.name, url: `${origin}/`, publisher: { '@id': organization['@id'] } };
const setContent = (html, selector, value) => html.replace(new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*(")`), (_, a, b) => a + escape(value) + b);

for (const [path, title, description, hero] of publicPages) for (const [code, {tag}] of entries) {
  const pathname = publicPath(code,path);
  const url = canonical(code,path);
  const lang = pageLanguage(code,tag,path);
  const localTitle = translate(code,title);
  const localDescription = translate(code,description);
  const graph = [organization, website];
  const data = { '@type': 'WebPage', '@id': `${url}#webpage`, url, name: localTitle, description: localDescription, inLanguage: lang, isPartOf: { '@id': website['@id'] } };
  const group = services.find(service => `/services/${service.slug}` === path);
  if (group) {
    const service = { '@type': 'Service', '@id': `${url}#service`, name: translate(code,group.name), description: localDescription, url, provider: { '@id': organization['@id'] } };
    const breadcrumb = { '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [['Home','/'],['Services','/services'],[group.name,path]].map(([name,route],index) => ({'@type':'ListItem',position:index+1,name:translate(code,name),item:canonical(code,route)})) };
    data.mainEntity = { '@id': service['@id'] };
    data.breadcrumb = { '@id': breadcrumb['@id'] };
    graph.push(service,breadcrumb);
  }
  graph.push(data);
  const schema = JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c');
  const head = [
    ...alternates(path).map(([language,href]) => `<link rel="alternate" hreflang="${language}" href="${href}">`),
    `<meta property="og:site_name" content="GIGI Cloud Solutions">`,
    `<meta property="og:image:alt" content="GIGI Cloud Solutions">`,
    `<script type="application/ld+json" data-gigi-schema>${schema}</script>`,
  ].join('\n');
  let html = template.replace('lang="en-ZA"', `lang="${lang}"`)
    .replace(/<title>.*?<\/title>/, () => `<title>${escape(localTitle)}</title>`)
    .replace(/\/enterprise\/heroes\/hero-home-/g, `/enterprise/heroes/hero-${hero}-`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${url}$2`)
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="${pathname}">${renderSite(pathname)}</div>`)
    .replace('</head>', () => `${head}\n</head>`);
  for (const [selector,value] of [['name="description"',localDescription],['property="og:title"',localTitle],['property="og:description"',localDescription],['property="og:url"',url]]) html = setContent(html,selector,value);
  await mkdir(`dist${pathname}`, {recursive:true});
  await writeFile(`dist${pathname}index.html`,html);
}

const urls = publicPages.flatMap(([path]) => entries.map(([code]) => `<url><loc>${canonical(code,path)}</loc>${lastMeaningfulUpdate[path] ? `<lastmod>${lastMeaningfulUpdate[path]}</lastmod>` : ''}${alternates(path).map(([tag,url])=>`<xhtml:link rel="alternate" hreflang="${tag}" href="${url}"/>`).join('')}</url>`));
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>`);
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);

let fallback = template.replace(/<title>.*?<\/title>/, `<title>${escape(notFound[0])}</title>`)
  .replace(/<link\s+rel="canonical"[^>]+>/, '')
  .replace(/<link\s+rel="preload"\s+as="image"[^>]+>/g, '')
  .replace('</head>', '<meta name="robots" content="noindex">\n</head>')
  .replace('<div id="root"></div>', () => `<div id="root">${renderSite('/404.html')}</div>`);
fallback = setContent(fallback, 'name="description"', notFound[1]);
fallback = setContent(fallback, 'property="og:title"', notFound[0]);
fallback = setContent(fallback, 'property="og:description"', notFound[1]);
await writeFile('dist/404.html', fallback);
console.log(`Prerendered ${urls.length} localized URLs, sitemap, robots.txt and 404.`);
