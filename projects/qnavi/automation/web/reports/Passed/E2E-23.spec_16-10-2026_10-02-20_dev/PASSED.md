# PASSED · E2E-23.spec_16-10-2026_10-02-20_dev

Chạy lúc 16/10/2026 10:02:20 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 11 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E23-TC-001 | SETUP · LINKSYS STORE00007; 限度額 read | 99 | 17.9s | 00:00 → 00:17 | - |
| E2E23-TC-002 | NEW · chainstore manager creates trouble (トラブルナビ) | 01 | 56.5s | 00:18 → 01:15 | - |
| E2E23-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 17.7s | 01:15 → 01:32 | Dashboard GET /api/home: trả về sau 60.3s (ngưỡng 30s) |
| E2E23-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.6s | 01:32 → 01:48 | - |
| E2E23-TC-005 | NEW · Create 1 estimate(s) (total = FIX + 1) and 提示 | 99 | 15.5s | 01:48 → 02:03 | - |
| E2E23-TC-006 | NEW · Approve (2 level(s)): ChainStore Manager 'LINKSYS MANAGER00001' → ChainStore Manager 'LINKSYS MANAGER00002' | 01 | 76.4s | 02:03 → 03:20 | - |
| E2E23-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 25.1s | 03:20 → 03:45 | Dashboard GET /api/home: trả về sau 80.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 43.5s (ngưỡng 30s) |
| E2E23-TC-008 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.3s | 03:45 → 04:23 | - |
| E2E23-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 38.9s | 04:23 → 05:02 | - |
| E2E23-TC-010 | CONTINUE · Set urgent: 案件区分 営業停止案件 | 99 | 19.0s | 05:02 → 05:21 | Dashboard GET /api/home: trả về sau 81.4s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 42.9s (ngưỡng 30s) |
| E2E23-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 28.9s | 05:21 → 05:50 | - |

Report gốc: reports/Runs/E2E-23.spec_16-10-2026_10-02-20_dev/SUMMARY.md
