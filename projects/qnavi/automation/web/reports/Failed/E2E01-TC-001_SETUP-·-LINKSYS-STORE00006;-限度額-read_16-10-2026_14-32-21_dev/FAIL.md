# FAIL · E2E01-TC-001 · 16/10/2026 14:32:21 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-001 — SETUP · LINKSYS STORE00006; 限度額 read |
| Ngày chạy | 16/10/2026 14:32:21 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 21.7s |
| Bước fail | Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF) |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/cms/login.screen.ts:29 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/login |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-01_16-10-2026_14-32-21_dev/video/E2E-01_16-10-2026_14-32-21_dev.webm — tua tới 00:00 (TC bắt đầu) → 00:21 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, trace.zip, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:29 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[name="loginId"]')
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-001_SETUP-·-LINKSYS-STORE00006;-限度額-read_16-10-2026_14-32-21_dev/trace.zip"`
