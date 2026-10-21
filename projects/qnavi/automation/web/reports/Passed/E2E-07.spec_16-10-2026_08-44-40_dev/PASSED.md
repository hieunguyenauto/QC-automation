# PASSED · E2E-07.spec_16-10-2026_08-44-40_dev

Chạy lúc 16/10/2026 08:44:41 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E07-TC-001 | SETUP · LINKSYS STORE00009; 限度額 read | 99 | 17.5s | 00:00 → 00:17 | - |
| E2E07-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 58.0s | 00:18 → 01:16 | - |
| E2E07-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.6s | 01:16 → 01:34 | Dashboard GET /api/home: trả về sau 62.3s (ngưỡng 30s) |
| E2E07-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.8s | 01:34 → 01:50 | - |
| E2E07-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 17.8s | 01:50 → 02:08 | - |
| E2E07-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' (Lv0) | 01 | 40.4s | 02:08 → 02:48 | - |
| E2E07-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 24.6s | 02:48 → 03:13 | Dashboard GET /api/home: trả về sau 43.7s (ngưỡng 30s) |
| E2E07-TC-008 | NEW · CS Admin (Level 0) 確認・決済 → 完了 | 01 | 38.3s | 03:13 → 03:51 | - |
| E2E07-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.1s | 03:51 → 04:29 | - |
| E2E07-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 04:29 → 04:33 | - |
| E2E07-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.3s | 04:33 → 04:57 | Dashboard GET /api/home: trả về sau 83.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 44.7s (ngưỡng 30s) |
| E2E07-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.5s | 04:57 → 05:03 | - |
| E2E07-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.9s | 05:03 → 05:29 | - |
| E2E07-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 10.7s | 05:29 → 05:40 | - |
| E2E07-TC-015 | CONTINUE · CS Admin (Level 0) 確認・決済 → 完了 | 01 | 44.3s | 05:40 → 06:24 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-07.spec_16-10-2026_08-44-40_dev/SUMMARY.md
