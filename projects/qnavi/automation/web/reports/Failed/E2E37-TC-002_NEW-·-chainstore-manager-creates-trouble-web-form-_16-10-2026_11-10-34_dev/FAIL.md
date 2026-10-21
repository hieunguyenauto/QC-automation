# FAIL · E2E37-TC-002 · 16/10/2026 11:10:59 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E37-TC-002 — NEW · chainstore manager creates trouble (web form, シサンNAVI) |
| Ngày chạy | 16/10/2026 11:10:59 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 81.8s |
| Bước fail | Expected: Trouble is created for 'LINKSYS STORE00006': '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出', asset attached |
| Lỗi | Error: expect(locator).toContainText(expected) failed |
| Locator | locator('.content-wrapper').first() |
| Expected | - |
| Received | - |
| Vị trí code | tests/cms/e2e-suite/E2E-37.spec.ts:91 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43960/detail |
| Dữ liệu (trouble) | NEW 223470109 (id 43960) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-37.spec_16-10-2026_11-10-34_dev/video-full.webm — tua tới 00:25 (TC bắt đầu) → 01:46 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-37.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.content-wrapper').first()
Timeout: 5000ms
- Expected substring  - 1
+ Received string     + 5

- Automation Asset
+ 関連案件:223470109問い合わせ中受注待ち戻る編集店舗名:LINKSYS STORE00006 (APPROVE TYPE 1) [5]依頼内容確認:受付業者:未確定訪問日時:未確定見積書:未提出報告書有無:未提出立候補無料キャンセルタスク作業項目（大）操作テスト作業項目（中）トイレ（テスト）作業項目（小）つまり：大便器（テスト）資産資産一覧番号223470109次回番号詳細Automation E2E 37画像×案件区分通常案件緊急フラグ緊急要望の日付2026年10月16日 緊急訪問確定日時作業者登録日時2026年10月16日 13:12:02更新日時2026年10月16日 13:12:02全体状態問い合わせ中依頼種類新規依頼対応状態受注待ち自動マッチング報告書確認状況  決済状況  請求状態未請求店舗名LINKSYS STORE00006 (APPROVE TYPE 1) [5]住所〒123-1443 大阪府 15 Le Quang Hoa 電話番号(店舗)0935678278担当者Hieu電話番号(担当者)08057882712依頼登録者LINKSYS MANAGER00005店舗決済者店舗決済者を表示請求月支払月BM番号メモ欄（店舗）チャット メッセージがありません。宛先宛先を選択してください見積稟議進捗閉じる稟議ステップ進捗決裁者一覧該当データが0件でした。
+     To pick up a draggable item, press the space bar.
+     While dragging, use the arrow keys to move the item.
+     Press space again to drop the item in its new position, or press escape to cancel.
+   

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.content-wrapper').first()
    9 × locator resolved to <div class="content-wrapper">…</div>
      - unexpected value "関連案件:223470109問い合わせ中受注待ち戻る編集店舗名:LINKSYS STORE00006 (APPROVE TYPE 1) [5]依頼内容確認:受付業者:未確定訪問日時:未確定見積書:未提出報告書有無:未提出立候補無料キャンセルタスク作業項目（大）操作テスト作業項目（中）トイレ（テスト）作業項目（小）つまり：大便器（テスト）資産資産一覧番号223470109次回番号詳細Automation E2E 37画像×案件区分通常案件緊急フラグ緊急要望の日付2026年10月16日 緊急訪問確定日時作業者登録日時2026年10月16日 13:12:02更新日時2026年10月16日 13:12:02全体状態問い合わせ中依頼種類新規依頼対応状態受注待ち自動マッチング報告書確認状況  決済状況  請求状態未請求店舗名LINKSYS STORE00006 (APPROVE TYPE 1) [5]住所〒123-1443 大阪府 15 Le Quang Hoa 電話番号(店舗)0935678278担当者Hieu電話番号(担当者)08057882712依頼登録者LINKSYS MANAGER00005店舗決済者店舗決済者を表示請求月支払月BM番号メモ欄（店舗）チャット メッセージがありません。宛先宛先を選択してください見積稟議進捗閉じる稟議ステップ進捗決裁者一覧該当データが0件でした。
    To pick up a draggable item, press the space bar.
    While dragging, use the arrow keys to move the item.
    Press space again to drop the item in its new position, or press escape to cancel.
  "
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E37-TC-002_NEW-·-chainstore-manager-creates-trouble-web-form-_16-10-2026_11-10-34_dev/trace.zip"`
