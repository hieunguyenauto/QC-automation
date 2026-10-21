# PASSED · E2E-39.spec_16-10-2026_11-15-19_dev

Chạy lúc 16/10/2026 11:15:19 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 7 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E39-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 23.2s | 00:00 → 00:23 | - |
| E2E39-TC-002 | NEW · chainstore creates trouble (web form) | 02 | 56.3s | 00:23 → 01:20 | - |
| E2E39-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.4s | 01:20 → 01:39 | Dashboard GET /api/home: trả về sau 61.1s (ngưỡng 30s) |
| E2E39-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.2s | 01:39 → 01:55 | - |
| E2E39-TC-005 | NEW · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 14.3s | 01:55 → 02:10 | - |
| E2E39-TC-006 | NEW · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 02:10 → 02:16 | - |
| E2E39-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) + PDF attachment | 99 | 17.2s | 02:16 → 02:33 | - |

Report gốc: reports/Runs/E2E-39.spec_16-10-2026_11-15-19_dev/SUMMARY.md
