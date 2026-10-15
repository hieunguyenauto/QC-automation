# FAIL · E2E01-TC-001 · 15/10/2026 10:09:08 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-001 — SETUP · LINKSYS STORE00006; 限度額 read |
| Ngày chạy | 15/10/2026 10:09:08 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 101.8s |
| Bước fail | Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF) |
| Lỗi | Error: locator.click: Target page, context or browser has been closed |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/cms/layout.screen.ts:72 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Performance | Dashboard GET /api/home: không trả về trong 180s (ngưỡng 30s), app huỷ 1 lần (ERR_ABORTED) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-01_15-10-2026_10-09-08_est-test/video/E2E-01_15-10-2026_10-09-08_est-test.webm — tua tới 00:00 (TC bắt đầu) → 01:41 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | url.txt, trace.zip, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:25 |

## Lỗi đầy đủ
```
Error: locator.click: Target page, context or browser has been closed
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-001_SETUP-·-LINKSYS-STORE00006;-限度額-read_15-10-2026_10-09-08_est-test/trace.zip"`
