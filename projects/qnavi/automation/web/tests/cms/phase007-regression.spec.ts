import { test, expect, type Page } from '@playwright/test';
import data from '../../data/phase007-regression.json';
import { serialScenario } from '../../common/scenario';
import { credentialsOf, loginAs, markLoggedIn, logout, type Who } from '../../common/session';
import { account } from '../../data/roles';
import { click, closeModal, exact, minimizeChat, modal, modalWithButton, acknowledgeOk, confirmDecide, valueOf } from '../../common/ui';
import { LoginScreen } from '../../screens/cms/login.screen';
import { CmsLayout, waitDashboardApi } from '../../screens/cms/layout.screen';
import { env } from '../../common/env';
import { waitApiPerf, waitApisIdle } from '../../common/wait';
import { TroubleCreateScreen } from '../../screens/cms/trouble-create.screen';
import { TroubleListScreen } from '../../screens/cms/trouble-list.screen';
import { TroubleDetailScreen } from '../../screens/cms/trouble-detail.screen';
import { TroubleEditScreen } from '../../screens/cms/trouble-edit.screen';
import { ChainSystemScreen } from '../../screens/cms/chain-system.screen';
import { AssetColumnScreen } from '../../screens/cms/asset-column.screen';
import { SubAdminScreen, STORE_CSV_HEADER } from '../../screens/cms/subadmin.screen';
import { TaskListScreen, ChatListScreen, AssetInfoScreen } from '../../screens/cms/task-chat-asset.screen';

/**
 * TC: projects/qnavi/qc/test-cases/phase007-regression-test-cases.md (rev 6, LOCKED 2026-10-13) — 65 TC, chạy nối tiếp.
 * Môi trường: est-test (ENV=est-test). Locator dò thật trên dev 2026-10-13 (cùng CMS); chỗ chưa dò ghi [chưa dò] trong screens/.
 * Lesson đã áp dụng (automation/lessons/INDEX.md): R01 dò DOM trước · R03/R05 chờ dữ liệu tải · R04 valueOf · R07 option:checked
 *  · R08 nút 閉じる · R09/R15 modal lồng nhau · R10 toggle · R11/R12 dispatchEvent · R13 trace theo chunk (common/scenario.ts)
 *  · R14 ghi id ngay sau khi tạo · R16 chờ upload S3 · R17 hộp OK chờ 30s.
 * Trouble dùng chung: T1 (TC-016), T2 (TC-046), T3 (TC-050), T5 (TC-052), T4 (TC-055). TC phụ thuộc trouble chưa tạo → skip.
 * Chạy:  ENV=est-test npx playwright test tests/cms/phase007-regression.spec.ts --project=e2e --headed
 *        ENV=est-test npx playwright test tests/cms/phase007-regression.spec.ts --project=e2e -g "P007-TC-00[1-9]"
 */
test.describe.configure({ mode: 'serial' });

type T = { id?: string; number?: string };
const T1: T = {}; const T2: T = {}; const T3: T = {}; const T4: T = {}; const T5: T = {};
const st: { chainId?: string; storeId?: string; group?: string; filter?: string; reportExcel?: string } = {};
const stamp = (() => {
  const d = new Date(); const p = (n: number) => String(n).padStart(2, '0');
  return `${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
})();
const M = data.messages;
const E = data.estimate;

const sc = serialScenario(() => [
  T1.number && `T1 ${T1.number}`, T2.number && `T2 ${T2.number}`, T3.number && `T3 ${T3.number}`,
  T5.number && `T5 ${T5.number}`, T4.number && `T4 ${T4.number}`,
].filter(Boolean) as string[]);

let page: Page;
let s: {
  login: LoginScreen; layout: CmsLayout; create: TroubleCreateScreen; list: TroubleListScreen; detail: TroubleDetailScreen;
  edit: TroubleEditScreen; chain: ChainSystemScreen; column: AssetColumnScreen; sub: SubAdminScreen;
  tasks: TaskListScreen; chats: ChatListScreen; assetInfo: AssetInfoScreen;
};
test.beforeAll(() => {
  page = sc.page;
  s = {
    login: new LoginScreen(page), layout: new CmsLayout(page), create: new TroubleCreateScreen(page), list: new TroubleListScreen(page),
    detail: new TroubleDetailScreen(page), edit: new TroubleEditScreen(page), chain: new ChainSystemScreen(page),
    column: new AssetColumnScreen(page), sub: new SubAdminScreen(page), tasks: new TaskListScreen(page),
    chats: new ChatListScreen(page), assetInfo: new AssetInfoScreen(page),
  };
});

// ---------------- helper của kịch bản ----------------
const step = test.step;
/** 1 TC = 1 test; Pre-condition đăng nhập đúng tài khoản (common/session.ts). */
function tc(id: string, title: string, who: Who | null, body: () => Promise<void>, timeout = 240_000) {
  const role = who ? who.split(':')[0] : 'none';
  test(`${id} ${title}`, { tag: [`@${id}`, `@role-${role}`] }, async () => {
    test.setTimeout(timeout);
    if (who) await step(`Pre-condition: đăng nhập ${who}`, () => loginAs(page, who));
    await body();
  });
}
/** Dòng 見積 theo đúng tên ở ô td (hasText khớp chuỗi con: 'Test' khớp cả 'EnterTest'). */
const estimationRow = (box: ReturnType<typeof modal>, name: string) =>
  box.locator('tr.estimation-row').filter({ has: page.locator('td', { hasText: exact(name) }) }).first();
const need = (t: T, name: string) => test.skip(!t.id, `Chưa có ${name} (TC tạo ${name} chưa chạy / fail)`);
async function openTrouble(t: T): Promise<void> {
  await page.goto(`/admin/troubles/${t.id}/detail`); await waitApisIdle(page, 'goto');
  await s.detail.expectOpened(t.id);
}
/** Ghi id / 依頼番号 ngay khi vào chi tiết sau khi tạo (R14). */
async function record(t: T, created: T): Promise<void> {
  Object.assign(t, created);
  await expect(page).toHaveURL(/\/admin\/troubles\/\d+\/detail/, { timeout: 30_000 });
  t.id ??= page.url().match(/troubles\/(\d+)\/detail/)?.[1];
  await s.detail.expectOpened(t.id);
  t.number ??= await s.detail.number();
}
/** 作業依頼登録 新規依頼 tới bước 作業項目選択 (store + 担当者 + 3 thẻ 作業項目). */
async function createUntilCategories(storeQuery: string, storeName: string): Promise<void> {
  const c = s.create;
  await page.goto('/admin/trouble/create'); await waitApisIdle(page, 'goto');
  await c.start('新規依頼');
  await c.openChainStoreSearch();
  await c.expandSearch('電話番号');
  await c.fillSearch('店名', storeQuery);
  await c.search();
  await c.pickStore(storeName);
  await c.openStaff();
  await c.pickFirstStaff();
  await c.next('作業項目選択');
  for (const [i, v] of [data.categories.large, data.categories.medium, data.categories.small].entries()) {
    await c.openCategory(i);
    await c.chooseCategory(v);
  }
}
async function finishCreate(text: string, urgent = false): Promise<T> {
  const c = s.create;
  await c.next('故障詳細');
  await c.fillFaultDetail(text);
  if (urgent) await click(c.content, '至急');
  else await c.chooseExpectedDate(data.expectedDate.option, data.expectedDate.start, data.expectedDate.end);
  await c.clickSubmit();
  return c.confirmSubmit();
}
async function assignWorker(): Promise<void> {
  const d = s.detail;
  await d.openQuickAction();
  await d.setStatus('対応中');
  await d.expectFlow('受注待ち');
  await d.editRow('作業者');
  await d.expandSearch();
  await d.searchWorker(data.worker.companyQuery);
  await d.pickWorker(data.worker.loginId);
  await expect(d.statusModal).toContainText(data.worker.companyName);
  await d.saveStatus();
  await d.expectBadges('対応中', '受注待ち');
}
async function moveFlow(...labels: string[]): Promise<void> {
  for (const l of labels) {
    await s.detail.openQuickAction();
    await s.detail.setFlow(l);
    await s.detail.saveStatus();
    await s.detail.expectBadges('対応中', l);
  }
}
/** Mở 見積一覧 qua クイック操作 (chọn flow trước nếu truyền). */
async function openEstimates(flow?: string): Promise<void> {
  await s.detail.openQuickAction();
  if (flow) await s.detail.setFlow(flow);
  await s.detail.openEstimateFromStatus();
}
/** Tạo 見積 (đã ở 見積一覧): 1 hạng mục, tuỳ chọn xoá dòng mặc định / sửa 店舗向け 単価. Kết thúc khi 見積 = 下書き. */
async function newEstimate(name: string, item?: { type: '作業' | '部材' | '諸経費'; label: string; price: string; shown?: string },
  opts: { deleteDefault?: boolean; storePrice?: string } = {}): Promise<void> {
  const d = s.detail;
  await d.startNewEstimate();
  await d.fillEstimateName(name);
  if (item) {
    await d.openAddItem();
    await d.chooseItemType(item.type);
    await d.fillItemName(item.label);
    await d.fillUnitPrice(item.price, Number(item.price).toLocaleString('en-US'));
    await d.decideItem(item.label);
  }
  if (opts.deleteDefault) await d.deleteDefaultRows();
  if (opts.storePrice) await d.setStoreUnitPrice(opts.storePrice);
  await d.decideEstimate(name);
  await d.expectEstimateStatus(name, '下書き');
}
/** 報告書 edit form qua クイック操作 → 報告済 → icon 報告書 → 編集. */
async function openReportForm(): Promise<void> {
  const d = s.detail;
  await d.openQuickAction();
  await d.setFlow('報告済');
  await d.editRow('報告書');
  await click(d.reportModal, '編集');
  await expect(d.reportModal.locator('input[name="start"]')).toBeVisible();
}
async function cancelReportForm(): Promise<void> {
  await click(s.detail.reportModal, 'キャンセル');
  if (await s.detail.statusModal.isVisible().catch(() => false)) await s.detail.closeStatus();
}
async function downloadName(trigger: () => Promise<void>): Promise<string> {
  const dl = page.waitForEvent('download', { timeout: 60_000 });
  await trigger();
  return (await dl).suggestedFilename();
}

// =====================================================================================
// M1 · Login + chain / 資産管理項目 / フィルタ / サブアドミン
// =====================================================================================
tc('P007-TC-001', 'Login admin', null, async () => {
  const c = credentialsOf('99');
  await step('1. Open /login → form ログインID / パスワード', async () => {
    await s.login.goto();
    const noPerm = modal(page, '権限がありません');
    if (await noPerm.isVisible().catch(() => false)) await closeModal(noPerm);
    await expect(s.login.loginId).toBeVisible();
    await expect(s.login.password).toBeVisible();
  });
  await step('2. Input admin login ID', () => s.login.loginId.fill(c.loginId));
  await step('3. Input admin password', () => s.login.password.fill(c.password));
  let dashboard: Promise<void> = Promise.resolve();
  await step('4. Click ログイン', async () => { dashboard = waitDashboardApi(page); await s.login.submit.click(); });
  await step("Expected: sidebar 'Qナビ担当者', dashboard '全体', menu '作業依頼登録'", async () => {
    await expect(page).toHaveURL(/\/admin(\/|$|\?)/, { timeout: env.navigationTimeoutMs }); // đợi chuyển trang thực tế (R18), không dùng 5s mặc định
    await dashboard;
    await s.login.waitAfterLogin();
    markLoggedIn(page, '99');
    await s.layout.expectAccount('Qナビ担当者');
    await expect(s.layout.content).toContainText('全体', { timeout: 20_000 });
    await expect(s.layout.sidebar).toContainText('作業依頼登録');
  });
});

tc('P007-TC-002', '#2 · 2296 · 店舗別作業項目DL confirm dialog says CSV', '99', async () => {
  await step('1. Menu チェーンシステム情報', () => s.layout.menu('チェーンシステム情報'));
  await step('2. 社名 Linksys → 検索 → open Linksys Chain System', async () => {
    st.chainId = await s.chain.openChain(data.chain.companyQuery, data.chain.name);
    await expect(s.chain.storeItemDl).toBeVisible();
  });
  await step('3. 店舗別作業項目DL → dialog CSV, no Excel / xlsx', async () => {
    const box = await s.chain.openStoreItemDl();
    await expect(box).toContainText(M.csvConfirm);
    await expect(box).not.toContainText('Excel');
    await expect(box).not.toContainText('xlsx');
  });
  await step('4. 閉じる → no file downloaded', async () => {
    let downloaded = false;
    const h = () => { downloaded = true; };
    page.on('download', h);
    await click(modalWithButton(page, '決定'), '閉じる');
    await page.waitForTimeout(1500); // khoảng chờ để bắt download ngoài ý muốn (không có tín hiệu nào khác)
    page.off('download', h);
    expect(downloaded).toBe(false);
  });
  let name = '';
  await step('5. 店舗別作業項目DL → 決定', async () => {
    const box = await s.chain.openStoreItemDl();
    name = await downloadName(() => click(box, '決定'));
  });
  await step("Expected: a '.csv' file is downloaded", () => expect(name).toMatch(/\.csv$/i));
});

for (const [i, t] of data.timers.entries()) {
  tc(t.tc, `#${3 + i} · 2174-0${i + 1} · タイマー形式 ${t.format}`, '99', async () => {
    test.skip(!st.chainId, 'Chưa có chainId (P007-TC-002)');
    await step('1. Open /admin/asset-column/<chain>/edit', () => s.column.open(st.chainId!));
    await step(`2. 追加 → 項目名 ${t.name}, タイマー → ${t.format}`, async () => {
      await s.column.startAdd();
      await s.column.fillName(t.name);
      await s.column.chooseTimer();
      await s.column.chooseFormat(t.format as '年月');
    });
    await step('3. 保存 (form) → row added', async () => {
      await click(s.column.form, '保存');
      await expect(s.column.form).toBeHidden();
      await expect(s.column.row(t.name)).toContainText('タイマー');
    });
    await step('3a. 保存 (page) → 決定 (→ OK)', async () => {
      // Đợi lưu + tải lại danh sách thực tế (R18): GET chưa về thì bảng còn trạng thái tạm (dòng mới vẫn sửa được タイマー形式)
      const api = (m: string) => (u: URL, method: string) => method === m && u.pathname.endsWith('/api/asset/column-management');
      const saved = waitApiPerf(page, api('POST'), '資産管理項目 POST column-management (保存)');
      const listed = waitApiPerf(page, api('GET'), '資産管理項目 GET column-management (tải lại sau 保存)');
      await s.column.saveAll();
      await confirmDecide(page);
      const ok = modalWithButton(page, 'OK');
      if (await ok.waitFor({ state: 'visible', timeout: 15_000 }).then(() => true).catch(() => false)) await acknowledgeOk(page);
      await saved;
      await listed;
      await expect(s.column.row(t.name)).toContainText('タイマー', { timeout: 15_000 });
      await expect(s.column.row(t.name)).toContainText(t.format);
    });
    if (i === 1) await step('4. Reload (F5) → row still shows the format', async () => {
      await s.column.reload();
      await expect(s.column.row(t.name)).toContainText(t.format, { timeout: 20_000 });
    });
    await step(`${i === 1 ? 5 : 4}. Open row ${t.name}`, () => s.column.openEdit(t.name));
    await step(`Expected: form タイマー形式 = '${t.format}' and read-only`, async () => {
      await expect.soft(s.column.formatRadio(t.format as '年月'), `form phải chọn ${t.format} (không về 年)`).toBeChecked();
      await expect(s.column.formatRadio(t.format as '年月'), 'タイマー形式 phải bị khoá').toBeDisabled();
    });
    await s.column.closeForm().catch(() => {});
  });
}

