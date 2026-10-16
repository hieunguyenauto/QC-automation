import { expect, test } from '@playwright/test';
import data from '../../../data/e2e-suite.json';
import { serialScenario } from '../../../common/scenario';
import { E2E, assertTcRevision, storeName, type Trouble } from '../../../common/e2e-suite';
import { minimizeChat, rowOf } from '../../../common/ui';

/**
 * E2E-24 · Worker(iOS) create → / Admin approve (CMS) — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-24-worker-ios-create-test-cases.md (LOCKED rev 12, 5 TC).
 * FILE SINH TỰ ĐỘNG từ TC — không sửa tay. TC đổi → node scripts/gen-e2e-specs.mjs; cần thao tác mới → sửa khuôn trong script hoặc screens/ / common/.
 * 1 tc() = 1 TC, step = nguyên văn cột Steps. Chạy nối tiếp trên 1 trình duyệt; TC fail → TC sau không chạy.
 * Chạy: ENV=toridoll-test npm run suite -- E2E-24
 * Chạy tiếp trên trouble có sẵn: E2E_TROUBLE_ID=<id NEW> E2E_TROUBLE2_ID=<id _2> E2E_FIX=<限度額> … --grep "TC-00[6-9]|TC-01"
 */
test.describe.configure({ mode: 'serial' });
// E2E_DRY=1 (kiểm / recon): không mở app (R36). Kiểm TC ↔ code: node scripts/gen-e2e-specs.mjs --check
test.skip(!!process.env.E2E_DRY, 'E2E_DRY: không chạy app');
const STORE = '00007' as const;
const t: Trouble = { id: process.env.E2E_TROUBLE_ID || undefined };
const t2: Trouble = { id: process.env.E2E_TROUBLE2_ID || undefined };
let FIX: number | null | undefined = process.env.E2E_FIX ? Number(process.env.E2E_FIX) : undefined;
/** Tổng 税込 của từng báo giá tạo trong lần chạy. */
const totals = new Map<string, number>();
const sc = serialScenario(() => [t.number ? `NEW ${t.number} (id ${t.id})` : '', t2.number ? `CONT ${t2.number} (id ${t2.id})` : '', FIX != null ? `FIX ${FIX}` : '']);
let e: E2E;
test.beforeAll(() => { assertTcRevision('projects/qnavi/qc/test-cases/e2e-suite/E2E-24-worker-ios-create-test-cases.md', 12); e = new E2E(sc.page, 24); });
const step = test.step;
const tc = (id: string, title: string, role: string, body: () => Promise<void>, timeout = 300_000) =>
  test(`${id} ${title}`, { tag: [`@${id}`, `@role-${role}`] }, async () => { test.setTimeout(timeout); await body(); });
const needFix = () => test.skip(!FIX, 'Chưa có FIX (TC-001 chưa chạy) — hoặc đặt E2E_FIX');

tc('E2E24-TC-001', 'SETUP · LINKSYS STORE00007; 限度額 read', '99', async () => {
  await step('Pre-condition: E2E00-TC-001 passed (シサンNAVI OFF)', async () => { await e.commonSetup(false); });
  await step("1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'", async () => { await e.openChain(); });
  await step("2. Scroll to store list → open 'LINKSYS STORE00007' → Verify: 承認タイプ = '階層承認（No順）'", async () => {
    await e.chain.openStore(storeName(STORE));
    await expect(e.chain.storeValue('限度額')).toBeVisible({ timeout: 20_000 });
    await expect(e.chain.storeValue('承認タイプ')).toContainText('階層承認（No順）');
  });
  await step("3. Record '限度額' (税込) as FIX (do not edit — N11)", async () => {
    const fix = await e.chain.limitAmount();
    expect(fix, '限度額 trống — TC cần FIX').not.toBeNull();
    FIX = fix;
  });
  await step('Expected: LINKSYS STORE00007 opened; FIX recorded', async () => { expect(FIX).toBeGreaterThan(0); });
});

