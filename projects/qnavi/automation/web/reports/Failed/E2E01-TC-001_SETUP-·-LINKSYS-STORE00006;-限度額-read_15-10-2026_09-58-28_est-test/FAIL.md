# FAIL · E2E01-TC-001 · 15/10/2026 09:58:28 · est-test

| Trường | Giá trị |
|---|---|
| Test case | E2E01-TC-001 — SETUP · LINKSYS STORE00006; 限度額 read |
| Ngày chạy | 15/10/2026 09:58:28 |
| Môi trường | est-test (https://cms-test.estimation.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 143.5s |
| Bước fail | Pre-condition: E2E00-TC-001 (トラブルナビ ON, シサンNAVI OFF) |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/cms/chain-system.screen.ts:79 |
| URL lúc fail | https://cms-test.estimation.qnavi.picontechnology.com/admin/asset-management/chains |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |
| Performance | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s), app huỷ 1 lần (ERR_ABORTED) |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Runs/E2E-01_15-10-2026_09-58-28_est-test/video/E2E-01_15-10-2026_09-58-28_est-test.webm — tua tới 00:00 (TC bắt đầu) → 02:19 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-01.spec.ts:25 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('.content-wrapper').first().locator('label[for="switchCheckboxassetFlag"]')
    - locator resolved to <label data-checked="ON" data-unchecked="OFF" class="roundedSwitch" for="switchCheckboxassetFlag"></label>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div id="loader-container">…</div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div id="loader-container">…</div> intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <nav class="main-header header-wrapper navbar navbar-expand navbar-dark bg-lightblue">…</nav> intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E01-TC-001_SETUP-·-LINKSYS-STORE00006;-限度額-read_15-10-2026_09-58-28_est-test/trace.zip"`
