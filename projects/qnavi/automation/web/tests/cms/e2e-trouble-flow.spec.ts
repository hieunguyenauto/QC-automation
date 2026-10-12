import { test, expect, type Page, type BrowserContext } from '@playwright/test';
import data from '../../data/e2e-trouble-flow.json';
import { credentials } from '../../data/roles';
import { env } from '../../common/env';
import { click, clickable, closeModal, expectRow, fill, minimizeChat, modal, rowOf, today } from '../../common/ui';
import { LoginScreen } from '../../screens/cms/login.screen';
import { CmsLayout } from '../../screens/cms/layout.screen';
import { TroubleCreateScreen } from '../../screens/cms/trouble-create.screen';
import { TroubleListScreen } from '../../screens/cms/trouble-list.screen';
import { TroubleDetailScreen } from '../../screens/cms/trouble-detail.screen';
import { TroubleEditScreen } from '../../screens/cms/trouble-edit.screen';

/**
 * Kịch bản E2E: projects/qnavi/qc/test-cases/e2e-trouble-flow-test-cases.md (E2E-TC-001 … 013).
 * Chạy nối tiếp trên CÙNG 1 trình duyệt: TC sau dùng trouble do E2E-TC-002 tạo. TC nào fail → các TC sau skip.
 * test.step('n. …') đánh số theo Steps của TC để biết fail ở bước nào.
 * Chạy: npm run e2e:headed
 */
test.describe.configure({ mode: 'serial' });

let context: BrowserContext;
/** Trouble tạo ở E2E-TC-002 (id lấy từ response, 依頼番号 hiển thị trên màn hình). */
const trouble: { id?: string; number?: string } = {};
const RUN = (() => {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
})();
const FAULT_TEXT = `${data.faultDetail.textPrefix}-${RUN}`;
let page: Page;
let s: {
  login: LoginScreen; layout: CmsLayout; create: TroubleCreateScreen;
  list: TroubleListScreen; detail: TroubleDetailScreen; edit: TroubleEditScreen;
};

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext({
    baseURL: env.cmsBaseUrl, locale: 'ja-JP', timezoneId: 'Asia/Tokyo', viewport: { width: 1600, height: 1000 },
    acceptDownloads: true,
  });
  context.setDefaultTimeout(env.actionTimeoutMs);
  context.setDefaultNavigationTimeout(env.navigationTimeoutMs);
  page = await context.newPage();
  s = {
    login: new LoginScreen(page), layout: new CmsLayout(page), create: new TroubleCreateScreen(page),
    list: new TroubleListScreen(page), detail: new TroubleDetailScreen(page), edit: new TroubleEditScreen(page),
  };
});

test.afterEach(async ({}, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    // Chụp màn hình + cây phần tử (aria) để sửa locator; giới hạn thời gian để không treo hook.
    const shot = await page.screenshot({ timeout: 10_000 }).catch(() => null);
    if (shot) await testInfo.attach('screenshot', { body: shot, contentType: 'image/png' });
    const aria = await page.locator('body').ariaSnapshot({ timeout: 10_000 }).catch(() => null);
    if (aria) await testInfo.attach('aria-snapshot', { body: aria, contentType: 'text/yaml' });
  }
});

// Trace: Playwright tự ghi cho context tạo từ browser (trace: retain-on-failure trong config).
test.afterAll(async () => {
  await context.close();
});

function account(role: '99' | '01') {
  const c = credentials(role);
  if (!c) throw new Error(`Thiếu CMS_${role}_ID / CMS_${role}_PASSWORD trong .env`);
  return c;
}

test('E2E-TC-001 Login as admin', { tag: ['@E2E-TC-001', '@role-99'] }, async () => {
  const c = account('99');
  await test.step('1. Open /login', () => s.login.goto());
  await test.step('2-7. Input login ID / password, click ログイン', async () => {
    await s.login.loginId.click();
    await s.login.loginId.fill(c.loginId);
    await expect(s.login.loginId).toHaveValue(c.loginId);
    await s.login.password.click();
    await s.login.password.fill(c.password);
    await s.login.submit.click();
  });
  await expect(page).toHaveURL(/\/admin(\/|$|\?)/);
});

