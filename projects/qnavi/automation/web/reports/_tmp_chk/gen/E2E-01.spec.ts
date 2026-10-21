import { test, expect } from '@playwright/test';
import data from '../../../data/e2e-suite.json';
import { serialScenario } from '../../../common/scenario';
import { E2E, storeName, storePriceFor, storeWho, yen, type Trouble } from '../../../common/e2e-suite';
import { minimizeChat, rowOf } from '../../../common/ui';
import { waitApisIdle } from '../../../common/wait';

/**
 * E2E-01 · Type01 direct / approver=Chain Store — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-01-type01-direct-test-cases.md (LOCKED rev 7).
 * 1 test() = 1 TC, test.step đặt tên theo cột Steps. Chạy nối tiếp trên 1 trình duyệt; TC fail → TC sau skip.
 * Chạy lẻ: ENV=toridoll-test npm run suite -- E2E-01.spec.ts
 * Chạy tiếp trên trouble có sẵn: E2E_TROUBLE_ID=<id> … --grep "TC-00[3-9]|TC-01"
 */
test.describe.configure({ mode: 'serial' });
// E2E_DRY=1 (kiểm TC ↔ code / recon): spec viết riêng, không có chế độ khô → bỏ qua cả file, KHÔNG mở app (chạy bình thường: không đặt E2E_DRY).
test.skip(!!process.env.E2E_DRY, 'E2E_DRY: spec viết riêng, không chạy khô được');
const STORE = '00006' as const;
const P = 'E2E01';
const t: Trouble = { id: process.env.E2E_TROUBLE_ID || undefined };
const t2: Trouble = { id: process.env.E2E_TROUBLE2_ID || undefined };
let FIX = Number(process.env.E2E_FIX || 0);
const sc = serialScenario(() => [t.number ? `NEW ${t.number} (id ${t.id})` : '', t2.number ? `CONT ${t2.number} (id ${t2.id})` : '', FIX ? `FIX ${FIX}` : '']);
let e: E2E;
test.beforeAll(() => { e = new E2E(sc.page, 1); });
const step = test.step;
const tc = (id: string, title: string, role: string, body: () => Promise<void>, timeout = 300_000) =>
  test(`${id} ${title}`, { tag: [`@${id}`, `@role-${role}`] }, async () => { test.setTimeout(timeout); await body(); });
const needFix = () => test.skip(!FIX, 'Chưa có FIX (TC-001 chưa chạy) — hoặc đặt E2E_FIX');

tc(`${P}-TC-001`, 'SETUP · LINKSYS STORE00006; 限度額 read', '99', async () => {
  await step('Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF)', () => e.commonSetup(false));
  await step("1. Login Admin (99) → チェーンシステム情報 → 'Linksys Chain System'", () => e.openChain());
  let fix: number | null = null;
  await step(`2. Open '${storeName(STORE)}' → Verify: 承認タイプ = '${data.typeLabel['01']}'`, async () => { fix = await e.readStore(STORE, '01'); });
  await step("3. Record '限度額' (税込) as FIX", async () => {
    expect(fix, '限度額 trống — TC cần FIX').not.toBeNull();
    FIX = fix!;
  });
  await step('Expected: store opened; FIX recorded', () => expect(FIX).toBeGreaterThan(0));
});