tc('P007-TC-006', '#6 · 1706-02 · Enter repeatedly in フィルタ名', '99', async () => {
  st.filter = `AT_Filter_${stamp}`;
  await step('1. Menu 作業依頼情報', () => s.layout.menu('作業依頼情報'));
  await step('2. 表示条件を保存 → フィルタ名', () => s.list.openSaveFilter());
  await step(`3. Input ${st.filter}`, () => s.list.saveFilterModal.locator('input[name="name"]').fill(st.filter!));
  await step('4. Press Enter 5 times', async () => {
    const f = s.list.saveFilterModal.locator('input[name="name"]');
    for (let k = 0; k < 5; k++) await f.press('Enter').catch(() => {}); // modal có thể đã đóng sau Enter đầu
    await expect(s.list.saveFilterModal).toBeHidden({ timeout: 15_000 });
  });
  await step(`Verify: dialog '${data.messages.filterSaved}' → OK`, () => acknowledgeOk(page, data.messages.filterSaved));
  await step(`Expected: header フィルタ lists '${st.filter}' once`, async () => {
    const names = await s.list.headerFilterNames();
    expect(names.filter((n) => n === st.filter)).toHaveLength(1);
  });
});

tc('P007-TC-007', '#7 · 1706-03 · Enter repeatedly in chat search', '99', async () => {
  await step('1. Menu チャット一覧', () => s.layout.menu('チャット一覧'));
  await step("2. Input 'LINKSYS' in 検索キー", async () => {
    await s.chats.expand();
    await s.chats.searchKey.fill('LINKSYS');
  });
  let requests = 0;
  await step('3. Press Enter 5 times', async () => {
    const h = (r: { url(): string; method(): string }) => { if (r.method() === 'GET' && /chat/i.test(r.url()) && /LINKSYS/i.test(decodeURIComponent(r.url()))) requests++; };
    page.on('request', h);
    for (let k = 0; k < 5; k++) await s.chats.searchKey.press('Enter');
    await page.waitForLoadState('networkidle').catch(() => {});
    page.off('request', h);
  });
  await step('Expected: ~1 search request, no error dialog', async () => {
    expect(requests, 'số request tìm kiếm').toBeLessThanOrEqual(1);
    await expect(page.locator('.modal.show').filter({ hasText: /エラー/ })).toHaveCount(0);
  });
});

tc('P007-TC-008', '#8 · 1388-01 · Subadmin detail shows 症状グループ', '99', async () => {
  await step('1. Menu サブアドミン情報', () => s.layout.menu('サブアドミン情報'));
  await step(`2. ログインID ${data.subadmin.loginId} → 検索 → row`, () => s.sub.searchLoginId(data.subadmin.loginId));
  await step('3. Open row → サブアドミン詳細', () => s.sub.openDetail(data.subadmin.loginId));
  await step("Expected: '症状グループID', '症状グループ名', '登録'; no 'チェーン店舗一覧' / '症状設定' in info", async () => {
    await expect(s.sub.content).toContainText('症状グループID');
    await expect(s.sub.content).toContainText('症状グループ名');
    await expect(s.sub.infoTable).not.toContainText('チェーン店舗一覧');
    await expect(s.sub.infoTable).not.toContainText('症状設定');
    await expect(s.sub.infoTable).toContainText('メール');
  });
});

tc('P007-TC-009', '#9 · 1388-02 · Add subadmin form has no 症状グループ', '99', async () => {
  await step('1. Menu サブアドミン情報', () => s.layout.menu('サブアドミン情報'));
  await step('2. 登録', () => click(s.sub.content, '登録'));
  await step("Expected: no '症状グループ' / 'チェーン店舗一覧'", async () => {
    await expect(s.sub.content.locator('input').first()).toBeVisible();
    await expect(s.sub.content).not.toContainText('症状グループ');
    await expect(s.sub.content).not.toContainText('チェーン店舗一覧');
  });
});

tc('P007-TC-010', '#10 · 1388-03 · Empty 症状グループ名 → error', '99', async () => {
  await step('1. Open subadmin detail', async () => { await s.layout.menu('サブアドミン情報'); await s.sub.openDetail(data.subadmin.loginId); });
  await step('2. 登録 → form', () => s.sub.startAddGroup());
  await step("3. 症状グループ名 empty, 説明 'automation'", () => s.sub.fillGroup('', data.subadmin.description));
  await step('4-5. 保存 → 決定', () => s.sub.saveGroup());
  await step(`Expected: '${M.groupNameRequired}', form stays`, async () => {
    await expect(s.sub.groupError).toHaveText(M.groupNameRequired);
    await expect(page).toHaveURL(/\/presets$/);
  });
  // Dọn (không thuộc TC): form nhập dở chặn menu của TC sau bằng hộp xác nhận 破棄.
  await step('Cleanup: rời form 症状グループ追加 (戻る → はい)', () => s.sub.discardGroupForm());
});

tc('P007-TC-011', '#11 · 1388-04 · Add 症状グループ AT_Group_<time>', '99', async () => {
  st.group = `AT_Group_${stamp}`;
  await step('1. Open subadmin detail', async () => { await s.layout.menu('サブアドミン情報'); await s.sub.openDetail(data.subadmin.loginId); });
  await step('2. 登録', () => s.sub.startAddGroup());
  await step(`3. 症状グループ名 ${st.group}, 説明 automation`, () => s.sub.fillGroup(st.group!, data.subadmin.description));
  await step('4. 保存 → 決定 → OK', async () => { await s.sub.saveGroup(); await s.sub.expectGroupSaved(st.group!); });
  await step("Expected: detail has name, '紐付け店舗一括登録', '症状一括登録'", async () => {
    await expect(s.sub.content).toContainText(st.group!);
    await expect(s.sub.content).toContainText('紐付け店舗一括登録');
    await expect(s.sub.content).toContainText('症状一括登録');
  });
});

