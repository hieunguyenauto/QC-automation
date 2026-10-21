# FAIL · E2E25-TC-006 · 16/10/2026 10:13:17 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E25-TC-006 — NEW · Approve (1 level(s)): CMS SubAdmin (98) |
| Ngày chạy | 16/10/2026 10:13:17 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 98 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 36.4s |
| Bước fail | 1. Login CMS SubAdmin (98) → open trouble → '見積もり' → expand 'E2E25-New' → Verify: card 店舗 has '承認する', '差し戻し' |
| Lỗi | Error: card 店舗 has '承認する' |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*承認する\s*$/ }).or(locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('input[type="button"][value="承認する"], input[type="submit"][value="承認する"]')).filter({ visible: true }).first() |
| Expected | visible |
| Received | - |
| Vị trí code | tests/cms/e2e-suite/E2E-25.spec.ts:155 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43943/detail |
| Dữ liệu (trouble) | NEW 223470099 (id 43943) · FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-25.spec_16-10-2026_10-11-51_dev/video-full.webm — tua tới 01:25 (TC bắt đầu) → 02:01 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-25.spec.ts:29 |

## Lỗi đầy đủ
```
Error: card 店舗 has '承認する'

expect(locator).toBeVisible() failed

Locator: locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*承認する\s*$/ }).or(locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('input[type="button"][value="承認する"], input[type="submit"][value="承認する"]')).filter({ visible: true }).first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - card 店舗 has '承認する' with timeout 5000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*承認する\s*$/ }).or(locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('.group-manager').locator('input[type="button"][value="承認する"], input[type="submit"][value="承認する"]')).filter({ visible: true }).first()
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E25-TC-006_NEW-·-Approve-1-level-s-CMS-SubAdmin-98_16-10-2026_10-11-51_dev/trace.zip"`
