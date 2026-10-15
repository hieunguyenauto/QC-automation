import { defineConfig } from '@playwright/test';
export default defineConfig({ testDir: '.', outputDir: 'out/artifacts', reporter: [['list'], ['../../../common/qc-reporter.ts', { outputFolder: 'out/run2', envName: 'dev', baseUrl: 'https://cms-demo' }]] });
