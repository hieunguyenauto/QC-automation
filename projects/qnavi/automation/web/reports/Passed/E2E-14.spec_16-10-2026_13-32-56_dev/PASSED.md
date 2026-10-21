# PASSED · E2E-14.spec_16-10-2026_13-32-56_dev

Chạy lúc 16/10/2026 13:32:56 · môi trường dev (https://cms-toridoll-test.qnavi.picontechnology.com) · Pass 16 / 16

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E14-TC-001 | SETUP · LINKSYS STORE00008; 限度額 read | 99 | 15.1s | 00:00 → 00:15 | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-toridoll-test.qnavi.picontechnology.com/admin |
| E2E14-TC-002 | NEW · admin creates trouble (web form) | 99 | 25.4s | 00:15 → 00:41 | - |
| E2E14-TC-003 | NEW · Admin: 対応中 + assign worker | 99 | 9.2s | 00:41 → 00:50 | - |
| E2E14-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | 99 | 15.1s | 00:50 → 01:05 | - |
| E2E14-TC-005 | NEW · Create 1 estimate(s) (total within ¥10,000–¥20,000 (range of MANAGER00004) and > FIX) and 提示 | 98 | 43.2s | 01:05 → 01:48 | - |
| E2E14-TC-006 | NEW · 取り下げ申請 → 却下 → コピー → 新規提示 | 99 | 75.7s | 01:48 → 03:04 | Dashboard GET /api/home: trả về sau 46.7s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 39.4s (ngưỡng 30s) |
| E2E14-TC-007 | NEW · Approve (1 level(s)): ChainStore Manager 'LINKSYS MANAGER00004' | 01 | 39.8s | 03:04 → 03:44 | - |
| E2E14-TC-008 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | 99 | 30.2s | 03:44 → 04:14 | Dashboard GET /api/home: trả về sau 47.8s (ngưỡng 30s) |
| E2E14-TC-009 | NEW · CS Admin 確認・決済 → 完了 | 01 | 38.0s | 04:14 → 04:52 | - |
| E2E14-TC-010 | CONTINUE · subadmin creates 継続依頼 '_2' | 98 | 39.3s | 04:52 → 05:31 | - |
| E2E14-TC-011 | CONTINUE · 作業スタッフ kept (linksysworker) | 98 | 3.2s | 05:31 → 05:34 | - |
| E2E14-TC-012 | CONTINUE · Create 1 estimate(s) (total = FIX − 1) and 提示 | 99 | 22.8s | 05:34 → 05:57 | Dashboard GET /api/home: trả về sau 84.0s (ngưỡng 30s) · Dashboard GET /api/home: trả về sau 45.8s (ngưỡng 30s) |
| E2E14-TC-013 | CONTINUE · ≤ FIX → auto approve (no approver) | 99 | 5.8s | 05:57 → 06:03 | - |
| E2E14-TC-014 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80) | 99 | 25.4s | 06:03 → 06:29 | - |
| E2E14-TC-015 | CONTINUE · 報告済 (02-90) | 99 | 11.3s | 06:29 → 06:40 | - |
| E2E14-TC-016 | CONTINUE · CS Admin 確認・決済 → 完了 | 01 | 42.7s | 06:40 → 07:23 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s) |

Report gốc: reports/Runs/E2E-14.spec_16-10-2026_13-32-56_dev/SUMMARY.md
