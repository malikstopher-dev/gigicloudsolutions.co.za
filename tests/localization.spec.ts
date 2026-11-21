import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
const copy = JSON.parse(readFileSync(new URL('../src/locale-copy.json', import.meta.url), 'utf8')) as Record<string, Record<string, string>>;

const routes = ['/', '/about', '/services', '/services/security-access', '/services/it-connectivity', '/services/electrical-solar', '/services/web-graphic-design', '/services/cloud-solutions', '/contact'];
const cases = [
  ['en', 'en-ZA', 'Enterprise capabilities', 'One conversation for the systems', 'Speak to the team.', 'Your project details.'],
  ['fr', 'fr', 'capacités d’entreprise', 'Une conversation pour les systèmes', 'Parlez à l’équipe.', 'Détails de votre projet'],
  ['sw', 'sw', 'Uwezo wa biashara', 'Mazungumzo moja kwa mifumo', 'Ongea na timu.', 'Maelezo ya mradi wako'],
  ['ln', 'ln', 'Makoki ya entreprise', 'Masolo moko mpo na ba systèmes', 'Solola na ekipi.', 'Makambo ya mosala na yo'],
  ['pt', 'pt-AO', 'Capacidades empresariais', 'Uma conversa para os sistemas', 'Fale com a equipa.', 'Dados do seu projecto'],
  ['zu', 'zu-ZA', 'Amakhono ebhizinisi', 'Ingxoxo eyodwa yamasistimu', 'Khuluma neqembu.', 'Imininingwane yephrojekthi yakho.'],
  ['af', 'af-ZA', 'Ondernemingsvermoëns', 'Een gesprek vir die stelsels', 'Praat met die span.', 'Jou projekbesonderhede.'],
] as const;

test('The new locale URLs are discoverable in the sitemap and carry metadata before JavaScript runs', async ({ request }) => {
  const base = 'https://www.gigicloudsolutions.co.za';
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  const locations = await sitemap.text();
  for (const [code, tag] of [['zu', 'zu-ZA'], ['af', 'af-ZA']]) {
    for (const path of routes) {
      const url = `/${code}${path.replace(/\/$/, '')}/`;
      const response = await request.get(url, { maxRedirects: 0 });
      expect(response.ok(), url).toBeTruthy();
      const html = await response.text();
      expect(html).toContain(`<html lang="${tag}">`);
      expect(html).toMatch(/<title>[^<]*GIGI Cloud Solutions[^<]*<\/title>/);
      expect(html).toContain(`<link rel="canonical" href="${base}${url}"`);
      expect(html).toContain(`hreflang="${tag}" href="${base}${url}"`);
      expect(locations).toContain(`<loc>${base}${url}</loc>`);
    }
  }
});

for (const [code, tag, homeCopy, aboutCopy, contactCopy] of cases) {
  test(`${code}: localized page body, footer, metadata and enquiry`, async ({ page, context }) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    const prefix = code === 'en' ? '' : `/${code}`;
    const englishLeaks = /Speak to the team|Your project details|One conversation for the systems|enterprise capabilities|project enquiry|Start a conversation/i;
    for (const [width,height] of [[400,554],[1440,900]]) {
      await page.setViewportSize({width,height});
      for (const path of routes) {
        await page.goto(prefix+path, {waitUntil:'domcontentloaded'});
        await expect(page.locator('html')).toHaveAttribute('lang',tag);
        await expect(page.locator('main h1')).toBeVisible();
        const body = await page.locator('body').innerText();
        expect(body.split(/\s+/).length).toBeGreaterThan(125);
        if (code !== 'en') expect(body).not.toMatch(englishLeaks);
        if (code !== 'en') {
          const bodyText = await page.locator('main, footer').evaluateAll(nodes => nodes.flatMap(root => {
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            const strings: string[] = [];
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              if (node.parentElement?.getClientRects().length) strings.push(node.textContent?.trim() ?? '');
            }
            return strings;
          }));
          expect(bodyText.filter(text => text.length > 20 && copy[text]?.[code] && copy[text][code] !== text), path).toEqual([]);
        }
        if (path === '/') expect(body.replaceAll("'",'’').toLowerCase()).toContain(homeCopy.toLowerCase());
        if (path === '/about') expect(body).toContain(aboutCopy);
        if (path === '/contact') expect(body).toContain(contactCopy);
        const slug = path.replace(/\/$/, '');
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za${prefix}${slug}/`);
        await expect(page.locator('link[hreflang="pt-AO"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za/pt${slug}/`);
        await expect(page.locator('link[hreflang="zu-ZA"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za/zu${slug}/`);
        await expect(page.locator('link[hreflang="af-ZA"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za/af${slug}/`);
        if (code !== 'en') await expect(page.locator('footer')).not.toContainText('Message us on WhatsApp');
        expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${path} at ${width}px`).toBeTruthy();
      }
    }
    const form = page.locator('#enquiry');
    await expect(form.locator('button[type=submit]')).toBeEnabled();
    await form.evaluate((el: HTMLFormElement) => el.requestSubmit());
    await expect(form.getByRole('status')).not.toBeEmpty();
    if (code !== 'en') await expect(form.getByRole('status')).not.toContainText('Please check the highlighted fields');
    for (const [name,value] of [['name','QA Example'],['email','qa@example.com'],['phone','073 168 0832'],['location','Johannesburg'],['message','QA test']]) await form.locator(`[name=${name}]`).fill(value);
    await form.locator('[name=service]').selectOption('Access Control');
    let payload='';
    await context.route('https://api.web3forms.com/submit', async route=>{
      payload=route.request().postData()||'';
      await route.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify({success:true})});
    });
    await form.locator('button[type=submit]').click();
    const success=code==='en'?'Thank you. Your enquiry has been sent.':copy['Thank you. Your enquiry has been sent. We will review it and respond using the contact details you provided.'][code];
    await expect(form.getByRole('status')).toContainText(success);
    for (const part of ['a9dc3e72-db1d-4958-a2c0-876e549371d8','qa@example.com','QA test','Access Control',tag]) expect(payload).toContain(part);
    if (code !== 'en') {
      await expect(form.getByRole('status')).not.toContainText('Thank you');
      await expect(form.getByRole('status')).not.toContainText('could not be sent');
    }
  });
}
