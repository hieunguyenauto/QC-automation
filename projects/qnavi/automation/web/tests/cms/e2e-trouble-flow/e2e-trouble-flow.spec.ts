import fs from 'fs';
import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import data from '../../../data/e2e-trouble-flow.json';
import { account as roleAccount } from '../../../data/roles';
import { credentialsOf, loginAs, markLoggedIn } from '../../../common/session';
import { env } from '../../../common/env';
import { click, clickable, closeModal, expectRow, fill, minimizeChat, modal, rowOf, today } from '../../../common/ui';
import { LoginScreen } from '../../../screens/cms/login.screen';
import { CmsLayout } from '../../../screens/cms/layout.screen';
import { TroubleCreateScreen } from '../../../screens/cms/trouble-create.screen';
import { TroubleListScreen } from '../../../screens/cms/trouble-list.screen';
import { TroubleDetailScreen } from '../../../screens/cms/trouble-detail.screen';
import { TroubleEditScreen } from '../../../screens/cms/trouble-edit.screen';

/**
 * Kịch bản E2E — TC: projects/qnavi/qc/test-cases/e2e-trouble-flow-test-cases.md (rev 2, E2E-TC-001 … 013).
 *
 * Quy ước:
 *  - 1 test() = 1 TC. test.step('n. …') đánh số ĐÚNG theo cột Steps của TC → báo lỗi biết ngay bước nào.
 *  - Bước cuối 'Expected: …' = cột Expected Results của TC.
 *  - Locator chỉ nằm trong screens/; spec chỉ gọi hàm của screen (automation/lessons R01).
 *  - Chạy nối tiếp trên CÙNG 1 trình duyệt; TC nào fail → các TC sau skip.
 *
 * Chạy:
 *   npm run e2e:headed                                   # cả kịch bản, tạo trouble mới
 *   E2E_TROUBLE_ID=1234 npm run e2e -- --grep "TC-00[5-9]|TC-01"   # chạy tiếp trên trouble có sẵn (đúng trạng thái)
 */
test.describe.configure({ mode: 'serial' });

type Role = '99' | '01';
let context: BrowserContext;
let page: Page;
let s: {
  login: LoginScreen; layout: CmsLayout; create: TroubleCreateScreen;
  list: TroubleListScreen; detail: TroubleDetailScreen; edit: TroubleEditScreen;
};

/** Trouble của kịch bản: tạo ở TC-002, hoặc lấy từ biến môi trường để chạy tiếp. */
const trouble: { id?: string; number?: string } = {
  id: process.env.E2E_TROUBLE_ID || undefined,
  number: process.env.E2E_TROUBLE_NUMBER || undefined,
};
const RUN = (() => {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
})();
const FAULT_TEXT = `${data.faultDetail.textPrefix}-${RUN}`;

/** Chờ tối đa ms rồi bỏ qua (hook không được treo — lesson R02/R13). */
const within = (p: Promise<unknown> | undefined, ms: number) =>
  Promise.race([(p ?? Promise.resolve()).catch(() => {}), new Promise((r) => setTimeout(r, ms))]);

// Video cả kịch bản (1 file / lần chạy) → reports/Runs/<lần chạy>/video/. Tắt: E2E_VIDEO=off.
// Reporter (common/qc-reporter.ts) ghi link + mốc thời gian vào FAIL.md; lần chạy không có fail thì xoá video.
const VIDEO_DIR = process.env.E2E_VIDEO === 'off' || !process.env.RUN_ID ? undefined : `reports/Runs/${process.env.RUN_ID}/video`;

