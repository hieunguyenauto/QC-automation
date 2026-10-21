# FAIL · E2E14-TC-006 · 16/10/2026 13:09:05 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E14-TC-006 — NEW · 取り下げ申請 → 却下 → コピー → 新規提示 |
| Ngày chạy | 16/10/2026 13:09:05 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 86.2s |
| Bước fail | 3. Logout → login Admin (99) → 'コピー' → new draft 'E2E14-New-copy' → tick → '提示する' → '決定' → Verify: '承認待ち' |
| Lỗi | Error: expect(locator).toHaveText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New\s*$/ }) }).first().locator('.badge') |
| Expected | "取り下げ却下" |
| Received | - |
| Vị trí code | screens/cms/trouble-detail.screen.ts:121 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43996/detail |
| Dữ liệu (trouble) | NEW 223470129 (id 43996) · FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 49.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 39.3s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-14.spec_16-10-2026_13-07-15_dev/video-full.webm — tua tới 01:49 (TC bắt đầu) → 03:15 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-14.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toHaveText(expected) failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New\s*$/ }) }).first().locator('.badge')
Expected: "取り下げ却下"
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" with timeout 15000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New\s*$/ }) }).first().locator('.badge')
    16 × locator resolved to <span class="badge p-2 text-white">失効</span>
       - unexpected value "失効"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E14-TC-006_NEW-·-取り下げ申請-→-却下-→-コピー-→-新規提示_16-10-2026_13-07-15_dev/trace.zip"`
