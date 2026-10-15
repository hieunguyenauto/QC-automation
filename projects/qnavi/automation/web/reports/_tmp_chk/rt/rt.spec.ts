import { test, expect } from '@playwright/test';
test.describe.serial('S', () => {
  test('RT-TC-001 pass one', async () => { await new Promise(r => setTimeout(r, 1500)); });
  test('RT-TC-002 fail two', async () => { await new Promise(r => setTimeout(r, 1500)); expect(1).toBe(2); });
  test('RT-TC-003 skipped three', async () => {});
});
