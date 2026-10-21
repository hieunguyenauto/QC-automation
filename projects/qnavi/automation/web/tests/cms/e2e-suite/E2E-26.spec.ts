import { expect, test } from '@playwright/test';
import dataRaw from '../../../data/e2e-suite.json';
import { serialScenario } from '../../../common/scenario';
import { E2E, assertTcRevision, managerWho, storeName, ringiLevels, yen, type Trouble } from '../../../common/e2e-suite';
import { minimizeChat, rowOf } from '../../../common/ui';
import { waitApisIdle } from '../../../common/wait';
import { N, envData } from '../../../common/env-names';
const data = envData(dataRaw);

/**
 * E2E-26 · Worker Company / creates est (Type04) — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-26-worker-company-test-cases.md (LOCKED rev 13, 15 TC).
 * FILE SINH TỰ ĐỘNG từ TC — không sửa tay. TC đổi → node scripts/gen-e2e-specs.mjs; cần thao tác mới → sửa khuôn trong script hoặc screens/ / common/.
 * 1 tc() = 1 TC, step = nguyên văn cột Steps. Chạy nối tiếp trên 1 trình duyệt; TC fail → TC sau không chạy.
 * Chạy: ENV=toridoll-test npm run suite -- E2E-26
 * Chạy tiếp trên trouble có sẵn: E2E_TROUBLE_ID=<id NEW> E2E_TROUBLE2_ID=<id _2> E2E_FIX=<限度額> … --grep "TC-00[6-9]|TC-01"
 */
test.describe.configure({ mode: 'serial' });
// E2E_DRY=1 (kiểm / recon): không mở app (R36). Kiểm TC ↔ code: node scripts/gen-e2e-specs.mjs --check
test.skip(!!process.env.E2E_DRY, 'E2E_DRY: không chạy app');
const STORE = '00004' as const;
const t: Trouble = { id: process.env.E2E_TROUBLE_ID || undefined };
const t2: Trouble = { id: process.env.E2E_TROUBLE2_ID || undefined };
let FIX: number | null | undefined = process.env.E2E_FIX ? Number(process.env.E2E_FIX) : undefined;
/** Tổng 税込 của từng báo giá tạo trong lần chạy. */
const totals = new Map<string, number>();
let levels = 1;   // số cấp 稟議 cần theo tổng
let srcSmall = '';   // 作業項目（小） của trouble gốc (TC 継続依頼)
const sc = serialScenario(() => [t.number ? `NEW ${t.number} (id ${t.id})` : '', t2.number ? `CONT ${t2.number} (id ${t2.id})` : '', FIX != null ? `FIX ${FIX}` : '']);
let e: E2E;
test.beforeAll(() => { assertTcRevision('projects/qnavi/qc/test-cases/e2e-suite/E2E-26-worker-company-test-cases.md', 13); e = new E2E(sc.page, 26); });
const step = test.step;
const tc = (id: string, title: string, role: string, body: () => Promise<void>, timeout = 300_000) =>
  test(`${id} ${title}`, { tag: [`@${id}`, `@role-${role}`] }, async () => { test.setTimeout(timeout); await body(); });
const needFix = () => test.skip(!FIX, 'Chưa có FIX (TC-001 chưa chạy) — hoặc đặt E2E_FIX');

tc('E2E26-TC-001', N('SETUP · LINKSYS STORE00004; 限度額 read'), '99', async () => {
  await step('Pre-condition: E2E00-TC-001 passed (シサンNAVI OFF)', async () => { await e.commonSetup(false); });
  await step(N("1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'"), async () => { await e.openChain(); });
  await step(N("2. Scroll to store list → open 'LINKSYS STORE00004' → Verify: 承認タイプ = '金額と階層承認 (No順)'"), async () => {
    await e.chain.openStore(storeName(STORE));
    await expect(e.chain.storeValue('限度額')).toBeVisible({ timeout: 20_000 });
    await expect(e.chain.storeValue('承認タイプ')).toContainText('金額と階層承認 (No順)');
  });
  await step("3. Record '限度額' (税込) as FIX (do not edit — N11)", async () => {
    const fix = await e.chain.limitAmount();
    expect(fix, '限度額 trống — TC cần FIX').not.toBeNull();
    FIX = fix;
  });
  await step(N('Expected: LINKSYS STORE00004 opened; FIX recorded'), async () => { expect(FIX).toBeGreaterThan(0); });
});

