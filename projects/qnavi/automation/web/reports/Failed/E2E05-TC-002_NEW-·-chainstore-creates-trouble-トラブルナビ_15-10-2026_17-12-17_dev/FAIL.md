# FAIL · E2E05-TC-002 · 15/10/2026 17:12:35 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E05-TC-002 — NEW · chainstore creates trouble (トラブルナビ) |
| Ngày chạy | 15/10/2026 17:12:35 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 02 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 26.1s |
| Bước fail | 1. Login ChainStore (02) 'linksysstore00005' → Verify: Dashboard |
| Lỗi | Error: Đăng nhập 02:autoApprove (linksysstore00005) không thành công |
| Locator | - |
| Expected | - |
| Received | "https://cms-toridoll-test.qnavi.picontechnology.com/login" |
| Vị trí code | common/session.ts:77 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/login |
| Dữ liệu (trouble) | FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-05.spec_15-10-2026_17-12-17_dev/video-full.webm — tua tới 00:17 (TC bắt đầu) → 00:43 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-05.spec.ts:29 |

## Lỗi đầy đủ
```
Error: Đăng nhập 02:autoApprove (linksysstore00005) không thành công

expect(page).not.toHaveURL(expected) failed

Expected pattern: not /\/login/
Received string: "https://cms-toridoll-test.qnavi.picontechnology.com/login"
Timeout: 20000ms

Call log:
  - Đăng nhập 02:autoApprove (linksysstore00005) không thành công with timeout 20000ms
    23 × unexpected value "https://cms-toridoll-test.qnavi.picontechnology.com/login"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E05-TC-002_NEW-·-chainstore-creates-trouble-トラブルナビ_15-10-2026_17-12-17_dev/trace.zip"`