tc(`${P}-TC-002`, 'NEW · chainstore creates trouble (トラブルナビ)', '02', async () => {
  const n = e.navi;
  await step(`1. Login ChainStore (02) 'linksysstore${STORE}' → Verify: Dashboard`, () => e.switchTo(storeWho(STORE)));
  await step(`2. 作業依頼登録 → Step 1 店舗 '${storeName(STORE)}' → 担当者選択 → first row → 次へ`, () => e.createStep1(STORE, false));
  await step(`3. 故障内容 '選択' → '${data.categories.navi}' → Verify: webview 'トラブル相談内容', 大項目 = '${data.categories.navi}'`, async () => {
    await e.create.openTroubleNavi(data.categories.navi);
    await n.expectOpened(data.categories.navi);
  });
  await step("4. Select '中項目', '小項目', '症状' (no '資産') → '次へ'", () => e.naviPickAll(false));
  await step("5. Click 'このまま依頼する' → click 'このまま依頼する' again", async () => {
    await n.requestAsIsButton().click();
    // TC: bấm 2 lần. Recon 14/10 (toridoll-test): sau lần 1 vào thẳng chat /job/ → kiểm lần 2 theo TC.
    await expect(n.requestAsIsButton(), "TC bước 5: nút 'このまま依頼する' lần 2").toBeVisible({ timeout: 15_000 });
    await n.requestAsIsButton().click();
  });
  await step(`6. Upload '${data.files.fault}', input '${e.note}' → next (icon)`, async () => {
    await n.uploadPhoto(data.files.fault);
    await n.sendDetail(e.note);
  });
  await step("7. Select radio '至急' → '依頼する'", async () => {
    await n.chooseTiming('至急');
    await n.submit();
  });
  await step("8. 'トップ画面に戻る' → Verify: Dashboard; record 依頼番号", async () => {
    const text = await n.doneText();
    test.info().annotations.push({ type: 'webview-done', description: text.slice(0, 300) });
    await n.backToTop();
    await e.recordNewest(t, STORE);   // R14
  });
  await step(`Expected: trouble of '${storeName(STORE)}': 問い合わせ中 / 受注待ち, 業者 未確定, 見積書 未提出`, async () => {
    await e.detail.expectBadges('問い合わせ中', '受注待ち');
    await e.detail.expectInfo('業者', '未確定');
    await e.detail.expectInfo('見積書', '未提出');
  });
}, 480_000);

tc(`${P}-TC-003`, 'NEW · Admin: 対応中 + assign worker', '99', async () => {
  await step('1. Login Admin (99) → open trouble (依頼番号)', async () => { await e.switchTo('99'); await e.openTrouble(t); });
  await step("2-4. 対応中 → 作業者 'linksysworker' → 保存 → 決定 → OK", () => e.assignWorker());
  await step("Expected: '対応中' / '受注待ち', 業者 'LINKSYS WORKER'", async () => {
    await e.detail.expectBadges('対応中', '受注待ち');
    await e.detail.expectInfo('業者', data.worker.companyName);
  });
});

tc(`${P}-TC-004`, 'NEW · 受注 → 移動中 → 到着 (02-04)', '99', async () => {
  await step('Pre-condition: Admin, trouble opened', async () => { await e.switchTo('99'); await e.openTrouble(t); });
  for (const [i, l] of ['受注', '移動中', '到着'].entries()) await step(`${i + 1}. ${l}`, () => e.moveFlow(l));
  await step("Expected: '対応中' / '到着'", () => e.detail.expectBadges('対応中', '到着'));
});

tc(`${P}-TC-005`, 'NEW · Create 1 estimate (total = FIX − 1) and 提示', '99', async () => {
  needFix();
  const d = e.detail; const name = `${P}-New`;
  await step("1. Admin → open trouble → クイック操作 → '見積承認待ち' → Verify: 見積もり '必須'", async () => {
    await e.switchTo('99'); await e.openTrouble(t);
    await d.openQuickAction();
    await d.setFlow('見積承認待ち');
    await expect(rowOf(d.statusModal, '見積もり')).toContainText('必須');
  });
  await step(`2. 見積もり → 登録 '${name}' → 作業 '${data.estimate.item}', total = FIX − 1 (${yen(FIX - 1)}) → 決定 → 下書き`, async () => {
    await d.openEstimateFromStatus();
    await e.newEstimate(name, FIX - 1);
  });
  await step(`3. Tick → 提示する → '${data.messages.submitOne}' → 決定 → Verify: '承認済み' (≤ FIX tự duyệt)`, () => d.submitEstimateExpect(name, '承認済み'));
  await step("4. '閉じる' → '保存' → '決定' → 'OK'", async () => { await d.closeEstimateModal(); await d.saveStatus(); });
  await step(`Expected: 見積書 = 税抜 of the approved estimate (¥${Number(storePriceFor(FIX - 1)).toLocaleString('en-US')}), '${name}' = '承認済み'`, async () => {
    await d.expectInfo('見積書', new RegExp(`[¥￥]\\s*${Number(storePriceFor(FIX - 1)).toLocaleString('en-US')}`));
  });
});

