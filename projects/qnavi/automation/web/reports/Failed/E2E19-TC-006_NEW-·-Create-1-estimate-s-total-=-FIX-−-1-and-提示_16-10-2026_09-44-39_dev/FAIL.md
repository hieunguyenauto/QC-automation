# FAIL · E2E19-TC-006 · 16/10/2026 09:46:35 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E19-TC-006 — NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 |
| Ngày chạy | 16/10/2026 09:46:35 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 21.9s |
| Bước fail | 3. Tick 'E2E19-New' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち' |
| Lỗi | Error: expect(locator).toHaveText(expected) failed |
| Locator | locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E19-New\s*$/ }) }).first().locator('.badge') |
| Expected | "承認待ち" |
| Received | "承認済み" |
| Vị trí code | screens/cms/trouble-detail.screen.ts:121 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43934/detail |
| Dữ liệu (trouble) | NEW 223470093 (id 43934) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | - |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-19.spec_16-10-2026_09-44-39_dev/video-full.webm — tua tới 01:55 (TC bắt đầu) → 02:17 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-19.spec.ts:29 |

## Lỗi đầy đủ
```
Error: expect(locator).toHaveText(expected) failed

Locator:  locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E19-New\s*$/ }) }).first().locator('.badge')
Expected: "承認待ち"
Received: "承認済み"
Timeout:  15000ms

Call log:
  - Expect "toHaveText" with timeout 15000ms
  - waiting for locator('.modal.show, [role="dialog"]').filter({ visible: true }).filter({ hasText: '見積一覧' }).last().locator('tr.estimation-row').filter({ has: locator('td').filter({ hasText: /^\s*E2E19-New\s*$/ }) }).first().locator('.badge')
    16 × locator resolved to <span class="badge p-2 text-white">下書き</span>
       - unexpected value "下書き"
    3 × locator resolved to <span class="badge p-2 text-white">承認済み</span>
      - unexpected value "承認済み"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E19-TC-006_NEW-·-Create-1-estimate-s-total-=-FIX-−-1-and-提示_16-10-2026_09-44-39_dev/trace.zip"`
