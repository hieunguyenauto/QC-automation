# FAIL · E2E14-TC-006 · 16/10/2026 09:28:13 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E14-TC-006 — NEW · 取り下げ申請 → 却下 → コピー → 新規提示 |
| Ngày chạy | 16/10/2026 09:28:13 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 58.7s |
| Bước fail | 2. Logout → login ChainStore Manager 'LINKSYS MANAGER00004' → expand 'E2E14-New' → '取り下げ却下' → '決定' → Verify: '取り下げ却下', only 'コピー' is available |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*決定\s*$/ }) }).last() |
| Expected | visible |
| Received | - |
| Vị trí code | common/ui.ts:44 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43929/detail |
| Dữ liệu (trouble) | NEW 223470090 (id 43929) · FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 48.9s (ngưỡng 30s) · Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-14.spec_16-10-2026_09-26-11_dev/video-full.webm — tua tới 02:01 (TC bắt đầu) → 03:00 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-14.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*決定\s*$/ }) }).last()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*決定\s*$/ }) }).last()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E14-TC-006_NEW-·-取り下げ申請-→-却下-→-コピー-→-新規提示_16-10-2026_09-26-11_dev/trace.zip"`