test.beforeAll(async ({ browser }) => {
  if (VIDEO_DIR) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
    fs.writeFileSync(`${VIDEO_DIR}/start.txt`, String(Date.now())); // mốc 00:00 của video
  }
  context = await browser.newContext({
    ...(VIDEO_DIR ? { recordVideo: { dir: VIDEO_DIR, size: { width: 1280, height: 800 } } } : {}),
    httpCredentials: env.httpCredentials, // Basic Auth nếu môi trường có
    baseURL: env.cmsBaseUrl, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', viewport: { width: 1600, height: 1000 },
    acceptDownloads: true,
  });
  context.setDefaultTimeout(env.actionTimeoutMs);
  context.setDefaultNavigationTimeout(env.navigationTimeoutMs);
  // Trace tự ghi (config e2e: trace off). Run 2026-10-12: trace tự động của Playwright cho context dùng chung
  // lưu quá lâu khi fail → hết 120s, trace.zip hỏng. Ghi từng chunk / TC, chỉ giữ khi fail (lesson R13).
  await context.tracing.start({ screenshots: true, snapshots: true });
  page = await context.newPage();
  s = {
    login: new LoginScreen(page), layout: new CmsLayout(page), create: new TroubleCreateScreen(page),
    list: new TroubleListScreen(page), detail: new TroubleDetailScreen(page), edit: new TroubleEditScreen(page),
  };
});

test.beforeEach(async ({}, testInfo) => {
  await within(context.tracing.startChunk({ title: testInfo.title }), 10_000);
});

test.afterEach(async ({}, testInfo) => {
  if (trouble.id || trouble.number) {
    testInfo.annotations.push({ type: 'trouble', description: `依頼番号 ${trouble.number ?? '?'} / id ${trouble.id ?? '?'}` });
  }
  if (testInfo.status !== testInfo.expectedStatus) {
    await testInfo.attach('url', { body: page.url(), contentType: 'text/plain' }).catch(() => {});
    // Ảnh + cây phần tử (aria) để sửa locator; có timeout để hook không treo (automation/lessons R02).
    const shot = await page.screenshot({ timeout: 10_000 }).catch(() => null);
    if (shot) await testInfo.attach('screenshot', { body: shot, contentType: 'image/png' });
    const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch(() => null);
    if (aria) await testInfo.attach('aria-snapshot', { body: aria, contentType: 'text/yaml' });
    const tracePath = testInfo.outputPath('trace.zip');
    await within(context.tracing.stopChunk({ path: tracePath }), 30_000);
    await testInfo.attach('trace', { path: tracePath, contentType: 'application/zip' }).catch(() => {});
  } else {
    await within(context.tracing.stopChunk(), 10_000);
  }
});

test.afterAll(async () => {
  test.setTimeout(60_000);
  await within(context?.tracing.stop(), 15_000);
  await within(context?.close(), 30_000); // video được ghi xong khi context đóng
});

// ---------------- helper của kịch bản ----------------
/** Pre-condition: đang đăng nhập đúng tài khoản (dùng common/session.ts — tự logout nếu đang là tài khoản khác). */
async function ensureRole(role: Role): Promise<void> {
  await loginAs(page, role);
}
/** Pre-condition: đang ở màn chi tiết của trouble của kịch bản. */
async function ensureTroubleOpened(): Promise<void> {
  test.skip(!trouble.id && !trouble.number, 'Chưa có trouble: chạy từ E2E-TC-002 hoặc đặt E2E_TROUBLE_ID');
  if (!(trouble.id && page.url().includes(`/troubles/${trouble.id}/detail`))) {
    await s.list.open();
    await s.list.openByNumber(trouble);
  }
  await s.detail.expectOpened();
  trouble.id ??= page.url().match(/troubles\/(\d+)\/detail/)?.[1];
}
const pre = (fn: () => Promise<void>) => test.step('Pre-condition', fn);

// ---------------- TC ----------------
test('E2E-TC-001 Login as admin', { tag: ['@E2E-TC-001', '@role-99'] }, async () => {
  const c = credentialsOf('99');
  await test.step('1. Open /login', () => s.login.goto());
  await test.step('2. Click the login ID field', () => s.login.loginId.click());
  await test.step('3. Input admin login ID', () => s.login.loginId.fill(c.loginId));
  await test.step('4. Verify: login ID field shows the input', () => expect(s.login.loginId).toHaveValue(c.loginId));
  await test.step('5. Click the password field', () => s.login.password.click());
  await test.step('6. Input admin password', () => s.login.password.fill(c.password));
  await test.step('7. Click ログイン', () => s.login.submit.click());
  await test.step('Expected: dashboard /admin is displayed', async () => {
    await expect(page).toHaveURL(/\/admin(\/|$|\?)/);
    markLoggedIn(page, '99');
  });
});

