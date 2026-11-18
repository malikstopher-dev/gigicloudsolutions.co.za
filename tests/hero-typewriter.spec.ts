import { expect, test, type Page } from '@playwright/test';

const intro = '.gc-hero__copy';
const cursor = '.gc-typing-cursor';

async function holdOnPoster(page: Page) {
  await page.route('**/enterprise/videos/*.mp4', route => route.abort());
  await page.clock.install({ time: new Date(0) });
  await page.clock.pauseAt(new Date(1000));
}

test('The full accessible headline stays in place as the desktop intro advances', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await holdOnPoster(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const hero = page.locator('.gc-hero');
  const copy = hero.locator(intro);
  const title = hero.getByRole('heading', { name: 'Smart security. Seamless connectivity.', exact: true });
  const action = hero.getByRole('link', { name: 'Explore our solutions' });
  await expect(title).toBeAttached();
  await expect(copy).toHaveAttribute('data-intro', 'waiting');
  await expect(hero.locator('.gc-hero__actions')).toHaveCSS('opacity', '0');
  await page.clock.runFor(750);
  await expect(copy).toHaveAttribute('data-intro', 'eyebrow');
  await page.clock.runFor(175);
  await expect(copy).toHaveAttribute('data-intro', 'headline');
  await expect(hero.locator(cursor)).toBeVisible();
  await page.screenshot({ path: test.info().outputPath('desktop-headline-in-progress.jpg') });
  await expect(title).toHaveAccessibleName('Smart security. Seamless connectivity.');
  const bounds = await title.boundingBox();
  await page.clock.runFor(2050);
  await expect(copy).toHaveAttribute('data-intro', 'lead');
  await expect(title).toHaveAccessibleName('Smart security. Seamless connectivity.');
  await page.clock.runFor(3000);
  await expect(copy).not.toHaveAttribute('data-intro');
  await expect(action).toBeVisible();
  await expect(hero.locator(cursor)).toBeHidden();
  expect((await title.boundingBox())?.height).toBe(bounds?.height);
});

test('Every route starts its intro, with room reserved for the mobile headline and action', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await holdOnPoster(page);
  for (const path of ['/', '/fr/about', '/sw/services', '/ln/services/security-access', '/pt/services/it-connectivity', '/fr/services/electrical-solar', '/sw/services/web-graphic-design', '/ln/services/cloud-solutions', '/pt/contact']) {
    await page.goto(path, { waitUntil: 'domcontentloaded' });
    const copy = page.locator(intro);
    await expect(copy).toHaveAttribute('data-intro', 'waiting');
    await page.addStyleTag({ content: '.gc-page { animation: none !important; }' });
    await page.clock.runFor(950);
    await expect(copy).toHaveAttribute('data-intro', 'headline');
    const link = copy.locator('.gc-hero__actions a:visible');
    const initial = (await link.boundingBox())!;
    expect(initial.y + initial.height, path).toBeLessThanOrEqual(568);
    if (path === '/') {
      await page.screenshot({ path: test.info().outputPath('mobile-headline-in-progress.jpg') });
    }
    // A focused CTA is revealed immediately instead of waiting for the animation.
    await link.focus();
    await expect(copy).not.toHaveAttribute('data-intro');
    expect((await link.boundingBox())?.y).toBeCloseTo(initial.y, 0);
    if (path === '/') await page.screenshot({ path: test.info().outputPath('mobile-complete.jpg') });
  }
});

test('Language changes replay the translated introduction without remounting the video', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const video = page.locator('.gc-hero video');
  await expect.poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime), { timeout: 15000 }).toBeGreaterThan(0);
  const initialVideo = await video.elementHandle();
  for (const code of ['fr', 'sw', 'ln', 'pt', 'zu', 'af', 'en']) {
    await page.locator('.gc-nav select').selectOption(code);
    await expect(page.locator(intro)).toHaveAttribute('data-intro', /^(eyebrow|headline)$/);
    const text = await page.locator('.gc-hero__title-wide').textContent();
    if (code !== 'en') expect(text).not.toBe('Smart security. Seamless connectivity.');
    expect(await video.evaluate((node, initial) => node === initial, initialVideo)).toBeTruthy();
  }
  await initialVideo?.dispose();
});

test('Reduced motion immediately shows complete hero copy and CTA', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fr/about', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Découvrez GIGI Cloud Solutions.' })).toBeVisible();
  await expect(page.locator(intro)).not.toHaveAttribute('data-intro');
  await expect(page.locator('.gc-hero__actions')).toHaveCSS('opacity', '1');
  await expect(page.locator(cursor)).toBeHidden();
});
