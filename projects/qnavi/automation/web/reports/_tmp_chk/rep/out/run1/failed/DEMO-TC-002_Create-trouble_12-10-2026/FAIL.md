# FAIL · DEMO-TC-002 · 12-10-2026

| Trường | Giá trị |
|---|---|
| Test case | DEMO-TC-002 — Create trouble |
| Ngày chạy | 12/10/2026 09:34:09 |
| Môi trường | dev (https://cms-demo) |
| Tài khoản / role | 99 |
| Kết quả | FAILED |
| Thời gian chạy | 0.0s |
| Bước fail | 14. Card 3 → つまり：大便器（テスト） |
| Lỗi | Error: content |
| Locator | - |
| Expected | "つまり：大便器（テスト）" |
| Received | "ウォシュレット" |
| Vị trí code | demo.spec.ts:6 |
| URL lúc fail | https://cms/admin/trouble/create |
| Dữ liệu (trouble) | - |
| File đính kèm | screenshot.png, url.txt |
| File spec | demo.spec.ts:3 |

## Lỗi đầy đủ
```
Error: content

expect(received).toBe(expected) // Object.is equality

Expected: "つまり：大便器（テスト）"
Received: "ウォシュレット"
```

Xem trace: `npx playwright show-trace "/sessions/rcw-013yqvykzh3biwmvo5cy9hq1/mnt/qc-automation/projects/qnavi/automation/web/reports/_tmp_chk/rep/out/run1/failed/DEMO-TC-002_Create-trouble_12-10-2026/trace.zip"`
