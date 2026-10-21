# FAIL · E2E38-TC-002 · 16/10/2026 11:14:04 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E38-TC-002 — NEW · chainstore manager creates trouble (トラブルナビ, シサンNAVI) |
| Ngày chạy | 16/10/2026 11:14:04 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 65.4s |
| Bước fail | 4. Select '中項目', '小項目', '症状', '資産' (field shown because シサンNAVI ON) → select asset 'TEST AUTOMATION' → '次へ' |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.trouble-navi iframe').first().contentFrame().locator('.ant-select-dropdown').filter({ has: locator('[id="asset-select_list"]') }).locator('.ant-select-item-option').filter({ hasText: /^\s*TEST AUTOMATION\s*$/ }).first() |
| Expected | visible |
| Received | - |
| Vị trí code | screens/cms/trouble-navi.webview.ts:44 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/trouble/create |
| Dữ liệu (trouble) | FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-38.spec_16-10-2026_11-13-44_dev/video-full.webm — tua tới 00:18 (TC bắt đầu) → 01:24 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-38.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.trouble-navi iframe').first().contentFrame().locator('.ant-select-dropdown').filter({ has: locator('[id="asset-select_list"]') }).locator('.ant-select-item-option').filter({ hasText: /^\s*TEST AUTOMATION\s*$/ }).first()
Expected: visible
Timeout: 2000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 2000ms
  - waiting for locator('.trouble-navi iframe').first().contentFrame().locator('.ant-select-dropdown').filter({ has: locator('[id="asset-select_list"]') }).locator('.ant-select-item-option').filter({ hasText: /^\s*TEST AUTOMATION\s*$/ }).first()


Call Log:
- Timeout 30000ms exceeded while waiting on the predicate
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E38-TC-002_NEW-·-chainstore-manager-creates-trouble-トラブルナビ-シサ_16-10-2026_11-13-44_dev/trace.zip"`
