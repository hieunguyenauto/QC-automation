# E2E-01_15-10-2026_10-11-10_est-test

Chạy lúc 15/10/2026 10:11:10 · môi trường est-test (https://cms-test.estimation.qnavi.picontechnology.com)

| Tổng | Pass | Fail | Skip | Thời gian | Trạng thái |
|---|---|---|---|---|---|
| 15 | 1 | 1 | 13 | 84.8s | FAILED |

## Cảnh báo môi trường (app hiện hộp lỗi, test đã tự đóng — cần báo dev / theo dõi)

| TC ID | Test case | Cảnh báo |
|---|---|---|
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin · Hộp lỗi app đã tự đóng (OK): 確認 表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。 OK — URL https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create · firebase-auth/exchange lỗi HTTP 504 → app huỷ request đang chạy — URL https://cms-test.estimation.qnavi.picontechnology.com/admin/trouble/create |

## Performance (lưu tạm để check sau — không làm fail TC; log dồn: reports/PERFORMANCE.md)

| TC ID | Test case | Chi tiết |
|---|---|---|
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | Dashboard GET /api/home: không trả về trong 180s (ngưỡng 30s) |

## Failed

| TC ID | Test case | Bước fail | Lỗi | Chi tiết |
|---|---|---|---|---|
| E2E01-TC-002 | NEW · chainstore creates trouble (トラブルナビ) | 3. 故障内容 '選択' → '水' → Verify: webview 'トラブル相談内容', 大項目 = '水' | Error: expect(locator).toBeVisible() failed | [FAIL.md](../../Failed/E2E01-TC-002_NEW-·-chainstore-creates-trouble-トラブルナビ_15-10-2026_10-11-10_est-test/FAIL.md) |

## Passed

Chi tiết + video đầy đủ: [PASSED.md](../../Passed/E2E-01_15-10-2026_10-11-10_est-test/PASSED.md)

| TC ID | Test case | Tài khoản / role | Thời gian | Tua video |
|---|---|---|---|---|
| E2E01-TC-001 | SETUP · LINKSYS STORE00006; 限度額 read | 99 | 19.8s | 00:00 |

## Skipped

| TC ID | Test case | Lý do |
|---|---|---|
| E2E01-TC-003 | NEW · Admin: 対応中 + assign worker | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-004 | NEW · 受注 → 移動中 → 到着 (02-04) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-005 | NEW · Create 1 estimate (total = FIX − 1) and 提示 | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-006 | NEW · ≤ FIX → auto approve (no approver) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-007 | NEW · 作業完了 → 報告済 (02-08 → 02-09) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-008 | NEW · Chain Store 確認・決済 → 完了 | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-009 | CONTINUE · subadmin creates 継続依頼 '_2' | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-010 | CONTINUE · 作業スタッフ kept (linksysworker) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-011 | CONTINUE · Create 1 estimate (total = FIX − 1) and 提示 | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-012 | CONTINUE · ≤ FIX → auto approve (no approver) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-013 | CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-014 | CONTINUE · 報告済 (02-90) | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |
| E2E01-TC-015 | CONTINUE · Chain Store 確認・決済 → 完了 | Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện) |

Video cả lần chạy: [../../Passed/E2E-01_15-10-2026_10-11-10_est-test/video-full.webm](../../Passed/E2E-01_15-10-2026_10-11-10_est-test/video-full.webm) — mốc tua từng TC ghi trong PASSED.md / FAIL.md; TC fail có thêm video-fail.webm.

Report gốc của Playwright: `npm run report` (thư mục `html/` cạnh file này) — bấm vào TC fail để xem trace / ảnh.
