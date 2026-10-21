# FAIL · E2E06-TC-013 · 15/10/2026 17:18:12 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E06-TC-013 — CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) |
| Ngày chạy | 15/10/2026 17:18:12 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED (timeout) |
| Bug đã biết | - |
| Thời gian chạy | 330.7s |
| Bước fail | 1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK' |
| Lỗi | Test timeout of 300000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | - |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43914/detail |
| Dữ liệu (trouble) | NEW 223470081 (id 43913) · CONT 223470081_2 (id 43914) · FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | 決定: API chưa xong sau 120s (GET /api/troubles/43914) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-06.spec_15-10-2026_17-13-09_dev/video-full.webm — tua tới 05:03 (TC bắt đầu) → 10:33 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-06.spec.ts:29 |

## Lỗi đầy đủ
```
Test timeout of 300000ms exceeded.
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E06-TC-013_CONTINUE-·-日程確定-→-移動中-→-到着-→-作業中-→-作業完了-02-50-→-02_15-10-2026_17-13-09_dev/trace.zip"`
