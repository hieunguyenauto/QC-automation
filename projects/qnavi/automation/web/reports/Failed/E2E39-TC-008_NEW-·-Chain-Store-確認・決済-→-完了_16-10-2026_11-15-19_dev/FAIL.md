# FAIL · E2E39-TC-008 · 16/10/2026 11:17:53 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E39-TC-008 — NEW · Chain Store 確認・決済 → 完了 |
| Ngày chạy | 16/10/2026 11:17:53 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 02 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 15.5s |
| Bước fail | 1. Logout → login ChainStore (02) 'linksysstore00006' → open trouble → minimize chat |
| Lỗi | TimeoutError: locator.click: Timeout 15000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/cms/layout.screen.ts:86 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/admin/troubles/43961/detail |
| Dữ liệu (trouble) | NEW 223470110 (id 43961) · FIX 20000 |
| Cảnh báo môi trường | - |
| Performance | - |
| Video đoạn fail | video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail) |
| Video cả lần chạy | ../../Passed/E2E-39.spec_16-10-2026_11-15-19_dev/video-full.webm — tua tới 02:33 (TC bắt đầu) → 02:49 (fail) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | screenshot.png, url.txt, screenshot-1.png, aria-snapshot.yml, trace.zip, error-context.md, video-fail.webm |
| File spec | tests/cms/e2e-suite/E2E-39.spec.ts:29 |

## Lỗi đầy đủ
```
TimeoutError: locator.click: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'ログアウト', exact: true })
    - locator resolved to <a role="button" class="nav-link">ログアウト</a>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div id="loader-container">…</div> intercepts pointer events
  - retrying click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <div role="dialog" aria-modal="true" class="modal fade show undefined">…</div> from <div class="content-wrapper">…</div> subtree intercepts pointer events
  - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div role="dialog" aria-modal="true" class="modal fade show undefined">…</div> from <div class="content-wrapper">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    29 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div role="dialog" aria-modal="true" class="modal fade show undefined">…</div> from <div class="content-wrapper">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E39-TC-008_NEW-·-Chain-Store-確認・決済-→-完了_16-10-2026_11-15-19_dev/trace.zip"`
