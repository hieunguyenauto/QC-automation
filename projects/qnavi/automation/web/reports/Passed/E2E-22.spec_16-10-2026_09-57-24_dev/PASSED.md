# PASSED · E2E-22.spec_16-10-2026_09-57-24_dev

Chạy lúc 16/10/2026 09:57:24 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 8 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E22-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 17.1s | 00:00 → 00:17 | - |
| E2E22-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.3s | 00:17 → 01:15 | - |
| E2E22-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 18.6s | 01:15 → 01:33 | Dashboard GET /api/home: trả về sau 60.8s (ngưỡng 30s) |
| E2E22-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 9.1s | 01:33 → 01:42 | - |
| E2E22-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.3s | 01:42 → 01:59 | - |
| E2E22-TC-006 | NEW · Create 4 estimates (total = FIX + 1), 提示 3, keep 1 下書き | 99 | 29.1s | 01:59 → 02:28 | - |
| E2E22-TC-007 | NEW · Urgent: Admin approves 1 estimate → others 失効 | 99 | 14.9s | 02:28 → 02:43 | - |
| E2E22-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.0s | 02:43 → 02:59 | - |

Report gốc: reports/Runs/E2E-22.spec_16-10-2026_09-57-24_dev/SUMMARY.md
