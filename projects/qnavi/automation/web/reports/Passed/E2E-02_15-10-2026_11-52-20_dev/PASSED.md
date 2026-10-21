# PASSED · E2E-02_15-10-2026_11-52-20_dev

Chạy lúc 15/10/2026 11:52:20 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 6 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E02-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 19.0s | 00:00 → 00:18 | - |
| E2E02-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 63.1s | 00:19 → 01:22 | - |
| E2E02-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.5s | 01:22 → 01:42 | Dashboard GET /api/home: trả về sau 67.1s (ngưỡng 30s) |
| E2E02-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:42 → 01:58 | - |
| E2E02-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 16.8s | 01:58 → 02:14 | - |
| E2E02-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 76.7s | 02:14 → 03:31 | - |

Report gốc: reports/Runs/E2E-02_15-10-2026_11-52-20_dev/SUMMARY.md
