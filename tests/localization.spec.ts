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
] as const;

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
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za${prefix}${path}`);
        await expect(page.locator('link[hreflang="pt-AO"]')).toHaveAttribute('href',`https://www.gigicloudsolutions.co.za/pt${path}`);
        if (code !== 'en') await expect(page.locator('footer')).not.toContainText('Message us on WhatsApp');
        expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1),`${path} at ${width}px`).toBeTruthy();
      }
    }
    const form = page.locator('#enquiry');
    await form.evaluate((el: HTMLFormElement) => el.requestSubmit());
    await expect(form.getByRole('status')).not.toBeEmpty();
    if (code !== 'en') await expect(form.getByRole('status')).not.toContainText('Please check the highlighted fields');
    for (const [name,value] of [['name','QA Example'],['email','qa@example.com'],['phone','073 168 0832'],['location','Johannesburg'],['message','QA test']]) await form.locator(`[name=${name}]`).fill(value);
    await form.locator('[name=service]').selectOption('Access Control');
    await context.route('https://wa.me/**', route=>route.fulfill({status:200,body:'Test handoff'}));
    const popup=page.waitForEvent('popup');
    await form.locator('button[type=submit]').click();
    await (await popup).close();
    const href=await form.getByRole('status').getByRole('link').getAttribute('href');
    const text=new URL(href!).searchParams.get('text');
    expect(text).toContain('qa@example.com');
    expect(text).toContain('QA test');
    if (code !== 'en') {
      expect(text).not.toContain('I would like to request a quotation');
      await expect(form.getByRole('status')).not.toContainText('Your enquiry is ready');
    }
  });
}
