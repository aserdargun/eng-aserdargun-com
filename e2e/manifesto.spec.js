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

test('mobile keyboard navigation traps focus, escapes, and restores the destination', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const toggle = page.locator('[data-menu-toggle]');
  await toggle.click();
  await expect(page.getByRole('link', { name: 'Manifesto', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.locator('.nav-github')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(toggle).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await toggle.click();
  await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
  await expect(page.locator('#curriculum')).toBeFocused();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
});

test('resizing an open mobile menu restores scrolling and page interaction', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-menu-toggle]').click();
  await page.setViewportSize({ width: 1280, height: 844 });
  await expect(page.locator('html')).not.toHaveClass(/menu-open/);
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
  await expect(page.locator('footer')).toHaveJSProperty('inert', false);
  await page.getByRole('link', { name: 'Platform', exact: true }).click();
  await expect(page.locator('#platform')).toBeInViewport();
});

for (const width of [320, 390, 640, 641, 768, 980, 981, 1024, 1220, 1280, 1440, 1920]) {
  test(`all sections fit at ${width}px and all local assets load`, async ({ page }) => {
    const failures = [];
    page.on('pageerror', error => failures.push(error.message));
    page.on('console', message => {
      if (['warning', 'error'].includes(message.type())) failures.push(message.text());
    });
    page.on('response', response => { if (response.status() >= 400) failures.push(response.url()); });
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveTitle(/^ENG - /);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('vite-error-overlay')).toHaveCount(0);
    expect(await page.locator('.figure-frame img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
    for (const section of await page.locator('main > section').all()) {
      await section.scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      expect(await section.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    }
    expect(failures).toEqual([]);
  });
}

test('mobile navigation and manifesto work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto(test.info().project.use.baseURL);
    await expect(page.locator('[data-menu-toggle]')).toBeHidden();
    await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
    await expect(page).toHaveURL(/#curriculum$/);
    await expect(page.locator('#curriculum')).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  } finally { await context.close(); }
});

test('short screens reveal long sections and printing exposes the whole manifesto', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 320 });
  await page.goto('/#platform');
  await expect(page.locator('#platform')).toHaveCSS('opacity', '1');
  await page.emulateMedia({ media: 'print' });
  for (const section of await page.locator('[data-reveal]').all()) {
    await expect(section).toHaveCSS('opacity', '1');
  }
});

test('keyboard skip link focuses the main content and HEX retains its evidence boundary', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip-link')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await expect(page.locator('.hex-link')).toHaveAttribute('href', 'https://hex.aserdargun.com/');
  await expect(page.locator('.hex-boundary')).toContainText('do not establish torque ratings');
  const broken = await page.locator('a[href^="#"]').evaluateAll(links => links.filter(link => !document.getElementById(link.hash.slice(1))).map(link => link.hash));
  expect(broken).toEqual([]);
});

test('deep links, reduced motion, skip link and print keep content available', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#production-gate');
  await expect(page.locator('#production-title')).toBeInViewport();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.site-header')).toBeHidden();
  for (const heading of await page.locator('h2').all()) await expect(heading).toBeVisible();
});


test('leaving through GitHub closes the mobile overlay', async ({ page, context }) => {
  await context.route('https://github.com/**', route => route.fulfill({ body: 'Repository destination' }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.locator('[data-menu-toggle]').click();
  const popup = page.waitForEvent('popup');
  await page.locator('.nav-github').click();
  await (await popup).close();
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
});

test('desktop navigation focus remains reachable after resizing to mobile', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Platform', exact: true }).focus();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('[data-menu-toggle]')).toBeFocused();
  await expect(page.locator('main')).toHaveJSProperty('inert', false);
});