tc('E2E26-TC-002', 'NEW · chainstore manager creates trouble (web form)', '01', async () => {
  const d = e.detail;
  const c = e.create;
  await step(N("1. Login ChainStore Manager 'LINKSYS MANAGER00001' → Verify: Dashboard"), async () => { await e.switchTo(managerWho('00001')); });
  await step(N("2. Menu '作業依頼登録' → Step 1 'チェーン店舗選択' → search 店名 'LINKSYS STORE00004' → '選択' → '担当者選択' → first row → '選択' → '次へ'"), async () => { await e.createStep1(STORE, true); });
  await step("3. Step 2 作業項目選択: card 故障内容 '選択' → '操作テスト' → 故障個所 'トイレ（テスト）' → 故障症状 'つまり：大便器（テスト）' (cột gốc トラブルNAVI OFF → category '操作テスト', no webview — C4)", async () => {
    await c.openCategory(0); await c.chooseCategory(data.categories.noNavi);
    await c.openCategory(1); await c.chooseCategory(data.categories.medium);
    await c.openCategory(2); await c.chooseCategory(data.categories.small);
  });
  await step("4. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 'Automation E2E 26'", async () => {
    await c.next('故障詳細');
    await c.uploadFaultImage(0, data.files.fault);
    await c.fillFaultDetail(e.note);
  });
  await step("5. '決定して問合わせ' → '決定' (if date error: '明日以降', 開始 4:00, 終了 5:00) → 'OK' → minimize chat; record 依頼番号", async () => {
    Object.assign(t, await c.submitWithDateFallback());   // R14
    if (!t.id || !t.number) {
      await d.expectOpened(t.id);
      t.id ??= sc.page.url().match(/troubles\/(\d+)\/detail/)?.[1];
      t.number ??= await d.number();
    }
    await minimizeChat(sc.page);
  });
  await step(N("Expected: Trouble is created for 'LINKSYS STORE00004': '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出'"), async () => {
    expect(t.id ?? t.number, 'Không lấy được id / 依頼番号 của trouble vừa tạo').toBeTruthy();
    await e.openTrouble(t);
    await d.expectBadges('問い合わせ中', '受注待ち');
    await d.expectInfo('業者', '未確定');
    await d.expectInfo('見積書', '未提出');
  });
}, 480_000);

tc('E2E26-TC-003', 'NEW · Admin: 対応中 + assign worker', '99', async () => {
  const d = e.detail;
  await step('1. Login Admin (99) → open trouble (依頼番号)', async () => { await e.open('99', t); });
  await step("2. 'クイック操作' → 状態 '対応中'", async () => {
    await d.openQuickAction();
    await d.setStatus('対応中');
  });
  await step(N("3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'"), async () => {
    await d.editRow('作業者');
    await d.expandSearch();
    await d.searchWorker(data.worker.companyQuery);
    await d.pickWorker(data.worker.loginId);
    await expect(d.statusModal).toContainText(data.worker.companyName);
  });
  await step("4. '保存' → '決定' → 'OK'", async () => { await d.saveStatus(); });
  await step(N("Expected: Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER'"), async () => {
    await d.expectBadges('対応中', '受注待ち');
    await d.expectInfo('業者', data.worker.companyName);
  });
});

tc('E2E26-TC-004', 'NEW · 受注 → 移動中 → 到着 (02-04)', '99', async () => {
  const d = e.detail;
  await step('Pre-condition: E2E26-TC-003 passed', async () => { await e.open('99', t); });
  await step("1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'", async () => { await e.moveFlow('受注'); });
  await step("2. Same with '移動中' → Verify: badge '移動中'", async () => { await e.moveFlow('移動中'); });
  await step("3. Same with '到着'", async () => { await e.moveFlow('到着'); });
  await step("Expected: Badge '対応中' / '到着' (02-04)", async () => { await d.expectBadges('対応中', '到着'); });
});

