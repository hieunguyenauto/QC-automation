# PASSED · E2E-17.spec_16-10-2026_09-35-21_dev

Chạy lúc 16/10/2026 09:35:21 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 17 / 17

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E17-TC-001 | SETUP · LINKSYS STORE00004; 限度額 read | 99 | 18.2s | 00:00 → 00:18 | - |
| E2E17-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.8s | 00:18 → 01:16 | - |
| E2E17-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.2s | 01:16 → 01:33 | Dashboard GET /api/home: trả về sau 61.3s (ngưỡng 30s) |
| E2E17-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.6s | 01:33 → 01:49 | - |
| E2E17-TC-005 | NEW · Create 4 estimates (total = FIX + 1), 提示 3, keep 1 下書き | 99 | 30.2s | 01:49 → 02:19 | - |
| E2E17-TC-006 | NEW · Approve type 04 (稟議, sequential managers) | 01 | 40.7s | 02:19 → 03:00 | - |
| E2E17-TC-007 | NEW · Other estimates → 失効 after approval | 99 | 16.6s | 03:00 → 03:17 | Dashboard GET /api/home: trả về sau 44.9s (ngưỡng 30s) |
| E2E17-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 16.2s | 03:17 → 03:33 | - |
| E2E17-TC-009 | NEW · CS Admin 確認・決済 → 完了 | 01 | 39.1s | 03:33 → 04:12 | - |
| E2E17-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 40.5s | 04:12 → 04:52 | - |
| E2E17-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 4.6s | 04:52 → 04:57 | - |
| E2E17-TC-012 | CONTINUE · Create 2 estimate(s) (total = FIX − 1) and 提示 | 99 | 31.7s | 04:57 → 05:29 | Dashboard GET /api/home: trả về sau 88.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 48.6s (ngưỡng 30s) |
| E2E17-TC-013 | CONTINUE · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' (Lv1) | 01 | 42.1s | 05:29 → 06:11 | - |
| E2E17-TC-014 | CONTINUE · Other estimate → 失効 | 99 | 15.6s | 06:11 → 06:26 | Dashboard GET /api/home: trả về sau 45.5s (ngưỡng 30s) |
| E2E17-TC-015 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.5s | 06:26 → 06:52 | - |
| E2E17-TC-016 | CONTINUE · 報告済 (02-90) | 99 | 11.1s | 06:52 → 07:03 | - |
| E2E17-TC-017 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 46.1s | 07:03 → 07:49 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-17.spec_16-10-2026_09-35-21_dev/SUMMARY.md