test('E2E-TC-002 Create trouble', { tag: ['@E2E-TC-002', '@role-99'] }, async () => {
  test.setTimeout(480_000);
  const c = s.create;
  await pre(() => ensureRole('99'));
  await test.step('1. Menu 作業依頼登録 → 新規依頼 → 次へ → step 店舗', async () => {
    await s.layout.menu('作業依頼登録');
    await c.startNew();
  });
  await test.step('2. Click チェーン店舗選択 → dialog 検索条件', () => c.openChainStoreSearch());
  await test.step('3. Expand 検索条件 → fields shown', async () => {
    await c.expandSearch('電話番号');
    for (const f of ['社名', '店名', '電話番号', '表示件数']) await expect(c.storeSearch).toContainText(f);
  });
  await test.step(`4. Input 社名: ${data.store.companyQuery}`, () => c.fillSearch('社名', data.store.companyQuery));
  await test.step(`5. Input 店名: ${data.store.storeQuery}`, () => c.fillSearch('店名', data.store.storeQuery));
  await test.step('6. Click 検索 → grid shows chain + store', async () => {
    await c.search();
    await expect(c.storeSearch).toContainText(data.store.chainSystemName);
    await expect(c.storeSearch).toContainText(data.store.storeName);
  });
  await test.step('7. Click 選択 on the store row → card 店舗選択', () => c.pickStore(data.store.storeName));
  await test.step('8. Click 担当者選択 → modal 担当者選択', () => c.openStaff());
  await test.step('9. Click 選択 on the first row', () => c.pickFirstStaff());
  await test.step('10. Click 次へ → step 作業項目選択', () => c.next('作業項目選択'));
  await test.step('11. Click 選択 on card 1 → modal 故障内容', () => c.openCategory(0));
  await test.step(`12. Click card ${data.categories.large}`, () => c.chooseCategory(data.categories.large));
  await test.step(`13. Card 2 → ${data.categories.medium}`, async () => {
    await c.openCategory(1);
    await c.chooseCategory(data.categories.medium);
  });
  await test.step(`14. Card 3 → ${data.categories.small}`, async () => {
    await c.openCategory(2);
    await c.chooseCategory(data.categories.small);
  });
  await test.step('15. Tick 対象資産がある場合… → 修理対象資産選択 shown', () => c.tickHasAsset());
  await test.step('16. Click 修理対象資産選択 → dialog', () => c.openAssetSelect());
  await test.step(`17. Select first 2 rows ${data.asset.existingName} (skip if 0件)`, () => c.assets.selectRows(data.asset.existingName, 2));
  await test.step('18. Click 新しい機器を登録する → modal 資産登録', () => c.assets.openRegister());
  await test.step(`19. Upload ${data.asset.image} on card 1 and 2`, async () => {
    await c.assets.uploadImage(0, data.asset.image);
    await c.assets.uploadImage(1, data.asset.image);
  });
  await test.step('20. Input 名称 / 型式 / 製造番号', async () => {
    await c.assets.fillField('名称', data.asset.name);
    await c.assets.fillField('型式', data.asset.model);
    await c.assets.fillField('製造番号', data.asset.serial);
  });
  await test.step('21. 設置・納入日 / 製造年月 → 現在', async () => {
    await c.assets.setNow('設置・納入日', 'ymd');
    await c.assets.setNow('製造年月', 'ym');
  });
  await test.step('22. Input 補足説明', () => c.assets.fillField('補足説明', data.asset.note));
  await test.step('23. 保存 → 決定 → OK', () => c.assets.save());
  await test.step(`24. Select the first ${data.asset.name}`, async () => {
    expect(await c.assets.selectRows(data.asset.name, 1)).toBe(1);
  });
  await test.step('25. Click 決定する → form lists the asset', async () => {
    await c.assets.decide();
    await expect(c.content).toContainText(data.asset.name);
  });
  await test.step('26. Click 次へ → step 故障詳細', () => c.next('故障詳細'));
  await test.step(`27. Upload ${data.faultDetail.image} on card 1 and 2`, async () => {
    await c.uploadFaultImage(0, data.faultDetail.image);
    await c.uploadFaultImage(1, data.faultDetail.image);
  });
  await test.step(`28. Input 故障詳細記入欄: ${FAULT_TEXT}`, () => c.fillFaultDetail(FAULT_TEXT));
  await test.step(`29. 希望日時 ${data.expectedDate.option} ${data.expectedDate.start}–${data.expectedDate.end}`, () =>
    c.chooseExpectedDate(data.expectedDate.option, data.expectedDate.start, data.expectedDate.end));
  await test.step('30. Click 決定して問合わせ', () => c.clickSubmit());
  let created: { id?: string; number?: string } = {};
  await test.step('31. Click 決定 (+ OK)', async () => { created = await c.confirmSubmit(); });
  await test.step('32. Minimize chat, record 依頼番号', async () => {
    // Ghi 依頼番号 trước (để resume bằng E2E_TROUBLE_ID nếu bước sau lỗi), thu nhỏ chat sau.
    Object.assign(trouble, created);
    if (!trouble.number && /\/detail/.test(page.url())) {
      await s.detail.expectOpened();
      trouble.number = await s.detail.number();
      trouble.id ??= page.url().match(/troubles\/(\d+)\/detail/)?.[1];
    }
    await minimizeChat(page);
  });
  await test.step('Expected: trouble created with 依頼番号', async () => {
    expect(trouble.id ?? trouble.number, 'Không lấy được id / 依頼番号 của trouble vừa tạo').toBeTruthy();
  });
});

