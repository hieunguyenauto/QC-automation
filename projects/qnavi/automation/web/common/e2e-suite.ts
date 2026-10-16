import fs from 'fs';
import path from 'path';
import { expect, test, type Page } from '@playwright/test';
import dataRaw from '../data/e2e-suite.json';
import { loginAs, logout, type Who } from './session';
import { click, minimizeChat, modal, rowOf, valueOf } from './ui';
import { waitApisIdle } from './wait';
import { CmsLayout } from '../screens/cms/layout.screen';
import { ChainSystemScreen } from '../screens/cms/chain-system.screen';
import { TroubleCreateScreen } from '../screens/cms/trouble-create.screen';
import { TroubleDetailScreen } from '../screens/cms/trouble-detail.screen';
import { TroubleEditScreen } from '../screens/cms/trouble-edit.screen';
import { TroubleListScreen } from '../screens/cms/trouble-list.screen';
import { TroubleNaviWebview } from '../screens/cms/trouble-navi.webview';
import { envData } from './env-names';
const data = envData(dataRaw);

/**
 * Bước dùng chung của bộ E2E suite (TC: projects/qnavi/qc/test-cases/e2e-suite/, LOCKED; rev từng file kiểm bằng assertTcRevision).
 * Mỗi hàm = 1 cụm thao tác lặp lại giữa các case; spec gọi trong test.step đặt tên đúng bước của TC.
 * Locator chỉ ở screens/. Tài khoản: common/session.ts (data/e2e-suite.json › stores / managers).
 */
export type StoreKey = keyof typeof data.stores;
export type Trouble = { id?: string; number?: string };

export const storeName = (k: StoreKey) => data.stores[k].name;
export const storeWho = (k: StoreKey) => data.stores[k].who as Who;
export const managerWho = (n: keyof typeof data.managers) => data.managers[n] as Who;

/** Tổng 税込 = floor(店舗向け 単価 × 1.1) khi xoá dòng mặc định (P007-TC-048: 9090 → ￥9,999, 9500 → ￥10,450). Tìm 単価 cho đúng tổng. */
export function storePriceFor(totalTax: number): string {
  for (let p = Math.floor(totalTax / 1.1) - 2; p < totalTax; p++) if (Math.floor(p * 1.1 + 1e-9) === totalTax) return String(p);
  throw new Error(`Không tìm được 単価 cho tổng 税込 ${totalTax}`);
}
export const yen = (n: number) => `￥${n.toLocaleString('en-US')}`;
/** Tổng 税込 khi xoá dòng mặc định = floor(店舗向け 単価 × 1.1). */
export const taxOf = (storePrice: number) => Math.floor(storePrice * 1.1 + 1e-9);
/** Số cấp 稟議 cần: tổng ≥ ngưỡng Lv nào thì cần Lv đó (Lv1 ¥20,000 · Lv2 ¥30,000 · Lv3 ¥40,000 · Lv4 ¥50,000). */
export const ringiLevels = (total: number) => Math.max(1, [20_000, 30_000, 40_000, 50_000].filter((x) => total >= x).length);
/** Manager duyệt 稟議 theo cấp (Lv1…Lv4). */
export const RINGI = ['00001', '00002', '00003', '00004'] as const;

/** Spec sinh từ TC (scripts/gen-e2e-specs.mjs): TC đổi revision mà chưa sinh lại → dừng, không chạy theo TC cũ. */
export function assertTcRevision(tcFile: string, rev: number): void {
  const text = fs.readFileSync(path.resolve(__dirname, '../../../../..', tcFile), 'utf8');
  const st = text.match(/State: (\w+) · Revision: (\d+)/);
  if (st?.[1] !== 'LOCKED') throw new Error(`${tcFile}: State ≠ LOCKED — automation chỉ chạy TC LOCKED`);
  if (Number(st[2]) !== rev) throw new Error(`${tcFile}: TC rev ${st[2]} ≠ spec rev ${rev} → chạy: node scripts/gen-e2e-specs.mjs`);
}

