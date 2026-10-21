# PASSED · E2E-01_15-10-2026_14-17-52_est-test

Chạy lúc 15/10/2026 14:17:53 · môi trường est-test (https://cms-test.estimation.qnavi.picontechnology.com) · Pass 1 / 15

Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |
|---|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 133.0s | 00:00 → 02:12 | Dashboard GET /api/home: không trả về trong 120s (ngưỡng 30s), app huỷ 1 lần (ERR_ABORTED) · firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin |

Report gốc: reports/Runs/E2E-01_15-10-2026_14-17-52_est-test/SUMMARY.md