tc('P007-TC-012', '#12 · 1388-05 · 表示件数 = 0', '99', async () => {
  await step('1. Open subadmin detail', async () => { await s.layout.menu('サブアドミン情報'); await s.sub.openDetail(data.subadmin.loginId); });
  const f = await step('2. Input 0 in 表示件数', async () => {
    const input = await s.sub.perPageInput();
    await input.fill('0');
    await input.blur();
    return input;
  });
  await step("Expected: 表示件数 changes to '1'", () => expect(f).toHaveValue('1'));
});

tc('P007-TC-013', '#13 · 1388-06 · Import store CSV (追加のみ)', '99', async () => {
  test.skip(!st.group || !st.chainId, 'Cần TC-002 (chainId) và TC-011 (AT_Group)');
  await step('Pre: lấy id STORE00001 (chain detail)', async () => {
    await page.goto(`/admin/chain-systems/${st.chainId}/stores`); await waitApisIdle(page, 'goto');
    st.storeId = await s.chain.storeId(data.store.name);
  });
  await step('1. AT_Group detail → 紐付け店舗一括登録 CSVアップロード → 追加のみ', async () => {
    await s.layout.menu('サブアドミン情報');
    await s.sub.openDetail(data.subadmin.loginId);
    await s.sub.content.locator('tbody tr', { hasText: st.group! }).first().locator('td').nth(2).click();
    await expect(page).toHaveURL(/\/presets\/\d+\/detail/);
    await s.sub.openImportStore();
    await expect(s.sub.addOnlyRadio).toBeChecked();
  });
  await step('2-3. store_ok.csv → アップロード', () =>
    s.sub.upload('store_ok.csv', `${STORE_CSV_HEADER}\n${st.storeId},${data.store.name},${st.chainId},${data.chain.name}\n`));
  await step(`Expected: success message, group lists '${data.chain.name}'`, async () => {
    await acknowledgeOk(page, M.importOk);
    await expect(page).toHaveURL(/\/presets\/\d+\/detail/);
    await expect(s.sub.content).toContainText(data.chain.name);
  });
});

tc('P007-TC-014', '#14 · 1388-07 · Import empty CSV → error', '99', async () => {
  test.skip(!st.group, 'Cần TC-011 (AT_Group)');
  await step('1. Open 紐付け店舗一括登録 of AT_Group', async () => {
    await s.layout.menu('サブアドミン情報');
    await s.sub.openDetail(data.subadmin.loginId);
    await s.sub.content.locator('tbody tr', { hasText: st.group! }).first().locator('td').nth(2).click();
    await s.sub.openImportStore();
  });
  await step('2-3. store_empty.csv (chỉ dòng tiêu đề) → アップロード', () => s.sub.upload('store_empty.csv', `${STORE_CSV_HEADER}\n`));
  await step(`Expected: '${M.importError}'`, async () => {
    const box = modalWithButton(page, 'OK');
    await expect(box).toContainText(M.importError, { timeout: 30_000 });
    await click(box, 'OK');
  });
});

tc('P007-TC-015', '#15 · 1388-08 · Admin sees 症状一覧DL', '99', async () => {
  await step('1. Menu チェーンシステム情報', () => s.layout.menu('チェーンシステム情報'));
  await step('2. 社名 Linksys → open chain', async () => { st.chainId = await s.chain.openChain(data.chain.companyQuery, data.chain.name); });
  await step("Expected: '症状一覧DL' shown and enabled", async () => {
    await expect(s.chain.symptomDl).toBeVisible();
    await expect(s.chain.symptomDl).toBeEnabled();
  });
});

// =====================================================================================
// T1 · tạo trouble + detail + 戻る + chat
// =====================================================================================
tc('P007-TC-016', '#16 · Create T1 (605-28)', '99', async () => {
  const c = s.create;
  await step('1-5. 作業依頼登録: 新規依頼 → ロックなし → STORE00001 → 担当者 → 作業項目', () =>
    createUntilCategories(data.store.query, data.store.name));
  await step('6. Tick 対象資産 → 修理対象資産選択 (次へ disabled before choosing)', async () => {
    await c.tickHasAsset();
    await expect(c.content.getByRole('button', { name: '次へ' }).or(c.content.locator('button', { hasText: /^\s*次へ\s*$/ })).first()).toBeDisabled();
    await c.openAssetSelect();
  });
  await step('7. 新しい機器を登録する → 605-28: AT_Timer_YM / YMD / YMDH on 資産登録', async () => {
    await c.assets.openRegister();
    for (const t of data.timers) await expect(c.assets.register).toContainText(t.name);
  });
  await step('8-9. 名称 / 型式 / 製造番号, 設置・納入日 → 現在, 保存 → 決定 → OK', async () => {
    await c.assets.fillField('名称', data.asset.name);
    await c.assets.fillField('型式', data.asset.model);
    await c.assets.fillField('製造番号', data.asset.serial);
    await c.assets.setNow('設置・納入日', 'ymd');
    await c.assets.save();
  });
  await step(`10. Select ${data.asset.name} (+ ${data.asset.existingName}) → 決定する`, async () => {
    expect(await c.assets.selectRows(data.asset.name, 1)).toBe(1);
    expect(await c.assets.selectRows(data.asset.existingName, 1)).toBe(1); // TC-036/037 cần 2 dòng tài sản
    await c.assets.decide();
    for (const h of ['資産名', '型式', '製造番号']) await expect(c.content).toContainText(h);
  });
  await step('11-12. 次へ, 故障詳細 AUTOMATION, ảnh 1 + 2', async () => {
    await c.next('故障詳細');
    await c.uploadFaultImage(0, data.fault.image);
    await c.uploadFaultImage(1, data.fault.image);
  });
  let created: T = {};
  await step('13-14. 明日以降 10:00–12:00, 決定して問合わせ → 決定 → OK', async () => {
    await c.fillFaultDetail(data.fault.text);
    await c.chooseExpectedDate(data.expectedDate.option, data.expectedDate.start, data.expectedDate.end);
    await c.clickSubmit();
    created = await c.confirmSubmit();
  });
  await step("Expected: T1 detail '問い合わせ中' / '受注待ち', '緊急フラグ 不緊急'", async () => {
    await record(T1, created);
    await s.detail.expectBadges('問い合わせ中', '受注待ち');
    await expect(s.detail.content).toContainText(/緊急フラグ\s*不緊急/);
    await minimizeChat(page);
  });
}, 480_000);

tc('P007-TC-017', '#17 · Trouble detail of T1 (605-34)', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open T1 → header / 作業項目', async () => {
    await openTrouble(T1);
    await d.expectInfo('店舗名', data.store.query);
    await d.expectInfo('依頼内容確認', '受付');
    await d.expectInfo('業者', '未確定');
    await d.expectInfo('訪問日時', '未確定');
    await d.expectInfo('見積書', '未提出');
    await d.expectInfo('報告書有無', '未提出');
    for (const v of Object.values(data.categories)) await expect(d.content).toContainText(v);
  });
  await step('2. 資産一覧 → asset row, no dropdown (605-34)', async () => {
    await d.headerButton('資産一覧');
    const box = modal(page);
    for (const v of [data.asset.name, data.asset.model, data.asset.serial, '対応区分']) await expect(box).toContainText(v);
    await expect(box.locator('select')).toHaveCount(0);
    await closeModal(box);
  });
  await step('3-4. 編集 → 変更 (作業項目（大）) → 保存 → OK', async () => {
    await d.headerButton('編集');
    await s.edit.expectOpened();
    await s.edit.setFirstAssetResponseType();
  });
  await step("Expected: saved without '修理対象資産を選択してください。', detail shown", async () => {
    await expect(page.getByText(M.assetRequired)).toHaveCount(0);
    await s.edit.back();
    await d.expectOpened(T1.id);
  });
});

tc('P007-TC-018', '#18 · 2132-01 · 戻る from detail returns to タスク管理', '99', async () => {
  await step('1. Menu タスク管理 → ≥1 task', async () => {
    await s.layout.menu('タスク管理');
    await expect(s.tasks.rows.first()).toBeVisible({ timeout: 20_000 });
  });
  await step('2. Open 依頼番号 → from=task, chatMode=firebase, chat not opened', async () => {
    await s.tasks.openRow(0);
    await expect(page).toHaveURL(/from=task/);
    await expect(page).toHaveURL(/chatMode=firebase/);
    await expect(s.detail.chatBox).toBeHidden();
  });
  await step('3. 戻る → /admin/tasks', async () => {
    await click(s.detail.content, '戻る');
    await expect(page).toHaveURL(/\/admin\/tasks/);
  });
  await step('4. Open again → 戻る', async () => {
    await s.tasks.openRow(0);
    await expect(page).toHaveURL(/from=task/);
    await click(s.detail.content, '戻る');
  });
  await step("Expected: '/admin/tasks' both times", () => expect(page).toHaveURL(/\/admin\/tasks/));
});

tc('P007-TC-019', '#19 · 2132-02 · Edit keeps from=task', '99', async () => {
  await step('1. タスク管理 → open task', async () => { await s.layout.menu('タスク管理'); await s.tasks.openRow(0); });
  await step('2. 編集 → URL keeps from=task', async () => {
    await s.detail.headerButton('編集');
    await expect(page).toHaveURL(/\/edit.*from=task/);
  });
  await step('3. 戻る → detail keeps from=task', async () => {
    await click(s.edit.content, '戻る');
    await expect(page).toHaveURL(/\/detail.*from=task/);
  });
  await step('4. 戻る', () => click(s.detail.content, '戻る'));
  await step('Expected: back to タスク管理', () => expect(page).toHaveURL(/\/admin\/tasks/));
});

tc('P007-TC-020', '#20 · 2132-03 · 戻る returns to 資産詳細 (also after 編集)', '99', async () => {
  let assetUrl = '';
  await step('1-2. 資産情報 → Linksys → TEST AUTOMATION → 資産詳細', async () => {
    await s.layout.menu('資産情報');
    await s.assetInfo.openChain(data.chain.companyQuery, data.chain.name);
    await s.assetInfo.openAsset(data.asset.existingName);
    assetUrl = new URL(page.url()).pathname;
  });
  await step('3. 依頼番号 → detail → 戻る → same 資産詳細', async () => {
    await s.assetInfo.historyLinks.first().click();
    await expect(page).toHaveURL(/assetId=/);
    await click(s.detail.content, '戻る');
    await expect(page).toHaveURL(new RegExp(assetUrl));
  });
  await step('4. 依頼番号 again (assetId kept) → 編集 → 戻る ×2', async () => {
    await s.assetInfo.historyLinks.first().click();
    await expect(page).toHaveURL(/assetId=/);
    await s.detail.headerButton('編集');
    await click(s.edit.content, '戻る');
    await expect(page).toHaveURL(/assetId=/);
    await click(s.detail.content, '戻る');
  });
  await step('Expected: back to 資産詳細 (not 作業依頼一覧)', () => expect(page).toHaveURL(new RegExp(assetUrl)));
});

