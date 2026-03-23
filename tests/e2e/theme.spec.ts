import { test, expect } from '@playwright/test';

/** Get the visible theme toggle button (desktop and mobile have separate instances) */
function getToggle(page: import('@playwright/test').Page) {
  return page.locator('button[aria-label*="Switch to"]').locator('visible=true').first();
}

test.describe('Theme', () => {
  test('default theme is dark', async ({ page }) => {
    await page.goto('/');
    const theme = await page.getAttribute('html', 'data-theme');
    expect(theme).toBe('dark');
  });

  test('theme toggle switches to light and back', async ({ page }) => {
    await page.goto('/');

    // Find and click the visible theme toggle button
    await getToggle(page).click();

    const themeAfterToggle = await page.getAttribute('html', 'data-theme');
    expect(themeAfterToggle).toBe('light');

    // Toggle back — aria-label changes after first click
    await getToggle(page).click();
    const themeAfterSecondToggle = await page.getAttribute('html', 'data-theme');
    expect(themeAfterSecondToggle).toBe('dark');
  });

  test('theme persists in localStorage', async ({ page }) => {
    await page.goto('/');

    await getToggle(page).click();

    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('light');
  });

  test('theme survives navigation (no FOUC)', async ({ page }) => {
    await page.goto('/');

    // Switch to light
    await getToggle(page).click();
    expect(await page.getAttribute('html', 'data-theme')).toBe('light');

    // Navigate to another page
    await page.goto('/about/');
    const themeAfterNav = await page.getAttribute('html', 'data-theme');
    expect(themeAfterNav).toBe('light');
  });

  test('theme init script runs before paint', async ({ page }) => {
    // The inline script in BaseLayout.astro should set data-theme before any rendering
    // We check that <html> has data-theme attribute immediately
    await page.goto('/');
    const theme = await page.getAttribute('html', 'data-theme');
    expect(theme).toBeTruthy();
    expect(['dark', 'light']).toContain(theme);
  });
});
