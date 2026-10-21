# PASSED · E2E-23.spec_16-10-2026_12-10-16_dev

Chạy lúc 16/10/2026 12:10:16 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 15 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E23-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 17.7s | 00:00 → 00:17 | - |
| E2E23-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 57.5s | 00:18 → 01:15 | - |
| E2E23-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.1s | 01:15 → 01:33 | Dashboard GET /api/home: trả về sau 61.2s (ngưỡng 30s) |
| E2E23-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 16.3s | 01:33 → 01:50 | - |
| E2E23-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 19.4s | 01:50 → 02:09 | - |
| E2E23-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 76.7s | 02:09 → 03:26 | - |
| E2E23-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 26.2s | 03:26 → 03:52 | Dashboard GET /api/home: trả về sau 80.5s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 43.5s (ngưỡng 30s) |
| E2E23-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.4s | 03:52 → 04:31 | - |
| E2E23-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.5s | 04:31 → 05:09 | - |
| E2E23-TC-010 | CONTINUE · Set urgent: 案件区分 営業停止案件 | 99 | 18.0s | 05:09 → 05:27 | Dashboard GET /api/home: trả về sau 80.2s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 41.8s (ngưỡng 30s) |
| E2E23-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 28.9s | 05:27 → 05:56 | - |
| E2E23-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 24.6s | 05:56 → 06:21 | Dashboard GET /api/home: trả về sau 32.7s (ngưỡng 30s) |
| E2E23-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 24.9s | 06:21 → 06:46 | - |
| E2E23-TC-014 | CONTINUE · 報告済 (02-90) | 99 | 12.2s | 06:46 → 06:58 | - |
| E2E23-TC-015 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 43.6s | 06:58 → 07:41 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-23.spec_16-10-2026_12-10-16_dev/SUMMARY.md