tc('E2E24-TC-002', 'NEW · admin creates trouble (web form)', '99', async () => {
  const d = e.detail;
  const c = e.create;
  await step('1. Login Admin (99)', async () => { await e.switchTo('99'); });
  await step("2. Menu '作業依頼登録' → '新規依頼' → '次へ'", async () => {
    await e.layout.menu('作業依頼登録');
    await c.startNew();
  });
  await step("3. 'チェーン店舗選択' → search 社名 'Linksys', 店名 'LINKSYS STORE00007' → '選択' → '担当者選択' → first row → '次へ'", async () => {
    await c.openChainStoreSearch();
    await c.expandSearch('店名');
    await c.fillSearch('社名', data.chain.companyQuery);
    await c.fillSearch('店名', storeName(STORE));
    await c.search();
    await c.pickStore(storeName(STORE));
    await c.openStaff();
    await c.pickFirstStaff();
    await c.next('作業項目選択');
  });
  await step("4. Select 作業項目 '操作テスト' > 'トイレ（テスト）' > 'つまり：大便器（テスト）'", async () => {
    await c.openCategory(0); await c.chooseCategory(data.categories.noNavi);
    await c.openCategory(1); await c.chooseCategory(data.categories.medium);
    await c.openCategory(2); await c.chooseCategory(data.categories.small);
  });
  await step("5. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 'Automation E2E 24'", async () => {
    await c.next('故障詳細');
    await c.uploadFaultImage(0, data.files.fault);
    await c.fillFaultDetail(e.note);
  });
  await step("6. '決定して問合わせ' → '決定' (if date error: '明日以降', 開始 4:00, 終了 5:00) → 'OK' → minimize chat; record 依頼番号", async () => {
    Object.assign(t, await c.submitWithDateFallback());   // R14
    if (!t.id || !t.number) {
      await d.expectOpened(t.id);
      t.id ??= sc.page.url().match(/troubles\/(\d+)\/detail/)?.[1];
      t.number ??= await d.number();
    }
    await minimizeChat(sc.page);
  });
  await step("Expected: Trouble is created for 'LINKSYS STORE00007': '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出'", async () => {
    expect(t.id ?? t.number, 'Không lấy được id / 依頼番号 của trouble vừa tạo').toBeTruthy();
    await e.openTrouble(t);
    await d.expectBadges('問い合わせ中', '受注待ち');
    await d.expectInfo('業者', '未確定');
    await d.expectInfo('見積書', '未提出');
  });
}, 480_000);

tc('E2E24-TC-003', 'NEW · Admin: 対応中 + assign worker', '99', async () => {
  const d = e.detail;
  await step('1. Login Admin (99) → open trouble (依頼番号)', async () => { await e.open('99', t); });
  await step("2. 'クイック操作' → 状態 '対応中'", async () => {
    await d.openQuickAction();
    await d.setStatus('対応中');
  });
  await step("3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'", async () => {
    await d.editRow('作業者');
    await d.expandSearch();
    await d.searchWorker(data.worker.companyQuery);
    await d.pickWorker(data.worker.loginId);
    await expect(d.statusModal).toContainText(data.worker.companyName);
  });
  await step("4. '保存' → '決定' → 'OK'", async () => { await d.saveStatus(); });
  await step("Expected: Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER'", async () => {
    await d.expectBadges('対応中', '受注待ち');
    await d.expectInfo('業者', data.worker.companyName);
  });
});

tc('E2E24-TC-004', 'NEW · 受注 → 移動中 → 到着 (02-04)', '99', async () => {
  const d = e.detail;
  await step('Pre-condition: E2E24-TC-003 passed', async () => { await e.open('99', t); });
  await step("1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'", async () => { await e.moveFlow('受注'); });
  await step("2. Same with '移動中' → Verify: badge '移動中'", async () => { await e.moveFlow('移動中'); });
  await step("3. Same with '到着'", async () => { await e.moveFlow('到着'); });
  await step("Expected: Badge '対応中' / '到着' (02-04)", async () => { await d.expectBadges('対応中', '到着'); });
});

tc('E2E24-TC-005', 'NEW · Create 1 estimate(s) (total = FIX + 1) and 提示', '99', async () => {
  const d = e.detail;
  await step("1. Login CMS Admin (99) (tạo thay worker) → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '必須'", async () => {
    needFix();
    await e.open('99', t);
    await d.openQuickAction();
    await d.setFlow('見積承認待ち');
    await expect(rowOf(d.statusModal, '見積もり')).toContainText('必須');
  });
  await step("2. Edit icon '見積もり' → for each of 'E2E24-New': '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that total = FIX + 1 → '決定' → '決定' (top right) → Verify: row '下書き'", async () => {
    await d.openEstimateFromStatus();
    for (const n of ['E2E24-New']) { await e.newEstimate(n, FIX! + 1); totals.set(n, FIX! + 1); }
  });
  await step("3. Tick 'E2E24-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'", async () => { await d.submitEstimates(['E2E24-New'], '承認待ち'); });
  await step("4. '閉じる' → '保存' → '決定' → 'OK'", async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
  });
  await step("Expected: Badge '対応中' / '見積承認待ち' (02-05), estimate '承認待ち'. NEW flow stops here; no CONTINUE (G9)", async () => { await d.expectBadges('対応中', '見積承認待ち'); });
});
