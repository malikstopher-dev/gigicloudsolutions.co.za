import { test, expect, type Page } from '@playwright/test';
import sharp from 'sharp';

const routes = ['/', '/about', '/services', '/services/it-connectivity', '/services/security-access', '/services/electrical-solar', '/services/web-graphic-design', '/services/cloud-solutions', '/contact'];

async function checkContrast(page: Page) {
  const failures = await page.evaluate(() => {
    const rgba = (value: string) => {
      const values = value.match(/[\d.]+/g)!.map(Number);
      return [values[0], values[1], values[2], values[3] ?? 1];
    };
    const over = (fg: number[], bg: number[]) =>
      [0, 1, 2].map(i => fg[i] * fg[3] + bg[i] * (1 - fg[3])).concat(1);
    const luminance = (color: number[]) => color.slice(0, 3).reduce((sum, c, i) => {
      const s = c / 255;
      return sum + (s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4) * [0.2126, 0.7152, 0.0722][i];
    }, 0);
    const failures: string[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('body *')) {
      const style = getComputedStyle(el);
      if (!el.getClientRects().length || style.visibility !== 'visible' || el.closest('svg, option')) continue;
      const text = [...el.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim();
      const placeholder = el.matches('input[placeholder],textarea[placeholder]');
      if (!text && !placeholder) continue;
    const layers: number[][] = [];
    for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) layers.push(rgba(getComputedStyle(node).backgroundColor));
    // Worst-case painted page background: glow blobs and tile squares over the gradient.
    const bg = layers.reverse().reduce((bg, layer) => over(layer, bg), [89, 211, 183, 1]);
      for (const color of [style.color, ...(placeholder ? [getComputedStyle(el, '::placeholder').color] : [])]) {
        const fgLum = luminance(over(rgba(color), bg)), bgLum = luminance(bg);
        const ratio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
        if (ratio < 4.5) failures.push(`${el.tagName}.${el.className}: ${(text || el.getAttribute('placeholder'))?.slice(0, 65)} = ${ratio.toFixed(2)}:1 (${color})`);
      }
    }
    return failures;
  });
  expect(failures, `Text contrast on ${page.url()}`).toEqual([]);
}

for (const width of [390, 1440]) test(`Low-glare surfaces and 4.5:1 text contrast at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const route of routes) {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(211, 239, 230)');
    await expect(page.locator('body')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await expect(page.locator('.page-bg')).toHaveCSS('position', 'fixed');
    await expect(page.locator('.page-bg')).toHaveCSS('background-image', /linear-gradient/);
    await expect(page.locator('.bg-blob')).toHaveCount(3);
    if (width >= 768) {
      await expect(page.locator('.tile-floor')).toBeVisible();
      await expect(page.locator('.blob-blue')).toBeVisible();
    } else {
      await expect(page.locator('.tile-floor')).toBeHidden();
      await expect(page.locator('.blob-blue')).toBeHidden();
    }
    await expect(page.locator('.header')).toHaveCSS('background-color', 'rgb(250, 251, 253)');
    const sections = page.locator('main > section:not(.closing)');
    for (let i = 0; i < await sections.count(); i++) {
      await expect(sections.nth(i)).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
      await expect(sections.nth(i)).toHaveCSS('border-top-width', '0px');
    }
    await checkContrast(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (['/', '/services', '/contact'].includes(route)) {
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `docs/screenshots/low-glare-${width}-${route === '/' ? 'home' : route.slice(1)}.png`, fullPage: true });
    }
  }
  if (width === 390) await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'Show service pages' }).click();
  await expect(page.locator('.dropdown')).toHaveCSS('background-color', 'rgb(250, 251, 253)');
  await checkContrast(page);
  const button = page.locator('.button').first();
  await button.hover();
  await checkContrast(page);
});

test('Daylight fallback artwork has transparent corners', async () => {
  for (const name of ['it', 'security', 'security-confirmed', 'solar', 'design', 'branding', 'cloud', 'hero']) {
    const image = sharp(`public/artwork/${name}.webp`);
    expect((await image.metadata()).hasAlpha, name).toBe(true);
    const pixel = await image.extract({ left: 0, top: 0, width: 1, height: 1 }).raw().toBuffer();
    expect(pixel[3], name).toBe(0);
  }
});

for (const width of [390, 1440]) test(`Live canvas blends into the card at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/services/it-connectivity', { waitUntil: 'domcontentloaded' });
  await page.locator('.board-art').scrollIntoViewIfNeeded();
  const canvas = page.locator('.board-art .scene-ready canvas');
  await expect(canvas).toBeVisible({ timeout: 120000 });
  expect(await canvas.evaluate((el: HTMLCanvasElement) => el.getContext('webgl2')?.getContextAttributes()?.alpha)).toBe(true);
  await page.waitForTimeout(500);
  const box = (await canvas.boundingBox())!;
  const corner = await sharp(await page.screenshot({ clip: { x: box.x + 12, y: box.y + 12, width: 4, height: 4 } })).removeAlpha().stats();
  for (const [i, expected] of [250, 251, 253].entries()) expect(Math.abs(corner.channels[i].mean - expected)).toBeLessThanOrEqual(2);
  await page.screenshot({ path: `docs/screenshots/low-glare-live-${width}.png` });
});
