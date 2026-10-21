# PASSED · E2E-04.spec_15-10-2026_16-59-26_dev

Chạy lúc 15/10/2026 16:59:26 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E04-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 16.5s | 00:00 → 00:16 | - |
| E2E04-TC-002 | NEW · chainstore manager creates trouble (web form) | 01 | 52.7s | 00:17 → 01:09 | - |
| E2E04-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.4s | 01:09 → 01:28 | Dashboard GET /api/home: trả về sau 57.3s (ngưỡng 30s) |
| E2E04-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 19.9s | 01:28 → 01:48 | - |
| E2E04-TC-005 | NEW · Create 1 estimate(s) (total = ¥49,999) and 提示 | 99 | 16.6s | 01:48 → 02:04 | - |
| E2E04-TC-006 | NEW · Approve (3 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' → ChainStore Manager 'LINKSYS MANAGER00003' | 01 | 121.4s | 02:04 → 04:06 | - |
| E2E04-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.3s | 04:06 → 04:31 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 86.9s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 48.3s (ngưỡng 30s) |
| E2E04-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.5s | 04:31 → 05:09 | - |
| E2E04-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.0s | 05:09 → 05:48 | - |
| E2E04-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.3s | 05:48 → 05:52 | - |
| E2E04-TC-011 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 25.6s | 05:52 → 06:17 | Dashboard GET /api/home: trả về sau 84.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.6s (ngưỡng 30s) |
| E2E04-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 6.0s | 06:17 → 06:23 | - |
| E2E04-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 27.0s | 06:23 → 06:50 | - |
| E2E04-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 11.2s | 06:50 → 07:02 | - |
| E2E04-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 44.7s | 07:02 → 07:46 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-04.spec_15-10-2026_16-59-26_dev/SUMMARY.md
