import { test, expect } from '@playwright/test';

const PAGES = [
  { path: '/', titleContains: 'Johnny Greco' },
  { path: '/notes/', titleContains: 'Notes' },
  { path: '/projects/', titleContains: 'Projects' },
  { path: '/about/', titleContains: 'About' },
];

test.describe('Meta tags', () => {
  for (const pg of PAGES) {
    test(`${pg.path} has correct meta tags`, async ({ page }) => {
      await page.goto(pg.path);

      // Title
      await expect(page).toHaveTitle(new RegExp(pg.titleContains));

      // Meta description
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description, `Missing meta description on ${pg.path}`).toBeTruthy();
      expect(description!.length).toBeGreaterThan(10);

      // Canonical URL
      const canonical = await page.getAttribute('link[rel="canonical"]', 'href');
      expect(canonical, `Missing canonical URL on ${pg.path}`).toBeTruthy();
      expect(canonical).toContain('johnnygreco.dev');
    });
  }
});

test.describe('Open Graph tags', () => {
  for (const pg of PAGES) {
    test(`${pg.path} has OG tags`, async ({ page }) => {
      await page.goto(pg.path);

      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      expect(ogTitle, `Missing og:title on ${pg.path}`).toBeTruthy();

      const ogDescription = await page.getAttribute('meta[property="og:description"]', 'content');
      expect(ogDescription, `Missing og:description on ${pg.path}`).toBeTruthy();

      const ogType = await page.getAttribute('meta[property="og:type"]', 'content');
      expect(ogType).toBe('website');

      const ogUrl = await page.getAttribute('meta[property="og:url"]', 'content');
      expect(ogUrl, `Missing og:url on ${pg.path}`).toBeTruthy();

      const ogSiteName = await page.getAttribute('meta[property="og:site_name"]', 'content');
      expect(ogSiteName).toBe('Johnny Greco');
    });
  }
});

test.describe('Twitter card tags', () => {
  test('homepage has Twitter card meta', async ({ page }) => {
    await page.goto('/');

    const card = await page.getAttribute('meta[name="twitter:card"]', 'content');
    expect(card).toBe('summary_large_image');

    const title = await page.getAttribute('meta[name="twitter:title"]', 'content');
    expect(title).toBeTruthy();

    const description = await page.getAttribute('meta[name="twitter:description"]', 'content');
    expect(description).toBeTruthy();
  });
});

test.describe('Sitemap', () => {
  test('sitemap index exists and is valid XML', async ({ page }) => {
    const response = await page.goto('/sitemap-index.xml');
    expect(response?.status()).toBe(200);

    const body = await response?.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('sitemap');
  });

  test('sitemap-0.xml has page URLs', async ({ page }) => {
    const response = await page.goto('/sitemap-0.xml');
    expect(response?.status()).toBe(200);

    const body = await response?.text();
    expect(body).toContain('johnnygreco.dev');
    expect(body).toContain('<loc>');
  });
});

test.describe('robots.txt', () => {
  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });
});

test.describe('RSS discovery', () => {
  test('pages have RSS autodiscovery link', async ({ page }) => {
    await page.goto('/');
    const rssLink = await page.getAttribute('link[type="application/rss+xml"]', 'href');
    expect(rssLink).toBe('/rss.xml');
  });
});

test.describe('Favicon', () => {
  test('favicon is set', async ({ page }) => {
    await page.goto('/');
    const favicon = await page.getAttribute('link[rel="icon"]', 'href');
    expect(favicon).toBeTruthy();
  });

  test('favicon.svg loads', async ({ page }) => {
    const response = await page.goto('/favicon.svg');
    expect(response?.status()).toBe(200);
  });
});

test.describe('Language', () => {
  test('html has lang attribute', async ({ page }) => {
    await page.goto('/');
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });
});

test.describe('Viewport', () => {
  test('has viewport meta tag', async ({ page }) => {
    await page.goto('/');
    const viewport = await page.getAttribute('meta[name="viewport"]', 'content');
    expect(viewport).toContain('width=device-width');
  });
});

test.describe('Charset', () => {
  test('has charset meta tag', async ({ page }) => {
    await page.goto('/');
    const charset = await page.getAttribute('meta[charset]', 'charset');
    expect(charset).toBe('utf-8');
  });
});
