# FAIL · E2E01-TC-002 · 15/10/2026 10:11:30 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-002 — NEW · chainstore creates trouble (トラブルナビ) |
| Ngày chạy | 15/10/2026 10:11:30 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 02 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 64.1s |
| Bước fail | 3. 故障内容 '選択' → '水' → Verify: webview 'トラブル相談内容', 大項目 = '水' |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).last().getByText(/^\s*水\s*$/).first() |
| Expected | visible |
| Received | - |
| Vị trí code | screens/cms/trouble-create.screen.ts:171 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create |
| Dữ liệu (trouble) | FIX 20000 |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create · firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create |
| Performance | Dashboard GET /api/home: không trả về trong 180s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-01_15-10-2026_10-11-10_est-test/video-full.webm — tua tới 00:20 (TC bắt đầu) → 01:24 (fail) |
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
    - found locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last().filter({ hasText: '表示に時間がかかっております' }), intercepting action to run the handler
    - locator handler has finished, waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last().filter({ hasText: '表示に時間がかかっております' }) to be hidden
    58 × locator resolved to visible <div role="dialog" aria-modal="true" class="modal fade show">…</div>
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-002_NEW-·-chainstore-creates-trouble-トラブルナビ_15-10-2026_10-11-10_est-test/trace.zip"`
