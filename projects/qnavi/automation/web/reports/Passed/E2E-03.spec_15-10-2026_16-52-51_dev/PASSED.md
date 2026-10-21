# PASSED · E2E-03.spec_15-10-2026_16-52-51_dev

Chạy lúc 15/10/2026 16:52:51 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E03-TC-001 | SETUP · LINKSYS STORE00008; 限度額 read | 99 | 17.4s | 00:00 → 00:17 | - |
| E2E03-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 56.9s | 00:18 → 01:15 | - |
| E2E03-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.1s | 01:15 → 01:33 | Dashboard GET /api/home: trả về sau 61.2s (ngưỡng 30s) |
| E2E03-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.1s | 01:33 → 01:49 | - |
| E2E03-TC-005 | NEW · Create 1 estimate(s) (total within ¥10,000–¥20,000 (range of MANAGER00004) and > FIX) and 提示 | 99 | 17.5s | 01:49 → 02:06 | - |
| E2E03-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00004' | 01 | 39.2s | 02:06 → 02:46 | - |
| E2E03-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.7s | 02:46 → 03:11 | Dashboard GET /api/home: trả về sau 42.6s (ngưỡng 30s) |
| E2E03-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 43.6s | 03:11 → 03:55 | - |
| E2E03-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:55 → 04:34 | - |
| E2E03-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.4s | 04:34 → 04:37 | - |
| E2E03-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 23.8s | 04:37 → 05:01 | Dashboard GET /api/home: trả về sau 90.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.0s (ngưỡng 30s) |
| E2E03-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.2s | 05:01 → 05:08 | - |
| E2E03-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 30.2s | 05:08 → 05:38 | - |
| E2E03-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 05:38 → 05:49 | - |
| E2E03-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 44.4s | 05:49 → 06:33 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-03.spec_15-10-2026_16-52-51_dev/SUMMARY.md
