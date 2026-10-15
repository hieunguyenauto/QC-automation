import { defineConfig } from '@playwright/test';
const out = 'reports/_tmp_chk/rt/out';
export default defineConfig({ testDir: '.', testMatch: /rt\.spec\.ts/, outputDir: `${out}/Runs/RT_run/artifacts`,
  reporter: [['../../../common/qc-reporter.ts', { reportsRoot: `${out}`, runDir: `${out}/Runs/RT_run`, stamp: 'x', envName: 'test' }]] });