test('E2E-TC-003 Trouble detail and edit 対応区分', { tag: ['@E2E-TC-003', '@role-99'] }, async () => {
  const d = s.detail;
  await pre(() => ensureRole('99'));
  await test.step('1. Open the trouble (依頼番号) from Trouble List', async () => {
    test.skip(!trouble.id && !trouble.number, 'Chưa có trouble');
    await s.list.open();
    await s.list.openByNumber(trouble);
    await d.expectOpened(trouble.id);
  });
  await test.step('2. Verify 作業項目（大/中/小）', async () => {
    await d.expectInfo('作業項目（大）', data.categories.large);
    await d.expectInfo('作業項目（中）', data.categories.medium);
    await d.expectInfo('作業項目（小）', data.categories.small);
  });
  await test.step('3. Verify header', async () => {
    await d.expectBadges('問い合わせ中', '受注待ち');
    await d.expectInfo('店舗名', data.store.storeName);
    await d.expectInfo('業者', '未確定');
    await d.expectInfo('訪問日時', '未確定');
    await d.expectInfo('見積書', '未提出');
  });
  await test.step('4. 資産一覧 → assets listed → X', async () => {
    await d.headerButton('資産一覧');
    const box = modal(page);
    await expect(box).toContainText(data.asset.name);
    await closeModal(box);
  });
  await test.step('5. Click 編集 → 作業依頼編集', async () => {
    await d.headerButton('編集');
    await s.edit.expectOpened();
  });
  await test.step('6-7. 変更 → 対応区分 = first value → 保存 → OK', async () => {
    const chosen = await s.edit.setFirstAssetResponseType();
    test.info().annotations.push({ type: '対応区分', description: chosen.join(', ') || '(không có select)' });
  });
  await test.step('8. Click 戻る', () => s.edit.back());
  await test.step('Expected: detail screen displayed again', () => d.expectOpened(trouble.id));
});

