# FAIL · E2E13-TC-006 · 16/10/2026 11:34:10 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E13-TC-006 — NEW · 取り下げ申請 → 承認 → 再提示 |
| Ngày chạy | 16/10/2026 11:34:10 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 69.1s |
| Bước fail | 2. Logout → login ChainStore Manager 'LINKSYS MANAGER00001' → expand 'E2E13-New' → '取り下げ承認' → reason 'Automation approve cancel' (if a reason box opens) → '取り下げ承認' → '決定' → Verify: '下書き' |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | common/ui.ts:27 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43966/detail |
| Dữ liệu (trouble) | NEW 223470113 (id 43966) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-13.spec_16-10-2026_11-32-46_dev/video-full.webm — tua tới 01:23 (TC bắt đầu) → 02:33 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-13.spec.ts:30 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.content-wrapper').first().locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*クイック操作\s*$/ }).or(locator('.content-wrapper').first().locator('input[type="button"][value="クイック操作"], input[type="submit"][value="クイック操作"]')).filter({ visible: true }).first()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E13-TC-006_NEW-·-取り下げ申請-→-承認-→-再提示_16-10-2026_11-32-46_dev/trace.zip"`