tc('P007-TC-021', '#21 · 2132-04 · 戻る keeps tab 自動マッチング', '99', async () => {
  await step('1. Open 資産詳細 of TEST AUTOMATION', async () => {
    await s.layout.menu('資産情報');
    await s.assetInfo.openChain(data.chain.companyQuery, data.chain.name);
    await s.assetInfo.openAsset(data.asset.existingName);
  });
  await step('2. Tab 自動マッチング → 依頼番号', async () => {
    await s.assetInfo.tab('自動マッチング').click();
    await expect(s.assetInfo.historyLinks.first()).toBeVisible({ timeout: 15_000 });
    await s.assetInfo.historyLinks.first().click();
    await expect(page).toHaveURL(/\/detail/);
  });
  await step('3. 戻る', () => click(s.detail.content, '戻る'));
  await step("Expected: 資産詳細 with tab '自動マッチング' active", async () => {
    await expect(page).toHaveURL(/\/asset-management\/\d+\/detail/);
    await expect(s.assetInfo.tab('自動マッチング')).toHaveClass(/active/);
  });
});

tc('P007-TC-022', '#22 · 2132-05 · 戻る returns to チャット一覧 (すべて, 自分宛て)', '99', async () => {
  for (const tab of ['すべて', '自分宛て'] as const) {
    await step(`${tab}: open first chat (chatMode=firebase) → 戻る`, async () => {
      await s.layout.menu('チャット一覧');
      await s.chats.tab(tab);
      await s.chats.openFirst();
      await click(s.detail.content, '戻る');
      await expect(page).toHaveURL(/\/admin\/chats/);
    });
  }
  await step("Expected: back to 'チャット一覧' from both tabs", () => expect(page).toHaveURL(/\/admin\/chats/));
});

tc('P007-TC-023', '#23 · 2132-06 · 戻る from 作業依頼情報 and plain URL', '99', async () => {
  need(T1, 'T1');
  await step('1. 作業依頼情報 → T1 → 戻る → /admin/troubles', async () => {
    await s.layout.menu('作業依頼情報');
    await s.list.searchNumber(T1.number!);
    await s.list.openByNumber(T1);
    await click(s.detail.content, '戻る');
    await expect(page).toHaveURL(/\/admin\/troubles(\?|$)/);
  });
  await step('2. Open T1 by plain URL', () => openTrouble(T1));
  await step('Expected: chat panel opens automatically', () => expect(s.detail.chatBox).toBeVisible({ timeout: 15_000 }));
});

tc('P007-TC-024', '#24 · 2285-02 · 資産チェック ON with ≥1 asset can be saved', '99', async () => {
  need(T1, 'T1');
  await step('1. Open T1', () => openTrouble(T1));
  await step(`2. 編集 → 資産一覧 → ≥1 asset ('${data.asset.name}')`, async () => {
    await s.detail.headerButton('編集');
    await s.edit.expectOpened();
    await s.edit.expectAssetInList(data.asset.name);
  });
  await step('3. 変更 (作業項目（大）) → 保存 → OK', () => s.edit.setFirstAssetResponseType());
  await step(`Expected: saved without '${M.assetRequired}', detail shown`, async () => {
    await expect(page.getByText(M.assetRequired)).toHaveCount(0);
    await s.edit.back();
  });
});

tc('P007-TC-025', '#25 · 2164-01 · Send long chat message, minimize / reopen', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open T1', async () => { await openTrouble(T1); await d.openChat(); });
  await step('2. Input long text → input auto-expands', async () => {
    const h0 = await d.chatInput.evaluate((e) => (e as HTMLElement).offsetHeight);
    await d.chatInput.fill(data.chat.longText);
    await expect.poll(() => d.chatInput.evaluate((e) => (e as HTMLElement).offsetHeight)).toBeGreaterThan(h0);
  });
  await step('3. Send → input empty, message shown', async () => {
    await page.locator('.chat-popover button.cf-send').click();
    await expect(d.chatInput).toHaveValue('');
    await expect(d.chatMessages).toContainText('AUTOMATION LONG TEXT', { timeout: 15_000 });
  });
  await step('4. Minimize (−) → only floating icon', async () => {
    await d.minimizeChatByIcon();
    await expect(page.locator('.chat-popover .popover-trigger')).toBeVisible();
  });
  await step('5. Click chat icon', () => d.openChat());
  await step("Expected: chat still shows 'AUTOMATION LONG TEXT'", () => expect(d.chatMessages).toContainText('AUTOMATION LONG TEXT'));
  await minimizeChat(page);
});

// =====================================================================================
// T1 · 状態 / 見積 / 報告書
// =====================================================================================
tc('P007-TC-026', '#27 · 対応中 + assign LINKSYS WORKER (2057-02)', '99', async () => {
  need(T1, 'T1');
  await step('1. Open T1', async () => { await openTrouble(T1); await minimizeChat(page); });
  await step('2-5. 対応中, 作業者 linksysworker (制限状態 trống, no 立候補制限中です) → 保存', async () => {
    const d = s.detail;
    await d.openQuickAction();
    await d.expectStatus('問い合わせ中');
    await d.setStatus('対応中');
    await d.expectFlow('受注待ち');
    await d.editRow('作業者');
    await d.expandSearch();
    await d.searchWorker(data.worker.companyQuery);
    for (const h of ['ログインID', '社名', '制限状態']) await expect(d.searchModal).toContainText(h);
    await expect(page.getByText('立候補制限中です')).toHaveCount(0);
    await d.pickWorker(data.worker.loginId);
    await expect(d.statusModal).toContainText(data.worker.companyName);
    await d.saveStatus();
  });
  await step("Expected: '対応中' / '受注待ち', 業者 'LINKSYS WORKER', 訪問日時 '未確定', 見積書 '未提出'", async () => {
    await s.detail.expectBadges('対応中', '受注待ち');
    await s.detail.expectInfo('業者', data.worker.companyName);
    await s.detail.expectInfo('訪問日時', '未確定');
    await s.detail.expectInfo('見積書', '未提出');
  });
});

tc('P007-TC-027', '#28 · 受注 → 移動中 → 到着', '99', async () => {
  need(T1, 'T1');
  await step('Open T1', () => openTrouble(T1));
  await step('1-3. 受注 → 移動中 → 到着', () => moveFlow('受注', '移動中', '到着'));
  await step("Expected: '対応中' / '到着'", () => s.detail.expectBadges('対応中', '到着'));
});

tc('P007-TC-028', '#29 · 1706-01 · Enter repeatedly in 見積名 → 1 estimate', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1-2. Open T1, 見積承認待ち → 見積もり 必須 → 登録', async () => {
    await openTrouble(T1);
    await d.openQuickAction();
    await d.setFlow('見積承認待ち');
    await expect(valueOf(d.statusModal, '見積もり').locator('xpath=..')).toContainText('必須');
    await d.openEstimateFromStatus();
    await d.startNewEstimate();
  });
  await step(`3. 見積名 ${E.enterName}, Enter ×5`, async () => {
    await d.fillEstimateName(E.enterName);
    await d.pressEnterInEstimateName(5);
  });
  await step('4. 決定 on form', async () => {
    // Enter thường đã gửi form (nút 決定 disabled khi đang gửi rồi form đóng) → chờ form tự đóng; còn mở sau 5s mới bấm 決定.
    const closed = await expect(d.estimateForm).toBeHidden({ timeout: 5_000 }).then(() => true, () => false);
    if (!closed) await click(d.estimateForm, '決定');
    await expect(d.estimateForm).toBeHidden({ timeout: 15_000 });
  });
  await step(`Expected: only 1 '${E.enterName}' (下書き)`, async () => {
    await expect(d.estimateRows(E.enterName)).toHaveCount(1, { timeout: 15_000 });
    await d.expectEstimateStatus(E.enterName, '下書き');
    await d.closeEstimateModal();
    await d.closeStatus();
  });
});

for (const [n, k] of [[29, 'part'], [30, 'fee']] as const) {
  const e = E[k];
  const type = k === 'part' ? '部材' : '諸経費';
  tc(`P007-TC-0${n}`, `#${n + 1} · 1771-0${n - 28} · Add ${type} item`, '99', async () => {
    need(T1, 'T1');
    const d = s.detail;
    await step('1. Open T1, 見積承認待ち → 見積もり → 登録 (見積書宛名 = Linksys Chain System)', async () => {
      await openTrouble(T1);
      await openEstimates('見積承認待ち');
      await d.startNewEstimate();
      await expect(d.estimateForm.locator('input[name="companyName"]')).toHaveValue(data.chain.name);
    });
    await step(`2. ${e.name}: 追加 → ${type}, ${e.item}, ${e.price}`, async () => {
      await d.fillEstimateName(e.name);
      await d.openAddItem();
      await d.chooseItemType(type);
      await d.fillItemName(e.item);
      await d.fillUnitPrice(e.price, Number(e.price).toLocaleString('en-US'));
      await d.decideItem(e.item);
      await expect(d.itemRow(e.item)).toContainText(e.shown);
    });
    await step('3. 決定 → 閉じる', async () => {
      await d.decideEstimate(e.name);
    });
    await step(`Expected: '${e.name}' saved with '下書き'`, async () => {
      await d.expectEstimateStatus(e.name, '下書き');
      await d.closeEstimateModal();
      await d.closeStatus();
    });
  });
}

