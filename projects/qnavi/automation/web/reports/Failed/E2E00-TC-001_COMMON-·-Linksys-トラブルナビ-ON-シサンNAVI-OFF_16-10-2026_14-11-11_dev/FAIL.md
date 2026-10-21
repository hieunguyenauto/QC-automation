# FAIL · E2E00-TC-001 · 16/10/2026 14:11:11 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E00-TC-001 — COMMON · Linksys: トラブルナビ ON, シサンNAVI OFF |
| Ngày chạy | 16/10/2026 14:11:11 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 19.0s |
| Bước fail | 1-3. Login Admin (99) → チェーンシステム情報 → Linksys Chain System → Verify トラブルNAVI ON; シサンNAVI = OFF (set + 保存 nếu khác) |
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
| Video cả lần chạy | ../../Runs/E2E-00.spec_16-10-2026_14-11-11_dev/video/E2E-00.spec_16-10-2026_14-11-11_dev.webm — tua tới 00:00 (TC bắt đầu) → 00:19 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, trace.zip, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-00.spec.ts:18 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('input[name="loginId"]')
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E00-TC-001_COMMON-·-Linksys-トラブルナビ-ON-シサンNAVI-OFF_16-10-2026_14-11-11_dev/trace.zip"`
