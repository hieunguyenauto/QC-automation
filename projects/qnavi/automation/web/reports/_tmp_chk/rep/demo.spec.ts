import { test, expect } from '@playwright/test';
test('DEMO-TC-001 Login as admin', { tag: ['@DEMO-TC-001', '@role-99'] }, async () => { await test.step('1. Open', async () => {}); });
test('DEMO-TC-002 Create trouble', { tag: ['@DEMO-TC-002', '@role-99'] }, async ({}, info) => {
  await info.attach('screenshot', { body: Buffer.from('x'), contentType: 'image/png' });
  await info.attach('url', { body: 'https://cms/admin/trouble/create', contentType: 'text/plain' });
  await test.step('14. Card 3 → つまり：大便器（テスト）', async () => { expect(1).toBe(1); });
});
test('DEMO-TC-003 Detail', { tag: ['@DEMO-TC-003', '@role-01'] }, async () => {  });
