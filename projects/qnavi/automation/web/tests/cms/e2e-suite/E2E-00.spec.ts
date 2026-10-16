import { test } from '@playwright/test';
import { serialScenario } from '../../../common/scenario';
import { E2E } from '../../../common/e2e-suite';

/**
 * E2E-00 · Common setup — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-00-common-setup-test-cases.md (LOCKED rev 3).
 * Mỗi case E2E-01…39 tự gọi E2E.commonSetup() ở Pre-condition TC-001 → chạy lẻ case không cần chạy file này trước.
 * Chạy: ENV=toridoll-test npm run suite -- E2E-00.spec.ts
 */
test.describe.configure({ mode: 'serial' });
// E2E_DRY=1 (kiểm TC ↔ code / recon): spec viết riêng, không có chế độ khô → bỏ qua cả file, KHÔNG mở app (chạy bình thường: không đặt E2E_DRY).
test.skip(!!process.env.E2E_DRY, 'E2E_DRY: spec viết riêng, không chạy khô được');
const sc = serialScenario();

for (const [id, asset] of [['E2E00-TC-001', false], ['E2E00-TC-002', true]] as const) {
  const v = asset ? 'ON' : 'OFF';
  test(`${id} COMMON · Linksys: トラブルナビ ON, シサンNAVI ${v}`, { tag: [`@${id}`, '@role-99'] }, async () => {
    const e = new E2E(sc.page, 0);
    await test.step('1-3. Login Admin (99) → チェーンシステム情報 → Linksys Chain System → Verify トラブルNAVI ON; シサンNAVI = ' + v + ' (set + 保存 nếu khác)',
      () => e.commonSetup(asset));
    await test.step(`Expected: トラブルナビ ON / シサンNAVI ${v}`, async () => { /* đã kiểm trong commonSetup */ });
  });
}
