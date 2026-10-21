# FAIL · E2E01-TC-002 · 16/10/2026 14:56:21 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-002 — NEW · chainstore creates trouble (トラブルナビ) |
| Ngày chạy | 16/10/2026 14:56:21 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 02 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 45.5s |
| Bước fail | 7. Select radio '至急' → '依頼する' |
| Lỗi | Error: expect(locator).toBeEnabled() failed |
| Locator | locator('.trouble-navi iframe').first().contentFrame().getByRole('button', { name: '依頼する' }) |
| Expected | enabled |
| Received | - |
| Vị trí code | screens/cms/trouble-navi.webview.ts:80 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/trouble/create |
| Dữ liệu (trouble) | FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-01_16-10-2026_14-56-01_dev/video-full.webm — tua tới 00:20 (TC bắt đầu) → 01:05 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | url.txt, trace.zip, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeEnabled() failed

Locator: locator('.trouble-navi iframe').first().contentFrame().getByRole('button', { name: '依頼する' })
Expected: enabled
Error: element(s) not found

Call log:
  - Expect "toBeEnabled" with timeout 30000ms
  - waiting for locator('.trouble-navi iframe').first().contentFrame().getByRole('button', { name: '依頼する' })
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-002_NEW-·-chainstore-creates-trouble-トラブルナビ_16-10-2026_14-56-01_dev/trace.zip"`