tc('P007-TC-031', '#32 · 1771-03 · Typing 作業 then picking 作業項目選択 adds only 1 row', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  const e = E.select;
  await step(`1. Open T1 → 見積もり → 登録, ${e.name}, 追加 → list has ${e.item}`, async () => {
    await openTrouble(T1);
    await openEstimates('見積承認待ち');
    await d.startNewEstimate();
    await d.fillEstimateName(e.name);
    await d.openAddItem();
    await expect(d.selectListItem(e.item)).toBeVisible();
  });
  await step(`2. 作業: ${e.typed}, ${e.price}`, async () => {
    await d.chooseItemType('作業');
    await d.fillItemName(e.typed);
    await d.fillUnitPrice(e.price, '99,999');
  });
  await step(`3. Click ${e.item} → dialog closes`, async () => {
    await d.selectListItem(e.item).click();
    await expect(d.itemModal).toBeHidden();
  });
  await step(`Expected: only '${e.item}' added (no '${e.typed}')`, async () => {
    const labels = await d.estimateForm.locator('textarea[name$=".label"]').evaluateAll((ts) => ts.map((t) => (t as HTMLTextAreaElement).value));
    const tdText = await d.estimateItemsBody.innerText();
    expect.soft(labels.includes(e.typed) || tdText.includes(e.typed), `BUG 1771-03: có dòng '${e.typed}'`).toBe(false);
    expect(tdText).toContain(e.item);
  });
  await step('4. キャンセル, 閉じる', async () => {
    await click(d.estimateForm, 'キャンセル');
    await d.closeEstimateModal().catch(() => {});
    await d.closeStatus().catch(() => {});
  });
});

tc('P007-TC-032', '#33 · Create 見積 Test (Autotest 99,999) and 提示', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  const e = E.main;
  await step('1. Open T1 → 見積承認待ち → 見積もり', async () => { await openTrouble(T1); await openEstimates('見積承認待ち'); });
  await step(`2-3. ${e.name}: 作業 ${e.item} ${e.price} → 決定 → 下書き`, () =>
    newEstimate(e.name, { type: '作業', label: e.item, price: e.price, shown: e.shown }));
  await step(`4. 提示する → 承認待ち, ${e.total} / ${e.totalTax}`, async () => {
    await d.submitEstimate(e.name);
    await expect(d.estimateRow(e.name)).toContainText(e.total);
    await expect(d.estimateRow(e.name)).toContainText(e.totalTax);
  });
  await step('5. 閉じる, 保存 (見積承認待ち), reload, header 見積もり', async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
    await page.reload(); await waitApisIdle(page, 'F5');
    await d.expectOpened(T1.id);
  });
  await step("Expected: '対応中' / '見積承認待ち', row Test = '承認待ち'", async () => {
    await d.expectBadges('対応中', '見積承認待ち');
    await d.headerButton('見積もり');
    const box = modal(page, '見積もり管理');
    await expect(box).toContainText(e.name);
    await expect(estimationRow(box, e.name)).toContainText('承認待ち');
    await click(box, '閉じる');
  });
});

tc('P007-TC-033', '#34 · 取り下げ申請 → 取り下げ承認 → 提示 → 承認する', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  const e = E.main;
  await step('1. Open T1 → クイック操作 → 見積もり', async () => { await openTrouble(T1); await openEstimates(); });
  await step('2. Expand Test → buttons', async () => {
    await d.openEstimateMenu(e.name);
    for (const b of ['差し戻し', '承認する']) await expect(d.estimateAction('manager', b)).toBeVisible();
    for (const b of ['取り下げ申請', 'コピー']) await expect(d.estimateAction('worker', b)).toBeVisible();
  });
  await step('3. 取り下げ申請 → Request cancel → 申請を送信 → 決定 → 取り下げ申請中', async () => {
    await d.estimateAction('worker', '取り下げ申請').click();
    const req = modal(page, '申請を送信');
    await req.locator('textarea[name="reason"]').fill(e.cancelReason);
    await click(req, '申請を送信');
    await d.decide(e.cancelReason);
    await d.expectEstimateStatus(e.name, '取り下げ申請中');
  });
  await step('4. 取り下げ承認 → 決定 → 下書き', async () => {
    await d.openEstimateMenu(e.name);
    await d.estimateAction('manager', '取り下げ承認').click();
    await d.decide('承認状態を保存します');
    await d.expectEstimateStatus(e.name, '下書き');
  });
  await step('5. 提示する → 承認待ち', () => d.submitEstimate(e.name));
  await step('6. 承認する → 決定 → 承認済み', async () => {
    await d.openEstimateMenu(e.name);
    await d.estimateAction('manager', '承認する').click();
    await d.decide(/この見積を承認しますか/);
    await d.expectEstimateStatus(e.name, '承認済み');
    await expect(d.estimateModal.locator('.group-manager')).toContainText(M.approvedCard);
  });
  await step('7. 閉じる, reload, minimize chat', async () => {
    await d.closeEstimateModal();
    await d.closeStatus();
    await page.reload(); await waitApisIdle(page, 'F5');
    await d.expectOpened(T1.id);
    await minimizeChat(page);
  });
  await step("Expected: '対応中' / '作業中'", () => d.expectBadges('対応中', '作業中'));
});

for (const [n, target, msg] of [[34, '見積承認待ち', M.blockNewEstimateWait], [35, '見積拒否', M.blockNewReject]] as const) {
  tc(`P007-TC-0${n}`, `#${n + 1} · 2267-0${n - 33} · 作業中 → ${target} blocked (新規)`, '99', async () => {
    need(T1, 'T1');
    const d = s.detail;
    await step('1. Open T1 → クイック操作 (作業中)', async () => { await openTrouble(T1); await d.openQuickAction(); await d.expectFlow('作業中'); });
    await step(`2. ${target} → 保存 → no confirm`, async () => {
      await d.setFlow(target);
      await d.clickSaveStatus();
      await d.expectNoConfirm();
    });
    await step(`Expected: '${msg}', badge stays 作業中`, async () => {
      await expect(page.getByText(msg).first()).toBeVisible();
      await click(d.statusModal, 'キャンセル');
      await d.expectBadges('対応中', '作業中');
    });
  });
}

tc('P007-TC-036', '#37 · 605-07 · Each asset has its own 対応 dropdown', '99', async () => {
  need(T1, 'T1');
  await step('1. Open T1 → 報告済 → 報告書 → 編集', async () => { await openTrouble(T1); await openReportForm(); });
  await step('2. Check fields + asset table', async () => {
    for (const f of ['開始', '終了', '原因と発生起因', '作業前の写真', '作業後の写真', 'PDFファイル', '修理対象資産選択']) await expect(s.detail.reportModal).toContainText(f);
  });
  await step('Expected: each asset row has its own dropdown', async () => {
    const rows = s.detail.assetRows;
    const n = await rows.count();
    expect(n).toBeGreaterThanOrEqual(1);
    for (let i = 0; i < n; i++) await expect(rows.nth(i).locator('select[name^="types."]')).toHaveCount(1);
    // Mỗi dòng 1 select; số name (types.<assetId>) khác nhau = số dòng.
    const names = new Set(await s.detail.assetTypeSelects.evaluateAll((ss) => ss.map((e) => (e as HTMLSelectElement).name)));
    expect(names.size).toBe(n);
  });
  await step('3. キャンセル', () => cancelReportForm());
});

tc('P007-TC-037', '#38 · 605-08 · Changing row A does not affect row B', '99', async () => {
  need(T1, 'T1');
  const sel = (i: number) => s.detail.assetTypeSelect(i);
  await step('1. Open 報告書 form; note row 2 (b0)', async () => { await openTrouble(T1); await openReportForm(); });
  const b0 = await sel(1).inputValue();
  await step('2. Row 1: 修理 → 入れ替え → 清掃', async () => {
    for (const v of ['修理', '入れ替え', '清掃']) await sel(0).selectOption({ label: v });
  });
  await step('Expected: row 1 = 清掃, row 2 = b0', async () => {
    await expect(sel(0).locator('option:checked')).toHaveText('清掃');
    await expect(sel(1)).toHaveValue(b0);
  });
  await step('3. キャンセル', () => cancelReportForm());
});

tc('P007-TC-038', '#39 · 1846-01 · Upload 1 PDF, preview, delete', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open 報告書 form', async () => { await openTrouble(T1); await openReportForm(); });
  await step(`2. ${data.report.pdf} → 完了 → card with ×`, async () => {
    const box = await d.choosePdf([data.report.pdf]);
    await expect(box).toContainText(data.report.pdf);
    await d.confirmPdf(box);
    await expect(d.pdfCard(data.report.pdf)).toBeVisible();
  });
  await step('3. Click card → preview (canvas) → close', async () => {
    const pv = await d.openPdfPreview(data.report.pdf);
    await closeModal(pv);
  });
  await step('4. × on card', async () => {
    await d.removePdf(data.report.pdf);
  });
  await step(`Expected: '${data.report.pdf}' removed`, () => expect(d.pdfCard(data.report.pdf)).toHaveCount(0));
  await step('5. キャンセル', () => cancelReportForm());
});

tc('P007-TC-039', '#40 · 1846-02 · Upload 6 PDF → only 5 accepted', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open 報告書 form', async () => { await openTrouble(T1); await openReportForm(); });
  const box = await step('2. Choose pdf1–pdf6 at once', () => d.choosePdf(data.report.pdfs));
  await step(`Expected: '${M.pdfLimit}', '5 / 5', no pdf6.pdf`, async () => {
    await expect(page.getByText(M.pdfLimit).first()).toBeVisible();
    await expect(box).toContainText(/5\s*\/\s*5/);
    await expect(box).not.toContainText('pdf6.pdf');
  });
  await step('3. キャンセル ×2', async () => { await d.cancelBox(box); await cancelReportForm(); });
});

tc('P007-TC-040', '#41 · 1846-03 · Non-PDF file → error', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open 報告書 form', async () => { await openTrouble(T1); await openReportForm(); });
  await step(`2. Choose ${data.report.notPdf}`, () => d.choosePdf([data.report.notPdf]));
  await step(`Expected: '${M.pdfType}', no card`, async () => {
    await expect(page.getByText(M.pdfType).first()).toBeVisible();
    await expect(d.pdfCard(data.report.notPdf)).toHaveCount(0);
  });
  await step('3. キャンセル ×2', async () => {
    const box = page.locator('.modal.show').filter({ hasText: /\d+\s*\/\s*5/ }).filter({ hasNotText: '施工業者' }).last();
    await d.cancelBox(box);
    await cancelReportForm();
  });
});

tc('P007-TC-041', '#42 · 作業完了', '99', async () => {
  need(T1, 'T1');
  await step('Open T1', () => openTrouble(T1));
  await step('1-2. 作業完了 → 保存 → 決定 → OK', () => moveFlow('作業完了'));
  await step("Expected: '対応中' / '作業完了'", () => s.detail.expectBadges('対応中', '作業完了'));
});