test('E2E-TC-004 状態 = 対応中 and assign worker', { tag: ['@E2E-TC-004', '@role-99'] }, async () => {
  const d = s.detail;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. クイック操作 → 状態変更 (問い合わせ中)', async () => {
    await d.openQuickAction();
    await d.expectStatus('問い合わせ中');
  });
  await test.step('2. Select 状態: 対応中', () => d.setStatus('対応中'));
  await test.step('3. Edit icon on 作業者 → 検索条件', async () => {
    await d.editRow('作業者');
    await expect(d.searchModal).toBeVisible();
  });
  await test.step('4. Expand 検索条件 → fields shown', async () => {
    await d.expandSearch();
    for (const f of ['電話番号', '対応可能な作業項目（大）', '表示件数']) await expect(d.searchModal).toContainText(f);
  });
  await test.step(`5. 社名: ${data.worker.companyQuery} → 検索`, async () => {
    await d.searchWorker(data.worker.companyQuery);
    await expect(d.searchModal.locator('tbody tr').first()).toContainText(new RegExp(data.worker.companyQuery, 'i'));
  });
  await test.step(`6. 選択 ${data.worker.loginId} → 作業者 = ${data.worker.companyName}`, async () => {
    await d.pickWorker(data.worker.loginId);
    await expect(d.statusModal).toContainText(data.worker.companyName);
  });
  await test.step('7. 保存 → 決定 → OK', () => d.saveStatus());
  await test.step('Expected: 対応中 / 受注待ち, 業者 = LINKSYS WORKER', async () => {
    await d.expectBadges('対応中', '受注待ち');
    await d.expectInfo('業者', data.worker.companyName);
  });
});

test('E2E-TC-005 受注 → 移動中 → 到着', { tag: ['@E2E-TC-005', '@role-99'] }, async () => {
  const d = s.detail;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  const change = async (from: string, to: string) => {
    await d.openQuickAction();
    await d.expectFlow(from);
    await d.setFlow(to);
    await d.saveStatus();
    await d.expectBadges('対応中', to);
  };
  await test.step('1. 受注', () => change('受注待ち', '受注'));
  await test.step('2. 移動中', () => change('受注', '移動中'));
  await test.step('3. 到着', () => change('移動中', '到着'));
  await test.step('Expected: 対応中 / 到着', () => d.expectBadges('対応中', '到着'));
});

test('E2E-TC-006 Create estimate Test and submit', { tag: ['@E2E-TC-006', '@role-99'] }, async () => {
  test.setTimeout(240_000);
  const d = s.detail;
  const e = data.estimate;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. クイック操作 → 見積承認待ち → 見積もり 必須', async () => {
    await d.openQuickAction();
    await d.expectFlow('到着');
    await d.setFlow('見積承認待ち');
    await expect(rowOf(d.statusModal, '見積もり')).toContainText('必須');
  });
  await test.step('2. Edit icon on 見積もり → 見積一覧', () => d.openEstimateFromStatus());
  await test.step('3. Click 登録 → form fields', () => d.startNewEstimate());
  await test.step(`4. Input 見積名: ${e.name}`, () => d.fillEstimateName(e.name));
  await test.step(`5. 追加 → 作業 → ${e.itemName}, 単価 ${e.unitPrice}`, async () => {
    await d.openAddItem();
    for (const t of ['作業', '部材', '諸経費']) await expect(clickable(d.itemModal, t)).toBeVisible();
    await d.chooseItemType('作業');
    await d.fillItemName(e.itemName);
    await d.fillUnitPrice(e.unitPrice, e.unitPriceShown);
  });
  await test.step('6. 決定 in 作業項目追加', () => d.decideItem(e.itemName));
  await test.step('7. 決定 on form 見積もり → row Test', () => d.decideEstimate(e.name));
  await test.step('8. Tick Test → 提示する → 決定 → 承認待ち', () => d.submitEstimate(e.name));
  await test.step('9. 閉じる → 保存 → 決定 → OK', async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
  });
  await test.step('10. Header 見積もり → 見積もり管理 amounts', async () => {
    // Browser thật 2026-10-12: 店舗向け 作業 = floor(単価 / 0.7) (99,999 → 142,855) + 出張費 6,000 = 148,855; 税込 ×1.1 = 163,740. [cần confirm P7]
    await d.headerButton('見積もり');
    const box = modal(page, '見積もり管理');
    for (const t of [e.name, e.total, e.totalTax]) await expect(box).toContainText(t);
    await click(box, '閉じる');
  });
  await test.step('Expected: 対応中 / 見積承認待ち, 見積書 = あり', async () => {
    await d.expectBadges('対応中', '見積承認待ち');
    await d.expectInfo('見積書', 'あり');
  });
});

