# FAIL · E2E22-TC-009 · 16/10/2026 10:00:24 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E22-TC-009 — NEW · CS Admin 確認・決済 → 完了 |
| Ngày chạy | 16/10/2026 10:00:24 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 35.4s |
| Bước fail | 2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate |
| Lỗi | Error: expect(locator).toContainText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '支払情報' }).last() |
| Expected | "Autotest" |
| Received | "支払情報2026年10月16日 12:0:54故障内容 : 故障内容 : 故障個所 : 故障症状 : （税込）上記金額で決済いたします。よろしければ「作業完了確認」ボタンを押してください。支払方法 : 請求書払い作業項目一覧 今回のメンテナンス作業はいかがでしたでしょうか？ご意見をお聞かせください。不満やや不満満足非常に満足感動閉じる作業完了確認" |
| Vị trí code | common/e2e-suite.ts:230 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43939/detail |
| Dữ liệu (trouble) | NEW 223470096 (id 43939) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-22.spec_16-10-2026_09-57-24_dev/video-full.webm — tua tới 02:59 (TC bắt đầu) → 03:34 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-22.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toContainText(expected) failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '支払情報' }).last()
Expected substring: "Autotest"
Received string:    "支払情報2026年10月16日 12:0:54故障内容 : 故障内容 : 故障個所 : 故障症状 : （税込）上記金額で決済いたします。よろしければ「作業完了確認」ボタンを押してください。支払方法 : 請求書払い作業項目一覧 今回のメンテナンス作業はいかがでしたでしょうか？ご意見をお聞かせください。不満やや不満満足非常に満足感動閉じる作業完了確認"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '支払情報' }).last()
    9 × locator resolved to <div role="dialog" aria-modal="true" class="modal fade show modalPayment">…</div>
      - unexpected value "支払情報2026年10月16日 12:0:54故障内容 : 故障内容 : 故障個所 : 故障症状 : （税込）上記金額で決済いたします。よろしければ「作業完了確認」ボタンを押してください。支払方法 : 請求書払い作業項目一覧 今回のメンテナンス作業はいかがでしたでしょうか？ご意見をお聞かせください。不満やや不満満足非常に満足感動閉じる作業完了確認"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E22-TC-009_NEW-·-CS-Admin-確認・決済-→-完了_16-10-2026_09-57-24_dev/trace.zip"`