tc(`${P}-TC-006`, 'NEW · ≤ FIX → auto approve (no approver)', '99', async () => {
  const d = e.detail; const name = `${P}-New`;
  await step("1. Reload trouble → '見積もり'", async () => {
    await e.switchTo('99'); await e.openTrouble(t);
    await sc.page.reload(); await waitApisIdle(sc.page, 'F5'); await d.expectOpened(t.id);
    await d.openQuickAction(); await d.openEstimateFromStatus();
  });
  await step(`Expected: '${name}' = '承認済み' automatically; '対応中' / '作業中'`, async () => {
    await d.expectEstimateStatus(name, '承認済み');
    await d.closeEstimateModal(); await d.closeStatus();
    await d.expectBadges('対応中', '作業中');
  });
});

tc(`${P}-TC-007`, 'NEW · 作業完了 → 報告済 (02-08 → 02-09)', '99', async () => {
  await step('Pre-condition: Admin, trouble opened', async () => { await e.switchTo('99'); await e.openTrouble(t); });
  await step("1. '作業完了' → Verify: badge '作業完了'", () => e.moveFlow('作業完了'));
  await step("2-3. '報告済' → 報告書 編集 (day 1 / 2, 'automation', photos) → 完了 → 保存 → 決定 → OK", () => e.report());
  await step("Expected: '対応中' / '報告済'", () => e.detail.expectBadges('対応中', '報告済'));
});

tc(`${P}-TC-008`, 'NEW · Chain Store 確認・決済 → 完了', '02', async () => {
  needFix();
  await step(`1. Logout → login ChainStore 'linksysstore${STORE}' → open trouble → minimize chat`, async () => {
    await e.switchTo(storeWho(STORE)); await e.openTrouble(t); await minimizeChat(sc.page);
  });
  await step(`2-3. '作業完了確認' → 支払情報 (${data.estimate.item}, ${yen(FIX - 1)}) → '感動' → comment → 決定 → OK`, () => e.payment(yen(FIX - 1)));
  await step("Expected: '完了' / '報告済'", () => e.detail.expectBadges('完了', '報告済'));
});

tc(`${P}-TC-009`, "CONTINUE · subadmin creates 継続依頼 '_2'", '98', async () => {
  test.skip(!t.number, 'Chưa có 依頼番号 NEW');
  await step("1. Logout → login SubAdmin (98) → '作業依頼登録' → '継続依頼' → '次へ'", async () => {
    await e.switchTo('98'); await e.layout.menu('作業依頼登録'); await e.create.start('継続依頼');
  });
  await step('2. 作業依頼選択 → NEW trouble → Verify: store filled', async () => {
    await e.create.pickContinuationSource(t.number!);
    await expect(e.create.content).toContainText(storeName(STORE));
  });
  await step("3. '決定して問合わせ' → '決定' → 'OK'", async () => {
    await e.create.submitContinuation();
    await expect(sc.page).toHaveURL(/\/admin\/troubles\/\d+\/detail/, { timeout: 30_000 });
    t2.id = sc.page.url().match(/troubles\/(\d+)\/detail/)?.[1];   // R14
    await e.detail.expectOpened(t2.id);
    t2.number = await e.detail.number();
  });
  await step(`Expected: '${t.number}_2': '対応中' / '見積待ち'`, async () => {
    expect(t2.number).toBe(`${t.number}_2`);
    await e.detail.expectBadges('対応中', '見積待ち');
  });
});