export class E2E {
  readonly layout: CmsLayout; readonly chain: ChainSystemScreen; readonly create: TroubleCreateScreen;
  readonly detail: TroubleDetailScreen; readonly edit: TroubleEditScreen; readonly list: TroubleListScreen;
  readonly navi: TroubleNaviWebview;
  /** Note của case (TC rev 6): 'Automation E2E NN' — chi tiết khi tạo trouble, 原因と発生起因, comment thanh toán. */
  readonly note: string;
  constructor(readonly page: Page, caseNo: number) {
    this.note = `Automation E2E ${String(caseNo).padStart(2, '0')}`;
    this.layout = new CmsLayout(page); this.chain = new ChainSystemScreen(page); this.create = new TroubleCreateScreen(page);
    this.detail = new TroubleDetailScreen(page); this.edit = new TroubleEditScreen(page); this.list = new TroubleListScreen(page);
    this.navi = new TroubleNaviWebview(page);
  }

  // ---------- E2E-00 common / TC-001 SETUP ----------
  async openChain(): Promise<void> {
    await this.layout.menu('チェーンシステム情報');
    await this.chain.openChain(data.chain.company, data.chain.name);
    await this.chain.expectChainLoaded();
  }
  /** E2E00-TC-001 / 002: トラブルNAVI phải ON; シサンNAVI = asset (đổi + lưu nếu khác). */
  async commonSetup(asset: boolean): Promise<void> {
    await loginAs(this.page, '99');
    await this.openChain();
    await this.chain.openEdit();
    await expect(this.chain.toggle('chatbotFlag'), "Verify: 'トラブルNAVI' = ON").toBeChecked();
    if ((await this.chain.isOn('assetFlag')) !== asset) {
      await this.chain.setToggle('assetFlag', asset);
      await this.chain.saveEdit();
      await this.openChain();
      await this.chain.openEdit();
    }
    await expect(this.chain.toggle('assetFlag')).toBeChecked({ checked: asset });
    await expect(this.chain.toggle('chatbotFlag')).toBeChecked();
  }
  /** TC-001 bước 2–3: mở store, kiểm 承認タイプ, đọc 限度額. Trả về FIX (null nếu trống). */
  async readStore(k: StoreKey, type?: keyof typeof data.typeLabel): Promise<number | null> {
    await this.chain.openStore(storeName(k));
    if (type) await expect(this.chain.storeValue('承認タイプ')).toContainText(data.typeLabel[type]);
    return this.chain.limitAmount();
  }

  // ---------- TC-002: tạo trouble ----------
  /** Store / manager vào 作業依頼登録 → Step 1 → Step 2. Manager chọn store (チェーン店舗選択). */
  async createStep1(k: StoreKey, byManager: boolean): Promise<void> {
    const c = this.create;
    await this.layout.menu('作業依頼登録');
    if (byManager) {
      await c.openChainStoreSearch();
      await c.expandSearch('店名');
      await c.fillSearch('店名', storeName(k));
      await c.search();
      await c.pickStore(storeName(k));
    } else {
      await c.expectOwnStore(storeName(k));
    }
    await c.openStaff();
    await c.pickFirstStaff();
    await c.next('作業項目選択');
  }
  /** Webview: 中項目 / 小項目 / 症状 (+ 資産) chọn option đầu → 次へ. */
  async naviPickAll(asset: boolean): Promise<void> {
    for (const l of ['中項目', '小項目', '症状']) await this.navi.pick(l);
    if (asset) await this.navi.pick('資産');
    else await expect(this.navi.hasSelect('資産'), "no field '資産' because シサンNAVI OFF").toHaveCount(0);
    await this.navi.next();
  }
  /** '依頼する' + ghi NGAY trouble vừa tạo (id / 番号 từ response POST /troubles — R14). Không lấy "dòng mới nhất" của danh sách:
   *  người khác tạo cùng lúc / trouble cũ của store sẽ bị lấy nhầm. */
  async submitTrouble(t: Trouble): Promise<void> {
    const c = await this.navi.submit();
    t.id = c.id; t.number = c.number;
    test.info().annotations.push({ type: 'trouble-created', description: `${c.number}${c.id ? ` (id ${c.id})` : ''}` });
  }
  /** Sau 'トップ画面に戻る': mở đúng trouble đã ghi, kiểm 番号 khớp và store đúng. */
  async openCreated(t: Trouble, k: StoreKey): Promise<void> {
    const number = t.number;
    await this.openTrouble(t);
    expect(await this.detail.number(), '番号 của trouble đã mở = 依頼番号 vừa tạo').toBe(number);
    await this.detail.expectInfo('店舗名', storeName(k));
  }

