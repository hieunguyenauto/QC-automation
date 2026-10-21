# FAIL · E2E00-TC-001 · 15/10/2026 15:44:30 · dev

| Trường | Giá trị |
|---|---|
| Test case | E2E00-TC-001 — COMMON · Linksys: トラブルナビ ON, シサンNAVI OFF |
| Ngày chạy | 15/10/2026 15:44:30 |
| Môi trường | dev (https://cms-toridoll-test.qnavi.picontechnology.com) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Bug đã biết | - |
| Thời gian chạy | 45.1s |
| Bước fail | 1-3. Login Admin (99) → チェーンシステム情報 → Linksys Chain System → Verify トラブルNAVI ON; シサンNAVI = OFF (set + 保存 nếu khác) |
| Lỗi | TimeoutError: page.goto: Timeout 30000ms exceeded. |
| Locator | - |
| Expected | - |
| Received | - |
| Vị trí code | screens/base.screen.ts:19 |
| URL lúc fail | https://cms-toridoll-test.qnavi.picontechnology.com/login |
| Dữ liệu (trouble) | - |
| Cảnh báo môi trường | - |
| Performance | - |
| Video đoạn fail | - |
| Video cả lần chạy | - (chỉ có ở kịch bản e2e; tắt bằng E2E_VIDEO=off) |
| Trace (xem từng bước) | trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev) |
| File đính kèm | url.txt, trace.zip |
| File spec | tests/cms/e2e-suite/E2E-00.spec.ts:15 |

## Lỗi đầy đủ
```
TimeoutError: page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://cms-toridoll-test.qnavi.picontechnology.com/login", waiting until "load"
```

Xem trace: `npx playwright show-trace "/Users/hieunt/work/qc-automation/projects/qnavi/automation/web/reports/Failed/E2E00-TC-001_COMMON-·-Linksys-トラブルナビ-ON-シサンNAVI-OFF_15-10-2026_15-44-29_dev/trace.zip"`