tc('P007-TC-042', '#43 · 報告済 + 報告書 (1846-04, 605-09)', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  const [Y, Mo] = (() => { const t = new Date(); return [t.getFullYear(), String(t.getMonth() + 1).padStart(2, '0')]; })();
  await step('1. Open T1 → 報告済 → 報告書 → 編集', async () => { await openTrouble(T1); await openReportForm(); });
  await step('2. 開始 day 1, 終了 day 2', async () => {
    await d.pickDay('start', 1);
    await d.pickDay('end', 2);
    await expect(d.reportModal.locator('input[name="start"]')).toHaveValue(`${Y}/${Mo}/01 00:00`);
    await expect(d.reportModal.locator('input[name="end"]')).toHaveValue(`${Y}/${Mo}/02 00:00`);
  });
  await step('3. 原因と発生起因 automation, 状態 提出済', async () => {
    await d.reportModal.locator('textarea[name="reason"]').fill(data.report.cause);
    await d.setReportStatus('提出済');
  });
  await step('4. Upload 作業前 / 作業後 / PDF', async () => {
    await d.uploadReportPhoto('作業前の写真', data.report.beforeImage);
    await d.uploadReportPhoto('作業後の写真', data.report.afterImage);
    const box = await d.choosePdf([data.report.pdf]);
    await d.confirmPdf(box);
    await expect(d.pdfCard(data.report.pdf)).toBeVisible();
  });
  await step("5. Keep 対応区分 '---' (605-09)", async () => {
    const n = await d.assetRows.count();
    for (let k = 0; k < n; k++) await d.assetTypeSelect(k).selectOption({ index: 0 });
  });
  await step('6. 完了 → back to 状態変更', async () => {
    await click(d.reportModal, '完了');
    await expect(d.statusModal).toBeVisible();
  });
  await step('7. 保存 → 決定 → OK', () => d.saveStatus());
  await step("Expected: '対応中' / '報告済', 報告書有無 'あり'", async () => {
    await d.expectBadges('対応中', '報告済');
    await d.expectInfo('報告書有無', 'あり');
  });
});

tc('P007-TC-043', '#44 · Admin views 報告書 (136-01, 605-10, 1846-04)', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open T1 → 報告書', async () => {
    await openTrouble(T1);
    await d.headerButton('報告書');
    const r = d.reportModal;
    await expect(r).toBeVisible();
    for (const [k, v] of [['店舗名', data.store.name], ['施工業者', data.worker.companyName], ['施工担当者', data.worker.staffName], ['原因と発生起因', data.report.cause]] as const) await d.expectInfo(k, v).catch(async () => expect(valueOf(r, k)).toContainText(v));
    for (const v of [data.report.pdf, '提出済', '対応区分', '資産名', 'メーカー名', '型式', '製造番号']) await expect(r).toContainText(v);
    await expect(valueOf(r, '作業前の写真').locator('img').first()).toBeVisible();
    await expect(valueOf(r, '作業後の写真').locator('img').first()).toBeVisible();
  });
  let x1 = ''; let x2 = '';
  await step('2. Excelダウンロード', async () => { x1 = await d.downloadFrom('Excelダウンロード'); });
  await step('3. PDFダウンロード', async () => { expect(await d.downloadFrom('PDFダウンロード')).toMatch(/\.pdf$/i); });
  await step('4. Excelダウンロード again', async () => { x2 = await d.downloadFrom('Excelダウンロード'); });
  await step('Expected: 2nd Excel name differs from 1st, .xlsx', async () => {
    expect(x1).toMatch(/\.xlsx$/i);
    expect(x2).not.toBe(x1);
    await click(d.reportModal, '閉じる');
  });
});

tc('P007-TC-044', '#45 · 136-02 · Download 報告書 from 状態変更', '99', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step('1. Open T1 → クイック操作 (報告済)', async () => { await openTrouble(T1); await d.openQuickAction(); await d.expectFlow('報告済'); });
  await step('2. Edit icon 報告書', async () => { await d.editRow('報告書'); await expect(d.reportModal).toBeVisible(); });
  let xl = ''; let pdf = '';
  await step('3. Excelダウンロード, PDFダウンロード', async () => {
    xl = await d.downloadFrom('Excelダウンロード');
    pdf = await d.downloadFrom('PDFダウンロード');
  });
  await step("Expected: '.xlsx' and '.pdf' downloaded", async () => {
    expect(xl).toMatch(/\.xlsx$/i);
    expect(pdf).toMatch(/\.pdf$/i);
    // Hộp 報告書 mở từ 状態変更 không có nút '閉じる' ở cuối (khác hộp mở từ header) → đóng bằng × (R08).
    await closeModal(d.reportModal);
    await d.closeStatus().catch(() => {});
  });
});

tc('P007-TC-045', '#46 · 136-03 · Download 報告書 from 作業依頼情報 list', '99', async () => {
  need(T1, 'T1');
  await step('1-2. 作業依頼情報 → 表示設定 → 報告書PDF / 報告書Excel → 設定', async () => {
    await s.layout.menu('作業依頼情報');
    await s.list.enableReportColumns();
  });
  await step('3. Search by 依頼番号', () => s.list.searchNumber(T1.number!));
  let pdf = ''; let xl = '';
  await step('4. 報告書PDF / 報告書Excel on row T1', async () => {
    const pdfCell = await s.list.cellOf(T1.number!, '報告書PDF');
    pdf = await downloadName(() => pdfCell.locator('a, button').first().click());
    const xlCell = await s.list.cellOf(T1.number!, '報告書Excel');
    xl = await downloadName(() => xlCell.locator('a, button').first().click());
  });
  await step("Expected: '.pdf' and '.xlsx' downloaded from row T1", () => {
    expect(pdf).toMatch(/\.pdf$/i);
    expect(xl).toMatch(/\.xlsx$/i);
  });
});

// =====================================================================================
// T2 · fix_amount (1765) · 2267-03
// =====================================================================================
tc('P007-TC-046', '#47 · SETUP-T2 · Create T2 and move to 到着', '99', async () => {
  await step('1. Create T2 (STORE00001, no asset)', async () => {
    await createUntilCategories(data.store.query, data.store.name);
    const created = await finishCreate(data.fault.text);
    await record(T2, created);
    await s.detail.expectBadges('問い合わせ中', '受注待ち');
    await expect(s.detail.content).toContainText(/緊急フラグ\s*不緊急/);
    await minimizeChat(page);
  });
  await step('2. 対応中 + linksysworker', () => assignWorker());
  await step('3. 受注 → 移動中 → 到着', () => moveFlow('受注', '移動中', '到着'));
  await step("Expected: T2 '対応中' / '到着'", () => s.detail.expectBadges('対応中', '到着'));
}, 480_000);

tc('P007-TC-047', '#48 · 1765-02 · Estimate < fix_amount → auto approved, 作業中', '99', async () => {
  need(T2, 'T2');
  const d = s.detail;
  const e = E.auto;
  await step('1. Open T2 → 見積承認待ち → 見積もり', async () => { await openTrouble(T2); await openEstimates('見積承認待ち'); });
  await step(`2-4. ${e.name}: 作業 ${e.item} ${e.price}, xoá dòng mặc định → 決定 → 下書き, ${e.total}`, async () => {
    await newEstimate(e.name, { type: '作業', label: e.item, price: e.price }, { deleteDefault: true });
    await expect(d.estimateRow(e.name)).toContainText(e.total);
  });
  await step('5. 提示する → 承認済み', () => d.submitEstimateExpect(e.name, '承認済み'));
  await step('6. 閉じる → 保存 → 決定 → OK', async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
  });
  await step(`Expected: 作業中 automatically, badge '対応中' / '作業中', 見積書 '${e.header}'`, async () => {
    await d.expectBadges('対応中', '作業中');
    await d.expectInfo('見積書', e.header);
    await d.openQuickAction();
    await d.expectFlow('作業中');
    await d.closeStatus();
  });
});

tc('P007-TC-048', '#49 · 1765-02b · fix_amount boundary on 店舗向け 税込', '99', async () => {
  need(T2, 'T2');
  const d = s.detail;
  const over = E.edgeOver; const under = E.edgeUnder;
  await step('Open T2 → 見積もり', async () => { await openTrouble(T2); await openEstimates(); });
  await step(`1. ${over.name}: 店舗向け 単価 ${over.storePrice} → 提示 → 承認待ち, ${over.totalTax}`, async () => {
    await newEstimate(over.name, { type: '作業', label: E.auto.item, price: E.auto.price }, { deleteDefault: true, storePrice: over.storePrice });
    await d.submitEstimate(over.name);
    await expect(d.estimateRow(over.name)).toContainText(over.totalTax);
  });
  await step(`2. ${under.name}: 店舗向け 単価 ${under.storePrice} → 提示 → 承認済み, ${under.totalTax}`, async () => {
    await newEstimate(under.name, { type: '作業', label: E.auto.item, price: E.auto.price }, { deleteDefault: true, storePrice: under.storePrice });
    await d.submitEstimateExpect(under.name, '承認済み');
    await expect(d.estimateRow(under.name)).toContainText(under.totalTax);
  });
  await step(`Expected: '${over.name}' becomes '失効'`, () => d.expectEstimateStatus(over.name, '失効'));
  await step('4. 閉じる', async () => { await d.closeEstimateModal(); await d.closeStatus(); });
});

tc('P007-TC-049', '#50 · 2267-03 · 作業中 → 到着 allowed (新規)', '99', async () => {
  need(T2, 'T2');
  await step('1. Open T2 → クイック操作 (作業中)', async () => { await openTrouble(T2); await s.detail.openQuickAction(); await s.detail.expectFlow('作業中'); await s.detail.closeStatus(); });
  await step('2. 到着 → 保存 → 決定 → OK', () => moveFlow('到着'));
  await step("Expected: '対応中' / '到着'", () => s.detail.expectBadges('対応中', '到着'));
});

// =====================================================================================
// T3 · 緊急 · 2285-01
// =====================================================================================
tc('P007-TC-050', '#51 · SETUP-T3 · Create urgent T3 (至急)', '99', async () => {
  const c = s.create;
  await step('1. 作業依頼登録 STORE00001 → 作業項目', () => createUntilCategories(data.store.query, data.store.name));
  await step(`2. 対象資産 → ${data.asset.existingName} → 決定する`, async () => {
    await c.tickHasAsset();
    await c.openAssetSelect();
    expect(await c.assets.selectRows(data.asset.existingName, 1)).toBe(1);
    await c.assets.decide();
  });
  await step("3-5. 次へ, 至急 (giờ làm việc) → 決定して問合わせ → 決定 → OK", async () => {
    await c.next('故障詳細');
    await expect(c.content.locator('button', { hasText: /^\s*至急\s*$/ }).first(), '至急 bị khoá: chạy trong giờ làm việc (P7)').toBeEnabled();
    const created = await finishCreateAfterNext(data.fault.text, true);
    await record(T3, created);
  });
  await step("Expected: '問い合わせ中' / '受注待ち', '緊急フラグ 緊急'", async () => {
    await s.detail.expectBadges('問い合わせ中', '受注待ち');
    await expect(s.detail.content).toContainText(/緊急フラグ\s*緊急/);
    await minimizeChat(page);
  });
}, 480_000);