  // ---------- mở trouble ----------
  /** Đổi sang tài khoản who rồi mở trouble (đóng modal báo giá còn mở trước — nó che nút ログアウト, dò thật 15/10/2026). */
  async open(who: Who, t: Trouble): Promise<void> {
    if (await this.detail.estimateModal.isVisible().catch(() => false)) await this.detail.closeEstimates();
    await this.switchTo(who);
    await this.openTrouble(t);
  }
  /** Mở 見積一覧 để thao tác: 99 / 98 qua クイック操作 → 状態変更 (modal header của 99 / 98 chỉ xem — R34; 98: E2E-25 16/10/2026);
   *  role khác (01 / 02) dùng nút header. */
  async openEstimatesAs(who: Who): Promise<void> {
    if (who === '99' || who === '98') { await this.detail.openQuickAction(); await this.detail.openEstimateFromStatus(); } else await this.detail.openEstimates();
  }
  /** Urgent (rev 7): tới 作業完了 Admin quay lại duyệt báo giá còn '承認待ち'. */
  async lateApprove(name: string): Promise<void> {
    await this.detail.openQuickAction(); await this.detail.openEstimateFromStatus();
    await this.detail.approveEstimate(name);
    await this.detail.expectEstimateStatus(name, '承認済み');
    await this.detail.closeEstimates();
  }
  async openTrouble(t: Trouble): Promise<void> {
    test.skip(!t.id && !t.number, 'Chưa có trouble (TC tạo trouble chưa chạy / fail)');
    if (t.id) {
      await this.page.goto(`/admin/troubles/${t.id}/detail`);
      await waitApisIdle(this.page, 'goto trouble');
    } else {
      await this.list.open();
      await this.list.openByNumber(t);
    }
    await this.detail.expectOpened(t.id);
    t.id ??= this.page.url().match(/troubles\/(\d+)\/detail/)?.[1];
    t.number ??= await this.detail.number();
  }

  /** 作業項目（小） của trouble (chi tiết, chờ ô có giá trị — R03). */
  async smallItemOf(t: Trouble): Promise<string> {
    await this.openTrouble(t);
    const cell = valueOf(this.detail.content, '作業項目（小）');
    await expect(cell).not.toHaveText(/^\s*$/, { timeout: 30_000 });
    return (await cell.innerText()).trim();
  }

  // ---------- trạng thái ----------
  async assignWorker(): Promise<void> {
    const d = this.detail;
    await d.openQuickAction();
    await d.setStatus('対応中');
    await d.editRow('作業者');
    await d.expandSearch();
    await d.searchWorker(data.worker.companyQuery);
    await d.pickWorker(data.worker.loginId);
    await expect(d.statusModal).toContainText(data.worker.companyName);
    await d.saveStatus();
  }
  async moveFlow(label: string, continuation = false): Promise<void> {
    const d = this.detail;
    await d.openQuickAction();
    if (continuation) await d.setContinuationFlow(label); else await d.setFlow(label);
    await d.saveStatus();
    await d.expectBadges('対応中', label);
  }

