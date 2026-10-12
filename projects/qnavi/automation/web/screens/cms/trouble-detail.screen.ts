import { expect, type Locator } from '@playwright/test';
import path from 'path';
import { BaseScreen } from '../base.screen';
import {
  acknowledgeOk, choose, click, exact, clickable, clickables, closeModal, confirmDecide, expectRow, field, fill, modal,
  saveDecideOk, valueOf,
} from '../../common/ui';
import { AssetSelectDialog } from './asset-select.dialog';

const FILES = path.resolve(__dirname, '../../data/files');

/**
 * 作業依頼詳細 — catalog: cms-frontend.md › "Trouble Detail: /admin/troubles/:id/detail" + "Trouble modals".
 * クイック操作 (99/98/05) mở modal 状態変更. Nút header: 履歴, 立候補, 見積もり, 報告書, 作業完了確認…
 * Recon 2026-10-12: header = <p>店舗名:</p>, <p>業者:</p>…; nút có icon (' 編集', ' クイック操作'); bảng chi tiết <td>label</td><td>value</td>;
 *   modal 状態変更 = dialog có heading '状態変更', nút '閉じる', select ở dòng '状態', nút 'キャンセル' / '保存'.
 * Browser thật 2026-10-12: đã chạy tay TC-005 → TC-010 trên trouble 43803 (xem ghi chú từng phần).
 * Sau 保存 → 決定 → OK 'この情報の保存が完了しました。' thì modal 状態変更 tự đóng.
 */
export class TroubleDetailScreen extends BaseScreen {
  readonly id = 'CMS-TROUBLE-DETAIL';
  readonly path = '/admin/troubles';
  readonly roles = ['99', '98', '01', '02', '05'] as const;

  readonly content = this.page.locator('.content-wrapper').first();
  readonly assets = new AssetSelectDialog(this.page);

  /** Đã vào màn chi tiết VÀ dữ liệu đã tải (ô 番号 có số; trước đó các ô trống, クイック操作 bị disable). */
  async expectOpened(id?: string): Promise<void> {
    await expect(this.page).toHaveURL(id ? new RegExp(`/admin/troubles/${id}/detail`) : /\/admin\/troubles\/\d+\/detail/);
    await expect(valueOf(this.content, '番号')).toHaveText(/\d+/, { timeout: 20_000 });
  }
  /** 番号 (= 依頼番号 trong danh sách) đang hiển thị. */
  async number(): Promise<string | undefined> {
    return (await valueOf(this.content, '番号').innerText()).match(/\d+/)?.[0];
  }
  /** Badge trạng thái: vd ('対応中', '受注'). */
  async expectBadges(...badges: string[]): Promise<void> {
    // Badge (.trouble-action .badge) render rỗng trước, có chữ sau ~3s (nhất là role 01).
    for (const b of badges) await expect(this.content.locator('.trouble-action .badge', { hasText: exact(b) })).toBeVisible({ timeout: 15_000 });
  }
  async expectInfo(label: string, value: string | RegExp): Promise<void> {
    await expectRow(this.content, label, value);
  }
  async headerButton(name: string): Promise<void> {
    await click(this.content, name);
  }

  // ---------- 状態変更 ----------
  get statusModal(): Locator { return modal(this.page, '状態変更'); }

