# FAIL · E2E29-TC-008 · 16/10/2026 10:29:43 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E29-TC-008 — NEW · Other estimates → 失効 after approval |
| Ngày chạy | 16/10/2026 10:29:43 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 40.3s |
| Bước fail | Expected: 'E2E29-New1' = '承認済み'; 'E2E29-New2' = '失効' |
| Lỗi | Error: expect(locator).toHaveText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E29-New1\s*$/ }) }).first().locator('.badge') |
| Expected | "承認済み" |
| Received | "失効" |
| Vị trí code | screens/cms/trouble-detail.screen.ts:121 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43947/detail |
| Dữ liệu (trouble) | NEW 223470102 (id 43947) · FIX 10000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 43.9s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-29.spec_16-10-2026_10-25-56_dev/video-full.webm — tua tới 03:46 (TC bắt đầu) → 04:27 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-29.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E29-New1\s*$/ }) }).first().locator('.badge')
Expected: "承認済み"
Received: "失効"
Timeout:  15000ms

Call log:
  - Expect "toHaveText" with timeout 15000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E29-New1\s*$/ }) }).first().locator('.badge')
    18 × locator resolved to <span class="badge p-2 text-white">失効</span>
       - unexpected value "失効"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E29-TC-008_NEW-·-Other-estimates-→-失効-after-approval_16-10-2026_10-25-56_dev/trace.zip"`
