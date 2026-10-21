# PASSED · E2E-20.spec_16-10-2026_11-51-39_dev

Chạy lúc 16/10/2026 11:51:39 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E20-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 18.3s | 00:00 → 00:18 | - |
| E2E20-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.7s | 00:18 → 01:13 | - |
| E2E20-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.7s | 01:13 → 01:31 | Dashboard GET /api/home: trả về sau 58.7s (ngưỡng 30s) |
| E2E20-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.6s | 01:31 → 01:46 | - |
| E2E20-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 23.1s | 01:46 → 02:10 | - |
| E2E20-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00005' | 01 | 39.8s | 02:10 → 02:49 | - |
| E2E20-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 24.7s | 02:49 → 03:14 | Dashboard GET /api/home: trả về sau 43.7s (ngưỡng 30s) |
| E2E20-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 37.9s | 03:14 → 03:52 | - |
| E2E20-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.6s | 03:52 → 04:31 | - |
| E2E20-TC-010 | CONTINUE · Set urgent: 案件区分 営業停止案件 | 99 | 18.6s | 04:31 → 04:49 | Dashboard GET /api/home: trả về sau 80.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 41.8s (ngưỡng 30s) |
| E2E20-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 28.8s | 04:49 → 05:18 | - |
| E2E20-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.2s | 05:18 → 05:42 | Dashboard GET /api/home: trả về sau 32.6s (ngưỡng 30s) |
| E2E20-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.3s | 05:42 → 06:07 | - |
| E2E20-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.4s | 06:07 → 06:18 | - |
| E2E20-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | 02 | 43.1s | 06:18 → 07:01 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-20.spec_16-10-2026_11-51-39_dev/SUMMARY.md
