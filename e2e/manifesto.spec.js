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

    const toggle = page.getByRole('button', { name: 'Menu' });
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');

    await page.getByRole('link', { name: 'Platform', exact: true }).click();
    await expect(page).toHaveURL(/#platform$/);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(page.getByRole('heading', { name: 'The laboratory is software.' })).toBeInViewport();

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('the horizon section and the itl parallel link are reachable from desktop and mobile navigation', async ({ page, context }) => {
    await page.goto('/');

    // Sidebar shows both horizon (internal anchor) and itl (external subdomain).
    await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toContainText('The horizon · what this loop serves');
    const sidebar = page.getByRole('navigation', { name: 'Primary navigation' });
    const horizonLink = sidebar.getByRole('link', { name: 'horizon', exact: true });
    const itlLink = sidebar.getByRole('link', { name: /itl\.aserdargun\.com/ });
    await expect(horizonLink).toHaveAttribute('href', '#horizon');
    await expect(itlLink).toHaveAttribute('href', 'https://itl.aserdargun.com');
    await expect(itlLink).toHaveAttribute('target', '_blank');

    // Clicking horizon scrolls the new section into view.
    await horizonLink.click();
    await expect(page).toHaveURL(/#horizon$/);
    await expect(page.getByRole('heading', { name: 'The horizon · what this loop serves.' })).toBeInViewport();
    await expect(page.getByRole('heading', { name: 'itl — what this loop serves' })).toBeVisible();

    // External itl link opens a new tab.
    const [popup] = await Promise.all([
      context.waitForEvent('page'),
      itlLink.click(),
    ]);
    expect(popup.url()).toBe('https://itl.aserdargun.com/');
    await popup.close();

    // Mobile menu also surfaces both links.
    await page.setViewportSize({ width: 390, height: 844 });
    const toggle = page.getByRole('button', { name: 'Menu' });
    await toggle.click();
    const mobileSidebar = page.getByRole('navigation', { name: 'Primary navigation' });
    await expect(mobileSidebar.getByRole('link', { name: 'horizon', exact: true })).toBeVisible();
    await expect(mobileSidebar.getByRole('link', { name: /itl\.aserdargun\.com/ })).toBeVisible();
  });
});
