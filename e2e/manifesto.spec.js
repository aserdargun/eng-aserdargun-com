import { expect, test } from '@playwright/test';

test.describe('Open Humanoid Engineering manifesto', () => {
  test('desktop navigation reaches the complete curriculum without console noise', async ({ page }) => {
    const diagnostics = [];
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type())) diagnostics.push(message.text());
    });
    page.on('pageerror', (error) => diagnostics.push(error.message));

    await page.goto('/');

    await expect(page).toHaveTitle(/^ENG - /);
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Build intelligence');
    await expect(page.getByRole('heading', { name: 'The laboratory is software.' })).toBeVisible();
    await expect(page.locator('[data-year]')).toHaveCount(4);
    await expect(page.locator('.specialization-item')).toHaveCount(7);

    await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
    await expect(page).toHaveURL(/#curriculum$/);
    await expect(page.getByRole('heading', { name: /One humanoid/ })).toBeInViewport();

    await page.getByRole('link', { name: 'Specializations', exact: true }).click();
    await expect(page).toHaveURL(/#specializations$/);
    await expect(page.getByRole('heading', { name: 'Specialize at the intersections.' })).toBeInViewport();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
    expect(diagnostics).toEqual([]);
  });

  test('mobile menu opens, navigates, and closes without horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open navigation' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    const closeToggle = page.getByRole('button', { name: 'Close navigation' });
    await expect(closeToggle).toHaveAttribute('aria-expanded', 'true');
    await expect(closeToggle).toBeVisible();

    await page.getByRole('link', { name: 'Platform', exact: true }).click();
    await expect(page).toHaveURL(/#platform$/);
    await expect(page.getByRole('button', { name: 'Open navigation' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.getByRole('heading', { name: 'The laboratory is software.' })).toBeInViewport();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });
});

test('mobile navigation preserves keyboard focus and unlocks on resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toHaveJSProperty('inert', true);
  const home = page.getByRole('link', { name: 'Open Humanoid Engineering home' });
  await home.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('link', { name: 'GitHub', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(home).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator('html')).not.toHaveClass(/menu-open/);
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
  await expect(page.locator('#curriculum')).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await toggle.click();
  await page.getByRole('link', { name: 'Platform', exact: true }).click();
  await expect(page.locator('#platform')).toBeFocused();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
});

for (const width of [320, 768, 981, 1220, 1920]) {
  test(`all sections fit the viewport at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    for (const id of ['top', 'manifesto', 'frontier', 'curriculum', 'platform', 'specializations', 'production-gate']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await expect(page.locator(`#${id}`)).toHaveCSS('opacity', '1');
    }
    await expect(page.getByRole('link', { name: /Explore HEX/ })).toHaveAttribute('href', 'https://hex.aserdargun.com/');
    expect(await page.locator('img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0))).toBe(true);
  });
}

test('JavaScript-disabled mobile visitors can navigate and read the manifesto', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();
  await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
  await expect(page).toHaveURL(/#curriculum$/);
  await expect(page.locator('#curriculum')).toHaveCSS('opacity', '1');
  await context.close();
});

test('deep links, skipped content, and printing never depend on a reveal observer', async ({ page }) => {
  await page.addInitScript(() => { delete window.IntersectionObserver; });
  await page.goto('/#specializations');
  await expect(page.getByRole('heading', { name: 'Specialize at the intersections.' })).toBeInViewport();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  for (const section of await page.locator('[data-reveal]').all()) await expect(section).toHaveCSS('opacity', '1');
});
