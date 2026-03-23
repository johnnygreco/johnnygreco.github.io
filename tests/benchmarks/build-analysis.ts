/**
 * Build Analysis Script
 *
 * Analyzes the production build output (dist/) for:
 * - Total build size
 * - Per-page HTML weight
 * - JS bundle sizes
 * - CSS bundle sizes
 * - Font sizes
 * - Image sizes
 * - Pagefind index size
 * - Expected pages exist
 *
 * Run: npx tsx tests/benchmarks/build-analysis.ts
 * Exit code 1 if any budget is exceeded.
 */

import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const DIST = join(import.meta.dirname, '..', '..', 'dist');

// ── Budgets (bytes) ──────────────────────────────────────────────────
const BUDGETS = {
  totalDistSizeMB: 15,         // Max total dist size in MB
  maxHtmlPerPageKB: 100,       // Max HTML per page in KB
  maxSingleJsBundleKB: 200,    // Max single JS file in KB (React runtime ~178KB)
  maxTotalJsKB: 500,           // Max total JS in KB
  maxTotalCssKB: 100,          // Max total CSS in KB
  maxFontFileKB: 150,          // Max single font file in KB
  maxImageFileKB: 500,         // Max single image file in KB
};

// ── Expected pages ───────────────────────────────────────────────────
const EXPECTED_FILES = [
  'index.html',
  'about/index.html',
  'projects/index.html',
  'notes/index.html',
  'log/index.html',
  'tags/index.html',
  '404.html',
  'rss.xml',
  'robots.txt',
  'sitemap-index.xml',
  'favicon.svg',
];

// ── Helpers ──────────────────────────────────────────────────────────
interface FileInfo {
  path: string;
  size: number;
  ext: string;
}

function walkDir(dir: string): FileInfo[] {
  const results: FileInfo[] = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath));
    } else {
      results.push({
        path: relative(DIST, fullPath),
        size: statSync(fullPath).size,
        ext: extname(entry.name).toLowerCase(),
      });
    }
  }
  return results;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

