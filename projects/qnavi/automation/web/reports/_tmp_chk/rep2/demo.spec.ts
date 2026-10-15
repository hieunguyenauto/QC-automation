import { test, expect } from '@playwright/test';
test('E2E-TC-001 Login as admin', { tag: ['@E2E-TC-001', '@role-99'] }, async () => { await test.step('1. Open', async () => {}); });
test('E2E-TC-002 Create trouble', { tag: ['@E2E-TC-002', '@role-99'] }, async ({}, info) => {
  await info.attach('screenshot', { body: Buffer.from('x'), contentType: 'image/png' });
  await test.step('14. Card 3 → つまり：大便器（テスト）', async () => { expect('ウォシュレット').toBe('つまり：大便器（テスト）'); });
});
test('E2E-TC-003 Trouble detail', { tag: ['@E2E-TC-003', '@role-99'] }, async () => { test.skip(true, 'TC-002 fail'); });