test('E2E-TC-007 取り下げ申請 → 取り下げ承認 → 承認', { tag: ['@E2E-TC-007', '@role-99'] }, async () => {
  test.setTimeout(240_000);
  const d = s.detail;
  const name = data.estimate.name;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. クイック操作 → edit 見積もり → Test = 承認待ち', async () => {
    await d.openQuickAction();
    await d.openEstimateFromStatus();
    await d.expectEstimateStatus(name, '承認待ち');
  });
  await test.step('2. メニュー展開▼ → buttons', async () => {
    await d.openEstimateMenu(name);
    for (const b of ['差し戻し', '承認する']) await expect(d.estimateAction('manager', b)).toBeVisible();
    for (const b of ['取り下げ申請', 'コピー']) await expect(d.estimateAction('worker', b)).toBeVisible();
  });
  await test.step('3. 取り下げ申請 → reason → 申請を送信 → 決定 → 取り下げ申請中', async () => {
    await d.estimateAction('worker', '取り下げ申請').click();
    const req = modal(page, '申請を送信');
    await req.locator('textarea[name="reason"]').fill(data.estimate.cancelReason);
    await click(req, '申請を送信');
    await d.decide(data.estimate.cancelReason);
    await d.expectEstimateStatus(name, '取り下げ申請中');
  });
  await test.step('4. 取り下げ承認 → 決定 → 下書き', async () => {
    await d.openEstimateMenu(name);
    await d.estimateAction('manager', '取り下げ承認').click();
    await d.decide('承認状態を保存します');
    await d.expectEstimateStatus(name, '下書き');
  });
  await test.step('5. Tick → 提示する → 決定 → 承認待ち', () => d.submitEstimate(name));
  await test.step('6. メニュー展開▼ → 承認する → 決定 → 承認済み', async () => {
    await d.openEstimateMenu(name);
    await d.estimateAction('manager', '承認する').click();
    await d.decide(/この見積を承認しますか|承認後は取り消すことができません/);
    await d.expectEstimateStatus(name, '承認済み');
  });
  await test.step('7. 閉じる 見積もり → × 状態変更', async () => {
    await d.closeEstimateModal();
    await d.closeStatus();
  });
  await test.step('Expected: 対応中 / 作業中', () => d.expectBadges('対応中', '作業中'));
});

test('E2E-TC-008 作業完了', { tag: ['@E2E-TC-008', '@role-99'] }, async () => {
  const d = s.detail;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. クイック操作 → 作業中', async () => {
    await d.openQuickAction();
    await d.expectFlow('作業中');
  });
  await test.step('2. Select 作業完了', () => d.setFlow('作業完了'));
  await test.step('3. 保存 → 決定 → OK', () => d.saveStatus());
  await test.step('Expected: 対応中 / 作業完了', () => d.expectBadges('対応中', '作業完了'));
});

