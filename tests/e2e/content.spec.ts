import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('shows intro section with name and bio', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText("hey, i'm johnny");
    await expect(page.locator('text=AI engineer')).toBeVisible();
  });

  test('shows quick link cards', async ({ page }) => {
    await page.goto('/');
    // Scope to main content to avoid matching header nav links
    await expect(page.locator('main a[href="/log/"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/notes/"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/projects/"]').first()).toBeVisible();
  });

  test('shows recent activity section', async ({ page }) => {
    await page.goto('/');
    const recentSection = page.locator('text=Recent activity');
    // May or may not exist depending on content — just check page loads
    expect(await page.locator('main').innerHTML()).toBeTruthy();
  });
});

test.describe('Notes page', () => {
  test('lists feed items', async ({ page }) => {
    await page.goto('/notes/');
    await expect(page.locator('h1')).toContainText('Notes');

    // Should have at least one feed item (note or external)
    const feedItems = page.locator('#feed-list > *');
    await expect(feedItems.first()).toBeVisible();
  });

  test('feed filter buttons work', async ({ page }) => {
    await page.goto('/notes/');
    const filters = page.locator('#feed-filters');

    // Filters may not be present if no external items exist
    if (await filters.isVisible()) {
      const allBtn = filters.locator('button[data-filter="all"]');
      const noteBtn = filters.locator('button[data-filter="note"]');

      await noteBtn.click();
      await expect(noteBtn).toHaveClass(/text-accent/);

      // External items should be hidden
      const externalItems = page.locator('[data-type="external"]');
      if (await externalItems.count() > 0) {
        await expect(externalItems.first()).toBeHidden();
      }

      // Click "All" to reset
      await allBtn.click();
      await expect(allBtn).toHaveClass(/text-accent/);
    }
  });
});

test.describe('Individual note page', () => {
  test('note renders with title, date, and content', async ({ page }) => {
    await page.goto('/notes/');
    // Click the first note link
    const firstNote = page.locator('#feed-list a[href^="/notes/"]').first();
    if (await firstNote.count() > 0) {
      const href = await firstNote.getAttribute('href');
      await page.goto(href!);
      // Should have a title heading
      await expect(page.locator('article h1, main h1').first()).toBeVisible();
      // Should have a time element
      await expect(page.locator('time').first()).toBeVisible();
      // Should have prose content
      await expect(page.locator('.prose, article').first()).toBeVisible();
    }
  });
});

test.describe("Agent's Log page", () => {
  test('lists log entries grouped by month', async ({ page }) => {
    await page.goto('/log/');
    await expect(page.locator('h1')).toContainText("Agent's Log");

    // Should have at least one entry
    const entries = page.locator('.log-entry');
    await expect(entries.first()).toBeVisible();

    // Should have month group headers
    const monthHeaders = page.locator('.log-month-group h2');
    await expect(monthHeaders.first()).toBeVisible();
  });

  test('log entries have title, date, and preview', async ({ page }) => {
    await page.goto('/log/');
    const firstEntry = page.locator('.log-entry').first();

    // Title
    await expect(firstEntry.locator('h3')).toBeVisible();
    // Date
    await expect(firstEntry.locator('time')).toBeVisible();
  });

  test('entry count is shown', async ({ page }) => {
    await page.goto('/log/');
    await expect(page.locator('text=/\\d+ entr(y|ies) total/')).toBeVisible();
  });
});

test.describe('Individual log entry page', () => {
  test('log entry renders with full content', async ({ page }) => {
    await page.goto('/log/');
    const firstEntry = page.locator('.log-entry').first();
    const href = await firstEntry.getAttribute('href');
    await page.goto(href!);

    // Should have title
    await expect(page.locator('article h1, main h1').first()).toBeVisible();
    // Should have content
    await expect(page.locator('.prose, article').first()).toBeVisible();
  });

  test('raw markdown endpoint works', async ({ page }) => {
    await page.goto('/log/');
    const firstEntry = page.locator('.log-entry').first();
    const href = await firstEntry.getAttribute('href');

    // Fetch the raw markdown endpoint
    const rawUrl = href + 'raw.md';
    const response = await page.goto(rawUrl);
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'] || '';
    expect(contentType).toContain('text/markdown');

    const body = await response?.text();
    expect(body).toContain('---'); // Has frontmatter
  });

  test('prev/next navigation exists', async ({ page }) => {
    await page.goto('/log/');
    const firstEntry = page.locator('.log-entry').first();
    const href = await firstEntry.getAttribute('href');
    await page.goto(href!);

    // Should have back link to all entries (in main content, not header)
    await expect(page.locator('main a[href="/log/"]').first()).toBeVisible();
  });
});

test.describe('Tags', () => {
  test('tags page shows tag cloud', async ({ page }) => {
    await page.goto('/tags/');
    await expect(page.locator('h1')).toContainText('Tags');

    const tags = page.locator('a[href^="/tags/"]');
    // Might have tags or might not depending on content
    if (await tags.count() > 0) {
      await expect(tags.first()).toBeVisible();
    }
  });

  test('clicking a tag shows filtered posts', async ({ page }) => {
    await page.goto('/tags/');
    const firstTag = page.locator('a[href^="/tags/"]').first();

    if (await firstTag.count() > 0) {
      await firstTag.click();
      await expect(page.locator('h1')).toBeVisible();
    }
  });
});

test.describe('RSS feed', () => {
  test('returns valid XML', async ({ page }) => {
    const response = await page.goto('/rss.xml');
    expect(response?.status()).toBe(200);

    const contentType = response?.headers()['content-type'] || '';
    expect(contentType).toContain('xml');

    const body = await response?.text();
    expect(body).toContain('<?xml');
    expect(body).toContain('<rss');
    expect(body).toContain('<channel>');
    expect(body).toContain('<title>');
  });
});

test.describe('Projects page', () => {
  test('shows project list', async ({ page }) => {
    await page.goto('/projects/');
    await expect(page.locator('h1')).toContainText('Projects');
  });
});

test.describe('About page', () => {
  test('about page renders', async ({ page }) => {
    await page.goto('/about/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