tc(`${P}-TC-010`, 'CONTINUE · 作業スタッフ kept (linksysworker)', '98', async () => {
  await step("1. Open '_2' → Verify: 業者 = 'LINKSYS WORKER'", async () => { await e.switchTo('98'); await e.openTrouble(t2); });
  await step('Expected: worker kept', () => e.detail.expectInfo('業者', data.worker.companyName));
});

tc(`${P}-TC-011`, 'CONTINUE · Create 1 estimate (total = FIX − 1) and 提示', '99', async () => {
  needFix();
  const d = e.detail; const name = `${P}-Cont`;
  await step(`1. Admin → open '_2' → クイック操作 → 見積もり → '${name}', total = FIX − 1 → 決定`, async () => {
    await e.switchTo('99'); await e.openTrouble(t2);
    await d.openQuickAction(); await d.openEstimateFromStatus();
    await e.newEstimate(name, FIX - 1);
  });
  await step("2. Tick → '提示する' → '決定' → Verify: '承認済み' (≤ FIX tự duyệt)", () => d.submitEstimateExpect(name, '承認済み'));
  await step("3. '閉じる' → '見積承認待ち' → '保存' → '決定' → 'OK'", async () => {
    await d.closeEstimateModal(); await d.setContinuationFlow('見積承認待ち'); await d.saveStatus();
  });
  await step("Expected: '対応中', estimate '承認済み'", () => d.expectBadges('対応中'));
});

tc(`${P}-TC-012`, 'CONTINUE · ≤ FIX → auto approve (no approver)', '99', async () => {
  const d = e.detail; const name = `${P}-Cont`;
  await step("1. Reload '_2' → '見積もり'", async () => {
    await e.switchTo('99'); await e.openTrouble(t2);
    await sc.page.reload(); await waitApisIdle(sc.page, 'F5'); await d.expectOpened(t2.id);
    await d.openQuickAction(); await d.openEstimateFromStatus();
  });
  await step(`Expected: '${name}' = '承認済み'; '対応中' / '見積承認済'`, async () => {
    await d.expectEstimateStatus(name, '承認済み');
    await d.closeEstimateModal(); await d.closeStatus();
    await d.expectBadges('対応中', '見積承認済');
  });
});

tc(`${P}-TC-013`, 'CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了', '99', async () => {
  await step('Pre-condition: Admin, _2 opened', async () => { await e.switchTo('99'); await e.openTrouble(t2); });
  for (const [i, l] of ['日程確定', '移動中', '到着', '作業中', '作業完了'].entries()) await step(`${i + 1}. ${l}`, () => e.moveFlow(l, true));
  await step("Expected: '対応中' / '作業完了'", () => e.detail.expectBadges('対応中', '作業完了'));
});

tc(`${P}-TC-014`, 'CONTINUE · 報告済 (02-90)', '99', async () => {
  await step('Pre-condition: Admin, _2 opened', async () => { await e.switchTo('99'); await e.openTrouble(t2); });
  await step("1. '報告済' → 報告書 編集 → 完了 → 保存 → 決定 → OK", () => e.report(true));
  await step("Expected: '対応中' / '報告済'", () => e.detail.expectBadges('対応中', '報告済'));
});

tc(`${P}-TC-015`, 'CONTINUE · Chain Store 確認・決済 → 完了', '02', async () => {
  needFix();
  await step(`1. Logout → login 'linksysstore${STORE}' → open '_2'`, async () => { await e.switchTo(storeWho(STORE)); await e.openTrouble(t2); });
  await step(`2-3. '作業完了確認' → 支払情報 (${yen(FIX - 1)}) → 感動 → comment → 決定 → OK`, () => e.payment(yen(FIX - 1)));
  await step("Expected: '_2' '完了' / '報告済'", () => e.detail.expectBadges('完了', '報告済'));
});