/** Như finishCreate nhưng đã ở bước 故障詳細. */
async function finishCreateAfterNext(text: string, urgent: boolean): Promise<T> {
  const c = s.create;
  await c.fillFaultDetail(text);
  if (urgent) await click(c.content, '至急');
  else await c.chooseExpectedDate(data.expectedDate.option, data.expectedDate.start, data.expectedDate.end);
  await c.clickSubmit();
  return c.confirmSubmit();
}

tc('P007-TC-051', '#52 · 2285-01 · 資産チェック ON with 0 asset → error text', '99', async () => {
  need(T3, 'T3');
  await step('1. Open T3 → 編集', async () => { await openTrouble(T3); await s.detail.headerButton('編集'); await s.edit.expectOpened(); });
  // Admin: hàng '資産' chỉ có '資産一覧' → xoá tài sản trong modal 店舗・担当者編集 ('変更' của 作業項目（大）) — Q11, dò thật dev 2026-10-13.
  let box!: Awaited<ReturnType<typeof s.edit.openItemEditModal>>;
  const assetCheck = () => s.edit.itemEditAssetCheck(box);
  await step("2. 変更 (作業項目（大）) → 削除 all assets, keep checkbox ticked", async () => {
    box = await s.edit.openItemEditModal();
    await expect(assetCheck()).toBeChecked();
    await s.edit.removeAllItemEditAssets(box);
    await expect(assetCheck()).toBeChecked();
  });
  await step('3. 保存', () => click(box, '保存'));
  await step(`Expected: '${M.assetRequired}' once, no '${M.assetOld}', checkbox stays ticked`, async () => {
    await expect(page.getByText(M.assetRequired)).toHaveCount(1, { timeout: 15_000 });
    await expect(page.getByText(M.assetOld)).toHaveCount(0);
    await expect(assetCheck()).toBeChecked();
    await click(box, 'キャンセル'); // không lưu: T3 giữ nguyên tài sản
  });
});

// =====================================================================================
// T5 · STORE00004 RINGI · 1786 / 1765-01
// =====================================================================================
tc('P007-TC-052', '#53 · SETUP-T5 · T5 (STORE00004 RINGI) Urgent → 到着', '99', async () => {
  await step('1. Create T5 (STORE00004 RINGI)', async () => {
    await createUntilCategories(data.store.ringiQuery, data.store.ringiName);
    const created = await finishCreate(data.fault.ringiText);
    await record(T5, created);
    await expect(s.detail.content).toContainText(/緊急フラグ\s*不緊急/);
    await minimizeChat(page);
  });
  await step('2. 編集 → 案件区分 営業停止案件 → 保存 → 決定', async () => {
    await s.detail.headerButton('編集');
    await s.edit.expectOpened();
    await s.edit.setCaseType('営業停止案件');
    await s.edit.save();
    await openTrouble(T5);
    await s.detail.expectInfo('案件区分', '営業停止案件');
  });
  await step('3. 対応中 + worker → 受注 → 移動中 → 到着', async () => { await assignWorker(); await moveFlow('受注', '移動中', '到着'); });
  await step("Expected: T5 '対応中' / '到着', 案件区分 '営業停止案件'", async () => {
    await s.detail.expectBadges('対応中', '到着');
    await s.detail.expectInfo('案件区分', '営業停止案件');
  });
}, 480_000);

tc('P007-TC-053', '#54 · 1786-01 (+1765-01) · Urgent 稟議: approve all steps → auto selected, task 完了', '99', async () => {
  need(T5, 'T5');
  const d = s.detail;
  const name = E.ringi2;
  await step('1-2. Open T5 → 見積もり → RingiTest2 (Autotest 99,999) → 提示 → 承認待ち', async () => {
    await openTrouble(T5);
    await s.detail.expectInfo('案件区分', '営業停止案件');
    await openEstimates();
    await newEstimate(name, { type: '作業', label: E.main.item, price: E.main.price });
    await d.submitEstimate(name);
  });
  await step("3. 閉じる → 作業中 → 保存 → 見積もり '任意', '対応中' / '作業中'", async () => {
    await d.closeEstimateModal();
    await d.setFlow('作業中');
    await expect(valueOf(d.statusModal, '見積もり').locator('xpath=..')).toContainText('任意');
    await d.saveStatus();
    await d.expectBadges('対応中', '作業中');
  });
  await step('4. 承認する lặp tới 承認済み (≤5 bước 稟議)', async () => {
    for (let k = 0; k < 5; k++) {
      await page.reload(); await waitApisIdle(page, 'F5');
      await d.expectOpened(T5.id);
      await openEstimates();
      const status = (await d.estimateRow(name).locator('.badge').innerText()).trim();
      if (status === '承認済み') { await d.closeEstimateModal(); await d.closeStatus(); break; }
      await d.openEstimateMenu(name);
      await d.estimateAction('manager', '承認する').click();
      await d.decide(/承認/);
      // 稟議 nhiều bước: badge giữ '稟議承認中' giữa các bước (nút 承認する hiện lại cho bước sau) → không kiểm badge đổi;
      // chờ API xong, vòng sau reload + kiểm. Bước 5 kiểm '承認済み' (dev 2026-10-13).
      await waitApisIdle(page, `稟議 承認 lần ${k + 1}`);
      await d.closeEstimateModal();
      await d.closeStatus();
    }
  });
  await step("5. 見積もり selected = RingiTest2, 対応中の状態 '作業中' (1765-01)", async () => {
    await page.reload(); await waitApisIdle(page, 'F5');
    await d.openQuickAction();
    await d.openEstimateFromStatus();
    await d.expectEstimateStatus(name, '承認済み');
    await d.closeEstimateModal();
    await expect(valueOf(d.statusModal, '見積もり')).toContainText(`見積名 : ${name}`);
    await d.expectFlow('作業中');
    await d.saveStatus();
    await d.expectBadges('対応中', '作業中');
  });
  await step('6. タスク管理 → 依頼番号 T5 (全て)', async () => {
    await s.layout.menu('タスク管理');
    await s.tasks.search({ number: T5.number, status: '', scope: '' }); // TC rev 6: 状態 '全て', タスク範囲 '全て'
  });
  await step("Expected: every '見積承認依頼' task of T5 is '完了'", async () => {
    const n = await s.tasks.rows.count();
    expect(n).toBeGreaterThanOrEqual(1);
    for (let k = 0; k < n; k++) await expect(s.tasks.status(s.tasks.rows.nth(k))).toHaveText('完了');
  });
}, 480_000);

tc('P007-TC-054', '#55 · 1786-02 · Second estimate not selected → task stays open after 作業完了', '99', async () => {
  need(T5, 'T5');
  const d = s.detail;
  const name = E.ringi3;
  await step('1. RingiTest3 → 提示 → 承認待ち', async () => {
    await openTrouble(T5);
    await openEstimates();
    await newEstimate(name, { type: '作業', label: E.main.item, price: E.main.price });
    await d.submitEstimate(name);
    await d.closeEstimateModal();
    await d.closeStatus();
  });
  await step("2. タスク管理 → newest task '未着手'", async () => {
    await s.layout.menu('タスク管理');
    await s.tasks.search({ number: T5.number, status: '', scope: '' }); // TC rev 6: 状態 '全て', タスク範囲 '全て'
    await expect(s.tasks.status(s.tasks.rows.first())).toHaveText('未着手');
  });
  await step("3. T5 → 作業完了 → 見積もり '見積もり選択', '対応中' / '作業完了'", async () => {
    await openTrouble(T5);
    await d.openQuickAction();
    await d.setFlow('作業完了');
    await expect(valueOf(d.statusModal, '見積もり')).toContainText('見積もり選択');
    await d.saveStatus();
    await d.expectBadges('対応中', '作業完了');
  });
  await step('4. タスク管理 → task of RingiTest3', async () => {
    await s.layout.menu('タスク管理');
    await s.tasks.search({ number: T5.number, status: '', scope: '' }); // TC rev 6: 状態 '全て', タスク範囲 '全て'
  });
  await step("Expected: RingiTest3 task still '未着手' (BUG 1786-02 nếu 完了)", () =>
    expect(s.tasks.status(s.tasks.rows.first())).toHaveText('未着手'));
});

// =====================================================================================
// T4 · 継続依頼 · 2267-04/05
// =====================================================================================
tc('P007-TC-055', '#56 · SETUP-T4 · 継続依頼 → 作業中', '99', async () => {
  need(T1, 'T1 (trouble 報告済 của STORE00001)');
  const d = s.detail;
  await step('1-3. 継続依頼 → ロックなし → 作業依頼選択 T1 → 決定して問合わせ → 決定 → OK', async () => {
    await page.goto('/admin/trouble/create'); await waitApisIdle(page, 'goto');
    await s.create.start('継続依頼');
    await s.create.pickContinuationSource(T1.number!);
    await s.create.submitContinuation();
    await record(T4, {});
    await d.expectBadges('対応中', '見積待ち');
    await d.expectInfo('業者', data.worker.companyName);
    await minimizeChat(page);
  });
  await step('4. ContTest → 提示 → 承認する → 承認済み', async () => {
    await openEstimates();
    await newEstimate(E.cont);
    await d.submitEstimate(E.cont);
    await d.openEstimateMenu(E.cont);
    await d.estimateAction('manager', '承認する').click();
    await d.decide(/この見積を承認しますか/);
    await d.expectEstimateStatus(E.cont, '承認済み');
    await d.closeEstimateModal();
    await d.closeStatus();
  });
  await step("5. reload → '対応中' / '見積承認済'", async () => { await page.reload(); await waitApisIdle(page, 'F5'); await d.expectOpened(T4.id); await d.expectBadges('対応中', '見積承認済'); });
  await step('6. 日程確定 → 移動中 → 到着 → 作業中', async () => {
    for (const l of ['日程確定', '移動中', '到着', '作業中']) {
      await d.openQuickAction();
      await d.setContinuationFlow(l);
      await d.saveStatus();
      await d.expectBadges('対応中', l);
    }
  });
  await step("Expected: T4 '対応中' / '作業中'", () => d.expectBadges('対応中', '作業中'));
}, 480_000);