  async openQuickAction(): Promise<Locator> {
    await click(this.content, 'クイック操作');
    await expect(this.statusModal).toBeVisible();
    return this.statusModal;
  }
  /** Icon edit trên dòng label trong modal 状態変更 (作業者, 見積もり, 報告書).
   *  Browser thật 2026-10-12: <td><div class="card">…<div class="icon …"><i class="far fa-edit"></i></div></td>. */
  async editRow(label: string): Promise<void> {
    await valueOf(this.statusModal, label).locator('.icon, i.fa-edit').filter({ visible: true }).first().click();
  }
  async setStatus(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '状態', value);
  }
  async setFlow(value: string): Promise<void> {
    await choose(this.page, this.statusModal, '対応中の状態（新規）', value);
  }
  /** Giá trị ĐANG CHỌN của dropdown 対応中の状態（新規） (dòng chứa cả danh sách option nên không kiểm theo text dòng). */
  async expectFlow(value: string): Promise<void> {
    await expect(field(this.statusModal, '対応中の状態（新規）').locator('option:checked')).toHaveText(value);
  }
  async expectStatus(value: string): Promise<void> {
    await expect(field(this.statusModal, '状態').locator('option:checked')).toHaveText(value);
  }
  async saveStatus(): Promise<void> {
    await saveDecideOk(this.page, this.statusModal);
    await expect(this.statusModal).toBeHidden();
  }
  async closeStatus(): Promise<void> {
    await closeModal(this.statusModal);
  }

  // ----- 作業者 (検索条件) -----
  get searchModal(): Locator { return modal(this.page, '検索条件'); }
  async expandSearch(): Promise<void> {
    const box = this.searchModal;
    if (!(await field(box, '電話番号').isVisible().catch(() => false))) await box.getByText('検索条件', { exact: true }).first().click();
    await expect(field(box, '電話番号')).toBeVisible();
  }
  async searchWorker(company: string): Promise<void> {
    await fill(this.searchModal, '社名', company);
    await click(this.searchModal, '検索');
  }
  async pickWorker(loginId: string): Promise<void> {
    // Có 'linksysworkerqnavi' và 'linksysworker' → khớp ô đúng nguyên văn.
    const row = this.searchModal.locator('tbody tr').filter({ has: this.page.locator('td', { hasText: new RegExp(`^\\s*${loginId}\\s*$`) }) }).first();
    await click(row, '選択');
    await expect(this.searchModal).toBeHidden();
  }

  // ---------- 見積もり ----------
  // Browser thật 2026-10-12 (trouble 43803):
  //  - Modal '見積もり' (có '見積一覧', nút 閉じる / 登録 / 提示する). Dòng = tr.estimation-row, badge trạng thái, ô 'メニュー展開▼'.
  //  - 登録 → modal form (input[name=title|companyName|expiredTime], textarea[name=notices]); có sẵn dòng 現場調査費/出張費.
  //  - 追加 → modal '作業項目追加': nút 作業/部材/諸経費; input[name=label|workerAmount] bị disable tới khi chọn loại.
  //  - Dòng item trong form: 項目名 nằm trong textarea[name="items.N.label"] (không phải text).
  //  - 決定 form: lưu ngay, không có confirm. 提示する → '以下1件の見積を店舗へ提出しますか?' → 決定; trạng thái đổi sau ~3–5s.
  //  - Nút × có aria-label="閉じる" → không dùng getByRole name '閉じる' (trùng).
  get estimateModal(): Locator { return modal(this.page, '見積一覧'); }
  get estimateForm(): Locator {
    return this.page.locator('.modal.show').filter({ visible: true }).filter({ has: this.page.locator('input[name="title"]') }).last();
  }
  get itemModal(): Locator { return modal(this.page, '作業項目追加'); }
  estimateRow(name: string): Locator {
    return this.estimateModal.locator('tr.estimation-row').filter({ has: this.page.locator('td', { hasText: exact(name) }) }).first();
  }
  async expectEstimateStatus(name: string, status: string): Promise<void> {
    await expect(this.estimateRow(name).locator('.badge')).toHaveText(status, { timeout: 15_000 });
  }

  async openEstimateFromStatus(): Promise<void> {
    await this.editRow('見積もり');
    await expect(this.estimateModal).toBeVisible();
  }
  async startNewEstimate(): Promise<void> {
    await click(this.estimateModal, '登録');
    const f = this.estimateForm;
    for (const n of ['title', 'companyName', 'expiredTime']) await expect(f.locator(`input[name="${n}"]`)).toBeVisible();
  }
  async fillEstimateName(name: string): Promise<void> {
    await this.estimateForm.locator('input[name="title"]').fill(name);
  }
  async openAddItem(): Promise<void> {
    await click(this.estimateForm, '追加');
    await expect(this.itemModal).toBeVisible();
  }
  async chooseItemType(type: '作業' | '部材' | '諸経費'): Promise<void> {
    await this.itemModal.locator('.btn-group button', { hasText: exact(type) }).click();
    await expect(this.itemModal.locator('input[name="label"]')).toBeEnabled();
  }
  async fillItemName(name: string): Promise<void> {
    await this.itemModal.locator('input[name="label"]').fill(name);
  }
  async fillUnitPrice(value: string, shown: string): Promise<void> {
    const price = this.itemModal.locator('input[name="workerAmount"]');
    await price.fill(value);
    await price.blur();
    await expect(price).toHaveValue(new RegExp(`^(${value}|${shown})$`));
  }
  async decideItem(itemName: string): Promise<void> {
    await click(this.itemModal, '決定');
    await expect(this.itemModal).toBeHidden();
    await expect(this.estimateForm.locator('textarea[name$=".label"]').last()).toHaveValue(itemName);
  }
  async decideEstimate(name: string): Promise<void> {
    await click(this.estimateForm, '決定');
    await expect(this.estimateForm).toBeHidden();
    await expect(this.estimateRow(name)).toBeVisible({ timeout: 15_000 });
  }
  /** Tick dòng → 提示する → 決定 → trạng thái 承認待ち. */
  async submitEstimate(name: string): Promise<void> {
    await this.estimateRow(name).locator('input[type="checkbox"]').first().check();
    await click(this.estimateModal, '提示する');
    const d = modal(this.page, '以下1件の見積を店舗へ提出しますか');
    await expect(d).toContainText(name);
    await click(d, '決定');
    await expect(d).toBeHidden();
    await this.expectEstimateStatus(name, '承認待ち');
  }
  /** Mở phần mở rộng của dòng (nếu đang đóng). Bấm khi đã mở sẽ ĐÓNG lại → kiểm class is-expanded trước. */
  async openEstimateMenu(name: string): Promise<void> {
    const row = this.estimateRow(name);
    if (!/is-expanded/.test((await row.getAttribute('class')) ?? '')) await row.getByText(/メニュー展開/).first().click();
    await expect(row).toHaveClass(/is-expanded/);
  }
  /** Nút trong phần mở rộng: card 店舗 (.group-manager) hoặc 作業員 (.group-worker). */
  estimateAction(group: 'manager' | 'worker', name: string): Locator {
    return clickable(this.estimateModal.locator(`.group-${group}`), name);
  }
  async closeEstimateModal(): Promise<void> {
    await click(this.estimateModal, '閉じる');
    await expect(this.estimateModal).toBeHidden();
  }

  // ---------- 報告書 ----------
  // Browser thật 2026-10-12: modal 報告書 (xem) có nút 編集 → modal sửa (input[name=start|end] react-datepicker,
  //  select[name=status] 未提出/提出済, textarea[name=symptom|reason|content|notice], dropzone ảnh, 修理対象資産選択, キャンセル/完了).
  //  Lọc theo '施工業者' vì modal 状態変更 cũng có chữ '報告書'.
  get reportModal(): Locator { return modal(this.page, '施工業者'); }

  /** react-datepicker: option "Choose 2026年10月1日木曜日"; nút 現在 / クリア / 閉じる; giá trị input 'YYYY/MM/DD 00:00'. */
  async pickDay(name: 'start' | 'end', day: number): Promise<void> {
    await this.reportModal.locator(`input[name="${name}"]`).click();
    const picker = this.page.locator('.react-datepicker').filter({ visible: true }).last();
    await picker.getByRole('option', { name: new RegExp(`^Choose \\d+年\\d+月${day}日`) }).first().click();
    const close = picker.locator('button', { hasText: exact('閉じる') });
    if (await close.isVisible().catch(() => false)) await close.click();
    await expect(picker).toBeHidden();
  }
  /** Ảnh: input[type=file] ẩn trong .dropzone của dòng → mở hộp con 'N / 20' → 完了. */
  async uploadReportPhoto(label: string, file: string): Promise<void> {
    await valueOf(this.reportModal, label).locator('.dropzone input[type="file"]').first().setInputFiles(path.join(FILES, file));
    // Hộp con là .modal lồng trong modal 報告書, đóng thì chỉ bỏ class show (vẫn ở DOM) → modal 報告書 cũng chứa chữ 'N / 20'
    //  → loại modal có '施工業者' (R09).
    const box = this.page.locator('.modal.show, [role="dialog"]').filter({ visible: true })
      .filter({ hasText: /\d+\s*\/\s*20/ }).filter({ hasNotText: '施工業者' }).last();
    await expect(box).toContainText(file);
    // 完了 → generate_presigned_url → PUT S3; app bỏ qua ảnh của dòng khác cho tới khi PUT xong → chờ response.
    const uploaded = this.page.waitForResponse(r => r.request().method() === 'PUT' && r.url().includes('/modules/troubles/files/'));
    await click(box, '完了');
    expect((await uploaded).ok()).toBe(true);
    await expect(box).toBeHidden();
    await expect(valueOf(this.reportModal, label).locator('img').first()).toBeVisible();
  }
  async downloadFrom(button: string): Promise<string> {
    const dl = this.page.waitForEvent('download');
    await click(this.reportModal, button);
    return (await dl).suggestedFilename();
  }

  // ---------- chung ----------
  async ok(text?: string | RegExp) { await acknowledgeOk(this.page, text); }
  async decide(text?: string | RegExp) { await confirmDecide(this.page, text); }
}
