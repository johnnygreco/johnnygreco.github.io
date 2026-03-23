import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', title: 'Johnny Greco' },
  { path: '/notes/', title: 'Notes' },
  { path: '/log/', title: "Agent's Log" },
  { path: '/projects/', title: 'Projects' },
  { path: '/about/', title: 'About' },
  { path: '/tags/', title: 'Tags' },
];

test.describe('Page loading', () => {
  for (const page of PAGES) {
    test(`${page.path} loads with correct title`, async ({ page: p }) => {
      const response = await p.goto(page.path);
      expect(response?.status()).toBe(200);
      await expect(p).toHaveTitle(new RegExp(page.title));
    });
  }
});

test.describe('Header navigation', () => {
  test('logo links to homepage', async ({ page }) => {
    await page.goto('/about/');
    await page.click('header a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('all nav links work', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // Open mobile menu first
      await page.click('#mobile-menu-toggle');
      await expect(page.locator('#mobile-menu')).toBeVisible();
    }

    const navLinks = [
      { text: "Agent's Log", href: '/log/' },
      { text: 'Notes', href: '/notes/' },
      { text: 'Projects', href: '/projects/' },
      { text: 'About', href: '/about/' },
    ];

    for (const link of navLinks) {
      const selector = isMobile ? '#mobile-menu' : 'header nav';
      const navLink = page.locator(`${selector} a:has-text("${link.text}")`).first();
      await expect(navLink).toHaveAttribute('href', link.href);
    }
  });

  test('active nav item is highlighted', async ({ page, isMobile }) => {
    if (isMobile) return; // Skip for mobile — nav is hidden

    await page.goto('/notes/');
    const notesLink = page.locator('header nav .hidden.md\\:flex a[href="/notes/"]');
    await expect(notesLink).toHaveClass(/text-accent/);
  });

  test('header is sticky', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header').first();
    await expect(header).toHaveCSS('position', 'sticky');
  });
});

test.describe('Mobile navigation', () => {
  test.skip(({ isMobile }) => !isMobile, 'Mobile only');

  test('hamburger menu toggles', async ({ page }) => {
    await page.goto('/');
    const menu = page.locator('#mobile-menu');

    await expect(menu).toBeHidden();
    await page.click('#mobile-menu-toggle');
    await expect(menu).toBeVisible();
    await page.click('#mobile-menu-toggle');
    await expect(menu).toBeHidden();
  });
});

test.describe('404 page', () => {
  test('shows 404 for invalid routes', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist/');
    expect(response?.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/404|not found/i);
  });
});

test.describe('Footer', () => {
  test('footer has social links', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('footer');

    await expect(footer.locator('a[aria-label="GitHub"]')).toBeVisible();
    await expect(footer.locator('a[aria-label="LinkedIn"]')).toBeVisible();
    await expect(footer.locator('a[aria-label="RSS Feed"]')).toBeVisible();
  });
});

test.describe('Skip to content', () => {
  test('skip link exists and targets main content', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a.skip-to-content');
    await expect(skipLink).toHaveAttribute('href', '#main-content');

    const main = page.locator('#main-content');
    await expect(main).toBeAttached();
  });
});

test.describe('Command palette', () => {
  test.skip(({ isMobile }) => isMobile, 'Desktop only');

  test('cmd+k trigger button exists', async ({ page }) => {
    await page.goto('/');
    const trigger = page.locator('#cmd-palette-trigger');
    await expect(trigger).toBeVisible();
  });
});
