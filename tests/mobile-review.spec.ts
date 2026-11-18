import { test, expect } from '@playwright/test';

const routes = ['/', '/about', '/services', '/services/security-access', '/services/it-connectivity', '/services/electrical-solar', '/services/web-graphic-design', '/services/cloud-solutions', '/contact'];
const sizes = [[320,568],[360,640],[375,667],[390,844],[400,554],[428,520],[430,932],[768,1024],[1440,900]];
const review = process.env.GIGI_VISUAL_REVIEW;

test('Review hero compositions across routes and device sizes', async ({ page }) => {
  test.skip(!review, 'Set GIGI_VISUAL_REVIEW to capture comparison screenshots');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (review !== 'before') await page.addInitScript(() => localStorage.setItem('gigi-language', 'ln'));
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      const hero = page.locator('.gc-hero');
      await hero.locator('img').evaluate((img: HTMLImageElement) => img.decode());
      await expect(hero.locator('h1')).toBeVisible();
      await expect(hero.locator('img')).toBeInViewport();
      if (width < 768 && review !== 'before') {
        const heroBox = (await hero.boundingBox())!;
        const action = (await hero.locator('.gc-hero__actions a:visible').boundingBox())!;
        expect(heroBox.height).toBeGreaterThanOrEqual(height);
        expect(action.y + action.height).toBeLessThanOrEqual(height);
      }
      await page.screenshot({ path: `test-results/review-${review}/${width}x${height}-${route.split('/').at(-1) || 'home'}.jpg`, animations: 'disabled' });
    }
  }
});

test('Short forced-colors viewport keeps the hero action clear of the pause control', async ({ page }) => {
  await page.setViewportSize({ width: 428, height: 520 });
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/ln/', { waitUntil: 'domcontentloaded' });
  const action = page.locator('.gc-hero__actions a:visible');
  const control = page.locator('.gc-film-control');
  await expect(control).toBeVisible();
  const linkBox = (await action.boundingBox())!;
  const controlBox = (await control.boundingBox())!;
  expect(controlBox.y + controlBox.height).toBeLessThan(linkBox.y);
  expect(linkBox.y + linkBox.height).toBeLessThan(520);
  await expect(page.locator('.gc-strip')).not.toBeInViewport();
});
