# FAIL · E2E23-TC-012 · 16/10/2026 10:08:12 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E23-TC-012 — CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 |
| Ngày chạy | 16/10/2026 10:08:12 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 31.6s |
| Bước fail | 2. Tick → '提示する' → '決定' → Verify: '承認待ち' |
| Lỗi | Error: expect(locator).toHaveText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E23-Cont\s*$/ }) }).first().locator('.badge') |
| Expected | "承認待ち" |
| Received | "承認済み" |
| Vị trí code | screens/cms/trouble-detail.screen.ts:121 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43941/detail |
| Dữ liệu (trouble) | NEW 223470097 (id 43940) · CONT 223470097_2 (id 43941) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 32.8s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-23.spec_16-10-2026_10-02-20_dev/video-full.webm — tua tới 05:50 (TC bắt đầu) → 06:22 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-23.spec.ts:28 |

## Lỗi đầy đủ
```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E23-Cont\s*$/ }) }).first().locator('.badge')
Expected: "承認待ち"
Received: "承認済み"
Timeout:  15000ms

Call log:
  - Expect "toHaveText" with timeout 15000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E23-Cont\s*$/ }) }).first().locator('.badge')
    7 × locator resolved to <span class="badge p-2 text-white">下書き</span>
      - unexpected value "下書き"
    12 × locator resolved to <span class="badge p-2 text-white">承認済み</span>
       - unexpected value "承認済み"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E23-TC-012_CONTINUE-·-Create-1-estimate-s-total-=-FIX-−-1-and_16-10-2026_10-02-20_dev/trace.zip"`