tc('E2E26-TC-005', 'NEW · Create 1 estimate(s) (total = ¥22,001 (税抜 ¥20,001 ≥ Lv1 min_amount ¥20,000)) and 提示', '05', async () => {
  const d = e.detail;
  await step(N("1. Login Worker Company (05) 'linksysworkercompany' → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '必須'"), async () => {
    await e.open('05', t);
    await d.openQuickAction();
    await d.setFlow('見積承認待ち');
    await expect(rowOf(d.statusModal, '見積もり')).toContainText('必須');
  });
  await step("2. Edit icon '見積もり' → for each of 'E2E26-New': '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that total = ¥22,001 (税抜 ¥20,001 ≥ Lv1 min_amount ¥20,000) → '決定' → '決定' (top right) → Verify: row '下書き'", async () => {
    await d.openEstimateFromStatus();
    for (const n of ['E2E26-New']) { await e.newEstimate(n, 22_001); totals.set(n, 22_001); }
  });
  await step("3. Tick 'E2E26-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'", async () => { await d.submitEstimates(['E2E26-New'], '承認待ち'); });
  await step("4. '閉じる' → '保存' → '決定' → 'OK'", async () => {
    await d.closeEstimateModal();
    await d.saveStatus();
  });
  await step("Expected: Badge '対応中' / '見積承認待ち' (02-05), 見積書 'あり', submitted estimate(s) '承認待ち'", async () => {
    await d.expectBadges('対応中', '見積承認待ち');
    await d.expectInfo('見積書', 'あり');
  });
});

tc('E2E26-TC-006', 'NEW · Approve type 04 (稟議): Admin approves on behalf of each Lv', '99', async () => {
  const d = e.detail;
  await step("1. Login Admin (99) → open trouble → '見積もり' → expand 'E2E26-New'", async () => {
    const total = totals.get('E2E26-New');
    test.skip(total == null, "Không biết tổng của 'E2E26-New'");
    levels = ringiLevels(total!);
    test.info().annotations.push({ type: 'ringi', description: `${yen(total!)} → cần Lv1–Lv${levels}` });
    await e.open('99', t);
    await e.openEstimatesAs('99');
    await d.openEstimateMenu('E2E26-New');
  });
  await step("2. '承認する' (on behalf of Lv1) → '決定' → Verify: '稟議承認中' if a higher Lv is needed (N1)", async () => {
    await d.approveEstimate('E2E26-New');
    if (levels > 1) await d.expectEstimateStatus('E2E26-New', '稟議承認中');
  });
  await step("3. Repeat '承認する' for each next needed Lv → Verify: '承認済み' after the last needed Lv", async () => {
    for (let lv = 1; lv < levels; lv++) await d.approveEstimate('E2E26-New');   // R29: kiểm ở cuối
    await d.expectEstimateStatus('E2E26-New', '承認済み');
  });
  await step("Expected: Estimate 'E2E26-New' = '承認済み'; badge '対応中' / '作業中'", async () => {
    await d.closeEstimates();
    await d.expectBadges('対応中', '作業中');
  });
});

tc('E2E26-TC-007', 'NEW · 作業完了 → 報告済 (02-08 → 02-09)', '99', async () => {
  const d = e.detail;
  await step("1. Login Admin (99) → 'クイック操作' → '作業完了' → '保存' → '決定' → 'OK' → Verify: badge '作業完了'", async () => {
    await e.open('99', t);
    await e.moveFlow('作業完了');
  });
  await step("2. 'クイック操作' → '報告済' → edit icon '報告書' → '編集' → 開始 day 1, 終了 day 2, 原因と発生起因 'Automation E2E 26', 作業前 'hieu4.jpg', 作業後 'hieu3.jpg' → '完了'", async () => {
    await d.openQuickAction();
    await d.setFlow('報告済');
    await e.reportForm();
  });
  await step("3. '保存' → '決定' → 'OK'", async () => { await d.saveStatus(); });
  await step("Expected: Badge '対応中' / '報告済' (02-09)", async () => { await d.expectBadges('対応中', '報告済'); });
});

