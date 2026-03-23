/**
 * Build Timing Benchmark
 *
 * Measures build performance:
 * - Full build time (astro build + pagefind)
 * - Reports against a time budget
 *
 * Run: npx tsx tests/benchmarks/build-timing.ts
 */

import { execSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');

// Max acceptable build time in seconds
const BUILD_TIME_BUDGET_S = 60;

function runBuildBenchmark() {
  console.log('');
  console.log('='.repeat(60));
  console.log('  BUILD TIMING BENCHMARK');
  console.log('='.repeat(60));

  console.log('\nRunning full production build...\n');

  const startTime = Date.now();
  try {
    execSync('npm run build', {
      cwd: ROOT,
      stdio: 'inherit',
      timeout: BUILD_TIME_BUDGET_S * 2 * 1000, // Hard timeout at 2x budget
    });
  } catch (error) {
    console.error('\nBuild failed!');
    process.exit(1);
  }
  const elapsed = (Date.now() - startTime) / 1000;

  console.log('\n' + '-'.repeat(60));
  console.log(`  Build time: ${elapsed.toFixed(1)}s`);
  console.log(`  Budget:     ${BUILD_TIME_BUDGET_S}s`);
  console.log(`  Status:     ${elapsed <= BUILD_TIME_BUDGET_S ? 'PASS' : 'FAIL — build too slow'}`);
  console.log('-'.repeat(60));
  console.log('');

  if (elapsed > BUILD_TIME_BUDGET_S) {
    process.exit(1);
  }
}

runBuildBenchmark();