  // ---------- báo giá ----------
  /** Đang ở 見積一覧: tạo báo giá 1 hạng mục 作業 'Autotest', tổng 税込 = total → 下書き. */
  async newEstimate(name: string, total: number): Promise<void> {
    const d = this.detail;
    await d.startNewEstimate();
    await d.fillEstimateName(name);
    await d.openAddItem();
    await d.chooseItemType('作業');
    await d.fillItemName(data.estimate.item);
    await d.fillUnitPrice(data.estimate.workerPrice, Number(data.estimate.workerPrice).toLocaleString('en-US'));
    await d.decideItem(data.estimate.item);
    await d.deleteDefaultRows();
    await d.setStoreUnitPrice(storePriceFor(total));
    await d.decideEstimate(name);
    await d.expectEstimateStatus(name, '下書き');
  }

  // ---------- báo cáo / thanh toán ----------
  async report(flowContinuation = false): Promise<void> {
    const d = this.detail;
    await d.openQuickAction();
    if (flowContinuation) await d.setContinuationFlow('報告済'); else await d.setFlow('報告済');
    await this.reportForm();
    await d.saveStatus();
  }
  /** Modal 状態変更 đang mở ở '報告済': icon 報告書 → 編集 → ngày, 原因と発生起因, ảnh (+ PDF) → 完了 (chưa 保存). */
  async reportForm(pdf?: string): Promise<void> {
    const d = this.detail;
    await d.editRow('報告書');
    await click(d.reportModal, '編集');
    await d.pickDay('start', 1);
    await d.pickDay('end', 2);
    await d.reportModal.locator('textarea[name="reason"]').fill(this.note);
    await d.uploadReportPhoto('作業前の写真', data.files.before);
    await d.uploadReportPhoto('作業後の写真', data.files.after);
    if (pdf) {
      const box = await d.choosePdf([pdf]);
      await d.confirmPdf(box);
      await expect(d.pdfCard(pdf)).toBeVisible();
    }
    await click(d.reportModal, '完了');
    await expect(d.statusModal).toBeVisible();
  }
  /** Header 作業完了確認 → 支払情報 → 感動 → comment → 作業完了確認 → 決定 → OK. */
  async payment(checkTotal?: string): Promise<void> {
    await minimizeChat(this.page);
    await this.paymentOpen(checkTotal ?? '');
    await this.paymentSubmit();
  }
  /** Header 作業完了確認 → modal 支払情報 (kiểm chữ nếu truyền). */
  async paymentOpen(...texts: string[]): Promise<void> {
    // Modal hiện trước, dữ liệu (作業項目, 金額) đến từ GET /troubles/<id>/payments — có lúc > 5s (E2E-22 16/10/2026) → chờ response rồi mới kiểm.
    const payments = this.page.waitForResponse((r) => /\/api\/troubles\/\d+\/payments/.test(r.url()), { timeout: 30_000 }).catch(() => null);
    await this.detail.headerButton('作業完了確認');
    const box = modal(this.page, '支払情報');
    await expect(box).toBeVisible();
    await payments;
    for (const t of texts.filter(Boolean)) await expect(box).toContainText(t, { timeout: 30_000 });
  }
  /** Trong 支払情報: 感動 → comment → 作業完了確認 → 決定 → OK. */
  async paymentSubmit(): Promise<void> {
    const d = this.detail;
    const box = modal(this.page, '支払情報');
    await box.locator('.rating-star', { hasText: '感動' }).locator('[data-index] img').click();
    await box.locator('textarea[name="description"]').fill(this.note);
    await click(box, '作業完了確認');
    await d.decide(data.messages.paymentConfirm);
    await d.ok(data.messages.paymentSaved);
  }

  async switchTo(who: Who): Promise<void> {
    await loginAs(this.page, who);
  }
  async signOut(): Promise<void> { await logout(this.page); }
  rowOf = rowOf;
}
