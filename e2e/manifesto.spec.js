import { expect, test } from '@playwright/test';

test.describe('Open Humanoid Engineering manifesto', () => {
  test('desktop navigation reaches the complete curriculum without console noise', async ({ page }) => {
    const diagnostics = [];
    page.on('console', (message) => {
      if (['warning', 'error'].includes(message.type())) diagnostics.push(message.text());
    });
    page.on('pageerror', (error) => diagnostics.push(error.message));

    await page.goto('/');

    await expect(page).toHaveTitle('Open Humanoid Engineering');
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.svg');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Build intelligence');
    await expect(page.getByRole('heading', { name: 'The laboratory is software.' })).toBeVisible();
    await expect(page.locator('[data-year]')).toHaveCount(4);
    await expect(page.locator('.specialization-item')).toHaveCount(7);

    await page.getByRole('link', { name: 'Curriculum', exact: true }).click();
    await expect(page).toHaveURL(/#curriculum$/);
    await expect(page.getByRole('heading', { name: /One humanoid/ })).toBeInViewport();

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
