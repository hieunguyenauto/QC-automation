# PASSED · E2E-20.spec_16-10-2026_09-47-04_dev

Chạy lúc 16/10/2026 09:47:04 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 11 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E20-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 15.4s | 00:00 → 00:15 | - |
| E2E20-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 02 | 54.8s | 00:16 → 01:10 | - |
| E2E20-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 18.0s | 01:10 → 01:28 | Dashboard GET /api/home: trả về sau 58.8s (ngưỡng 30s) |
| E2E20-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.5s | 01:28 → 01:44 | - |
| E2E20-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 15.2s | 01:44 → 01:59 | - |
| E2E20-TC-006 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00005' | 01 | 39.6s | 01:59 → 02:39 | - |
| E2E20-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.0s | 02:39 → 03:04 | Dashboard GET /api/home: trả về sau 43.0s (ngưỡng 30s) |
| E2E20-TC-008 | NEW · Chain Store 確認・決済 → 完了 | 02 | 39.1s | 03:04 → 03:43 | - |
| E2E20-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.5s | 03:43 → 04:21 | - |
| E2E20-TC-010 | CONTINUE · Set urgent: 案件区分 営業停止案件 | 99 | 18.3s | 04:21 → 04:40 | Dashboard GET /api/home: trả về sau 81.6s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 42.2s (ngưỡng 30s) |
| E2E20-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 28.9s | 04:40 → 05:08 | - |

Report gốc: reports/Runs/E2E-20.spec_16-10-2026_09-47-04_dev/SUMMARY.md
