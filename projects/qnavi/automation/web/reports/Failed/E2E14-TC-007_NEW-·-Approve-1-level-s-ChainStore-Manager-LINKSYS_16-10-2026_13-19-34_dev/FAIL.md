# FAIL · E2E14-TC-007 · 16/10/2026 13:22:46 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E14-TC-007 — NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00004' |
| Ngày chạy | 16/10/2026 13:22:46 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 01 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 54.9s |
| Bước fail | 2. '承認する' → '決定' → Verify: '承認済み' |
| Lỗi | Error: expect(locator).toHaveText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New-copy\s*$/ }) }).first().locator('.badge') |
| Expected | "承認済み" |
| Received | "承認待ち" |
| Vị trí code | screens/cms/trouble-detail.screen.ts:121 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43999/detail |
| Dữ liệu (trouble) | NEW 223470131 (id 43999) · FIX 5000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-14.spec_16-10-2026_13-19-34_dev/video-full.webm — tua tới 03:11 (TC bắt đầu) → 04:06 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-14.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New-copy\s*$/ }) }).first().locator('.badge')
Expected: "承認済み"
Received: "承認待ち"
Timeout:  15000ms

Call log:
  - Expect "toHaveText" with timeout 15000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E14-New-copy\s*$/ }) }).first().locator('.badge')
    19 × locator resolved to <span class="badge p-2 text-white">承認待ち</span>
       - unexpected value "承認待ち"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E14-TC-007_NEW-·-Approve-1-level-s-ChainStore-Manager-LINKSYS_16-10-2026_13-19-34_dev/trace.zip"`
