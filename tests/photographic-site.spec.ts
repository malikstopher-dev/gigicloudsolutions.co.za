import { test, expect } from '@playwright/test';

for (const width of [360, 390, 768, 1440]) {
  test(`Hero plays only the matching video at ${width}px`, async ({ page }) => {
    const desktop = width >= 768;
    const requests = new Set<string>();
    page.on('request', r => { if (r.url().includes('/videos/')) requests.add(decodeURIComponent(new URL(r.url()).pathname)); });
    await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
    await page.goto('/');
    const video = page.locator('.photo-hero video');
    await expect(video).toHaveAttribute('poster', `/images/gigi/hero-${desktop ? 'desktop' : 'mobile'}-960.webp`);
    await expect.poll(() => video.evaluate(v => (v as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
    expect([...requests]).toEqual([desktop ? '/videos/HERO DESKTOP.mp4' : '/videos/hero mobile.mp4']);
    for (const property of ['muted', 'loop', 'playsInline']) await expect(video).toHaveJSProperty(property, true);
    await page.screenshot({path:`docs/screenshots/video-hero-${width}.png`});
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect(video).toHaveJSProperty('paused', true);
    await page.evaluate(() => scrollTo(0, 0));
    await expect(video).toHaveJSProperty('paused', false);
  });
}

test('Reduced motion displays the poster without fetching a movie', async ({page}) => {
  const movies: string[] = [];
  page.on('request', r => { if (r.url().includes('/videos/')) movies.push(r.url()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.photo-hero picture img')).toHaveJSProperty('complete', true);
  await expect(page.locator('video')).toHaveCount(0);
  expect(movies).toEqual([]);
});

test('All five home cards lead to a service-specific quote', async ({page}) => {
  await page.goto('/');
  const cards = page.locator('.photo-service-card');
  await expect(cards).toHaveCount(5);
  await expect(cards.locator('picture img[alt^="Illustrative"]')).toHaveCount(4);
  await expect(cards.locator('.cloud-media svg')).toHaveCount(1);
  for (let i = 0; i < 5; i++) {
    const name = await cards.nth(i).locator('h3').innerText();
    await cards.nth(i).getByRole('link').click();
    await page.getByRole('link', {name:'Discuss your project', exact:true}).click();
    await expect(page.getByLabel('Service of interest')).toHaveValue(name);
    await page.goto('/');
  }
});
