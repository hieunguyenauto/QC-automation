# FAIL · E2E02-TC-001 · 16/10/2026 13:23:47 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E02-TC-001 — SETUP · LINKSYS STORE00007; 限度額 read |
| Ngày chạy | 16/10/2026 13:23:47 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 45.1s |
| Bước fail | Pre-condition: E2E00-TC-001 passed (シサンNAVI OFF) |
| Lỗi | TimeoutError: page.goto: Timeout 30000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/base.screen.ts:19 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/login |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | - |
| Performance | - |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-02.spec_16-10-2026_13-23-47_dev/video/E2E-02.spec_16-10-2026_13-23-47_dev.webm — tua tới 00:00 (TC bắt đầu) → 00:45 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | url.txt, trace.zip, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-02.spec.ts:29 |

## Lỗi đầy đủ
```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://cms-toridoll-test.qnavi.picontechnology.com/login", waiting until "load"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E02-TC-001_SETUP-·-LINKSYS-STORE00007;-限度額-read_16-10-2026_13-23-47_dev/trace.zip"`
