# FAIL · E2E22-TC-010 · 16/10/2026 12:08:53 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E22-TC-010 — CONTINUE · subadmin creates 継続依頼 '_2' |
| Ngày chạy | 16/10/2026 12:08:53 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 98 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 72.3s |
| Bước fail | 3. '決定して問合わせ' → '決定' → 'OK' |
| Lỗi | Error: expect(locator).toBeVisible() failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last() |
| Expected | visible |
| Received | - |
| Vị trí code | common/ui.ts:53 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43977/detail |
| Dữ liệu (trouble) | NEW 223470119 (id 43976) · FIX 20000 |
| Cảnh báo môi trường | Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43977/detail |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) · Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-22.spec_16-10-2026_12-05-16_dev/video-full.webm — tua tới 03:37 (TC bắt đầu) → 04:49 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-22.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toBeVisible() failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last()
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last()
    - found locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last().filter({ hasText: '表示に時間がかかっております' }), intercepting action to run the handler
    - locator handler has finished, waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ has: locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*OK\s*$/ }) }).last().filter({ hasText: '表示に時間がかかっております' }) to be hidden
    - interception handler has finished, continuing
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E22-TC-010_CONTINUE-·-subadmin-creates-継続依頼-_2_16-10-2026_12-05-16_dev/trace.zip"`
