# PASSED · E2E-29.spec_16-10-2026_10-25-56_dev

Chạy lúc 16/10/2026 10:25:56 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 7 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E29-TC-001 | SETUP · LINKSYS STORE00001; 限度額 read | 99 | 16.8s | 00:00 → 00:17 | - |
| E2E29-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.9s | 00:17 → 01:12 | - |
| E2E29-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.9s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 58.8s (ngưỡng 30s) |
| E2E29-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 19.1s | 01:30 → 01:49 | - |
| E2E29-TC-005 | NEW · Create 2 estimate(s) (total = FIX + 1) and 提示 | 99 | 23.2s | 01:49 → 02:12 | - |
| E2E29-TC-006 | NEW · 差し戻し → コピー → 新規提示 | 02 | 53.3s | 02:12 → 03:05 | Dashboard GET /api/home: trả về sau 39.7s (ngưỡng 30s) |
| E2E29-TC-007 | NEW · Approve (1 level(s)): ChainStore (02) 'linksysstore00001' | 02 | 40.9s | 03:05 → 03:46 | - |

Report gốc: reports/Runs/E2E-29.spec_16-10-2026_10-25-56_dev/SUMMARY.md