test('E2E-TC-002 Create trouble', { tag: ['@E2E-TC-002', '@role-99'] }, async () => {
  test.setTimeout(480_000);
  const c = s.create;
  await test.step('1. Menu 作業依頼登録 → 新規依頼 → 次へ → step 店舗', async () => {
    await s.layout.menu('作業依頼登録');
    await c.startNew();
  });
  await test.step('2-7. チェーン店舗選択 → 検索 → 選択', () =>
    c.selectChainStore(data.store.companyQuery, data.store.storeQuery, data.store.storeName, data.store.chainSystemName));
  await test.step('8-9. 担当者選択 → first row', () => c.selectFirstStaff());
  await test.step('10. 次へ → step 作業項目選択', () => c.next('作業項目選択'));
  await test.step('11-14. Pick categories', async () => {
    await c.pickCategory(0, data.categories.large);
    await c.pickCategory(1, data.categories.medium);
    await c.pickCategory(2, data.categories.small);
  });
  await test.step('15-16. Tick 対象資産, open 修理対象資産選択', async () => {
    await c.tickHasAsset();
    await c.openAssetSelect();
  });
  await test.step('17. Select first 2 rows TEST AUTOMATION (if any)', () => c.assets.selectRows(data.asset.existingName, 2));
  await test.step('18-23. Register new asset', () =>
    c.assets.registerAsset({
      name: data.asset.name, model: data.asset.model, serial: data.asset.serial, note: data.asset.note,
      images: [data.asset.image, data.asset.image], withDates: true,
    }));
  await test.step('24. Select the first Automation Asset', async () => {
    expect(await c.assets.selectRows(data.asset.name, 1)).toBe(1);
  });
  await test.step('25. 決定する → form lists Automation Asset', async () => {
    await c.assets.decide();
    await expect(c.content).toContainText(data.asset.name);
  });
  await test.step('26. 次へ → step 故障詳細', () => c.next('故障詳細'));
  await test.step('27. Upload fault images', () => c.uploadFaultImages(data.faultDetail.image, 2));
  await test.step(`28. Input 故障詳細記入欄 = ${FAULT_TEXT}`, () => c.fillFaultDetail(FAULT_TEXT));
  await test.step('29. 希望日時 = 明日以降 10:00–12:00', () =>
    c.chooseExpectedDate(data.expectedDate.option, data.expectedDate.start, data.expectedDate.end));
  await test.step('30-32. 決定して問合わせ → 決定 → OK, record 依頼番号', async () => {
    Object.assign(trouble, await c.submit());
    await minimizeChat(page);
    if (!trouble.number && /\/detail/.test(page.url())) {
      trouble.number = (await rowOf(page.locator('.content-wrapper'), '依頼番号').innerText()).match(/\d{3,}/)?.[0];
      trouble.id ??= page.url().match(/troubles\/(\d+)\/detail/)?.[1];
    }
  });
  test.info().annotations.push({ type: '依頼番号', description: `${trouble.number ?? '?'} (id ${trouble.id ?? '?'})` });
  expect(trouble.id ?? trouble.number, 'Không lấy được id / 依頼番号 của trouble vừa tạo').toBeTruthy();
});

test('E2E-TC-003 Trouble detail and edit 対応区分', { tag: ['@E2E-TC-003', '@role-99'] }, async () => {
  const d = s.detail;
  await test.step('1. Open the trouble from Trouble List', async () => {
    const onIt = trouble.id ? page.url().includes(`/troubles/${trouble.id}/detail`) : false;
    if (!onIt) {
      await s.list.open();
      await s.list.openByNumber(trouble);
    }
    await d.expectOpened();
  });
  await test.step('2. Verify 作業項目', async () => {
    await d.expectInfo('作業項目（大）', data.categories.large);
    await d.expectInfo('作業項目（中）', data.categories.medium);
    await d.expectInfo('作業項目（小）', data.categories.small);
  });
  await test.step('3. Verify header', async () => {
    await d.expectBadges('問い合わせ中', '受注待ち');
    await d.expectInfo('店舗名', data.store.storeName);
    for (const l of ['業者', '訪問日時']) await d.expectInfo(l, '未確定');
    await d.expectInfo('見積書', '未提出');
  });
  await test.step('4. 資産一覧 → assets listed → X', async () => {
    await d.headerButton('資産一覧');
    const box = modal(page);
    await expect(box).toContainText(data.asset.name);
    await closeModal(box);
  });
  await test.step('5. 編集', async () => {
    await d.headerButton('編集');
    await s.edit.expectOpened();
  });
  await test.step('6-7. 変更 → 対応区分 = first value → 保存 → OK', async () => {
    const chosen = await s.edit.setFirstAssetResponseType();
    test.info().annotations.push({ type: '対応区分', description: chosen.join(', ') || '(không có select)' });
  });
  await test.step('8. 戻る', () => s.edit.back());
  await d.expectOpened();
});

test('E2E-TC-004 状態 = 対応中 and assign worker', { tag: ['@E2E-TC-004', '@role-99'] }, async () => {
  const d = s.detail;
  await test.step('1. クイック操作 → 状態変更', async () => {
    const m = await d.openQuickAction();
    await expect(m).toContainText('問い合わせ中');
  });
  await test.step('2. 状態 = 対応中', () => d.setStatus('対応中'));
  await test.step('3-6. Assign worker', () => d.assignWorker(data.worker.companyQuery, data.worker.loginId, data.worker.companyName));
  await test.step('7. 保存 → 決定 → OK', () => d.saveStatus());
  await d.expectBadges('対応中', '受注待ち');
  await d.expectInfo('業者', data.worker.companyName);
});