tc('P007-TC-056', '#57 · 2267-04 · 継続: 作業中 → 見積承認待ち blocked', '99', async () => {
  need(T4, 'T4');
  const d = s.detail;
  await step("1. Open T4 → クイック操作 → '対応中の状態（継続）'", async () => {
    await openTrouble(T4);
    await d.openQuickAction();
    await expect(d.statusModal).toContainText('対応中の状態（継続）');
  });
  await step('2. 見積承認待ち → 保存 → no confirm', async () => {
    await d.setContinuationFlow('見積承認待ち');
    await d.clickSaveStatus();
    await d.expectNoConfirm();
  });
  await step(`Expected: '${M.blockContEstimateWait}' (no '到着'), badge stays 作業中`, async () => {
    const msg = page.getByText(M.blockContEstimateWait).first();
    await expect(msg).toBeVisible();
    await expect(msg).not.toContainText('到着');
    await click(d.statusModal, 'キャンセル');
    await d.expectBadges('対応中', '作業中');
  });
});

tc('P007-TC-057', '#58 · 2267-05 · 継続: 作業中 → 見積待ち allowed', '99', async () => {
  need(T4, 'T4');
  const d = s.detail;
  await step('1. Open T4 → クイック操作', async () => { await openTrouble(T4); await d.openQuickAction(); });
  await step('2. 見積待ち → 保存 → 決定 → OK', async () => { await d.setContinuationFlow('見積待ち'); await d.saveStatus(); });
  await step("Expected: '対応中' / '見積待ち'", () => d.expectBadges('対応中', '見積待ち'));
});

// =====================================================================================
// Manager (01) · SubAdmin (98)
// =====================================================================================
tc('P007-TC-058', '#59 · Logout admin → login manager', null, async () => {
  await step("1-2. ログアウト → 'ログアウトします' → 決定", async () => { await loginAs(page, '99'); await logout(page); });
  await step('3-4. Login manager (role 01)', async () => {
    const c = credentialsOf('01');
    await s.login.waitReady();
    await s.login.loginId.fill(c.loginId);
    await s.login.password.fill(c.password);
    const dashboard = waitDashboardApi(page);
    await s.login.submit.click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
    await dashboard;
    await s.login.waitAfterLogin();
    markLoggedIn(page, '01');
  });
  await step("Expected: sidebar 'LINKSYS MANAGER00001', no menu '作業依頼情報'", async () => {
    await expect(page.locator('.account')).toContainText(account('01')?.displayName || 'LINKSYS MANAGER00001');
    await expect(s.layout.sidebar.getByText('作業依頼情報', { exact: true })).toHaveCount(0);
  });
});

tc('P007-TC-059', '#60 · 1388-09 · Manager does not see 症状一覧DL', '01', async () => {
  await step('1. Menu チェーンシステム情報', async () => {
    await s.layout.menu('チェーンシステム情報');
    await expect(s.chain.content).toContainText('チェーン店舗一覧', { timeout: 20_000 });
  });
  await step("Expected: no '症状一覧DL'", () => expect(s.chain.content.locator('button', { hasText: '症状一覧DL' })).toHaveCount(0));
});

tc('P007-TC-060', '#61 · Manager views 見積 and history (605-44)', '01', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step("1. 進行中のトラブル一覧 → T1 ('対応中' / '報告済', 作業完了確認, no クイック操作)", async () => {
    await s.layout.menu('進行中のトラブル一覧');
    await openTrouble(T1);
    await d.expectBadges('対応中', '報告済');
    await d.expectInfo('業者', data.worker.companyName);
    await expect(d.content.locator('button', { hasText: /^\s*作業完了確認\s*$/ }).first()).toBeVisible({ timeout: 15_000 });
    await expect(d.content.locator('button', { hasText: 'クイック操作' })).toHaveCount(0);
  });
  await step('2. Minimize chat', () => minimizeChat(page));
  await step('3. 見積もり → amounts, Test 承認済み, no 下書き', async () => {
    await d.headerButton('見積もり');
    const box = modal(page, '見積もり管理');
    for (const v of [data.chain.name, E.main.total, E.main.totalTax]) await expect(box).toContainText(v);
    await expect(estimationRow(box, E.main.name)).toContainText('承認済み');
    await expect(box.locator('tr.estimation-row', { hasText: '下書き' })).toHaveCount(0);
  });
  await step('4. 履歴を見る → 取り下げ申請中 / Request cancel → 閉じる ×2', async () => {
    const box = modal(page, '見積もり管理');
    await click(box, '履歴を見る');
    const h = modal(page, '見積もり履歴');
    for (const v of ['No', '対応者', '登録日時', '理由', '状態', '取り下げ申請中', E.main.cancelReason]) await expect(h).toContainText(v);
    await click(h, '閉じる');
    await click(box, '閉じる');
  });
  await step('5. 編集', async () => { await d.headerButton('編集'); await expect(page).toHaveURL(/\/edit/); });
  await step("Expected: 資産 has '変更' (opens 対象資産), 作業項目（大） has no '変更'", async () => {
    const box = await s.edit.openAssetPopup();
    await closeModal(box);
    await expect(s.edit.content.locator('tr', { hasText: '作業項目（大）' }).first().locator('button', { hasText: '変更' })).toHaveCount(0);
  });
});

tc('P007-TC-061', '#62 · Manager 作業完了確認', '01', async () => {
  need(T1, 'T1');
  const d = s.detail;
  const box = modal(page, '支払情報');
  await step('1. Open T1 → 作業完了確認 → 支払情報', async () => {
    await openTrouble(T1);
    await minimizeChat(page);
    await d.headerButton('作業完了確認');
    for (const v of ['上記金額で決済いたします', `故障内容 : ${data.categories.large}`, `故障個所 : ${data.categories.medium}`, `故障症状 : ${data.categories.small}`, E.main.totalTax, E.main.item]) await expect(box).toContainText(v);
    await expect(box.locator('.rating-star')).toHaveCount(5);
  });
  await step('2. 感動 → 5 stars filled', async () => {
    const stars = box.locator('.rating-star img');
    const empty = await stars.first().getAttribute('src');
    await box.locator('.rating-star', { hasText: '感動' }).locator('[data-index] img').click();
    for (let k = 0; k < 5; k++) await expect(stars.nth(k)).not.toHaveAttribute('src', empty ?? '');
  });
  await step('3. Comment → 作業完了確認 → 決定 → OK', async () => {
    await box.locator('textarea[name="description"]').fill('Automation test');
    await click(box, '作業完了確認');
    await d.decide('作業依頼の決済状態を保存します');
    await d.ok(M.payOk);
  });
  await step("Expected: '完了' / '報告済', no 作業完了確認, 決済状況 'LINKSYS MANAGER00001'", async () => {
    await d.expectBadges('完了', '報告済');
    await expect(d.content.locator('button', { hasText: /^\s*作業完了確認\s*$/ })).toHaveCount(0);
    await expect(d.content).toContainText(account('01')?.displayName || 'LINKSYS MANAGER00001');
  });
});

tc('P007-TC-062', '#63 · 1786-03 · Manager checks 見積承認依頼 tasks of T5', '01', async () => {
  need(T5, 'T5');
  await step('1. タスク管理 → 全て / 全て / LINKSYS STORE00004 (RINGI)', async () => {
    await s.layout.menu('タスク管理');
    await s.tasks.search({ number: T5.number, status: '', scope: '', storeName: data.store.ringiName });
  });
  await step('Expected: RingiTest2 task 完了, RingiTest3 task not done', async () => {
    expect(await s.tasks.rows.count()).toBeGreaterThanOrEqual(2);
    await expect(s.tasks.status(s.tasks.rows.first())).toHaveText('未着手'); // mới nhất = RingiTest3
    await expect(s.tasks.status(s.tasks.rows.nth(1))).toHaveText('完了');    // RingiTest2
  });
});

tc('P007-TC-063', '#64 · Logout manager → login subadmin', null, async () => {
  await step('1. ログアウト → 決定', async () => { await loginAs(page, '01'); await logout(page); });
  await step("2. Login subadmin (98) → 'LINKSYS SUBADMIN', no 資産情報", async () => {
    const c = credentialsOf('98');
    await s.login.waitReady();
    await s.login.loginId.fill(c.loginId);
    await s.login.password.fill(c.password);
    const dashboard = waitDashboardApi(page);
    await s.login.submit.click();
    await expect(page).not.toHaveURL(/\/login/, { timeout: 20_000 });
    await dashboard;
    await s.login.waitAfterLogin();
    markLoggedIn(page, '98');
    await expect(page.locator('.account')).toContainText(data.subadmin.displayName);
    await expect(s.layout.sidebar.getByText('資産情報', { exact: true })).toHaveCount(0);
  });
  await step('3. Menu 作業依頼情報', () => s.layout.menu('作業依頼情報'));
  await step('Expected: SubAdmin sees troubles of STORE00001', () =>
    expect(s.list.rows.filter({ hasText: data.store.query }).first()).toBeVisible({ timeout: 20_000 }));
});

tc('P007-TC-064', '#65 · 2132-07 · SubAdmin 戻る from タスク管理 / チャット一覧', '98', async () => {
  await step('1. タスク管理 → 全て → 検索 → first task → 戻る', async () => {
    await s.layout.menu('タスク管理');
    await s.tasks.search({ status: '', scope: '' });
    if (await s.tasks.rows.count()) {
      await s.tasks.openRow(0);
      await expect(page).toHaveURL(/from=task/);
      await click(s.detail.content, '戻る');
      await expect(page).toHaveURL(/\/admin\/tasks/);
    } else test.info().annotations.push({ type: 'SKIP', description: 'SubAdmin không có task → bỏ phần タスク' });
  });
  await step('2. チャット一覧 → first chat (chatMode=firebase)', async () => { await s.layout.menu('チャット一覧'); await s.chats.tab('すべて'); await s.chats.openFirst(); });
  await step('3. 戻る', () => click(s.detail.content, '戻る'));
  await step("Expected: back to 'チャット一覧'", () => expect(page).toHaveURL(/\/admin\/chats/));
});

tc('P007-TC-065', '#66 · 1846-05 · SubAdmin downloads PDF from 報告書 preview', '98', async () => {
  need(T1, 'T1');
  const d = s.detail;
  await step("1. 作業依頼情報 → T1 ('完了' / '報告済') → 報告書 → test1.pdf listed", async () => {
    await openTrouble(T1);
    await d.expectBadges('完了', '報告済');
    await d.headerButton('報告書');
    await expect(d.reportModal).toContainText(data.report.pdf);
  });
  await step('2. Click test1.pdf → preview with canvas', async () => {
    await d.openPdfPreview(data.report.pdf);
  });
  let name = '';
  await step('3. ダウンロード', async () => { name = await downloadName(() => click(d.pdfPreview(data.report.pdf), 'ダウンロード')); });
  await step(`Expected: file name '${data.report.pdf}'`, () => expect(name).toBe(data.report.pdf));
});
