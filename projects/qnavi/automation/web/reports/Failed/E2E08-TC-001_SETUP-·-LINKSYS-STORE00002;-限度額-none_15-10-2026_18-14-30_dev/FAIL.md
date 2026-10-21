# FAIL · E2E08-TC-001 · 15/10/2026 18:14:30 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E08-TC-001 — SETUP · LINKSYS STORE00002; 限度額 none |
| Ngày chạy | 15/10/2026 18:14:30 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED (timeout) |
| Bug đã biết | - |
| Thời gian chạy | 975.3s |
| Bước fail | 1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System' |
| Lỗi | Test timeout of 300000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | - |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/chain-systems |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | - |
| Performance | - |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-08.spec_15-10-2026_18-14-30_dev/video/E2E-08.spec_15-10-2026_18-14-30_dev.webm — tua tới 00:00 (TC bắt đầu) → 16:15 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-08.spec.ts:28 |

## Lỗi đầy đủ
```
Test timeout of 300000ms exceeded.
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E08-TC-001_SETUP-·-LINKSYS-STORE00002;-限度額-none_15-10-2026_18-14-30_dev/trace.zip"`