tc('E2E26-TC-008', 'NEW · CS Admin 確認・決済 → 完了', '01', async () => {
  const d = e.detail;
  await step(N("1. Logout → login ChainStore Manager 'LINKSYS MANAGER00004' → open trouble → minimize chat"), async () => {
    await e.open(managerWho('00004'), t);
    await minimizeChat(sc.page);
  });
  await step("2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate", async () => {
    const total = totals.get('E2E26-New');   // báo giá được duyệt: 'E2E26-New' (chạy tiếp trên trouble có sẵn → không biết tổng, bỏ kiểm số tiền)
    await e.paymentOpen(data.estimate.item, total != null ? yen(total) : '');
  });
  await step("3. Star '感動' → comment 'Automation E2E 26' → '作業完了確認' → '決定' → Verify: '作業依頼の決済状態の保存が完了しました。' → 'OK'", async () => { await e.paymentSubmit(); });
  await step("Expected: Badge '完了' / '報告済', '作業完了確認' disappears; NEW trouble = 完了", async () => {
    await d.expectBadges('完了', '報告済');
    await expect(d.workCompleteConfirmButton).toHaveCount(0);
  });
});

tc('E2E26-TC-009', "CONTINUE · admin creates 継続依頼 '_2'", '99', async () => {
  const d = e.detail;
  const c = e.create;
  await step("1. Logout → login CMS Admin (99) → menu '作業依頼登録' → radio '継続依頼' → '次へ'", async () => {
    test.skip(!t.number, 'Chưa có 依頼番号 NEW');
    await e.switchTo('99');
    srcSmall = await e.smallItemOf(t);   // 作業項目（小） của trouble gốc — để kiểm 'filled from the original'
    await e.layout.menu('作業依頼登録');
    await c.start('継続依頼');
  });
  await step("2. '作業依頼選択' → select the NEW trouble → Verify: store and 作業項目 filled from the original", async () => {
    await c.pickContinuationSource(t.number!);
    await expect(c.content).toContainText(storeName(STORE));
    await expect(c.content).toContainText(`番号: ${t.number}`);
    await expect(c.content, '作業項目 filled from the original').toContainText(srcSmall);
  });
  await step("3. '決定して問合わせ' → '決定' → 'OK'", async () => {
    await c.submitContinuation();
    await expect(sc.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/, { timeout: 30_000 });
    t2.id = sc.page.url().match(/troubles\/(\d+)\/detail/)?.[1];   // R14
    await d.expectOpened(t2.id);
    t2.number = await d.number();
  });
  await step(N("Expected: Continue trouble '<依頼番号>_2' is created for 'LINKSYS STORE00004': '対応中' / '見積待ち' (02-10)"), async () => {
    expect(t2.number).toBe(`${t.number}_2`);
    await d.expectBadges('対応中', '見積待ち');
  });
});

tc('E2E26-TC-010', N('CONTINUE · 作業スタッフ kept (linksysworker)'), '99', async () => {
  const d = e.detail;
  await step(N("1. Open '_2' → Verify: 業者 = 'LINKSYS WORKER' (inherited) (cột gốc 変更あり — giữ nguyên worker theo N15)"), async () => { await e.open('99', t2); });
  await step(N("Expected: Worker 'LINKSYS WORKER' is kept from the original trouble"), async () => { await d.expectInfo('業者', data.worker.companyName); });
});