test('E2E-TC-009 報告済 and input 報告書', { tag: ['@E2E-TC-009', '@role-99'] }, async () => {
  test.setTimeout(300_000);
  const d = s.detail;
  const r = data.report;
  // Browser thật 2026-10-12: input = 'YYYY/MM/DD 00:00'; dòng 報告書 trong 状態変更 = 'YYYY年MM月DD日 00:00'.
  const [Y, M] = today('ym').split('/');
  const day = (dd: string) => `${Y}年${M}月${dd}日 00:00`;
  const input = (dd: string) => `${Y}/${M}/${dd} 00:00`;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. クイック操作 → 報告済', async () => {
    await d.openQuickAction();
    await d.setFlow('報告済');
  });
  await test.step('2. Edit icon on 報告書 → 編集', async () => {
    await d.editRow('報告書');
    await click(d.reportModal, '編集');
    await expect(d.reportModal.locator('input[name="start"]')).toBeVisible();
  });
  await test.step('3. 開始 = day 1, 終了 = day 2', async () => {
    await d.pickDay('start', 1);
    await d.pickDay('end', 2);
    await expect(d.reportModal.locator('input[name="start"]')).toHaveValue(input('01'));
    await expect(d.reportModal.locator('input[name="end"]')).toHaveValue(input('02'));
  });
  await test.step(`4. 原因と発生起因: ${r.cause}`, () => d.reportModal.locator('textarea[name="reason"]').fill(r.cause));
  await test.step('5. Upload 作業前 / 作業後 photos', async () => {
    await d.uploadReportPhoto('作業前の写真', r.beforeImage);
    await d.uploadReportPhoto('作業後の写真', r.afterImage);
  });
  await test.step(`6. 修理対象資産選択 → register ${r.assetName}`, async () => {
    await click(d.reportModal, '修理対象資産選択');
    await d.assets.expectOpen();
    await d.assets.openRegister();
    await d.assets.uploadImage(0, r.assetImage);
    await d.assets.fillField('名称', r.assetName);
    await d.assets.save();
  });
  await test.step(`7. Select ${r.assetName} → 決定する`, async () => {
    expect(await d.assets.selectRows(r.assetName, 1)).toBe(1);
    await d.assets.decide();
    await expect(d.reportModal).toContainText(r.assetName);
  });
  await test.step('8. 完了 → 状態変更 shows day 01 / 02', async () => {
    await click(d.reportModal, '完了');
    await expect(d.statusModal).toContainText(day('01'));
    await expect(d.statusModal).toContainText(day('02'));
  });
  await test.step('9. 保存 → 決定 → OK', () => d.saveStatus());
  await test.step('Expected: 対応中 / 報告済', () => d.expectBadges('対応中', '報告済'));
});

test('E2E-TC-010 Admin views 報告書 and downloads', { tag: ['@E2E-TC-010', '@role-99'] }, async () => {
  const d = s.detail;
  await pre(async () => { await ensureRole('99'); await ensureTroubleOpened(); });
  await test.step('1. Header 報告書', async () => {
    await d.headerButton('報告書');
    await expect(d.reportModal).toBeVisible();
  });
  await test.step('2. Verify 店舗名 / 施工業者 / 施工担当者 / 原因と発生起因', async () => {
    await expectRow(d.reportModal, '店舗名', data.store.storeName);
    await expectRow(d.reportModal, '施工業者', data.worker.companyName);
    await expectRow(d.reportModal, '施工担当者', data.worker.staffName);
    await expectRow(d.reportModal, '原因と発生起因', data.report.cause);
  });
  await test.step('3. Verify photos and asset', async () => {
    await expect(rowOf(d.reportModal, '作業前の写真').locator('img').first()).toBeVisible();
    await expect(rowOf(d.reportModal, '作業後の写真').locator('img').first()).toBeVisible();
    await expect(d.reportModal).toContainText(data.report.assetName);
  });
  await test.step('4. Excelダウンロード → .xlsx', async () => {
    expect(await d.downloadFrom('Excelダウンロード')).toMatch(/\.xlsx$/i);
  });
  let pdf = '';
  await test.step('5. PDFダウンロード', async () => { pdf = await d.downloadFrom('PDFダウンロード'); });
  await test.step('6. 閉じる', () => click(d.reportModal, '閉じる'));
  await test.step('Expected: .pdf downloaded', () => expect(pdf).toMatch(/\.pdf$/i));
});