test('E2E-TC-005 受注 → 移動中 → 到着', { tag: ['@E2E-TC-005', '@role-99'] }, async () => {
  const d = s.detail;
  await test.step('1. 受注', () => d.changeFlow('受注', '受注待ち'));
  await test.step('2. 移動中', () => d.changeFlow('移動中', '受注'));
  await test.step('3. 到着', () => d.changeFlow('到着', '移動中'));
  await d.expectBadges('対応中', '到着');
});

test('E2E-TC-006 Create estimate Test and submit', { tag: ['@E2E-TC-006', '@role-99'] }, async () => {
  test.setTimeout(240_000);
  const d = s.detail;
  await test.step('1. クイック操作 → 見積承認待ち', async () => {
    await d.openQuickAction();
    await d.setFlow('見積承認待ち');
    await expect(d.statusModal).toContainText('必須');
  });
  await test.step('2-8. 登録 estimate, 提示する', () => d.createAndSubmitEstimate(data.estimate));
  await test.step('9. 閉じる → 保存 → 決定 → OK', async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
  });
  await d.expectBadges('対応中', '見積承認待ち');
  await d.expectInfo('見積書', 'あり');
  await test.step('10. 見積もり管理 amounts', async () => {
    await d.headerButton('見積もり');
    const box = modal(page, '見積もり');
    await expect(box).toContainText(data.estimate.name);
    await expect(box).toContainText(data.estimate.total);
    await expect(box).toContainText(data.estimate.totalTax);
    await click(box, '閉じる');
  });
});

test('E2E-TC-007 取り下げ申請 → 取り下げ承認 → 承認', { tag: ['@E2E-TC-007', '@role-99'] }, async () => {
  test.setTimeout(240_000);
  const d = s.detail;
  const name = data.estimate.name;
  await test.step('1. クイック操作 → edit 見積もり', async () => {
    await d.openQuickAction();
    await d.editRow('見積もり');
    await expect(d.estimateRow(name)).toContainText('承認待ち');
  });
  await test.step('2. メニュー展開▼', async () => {
    await d.openEstimateMenu(name);
    for (const b of ['差し戻し', '承認する', '取り下げ申請', 'コピー']) await expect(clickable(d.estimateModal, b)).toBeVisible();
  });
  await test.step('3. 取り下げ申請', async () => {
    await click(d.estimateModal, '取り下げ申請');
    const req = modal(page, '申請を送信');
    await req.locator('textarea').first().fill(data.estimate.cancelReason);
    await click(req, '申請を送信');
    await d.decide(data.estimate.cancelReason);
    await expect(d.estimateRow(name)).toContainText('取り下げ申請中');
  });
  await test.step('4. 取り下げ承認', async () => {
    await click(d.estimateModal, '取り下げ承認');
    await d.decide('承認状態を保存します');
    await expect(d.estimateRow(name)).toContainText('下書き');
  });
  await test.step('5. 再提示', () => d.submitEstimate(name));
  await test.step('6. 承認する', async () => {
    await d.openEstimateMenu(name);
    await click(d.estimateModal, '承認する');
    await d.decide('この見積を承認しますか');
    await expect(d.estimateRow(name)).toContainText('承認済み');
  });
  await test.step('7. 閉じる, × 状態変更', async () => {
    await d.closeEstimateModal();
    await closeModal(d.statusModal);
  });
  await d.expectBadges('対応中', '作業中');
});

test('E2E-TC-008 作業完了', { tag: ['@E2E-TC-008', '@role-99'] }, async () => {
  await s.detail.changeFlow('作業完了', '作業中');
});

