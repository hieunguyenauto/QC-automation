# PASSED · E2E-12.spec_16-10-2026_09-21-08_dev

Chạy lúc 16/10/2026 09:21:08 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 5 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E12-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 16.2s | 00:00 → 00:16 | - |
| E2E12-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.6s | 00:16 → 01:11 | - |
| E2E12-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.9s | 01:11 → 01:30 | Dashboard GET /api/home: trả về sau 59.2s (ngưỡng 30s) |
| E2E12-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 20.4s | 01:30 → 01:50 | - |
| E2E12-TC-005 | NEW · Create 2 estimate(s) (total = FIX + 1) and 提示 | 99 | 21.1s | 01:50 → 02:11 | - |

Report gốc: reports/Runs/E2E-12.spec_16-10-2026_09-21-08_dev/SUMMARY.md