test('E2E-TC-011 Logout, login as chain store manager', { tag: ['@E2E-TC-011', '@role-01'] }, async () => {
  const c = credentialsOf('01');
  await pre(() => ensureRole('99'));
  await test.step('1-2. ログアウト → 決定 → login screen', async () => {
    await s.layout.logout();
    markLoggedIn(page, null);
  });
  await test.step('3. Input manager login ID / password', async () => {
    await s.login.loginId.fill(c.loginId);
    await s.login.password.fill(c.password);
  });
  await test.step('4. Click ログイン', async () => {
    await s.login.submit.click();
    await expect(page).not.toHaveURL(/\/login/);
    markLoggedIn(page, '01');
  });
  // Browser thật 2026-10-12: tên user ở sidebar '.account p'.
  const name = roleAccount('01')?.displayName || data.manager.dashboardName;
  await test.step(`Expected: dashboard shows ${name}`, () => expect(page.locator('.account')).toContainText(name));
});

test('E2E-TC-012 Manager views estimate and history', { tag: ['@E2E-TC-012', '@role-01'] }, async () => {
  const d = s.detail;
  const e = data.estimate;
  await pre(() => ensureRole('01'));
  await test.step('1. Menu 進行中のトラブル一覧', () => s.layout.menu('進行中のトラブル一覧'));
  await test.step('2. Open the trouble (依頼番号) → 対応中 / 報告済', async () => {
    test.skip(!trouble.id && !trouble.number, 'Chưa có trouble');
    await s.list.openByNumber(trouble);
    await d.expectBadges('対応中', '報告済');
  });
  await test.step('3. Minimize chat', () => minimizeChat(page));
  const box = modal(page, '見積もり管理');
  await test.step('4. Header 見積もり → verify', async () => {
    await d.headerButton('見積もり');
    for (const t of [e.name, data.store.chainSystemName, e.total, e.totalTax]) await expect(box).toContainText(t);
  });
  const history = modal(page, '見積もり履歴');
  await test.step('5. 履歴を見る', async () => {
    await click(box, '履歴を見る');
    await expect(history).toBeVisible();
  });
  await test.step('Expected: 見積もり履歴 shows 取り下げ申請中', () => expect(history).toContainText('取り下げ申請中'));
  await test.step('6. 閉じる x2', async () => {
    await click(history, '閉じる');
    await click(box, '閉じる');
  });
});

test('E2E-TC-013 Manager 作業完了確認', { tag: ['@E2E-TC-013', '@role-01'] }, async () => {
  const d = s.detail;
  await pre(async () => { await ensureRole('01'); await ensureTroubleOpened(); });
  const box = modal(page, '支払情報');
  await test.step('1. Header 作業完了確認 → 支払情報', async () => {
    await d.headerButton('作業完了確認');
    for (const t of [data.categories.large, data.categories.medium, data.categories.small, data.estimate.totalTax]) {
      await expect(box).toContainText(t);
    }
  });
  // Browser thật 2026-10-12: 5 ô .rating-star (不満…感動), mỗi ô có <div data-index=N><img></div>; chọn → cả 5 ảnh đổi src.
  await test.step('2. Click 感動 → 5 stars selected', async () => {
    const stars = box.locator('.rating-star img');
    const empty = await stars.first().getAttribute('src');
    await box.locator('.rating-star', { hasText: '感動' }).locator('[data-index] img').click();
    for (let i = 0; i < 5; i++) await expect(stars.nth(i)).not.toHaveAttribute('src', empty ?? '');
  });
  await test.step('3. Input comment', () => box.locator('textarea[name="description"]').fill(data.payment.comment));
  await test.step('4. Click 作業完了確認 → confirm', async () => {
    await click(box, '作業完了確認');
  });
  await test.step('5. Click 決定', () => d.decide('作業依頼の決済状態を保存します'));
  await test.step('6. Click OK', () => d.ok('作業依頼の決済状態の保存が完了しました'));
  await test.step('Expected: 完了 / 報告済', () => d.expectBadges('完了', '報告済'));
});