tc('E2E26-TC-011', 'CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示', '99', async () => {
  const d = e.detail;
  await step("1. Login Admin (99) → open '_2' → 'クイック操作' → edit icon '見積もり' → for each of 'E2E26-Cont': '登録', item '作業' 'Autotest', total = FIX − 1 → '決定'", async () => {
    needFix();
    await e.open('99', t2);
    await d.openQuickAction();
    await d.openEstimateFromStatus();
    for (const n of ['E2E26-Cont']) { await e.newEstimate(n, FIX! - 1); totals.set(n, FIX! - 1); }
  });
  await step("2. Tick → '提示する' → '決定' → Verify: '承認済み' (≤ FIX → tự duyệt ngay khi 提示 — rev 4)", async () => { await d.submitEstimates(['E2E26-Cont'], '承認済み'); });
  await step("3. '閉じる' → select '見積承認待ち' → '保存' → '決定' → 'OK'", async () => {
    await d.closeEstimateModal();
    await d.setContinuationFlow('見積承認待ち');
    await d.saveStatus();
  });
  await step("Expected: Badge '対応中', estimate '承認済み' (≤ FIX, tự duyệt khi 提示)", async () => { await d.expectBadges('対応中'); });
});

tc('E2E26-TC-012', 'CONTINUE · ≤ FIX → auto approve (no approver)', '99', async () => {
  const d = e.detail;
  await step("1. Reload trouble → '見積もり' → Verify: no approver action was done", async () => {
    await e.open('99', t2);
    await sc.page.reload(); await waitApisIdle(sc.page, 'F5');
    await d.expectOpened(t2.id);
    await d.openQuickAction(); await d.openEstimateFromStatus();
  });
  test.info().annotations.push({ type: 'tc-note', description: "Note: cột gốc ghi người duyệt 'CS Admin' nhưng số tiền ≤ FIX → tự duyệt (G27)" });
  await step("Expected: Estimate 'E2E26-Cont' = '承認済み' automatically; badge '対応中' / '見積承認済'; no '稟議承認中'", async () => {
    await d.expectEstimateStatus('E2E26-Cont', '承認済み');
    await expect(d.estimateModal, "no '稟議承認中'").not.toContainText('稟議承認中');
    await d.closeEstimates();
    await d.expectBadges('対応中', '見積承認済');
  });
});

tc('E2E26-TC-013', 'CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80)', '99', async () => {
  const d = e.detail;
  await step("1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK'", async () => {
    await e.open('99', t2);
    await e.moveFlow('日程確定', true);
  });
  await step("2. Same with '移動中', '到着', '作業中', '作業完了' → Verify: badge after each step", async () => { for (const l of ['移動中', '到着', '作業中', '作業完了']) await e.moveFlow(l, true); });
  await step("Expected: Badge '対応中' / '作業完了' (02-80)", async () => { await d.expectBadges('対応中', '作業完了'); });
});

tc('E2E26-TC-014', 'CONTINUE · 報告済 (02-90)', '99', async () => {
  const d = e.detail;
  await step("1. 'クイック操作' → '報告済' → edit '報告書' → '編集' → 開始 / 終了, 原因と発生起因 'Automation E2E 26', photos → '完了' → '保存' → '決定' → 'OK'", async () => {
    await e.open('99', t2);
    await e.report(true);
  });
  await step("Expected: Badge '対応中' / '報告済' (02-90)", async () => { await d.expectBadges('対応中', '報告済'); });
});

tc('E2E26-TC-015', 'CONTINUE · CS Admin 確認・決済 → 完了', '01', async () => {
  const d = e.detail;
  await step(N("1. Logout → login ChainStore Manager 'LINKSYS MANAGER00004' → open '_2'"), async () => {
    await e.open(managerWho('00004'), t2);
    await minimizeChat(sc.page);
  });
  await step("2. '作業完了確認' → Verify: '支払情報' total of the CONTINUE estimate", async () => {
    const total = totals.get('E2E26-Cont');   // báo giá được duyệt: 'E2E26-Cont' (chạy tiếp trên trouble có sẵn → không biết tổng, bỏ kiểm số tiền)
    await e.paymentOpen(data.estimate.item, total != null ? yen(total) : '');
  });
  await step("3. '感動' → 'Automation E2E 26' → '作業完了確認' → '決定' → 'OK'", async () => { await e.paymentSubmit(); });
  await step("Expected: '_2' badge '完了' / '報告済'; both troubles 完了", async () => {
    await d.expectBadges('完了', '報告済');
    await e.openTrouble(t);
    await d.expectBadges('完了');
  });
});
