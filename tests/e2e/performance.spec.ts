import { test, expect } from '@playwright/test';

// Performance budgets — these are generous starting thresholds.
// Tighten them as the site matures to catch regressions.
const BUDGETS = {
  // Max time for the page to report "load" event (ms)
  pageLoadMs: 3000,
  // Max time to DOMContentLoaded (ms)
  domContentLoadedMs: 2000,
  // Max total transfer size per page (bytes) — 500KB budget
  totalTransferBytes: 500 * 1024,
  // Max number of requests per page
  maxRequests: 40,
};

const PAGES_TO_BENCHMARK = ['/', '/notes/', '/log/', '/about/', '/projects/'];

test.describe('Page load performance', () => {
  for (const path of PAGES_TO_BENCHMARK) {
    test(`${path} loads within performance budget`, async ({ page }) => {
      // Collect all network requests
      const requests: { size: number; url: string }[] = [];
      page.on('response', async (response) => {
        try {
          const size = (await response.body()).length;
          requests.push({ size, url: response.url() });
        } catch {
          // Some responses may not have a body
        }
      });

      const start = Date.now();
      await page.goto(path, { waitUntil: 'load' });
      const loadTime = Date.now() - start;

      // Check load time
      expect(
        loadTime,
        `${path} load time ${loadTime}ms exceeds budget of ${BUDGETS.pageLoadMs}ms`
      ).toBeLessThan(BUDGETS.pageLoadMs);

      // Check total transfer size
      const totalSize = requests.reduce((sum, r) => sum + r.size, 0);
      expect(
        totalSize,
        `${path} total transfer ${(totalSize / 1024).toFixed(0)}KB exceeds budget of ${(BUDGETS.totalTransferBytes / 1024).toFixed(0)}KB`
      ).toBeLessThan(BUDGETS.totalTransferBytes);

      // Check request count
      expect(
        requests.length,
        `${path} made ${requests.length} requests, exceeds budget of ${BUDGETS.maxRequests}`
      ).toBeLessThan(BUDGETS.maxRequests);
    });
  }
});

test.describe('Navigation timing', () => {
  for (const path of PAGES_TO_BENCHMARK) {
    test(`${path} DOMContentLoaded within budget`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      const timing = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        return {
          domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
          loadEvent: nav.loadEventEnd - nav.startTime,
          ttfb: nav.responseStart - nav.startTime,
          domInteractive: nav.domInteractive - nav.startTime,
        };
      });

      expect(
        timing.domContentLoaded,
        `${path} DOMContentLoaded at ${timing.domContentLoaded.toFixed(0)}ms`
      ).toBeLessThan(BUDGETS.domContentLoadedMs);

      // TTFB should be very fast for static files served locally
      expect(timing.ttfb, `${path} TTFB at ${timing.ttfb.toFixed(0)}ms`).toBeLessThan(500);
    });
  }
});

test.describe('Cumulative Layout Shift', () => {
  for (const path of PAGES_TO_BENCHMARK) {
    test(`${path} has minimal layout shift`, async ({ page }) => {
      await page.goto(path, { waitUntil: 'networkidle' });

      const cls = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          let clsValue = 0;
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              // @ts-ignore — LayoutShift is not in standard TS types
              if (!(entry as any).hadRecentInput) {
                clsValue += (entry as any).value;
              }
            }
          });
          observer.observe({ type: 'layout-shift', buffered: true });

          // Give the page a moment to settle, then report
          setTimeout(() => {
            observer.disconnect();
            resolve(clsValue);
          }, 1000);
        });
      });

      // CLS should be under 0.1 (Google's "good" threshold)
      expect(cls, `${path} CLS is ${cls.toFixed(4)}`).toBeLessThan(0.1);
    });
  }
});

test.describe('Font loading', () => {
  test('fonts are preloaded', async ({ page }) => {
    await page.goto('/');
    const preloads = await page.$$eval('link[rel="preload"][as="font"]', (links) =>
      links.map((l) => l.getAttribute('href'))
    );
    expect(preloads.length).toBeGreaterThan(0);
    expect(preloads.some((p) => p?.includes('Inter'))).toBe(true);
  });

  test('fonts use woff2 format', async ({ page }) => {
    await page.goto('/');
    const preloads = await page.$$eval('link[rel="preload"][as="font"]', (links) =>
      links.map((l) => l.getAttribute('type'))
    );
    for (const type of preloads) {
      expect(type).toBe('font/woff2');
    }
  });
});

test.describe('Resource optimization', () => {
  test('no render-blocking stylesheets from external CDNs', async ({ page }) => {
    await page.goto('/');
    const externalStylesheets = await page.$$eval(
      'link[rel="stylesheet"]',
      (links) =>
        links
          .map((l) => l.getAttribute('href'))
          .filter((href) => href && (href.startsWith('http://') || href.startsWith('https://')))
    );
    // We expect zero external CSS — everything should be self-hosted
    expect(
      externalStylesheets,
      `External stylesheets found: ${externalStylesheets.join(', ')}`
    ).toHaveLength(0);
  });

  test('images use modern formats', async ({ page }) => {
    await page.goto('/');
    const images = await page.$$eval('img[src]', (imgs) =>
      imgs.map((img) => img.getAttribute('src'))
    );

    for (const src of images) {
      if (src && !src.startsWith('data:') && !src.includes('.svg')) {
        // Astro-optimized images should be webp or avif
        expect(
          src,
          `Image ${src} is not using a modern format`
        ).toMatch(/\.(webp|avif|svg)/);
      }
    }
  });
});
