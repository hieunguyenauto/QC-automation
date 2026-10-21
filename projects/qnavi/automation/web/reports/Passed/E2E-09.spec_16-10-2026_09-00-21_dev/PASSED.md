# PASSED · E2E-09.spec_16-10-2026_09-00-21_dev

Chạy lúc 16/10/2026 09:00:21 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E09-TC-001 | SETUP · LINKSYS STORE00005; 限度額 read | 99 | 17.1s | 00:00 → 00:17 | - |
| E2E09-TC-002 | NEW · chainstore manager creates trouble (web form) | 01 | 54.1s | 00:17 → 01:11 | - |
| E2E09-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 19.1s | 01:11 → 01:31 | Dashboard GET /api/home: trả về sau 58.1s (ngưỡng 30s) |
| E2E09-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 17.3s | 01:31 → 01:48 | - |
| E2E09-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 18.9s | 01:48 → 02:07 | - |
| E2E09-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' | 01 | 43.9s | 02:07 → 02:51 | - |
| E2E09-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 27.0s | 02:51 → 03:18 | Dashboard GET /api/home: trả về sau 47.6s (ngưỡng 30s) |
| E2E09-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 39.4s | 03:18 → 03:57 | - |
| E2E09-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.1s | 03:57 → 04:36 | - |
| E2E09-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.5s | 04:36 → 04:40 | - |
| E2E09-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX + 1 (cột gốc "no limit"; STORE00005 vẫn có FIX — N17)) and 提示 | 99 | 26.6s | 04:40 → 05:06 | Dashboard GET /api/home: trả về sau 85.6s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 46.2s (ngưỡng 30s) |
| E2E09-TC-012 | CONTINUE · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' | 01 | 40.2s | 05:06 → 05:46 | - |
| E2E09-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 35.9s | 05:46 → 06:22 | Dashboard GET /api/home: trả về sau 44.0s (ngưỡng 30s) |
| E2E09-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.1s | 06:22 → 06:34 | - |
| E2E09-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 42.7s | 06:34 → 07:17 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-09.spec_16-10-2026_09-00-21_dev/SUMMARY.md
