# FAIL · E2E21-TC-010 · 16/10/2026 09:56:45 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E21-TC-010 — CONTINUE · Set urgent: 案件区分 営業停止案件 |
| Ngày chạy | 16/10/2026 09:56:45 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 28.5s |
| Bước fail | 2. 案件区分 = '営業停止案件' → '保存' → '決定' → 'OK' |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | common/ui.ts:27 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43938/edit |
| Dữ liệu (trouble) | NEW 223470095 (id 43937) · CONT 223470095_2 (id 43938) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | Dashboard GET /api/home: trả về sau 80.3s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 41.8s (ngưỡng 30s) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-21.spec_16-10-2026_09-52-53_dev/video-full.webm — tua tới 03:51 (TC bắt đầu) → 04:20 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-21.spec.ts:28 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.content-wrapper').first().locator('button, a, [role="button"], input[type="button"], input[type="submit"], label.btn').filter({ hasText: /^\s*保存\s*$/ }).or(locator('.content-wrapper').first().locator('input[type="button"][value="保存"], input[type="submit"][value="保存"]')).filter({ visible: true }).first()
    - locator resolved to <button disabled type="button" class="ml-2 btn btn-sm btn-success">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is not enabled
     - retrying click action
       - waiting 500ms
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E21-TC-010_CONTINUE-·-Set-urgent-案件区分-営業停止案件_16-10-2026_09-52-53_dev/trace.zip"`