test('E2E-TC-009 報告済 and input 報告書', { tag: ['@E2E-TC-009', '@role-99'] }, async () => {
  test.setTimeout(300_000);
  const d = s.detail;
  const ym = today('ym');
  await test.step('1. クイック操作 → 報告済', async () => {
    await d.openQuickAction();
    await d.setFlow('報告済');
  });
  await test.step('2. edit 報告書 → 編集', async () => {
    await d.editRow('報告書');
    await click(d.reportModal, '編集');
  });
  await test.step('3. 開始 day 1, 終了 day 2', async () => {
    await d.pickDay('開始', 1);
    await d.pickDay('終了', 2);
    await expect(d.reportModal).toContainText(`${ym}/01 00:00`);
    await expect(d.reportModal).toContainText(`${ym}/02 00:00`);
  });
  await test.step('4. 原因と発生起因', () => fill(d.reportModal, '原因と発生起因', data.report.cause));
  await test.step('5. Photos before / after', async () => {
    await d.uploadReportPhoto('作業前の写真', data.report.beforeImage);
    await d.uploadReportPhoto('作業後の写真', data.report.afterImage);
  });
  await test.step('6. Register asset TEST AUTOMATION', async () => {
    await click(d.reportModal, '修理対象資産選択');
    await d.assets.expectOpen();
    await d.assets.registerAsset({ name: data.report.assetName, images: [data.report.assetImage] });
  });
  await test.step('7. Select TEST AUTOMATION → 決定する', async () => {
    await d.assets.selectRows(data.report.assetName, 1);
    await d.assets.decide();
    await expect(d.reportModal).toContainText(data.report.assetName);
  });
  await test.step('8. 完了', async () => {
    await click(d.reportModal, '完了');
    await expect(d.statusModal).toContainText(`${ym}/01`);
  });
  await test.step('9. 保存 → 決定 → OK', () => d.saveStatus());
  await d.expectBadges('対応中', '報告済');
});

test('E2E-TC-010 Admin views 報告書 and downloads', { tag: ['@E2E-TC-010', '@role-99'] }, async () => {
  const d = s.detail;
  await test.step('1. 報告書', () => d.headerButton('報告書'));
  const box = d.reportModal;
  await test.step('2. Verify info', async () => {
    await expectRow(box, '店舗名', data.store.storeName);
    await expectRow(box, '施工業者', data.worker.companyName);
    await expectRow(box, '施工担当者', data.worker.staffName);
    await expectRow(box, '原因と発生起因', data.report.cause);
  });
  await test.step('3. Verify images and asset', async () => {
    await expect(box.locator('img').first()).toBeVisible();
    await expect(box).toContainText(data.report.assetName);
  });
  await test.step('4. Excelダウンロード', async () => {
    expect(await d.downloadFrom('Excelダウンロード')).toMatch(/\.xlsx$/i);
  });
  const pdf = await test.step('5. PDFダウンロード', () => d.downloadFrom('PDFダウンロード'));
  await test.step('6. 閉じる', () => click(box, '閉じる'));
  expect(pdf).toMatch(/\.pdf$/i);
});

test('E2E-TC-011 Logout, login as chain store manager', { tag: ['@E2E-TC-011', '@role-01'] }, async () => {
  const c = account('01');
  await test.step('1-2. ログアウト → 決定', () => s.layout.logout());
  await test.step('3-4. Login as manager', () => s.login.login(c.loginId, c.password));
  await expect(page.locator('body')).toContainText(data.manager.dashboardName);
});

test('E2E-TC-012 Manager views estimate and history', { tag: ['@E2E-TC-012', '@role-01'] }, async () => {
  const d = s.detail;
  await test.step('1. Menu 進行中のトラブル一覧', () => s.layout.menu('進行中のトラブル一覧'));
  await test.step('2. Open the trouble', async () => {
    await s.list.openByNumber(trouble);
    await d.expectBadges('対応中', '報告済');
  });
  await test.step('3. Minimize chat', () => minimizeChat(page));
  const box = modal(page, '見積もり管理');
  await test.step('4. 見積もり → verify', async () => {
    await d.headerButton('見積もり');
    await expect(box).toBeVisible();
    for (const t of [data.estimate.name, data.store.chainSystemName, data.estimate.total, data.estimate.totalTax]) await expect(box).toContainText(t);
  });
  const history = modal(page, '見積もり履歴');
  await test.step('5. 履歴を見る', async () => {
    await click(box, '履歴を見る');
    await expect(history).toBeVisible();
  });
  await expect(history).toContainText('取り下げ申請中');
  await test.step('6. 閉じる x2', async () => {
    await click(history, '閉じる');
    await click(box, '閉じる');
  });
});

test('E2E-TC-013 Manager 作業完了確認', { tag: ['@E2E-TC-013', '@role-01'] }, async () => {
  const d = s.detail;
  const box = modal(page, '支払情報');
  await test.step('1. 作業完了確認 → 支払情報', async () => {
    await d.headerButton('作業完了確認');
    for (const t of [data.categories.large, data.categories.medium, data.categories.small, data.estimate.totalTax]) await expect(box).toContainText(t);
  });
  await test.step('2. 感動', () => box.getByText('感動', { exact: true }).first().click());
  await test.step('3. Comment', () => box.locator('textarea').first().fill(data.payment.comment));
  await test.step('4-5. 作業完了確認 → 決定', async () => {
    await click(box, '作業完了確認');
    await d.decide('作業依頼の決済状態を保存します');
  });
  await test.step('6. OK', () => d.ok('作業依頼の決済状態の保存が完了しました'));
  await d.expectBadges('完了', '報告済');
});
