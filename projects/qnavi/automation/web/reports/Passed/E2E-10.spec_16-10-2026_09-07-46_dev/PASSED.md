# PASSED · E2E-10.spec_16-10-2026_09-07-46_dev

Chạy lúc 16/10/2026 09:07:46 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E10-TC-001 | SETUP · LINKSYS STORE00005; 限度額 read | 99 | 17.9s | 00:00 → 00:18 | - |
| E2E10-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 61.0s | 00:18 → 01:19 | - |
| E2E10-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.4s | 01:19 → 01:39 | Dashboard GET /api/home: trả về sau 60.6s (ngưỡng 30s) |
| E2E10-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 17.6s | 01:39 → 01:56 | - |
| E2E10-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 19.0s | 01:56 → 02:15 | - |
| E2E10-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' | 01 | 39.7s | 02:15 → 02:55 | - |
| E2E10-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 26.2s | 02:55 → 03:21 | Dashboard GET /api/home: trả về sau 43.1s (ngưỡng 30s) |
| E2E10-TC-008 | NEW · Store Manager 確認・決済 → 完了 | 01 | 38.8s | 03:21 → 04:00 | - |
| E2E10-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.8s | 04:00 → 04:39 | - |
| E2E10-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.5s | 04:39 → 04:42 | - |
| E2E10-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 28.0s | 04:42 → 05:10 | Dashboard GET /api/home: trả về sau 85.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.1s (ngưỡng 30s) |
| E2E10-TC-012 | CONTINUE · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' | 01 | 40.4s | 05:10 → 05:51 | - |
| E2E10-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 35.3s | 05:51 → 06:26 | Dashboard GET /api/home: trả về sau 44.1s (ngưỡng 30s) |
| E2E10-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.0s | 06:26 → 06:38 | - |
| E2E10-TC-015 | CONTINUE · Store Manager 確認・決済 → 完了 | 01 | 45.6s | 06:38 → 07:24 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-10.spec_16-10-2026_09-07-46_dev/SUMMARY.md
