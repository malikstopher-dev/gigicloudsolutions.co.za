import { expect, test } from '@playwright/test';

test('Every sitemap URL serves crawlable content and reciprocal canonical language links', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const origin = 'https://www.gigicloudsolutions.co.za';
  const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  expect(new Set(urls).size).toBe(70);
  const titles = new Set<string>();
  for (const url of urls) {
    expect(url).toMatch(/^https:\/\/www\.gigicloudsolutions\.co\.za\/.*$/);
    const response = await request.get(url.slice(origin.length), { maxRedirects: 0 });
    expect(response.status(), url).toBe(200);
    const html = await response.text();
    expect(html).toContain(`<link rel="canonical" href="${url}"`);
    expect(html).toMatch(/<main[\s\S]+<h1>[\s\S]+<\/h1>[\s\S]+<\/main>/);
    expect(html).not.toMatch(/name="robots" content="noindex"/);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    expect(title, url).toBeTruthy();
    expect(titles.has(title!), title).toBeFalsy();
    titles.add(title!);
    const tags = [...html.matchAll(/rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
    expect(tags).toHaveLength(8);
    expect(tags.every(match => urls.includes(match[2]))).toBeTruthy();
    expect(tags.some(match => match[2] === url && html.startsWith(`<!doctype html>\n<html lang="${match[1]}">`))).toBeTruthy();
    expect(tags.some(match => match[1] === 'x-default')).toBeTruthy();
    const schema = JSON.parse(html.match(/data-gigi-schema>(.*?)<\/script>/)?.[1] ?? 'null');
    expect(schema['@graph']).toEqual(expect.arrayContaining([expect.objectContaining({ '@type': 'WebPage', url }), expect.objectContaining({ '@type': 'Organization', address: expect.objectContaining({addressCountry:'ZA'}) })]));
  }
  const fallback = await request.get('/404.html');
  const html = await fallback.text();
  expect(html).toContain('name="robots" content="noindex"');
  expect(html).not.toContain('rel="canonical"');
});

test('French Congo guide is readable without JavaScript and links to a real localized quote page', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: {width:390,height:844}, reducedMotion: 'reduce' });
  try {
    const page = await context.newPage();
    await page.goto('http://localhost:4173/fr/service-areas/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr-CD');
    await expect(page.getByRole('heading', {level:1,name:'Johannesburg et la RDC.'})).toBeVisible();
    await expect(page.getByRole('heading', {name:/Projets en République démocratique du Congo/})).toBeVisible();
    await expect(page.getByText(/Toute intervention sur place en RDC doit être confirmée/)).toBeVisible();
    await page.getByRole('link', {name:'Demander un devis', exact:true}).first().click();
    await expect(page).toHaveURL(/\/fr\/contact\/$/);
    await expect(page.locator('#enquiry')).toBeVisible();
    await expect(page.locator('#enquiry')).toHaveAttribute('action', 'https://api.web3forms.com/submit');
    await expect(page.locator('#enquiry button[type=submit]')).toBeEnabled();
  } finally { await context.close(); }
});

for (const [width,route] of [[390, '/fr/service-areas/'], [1440, '/services/security-access/']] as const) {
  test(`Prerendered route hydrates cleanly and keeps its responsive poster at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({reducedMotion:'reduce'});
    const errors:string[]=[];
    const posters=new Set<string>();
    page.on('pageerror', err=>errors.push(err.message));
    page.on('request', req=>{if (/\/hero-(contact|enterprise-security)-(mobile|desktop)-\d+\.webp$/.test(req.url())) posters.add(req.url());});
    await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(errors).toEqual([]);
    expect([...posters].filter(url=>width===390 ? url.includes('-desktop-') : url.includes('-mobile-'))).toEqual([]);
    if(width===390) {
      await page.locator('.gc-header__language select').selectOption('en');
      await expect(page).toHaveURL(/\/service-areas\/$/);
      await expect(page.locator('html')).toHaveAttribute('lang','en-ZA');
    }
  });
}