// ── Main ─────────────────────────────────────────────────────────────
function analyze() {
  if (!existsSync(DIST)) {
    console.error('ERROR: dist/ not found. Run `npm run build` first.');
    process.exit(1);
  }

  const allFiles = walkDir(DIST);
  const failures: string[] = [];

  console.log('');
  console.log('='.repeat(60));
  console.log('  BUILD ANALYSIS REPORT');
  console.log('='.repeat(60));

  // ── 1. Expected files ──
  console.log('\n--- Expected Files ---');
  for (const file of EXPECTED_FILES) {
    const exists = existsSync(join(DIST, file));
    const status = exists ? 'OK' : 'MISSING';
    console.log(`  ${exists ? '✓' : '✗'} ${file} — ${status}`);
    if (!exists) failures.push(`Missing expected file: ${file}`);
  }

  // ── 2. Total dist size ──
  const totalSize = allFiles.reduce((sum, f) => sum + f.size, 0);
  const totalSizeMB = totalSize / (1024 * 1024);
  console.log(`\n--- Total Build Size ---`);
  console.log(`  ${formatBytes(totalSize)} (${allFiles.length} files)`);
  if (totalSizeMB > BUDGETS.totalDistSizeMB) {
    failures.push(`Total dist size ${totalSizeMB.toFixed(1)}MB exceeds budget of ${BUDGETS.totalDistSizeMB}MB`);
  }

  // ── 3. HTML pages ──
  const htmlFiles = allFiles.filter((f) => f.ext === '.html');
  console.log(`\n--- HTML Pages (${htmlFiles.length}) ---`);
  for (const f of htmlFiles.sort((a, b) => b.size - a.size)) {
    const sizeKB = f.size / 1024;
    const over = sizeKB > BUDGETS.maxHtmlPerPageKB;
    console.log(`  ${over ? '✗' : '✓'} ${f.path} — ${formatBytes(f.size)}`);
    if (over) {
      failures.push(`HTML ${f.path} is ${sizeKB.toFixed(1)}KB (budget: ${BUDGETS.maxHtmlPerPageKB}KB)`);
    }
  }

  // ── 4. JavaScript bundles ──
  const jsFiles = allFiles.filter((f) => f.ext === '.js' || f.ext === '.mjs');
  const totalJs = jsFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n--- JavaScript Bundles (${jsFiles.length}) — Total: ${formatBytes(totalJs)} ---`);
  for (const f of jsFiles.sort((a, b) => b.size - a.size)) {
    const sizeKB = f.size / 1024;
    const over = sizeKB > BUDGETS.maxSingleJsBundleKB;
    console.log(`  ${over ? '✗' : '✓'} ${f.path} — ${formatBytes(f.size)}`);
    if (over) {
      failures.push(`JS bundle ${f.path} is ${sizeKB.toFixed(1)}KB (budget: ${BUDGETS.maxSingleJsBundleKB}KB)`);
    }
  }
  if (totalJs / 1024 > BUDGETS.maxTotalJsKB) {
    failures.push(`Total JS ${(totalJs / 1024).toFixed(1)}KB exceeds budget of ${BUDGETS.maxTotalJsKB}KB`);
  }

  // ── 5. CSS ──
  const cssFiles = allFiles.filter((f) => f.ext === '.css');
  const totalCss = cssFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n--- CSS (${cssFiles.length}) — Total: ${formatBytes(totalCss)} ---`);
  for (const f of cssFiles.sort((a, b) => b.size - a.size)) {
    console.log(`  ✓ ${f.path} — ${formatBytes(f.size)}`);
  }
  if (totalCss / 1024 > BUDGETS.maxTotalCssKB) {
    failures.push(`Total CSS ${(totalCss / 1024).toFixed(1)}KB exceeds budget of ${BUDGETS.maxTotalCssKB}KB`);
  }

  // ── 6. Fonts ──
  const fontFiles = allFiles.filter((f) => ['.woff2', '.woff', '.ttf', '.otf'].includes(f.ext));
  const totalFonts = fontFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n--- Fonts (${fontFiles.length}) — Total: ${formatBytes(totalFonts)} ---`);
  for (const f of fontFiles.sort((a, b) => b.size - a.size)) {
    const sizeKB = f.size / 1024;
    const over = sizeKB > BUDGETS.maxFontFileKB;
    console.log(`  ${over ? '✗' : '✓'} ${f.path} — ${formatBytes(f.size)}`);
    if (over) {
      failures.push(`Font ${f.path} is ${sizeKB.toFixed(1)}KB (budget: ${BUDGETS.maxFontFileKB}KB)`);
    }
  }

  // ── 7. Images ──
  const imageFiles = allFiles.filter((f) => ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.svg'].includes(f.ext));
  const totalImages = imageFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n--- Images (${imageFiles.length}) — Total: ${formatBytes(totalImages)} ---`);
  for (const f of imageFiles.sort((a, b) => b.size - a.size)) {
    const sizeKB = f.size / 1024;
    const over = sizeKB > BUDGETS.maxImageFileKB;
    console.log(`  ${over ? '✗' : '✓'} ${f.path} — ${formatBytes(f.size)}`);
    if (over) {
      failures.push(`Image ${f.path} is ${sizeKB.toFixed(1)}KB (budget: ${BUDGETS.maxImageFileKB}KB)`);
    }
  }

  // ── 8. Pagefind search index ──
  const pagefindFiles = allFiles.filter((f) => f.path.startsWith('pagefind'));
  const totalPagefind = pagefindFiles.reduce((sum, f) => sum + f.size, 0);
  console.log(`\n--- Pagefind Search Index ---`);
  if (pagefindFiles.length > 0) {
    console.log(`  ✓ ${pagefindFiles.length} files — ${formatBytes(totalPagefind)}`);
  } else {
    console.log(`  ✗ No pagefind index found`);
    failures.push('Pagefind search index not found in dist/');
  }

  // ── 9. Size breakdown by type ──
  const byType = new Map<string, number>();
  for (const f of allFiles) {
    const ext = f.ext || '(no ext)';
    byType.set(ext, (byType.get(ext) || 0) + f.size);
  }
  console.log(`\n--- Size by File Type ---`);
  for (const [ext, size] of [...byType.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${ext.padEnd(10)} ${formatBytes(size)}`);
  }

  // ── Summary ──
  console.log('\n' + '='.repeat(60));
  if (failures.length === 0) {
    console.log('  ALL CHECKS PASSED');
  } else {
    console.log(`  ${failures.length} CHECK(S) FAILED:`);
    for (const f of failures) {
      console.log(`    ✗ ${f}`);
    }
  }
  console.log('='.repeat(60));
  console.log('');

  process.exit(failures.length > 0 ? 1 : 0);
}

analyze();
