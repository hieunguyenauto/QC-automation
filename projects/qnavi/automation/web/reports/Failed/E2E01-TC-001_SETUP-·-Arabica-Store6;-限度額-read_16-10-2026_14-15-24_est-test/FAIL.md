# FAIL · E2E01-TC-001 · 16/10/2026 14:15:24 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-001 — SETUP · Arabica Store6; 限度額 read |
| Ngày chạy | 16/10/2026 14:15:24 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 160.9s |
| Bước fail | Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF) |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.content-wrapper').first().getByText(/Arabica Store\d/).first() |
| Expected | visible |
| Received | - |
| Vị trí code | screens/cms/chain-system.screen.ts:69 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin/chain-systems/1883/stores |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s), app huỷ 1 lần (ERR_ABORTED) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-01_16-10-2026_14-15-24_est-test/video/E2E-01_16-10-2026_14-15-24_est-test.webm — tua tới 00:00 (TC bắt đầu) → 02:41 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.content-wrapper').first().getByText(/Arabica Store\d/).first()
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('.content-wrapper').first().getByText(/Arabica Store\d/).first()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-001_SETUP-·-Arabica-Store6;-限度額-read_16-10-2026_14-15-24_est-test/trace.zip"`
