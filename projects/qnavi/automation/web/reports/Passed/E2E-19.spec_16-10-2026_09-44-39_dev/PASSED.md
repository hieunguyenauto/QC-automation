# PASSED · E2E-19.spec_16-10-2026_09-44-39_dev

Chạy lúc 16/10/2026 09:44:39 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 5 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E19-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 16.7s | 00:00 → 00:16 | - |
| E2E19-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 55.1s | 00:17 → 01:12 | - |
| E2E19-TC-003 | NEW · Set urgent: 案件区分 営業停止案件 | 99 | 18.4s | 01:12 → 01:30 | Dashboard GET /api/home: trả về sau 58.9s (ngưỡng 30s) |
| E2E19-TC-004 | NEW · Admin: 対応中 + assign worker | 99 | 9.2s | 01:30 → 01:40 | - |
| E2E19-TC-005 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.9s | 01:40 → 01:55 | - |

Report gốc: reports/Runs/E2E-19.spec_16-10-2026_09-44-39_dev/SUMMARY.md
