# FAIL · E2E12-TC-006 · 16/10/2026 09:23:20 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E12-TC-006 — NEW · 差し戻し → 再編集 → 再提示 |
| Ngày chạy | 16/10/2026 09:23:20 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 64.9s |
| Bước fail | 3. Logout → login Admin (99) → re-edit 'E2E12-New1' (change 単価 +1) → '提示する' → '決定' → Verify: '再承認待ち' |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/cms/trouble-detail.screen.ts:269 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43927/detail |
| Dữ liệu (trouble) | NEW 223470088 (id 43927) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 40.5s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-12.spec_16-10-2026_09-21-08_dev/video-full.webm — tua tới 02:11 (TC bắt đầu) → 03:16 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-12.spec.ts:29 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-worker').locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*編集\s*$/ }).or(locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-worker').locator('input[type="button"][value="編集"], input[type="submit"][value="編集"]')).filter({ visible: true }).first()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E12-TC-006_NEW-·-差し戻し-→-再編集-→-再提示_16-10-2026_09-21-08_dev/trace.zip"`
