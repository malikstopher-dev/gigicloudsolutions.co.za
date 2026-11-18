import { expect, test } from '@playwright/test';

const heroes = {
  '/': 'home', '/about': 'about', '/contact': 'contact', '/services': 'services',
  '/services/security-access': 'enterprise-security', '/services/it-connectivity': 'it-connectivity',
  '/services/electrical-solar': 'solar-energy', '/services/web-graphic-design': 'web-graphic-design',
  '/services/cloud-solutions': 'data-backup',
};

for (const width of [360, 1440]) {
  test(`All routes have a decoded device-specific hero at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 360 ? 640 : 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [path, key] of Object.entries(heroes)) {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const image = page.locator('.gc-hero picture img');
      await image.evaluate((img: HTMLImageElement) => img.decode());
      expect(await image.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain(`hero-${key}-${width === 360 ? 'mobile' : 'desktop'}-`);
      await expect(page.locator('h1')).toHaveCount(1);
      const box = await page.locator('.gc-hero__copy').boundingBox();
      const header = await page.getByRole('banner').boundingBox();
      expect(box!.y, path).toBeGreaterThanOrEqual(header!.height - 1);
    }
  });
}

test('All eleven capabilities offer a prefilled quote and service group page', async ({ page }) => {
  await page.goto('/services', { waitUntil: 'domcontentloaded' });
  const cards = page.locator('.gc-cap-card');
  await expect(cards).toHaveCount(11);
  await expect(page.locator('.gc-group-card')).toHaveCount(5);
  for (const card of await cards.all()) {
    const name = await card.locator('h3').innerText();
    const href = await card.getByRole('link', { name: 'Request a quote' }).getAttribute('href');
    expect(new URL(href!, page.url()).searchParams.get('service')).toBe(name);
    await expect(card.getByRole('link', { name: /^Explore/ })).toHaveAttribute('href', /^\/services\//);
  }
  await cards.last().getByRole('link', { name: 'Request a quote' }).click();
  await expect(page.getByLabel('Service of interest')).toHaveValue('Graphic Design');
});
