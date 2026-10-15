# FAIL · E2E01-TC-001 · 15/10/2026 10:25:28 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-001 — SETUP · LINKSYS STORE00006; 限度額 read |
| Ngày chạy | 15/10/2026 10:25:28 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 28.2s |
| Bước fail | Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF) |
| Lỗi | Error: Đăng nhập 99: app huỷ firebase-auth/exchange 3 lần liên tiếp (net::ERR_ABORTED) — phiên không dùng được |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | common/session.ts:127 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Đăng nhập 99: app huỷ firebase-auth/exchange + mọi request (net::ERR_ABORTED; app tự log 'status: 504', server không trả) → đăng xuất, đăng nhập lại (lần 1/2) — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Đăng nhập 99: app huỷ firebase-auth/exchange + mọi request (net::ERR_ABORTED; app tự log 'status: 504', server không trả) → đăng xuất, đăng nhập lại (lần 2/2) — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Performance | - |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-01_15-10-2026_10-25-28_est-test/video/E2E-01_15-10-2026_10-25-28_est-test.webm — tua tới 00:00 (TC bắt đầu) → 00:27 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:25 |

## Lỗi đầy đủ
```
Error: Đăng nhập 99: app huỷ firebase-auth/exchange 3 lần liên tiếp (net::ERR_ABORTED) — phiên không dùng được
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-001_SETUP-·-LINKSYS-STORE00006;-限度額-read_15-10-2026_10-25-28_est-test/trace.zip"`
