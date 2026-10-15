# FAIL · E2E01-TC-002 · 15/10/2026 10:03:56 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-002 — NEW · chainstore creates trouble (トラブルナビ) |
| Ngày chạy | 15/10/2026 10:03:56 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 02 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 61.0s |
| Bước fail | 3. 故障内容 '選択' → '水' → Verify: webview 'トラブル相談内容', 大項目 = '水' |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).last().getByText(/^\s*水\s*$/).first() |
| Expected | visible |
| Received | - |
| Vị trí code | screens/cms/trouble-create.screen.ts:166 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create |
| Dữ liệu (trouble) | FIX 20000 |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-01_15-10-2026_10-01-36_est-test/video-full.webm — tua tới 02:19 (TC bắt đầu) → 03:20 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:25 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).last().getByText(/^\s*水\s*$/).first()
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).last().getByText(/^\s*水\s*$/).first()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-002_NEW-·-chainstore-creates-trouble-トラブルナビ_15-10-2026_10-01-36_est-test/trace.zip"`
