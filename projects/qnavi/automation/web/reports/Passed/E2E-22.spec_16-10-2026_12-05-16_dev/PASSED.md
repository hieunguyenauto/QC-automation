# PASSED · E2E-22.spec_16-10-2026_12-05-16_dev

Chạy lúc 16/10/2026 12:05:16 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 9 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E22-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 17.6s | 00:00 → 00:17 | - |
| E2E22-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 58.3s | 00:18 → 01:16 | - |
| E2E22-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 17.7s | 01:16 → 01:34 | Dashboard GET /api/home: trả về sau 62.3s (ngưỡng 30s) |
| E2E22-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 7.8s | 01:34 → 01:42 | - |
| E2E22-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.9s | 01:42 → 01:57 | - |
| E2E22-TC-006 | NEW · Create 4 estimates (total = FIX + 1), 提示 3, keep 1 下書き | 99 | 30.5s | 01:57 → 02:28 | - |
| E2E22-TC-007 | NEW · Urgent: Admin approves 1 estimate → others 失効 | 99 | 15.4s | 02:28 → 02:43 | - |
| E2E22-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.1s | 02:43 → 02:59 | - |
| E2E22-TC-009 | NEW · CS Admin 確認・決済 → 完了 | 01 | 37.7s | 02:59 → 03:37 | - |

Report gốc: reports/Runs/E2E-22.spec_16-10-2026_12-05-16_dev/SUMMARY.md
