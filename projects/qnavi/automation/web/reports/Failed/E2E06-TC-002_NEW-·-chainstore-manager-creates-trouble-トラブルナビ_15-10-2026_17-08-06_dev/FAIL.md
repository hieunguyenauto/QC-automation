# FAIL · E2E06-TC-002 · 15/10/2026 17:08:23 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E06-TC-002 — NEW · chainstore manager creates trouble (トラブルナビ) |
| Ngày chạy | 15/10/2026 17:08:23 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 60.7s |
| Bước fail | 3. Step 2 作業項目選択: card 故障内容 '選択' → click '水' → Verify: webview 'トラブル相談内容' opens, 大項目 = '水' |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.trouble-navi iframe').first().contentFrame().getByRole('heading', { name: 'トラブル相談内容' }) |
| Expected | visible |
| Received | - |
| Vị trí code | screens/cms/trouble-navi.webview.ts:26 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/trouble/create |
| Dữ liệu (trouble) | FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-06.spec_15-10-2026_17-08-06_dev/video-full.webm — tua tới 00:16 (TC bắt đầu) → 01:17 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-06.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.trouble-navi iframe').first().contentFrame().getByRole('heading', { name: 'トラブル相談内容' })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('.trouble-navi iframe').first().contentFrame().getByRole('heading', { name: 'トラブル相談内容' })
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E06-TC-002_NEW-·-chainstore-manager-creates-trouble-トラブルナビ_15-10-2026_17-08-06_dev/trace.zip"`
