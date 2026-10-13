# Câu hỏi — E2E suite (39 kịch bản) · 13/10/2026
Trả lời theo số Gx. Ô "Đề xuất" = em sẽ làm vậy nếu anh đồng ý (chỉ cần ghi "OK").
Đã trả lời trước đó (áp vào cả 39 file): Q2 store đăng nhập CMS bằng role 02 · Q3 luồng トラブルナビ · Q4 xem 限度額 ở チェーンシステム情報 · Q5 ≤ 限度額 → tự duyệt · Q6 tạo 継続依頼 '_2' · Q7 báo cáo = đổi trạng thái CMS · Q8 bỏ 日程承認 · Q9 môi trường tuỳ biến.

## A. Tài khoản và cấu hình (chặn cả 39 file)
| # | Câu hỏi | Case | Đề xuất của em |
|---|---|---|---|
| G1 | Bảng map vai trò → tài khoản. Cần: chainstore theo từng 承認タイプ 01–04; chainstore manager; CS Admin Lv1, Lv2, Lv3, Lv4 (cao nhất); CS Admin có khoảng tiền (range) và 0→∞; CS Admin Level 0 (thay thế); Store Manager; store read-key; store no-key; worker 2 | 01–39 | type01 → STORE00006 · type02 → STORE00007 · type03 → STORE00008 · type04 稟議 → STORE00004 · auto → STORE00005 · Level 0 → STORE00009 · urgent → STORE00003 · chainstore manager → MANAGER00001 · còn lại anh bổ sung |
| G2 | 承認タイプ (01–04) của store cấu hình ở đâu? Có đổi được giữa 2 lần 提示 không (case 12: 02→04, 13: 04→02, 15: 01→01, 16: 02→04)? | 01–39 | Mỗi case dùng 1 store cố định đúng type; case đổi type → Admin sửa ở チェーンシステム情報 › store › 編集 giữa 2 lần 提示 |
| G3 | So sánh với 限度額 theo 税抜 hay 税込? | 01–39 | 税込 (tổng hiển thị ở 見積もり) |
| G4 | Số tiền cụ thể: case 4 '> fix (¥49,999)' (FIX phải < 49,999?) · case 5 '< ¥5,000 (below min)' — mức tối thiểu type04 cấu hình ở đâu? · case 3, 14, 25 'within range' và case 6 '0→∞' — khoảng tiền của người duyệt cấu hình ở đâu? · case 6 '> fix (high)' bao nhiêu? | 03, 04, 05, 06, 14, 25 | Đọc cấu hình trên app (như Q4) rồi chọn số, ghi vào data |
| G23 | Được phép sửa 限度額 / toggle ナビ của Linksys trên môi trường test không? Có cần trả lại giá trị cũ cuối mỗi case không? | 08, 09, 27 (+ TC-001 mọi case) | Được sửa; cuối case trả lại FIX cũ |

## B. Tạo trouble
| # | Câu hỏi | Case | Đề xuất |
|---|---|---|---|
| G5 | Tạo trouble 緊急 (urgent) thế nào? Radio '至急' trong トラブルナビ có phải là cờ urgent không? Case thường (không urgent) thì chọn radio nào? Continue urgent (20, 21, 23) bật ở đâu? | 24 case có トラブルナビ / urgent | — |
| G6 | トラブルナビ OFF → tạo bằng form web như file CSV (作業依頼登録 → chọn store → 作業項目 → 故障詳細), đúng không? Admin tạo trouble khi トラブルナビ ON cũng dùng form web? | 15 case | Đúng như CSV; admin luôn dùng form web |
| G12 | Case 34: 'Trouble creator' ghi 'CMS Web' (có vẻ nhầm cột) → ai tạo? | 34 | chainstore |
| G29 | Case 37: シサンNAVI ON nhưng トラブルナビ OFF → chọn tài sản ở form web giống CSV bước 17–37? | 37 | Đúng như CSV |
| G11 | Case 28: tạo trouble 'OLD version' thế nào? | 28 | — |

## C. Báo giá và duyệt
| # | Câu hỏi | Case | Đề xuất |
|---|---|---|---|
| G27 | 16 case có số tiền ≤ FIX (→ tự duyệt theo Q5) nhưng cột 'Approver' lại ghi người duyệt cụ thể (vd 27 Chain Store, 31 read-key store, 34 no-key store, 35–39 Store Manager; Continue của 01, 04, 24–31). Giữ tự duyệt hay đổi số tiền thành > FIX để người đó duyệt? Đặc biệt 31, 34 (kiểm key) cần có người duyệt | 01, 04, 24–31, 34–39 | 31, 34: đổi thành > FIX; còn lại giữ tự duyệt |
| G20 | 稟議: mỗi cấp Lv1 → Lv3 duyệt bằng tài khoản riêng, hay Admin duyệt hộ lặp tới 承認済み như phase007 (P6)? | 04, 07, 09, 10, 12, 16, 17, 26 | Tài khoản riêng nếu có (G1), không thì Admin duyệt hộ |
| G21 | Case 7 'Level 0 substitute approver' là cấu hình gì, kiểm điều gì? | 07 | — |
| G22 | Case 2 'Type02 multi-level, highest must approve': cấp thấp bấm 承認する thì trạng thái thế nào? | 02 | Cấp thấp duyệt → vẫn 承認待ち; cấp cao nhất duyệt → 承認済み |
| G14 | 'non-target → 失効' khi chỉ có 1 báo giá (12, 29, 33) / 'approved → 失効' (16): báo giá nào bị 失効? Re-edit có tạo bản mới không? | 12, 16, 29, 33 | — |
| G15 | Case 17: 3 báo giá '1 approve → 2 失効 (下書き kept)' — 提示 mấy cái, giữ nháp mấy cái? Case 22: 3 báo giá urgent | 17, 22 | 17: 提示 2 + giữ 1 nháp? |
| G16 | Case 18 'bulk submit → 1 notification': trên CMS kiểm '1 notification' ở đâu (push không thấy trên CMS)? | 18 | Chỉ kiểm hộp xác nhận liệt kê 3 báo giá + 3 dòng 承認待ち; push để manual |
| G17 | Case 22 (urgent, không cần duyệt): ai duyệt 1 báo giá để 2 cái còn lại 失効? | 22 | Admin duyệt hộ |
| G24 | Quy tắc Q5 (≤ 限度額 → tự duyệt) áp cho cả Continue? | 01–39 | Có (đã áp) |
| G13 | Case 10: dòng 14 ghi 'fix both NEW and CONTINUE', dòng 78 ghi 'fix only CONTINUE' — đúng là cái nào? | 10 | Theo dòng 14 (cả 2) |

## D. Key / mã hoá
| # | Câu hỏi | Case | Đề xuất |
|---|---|---|---|
| G18 | Kiểm key trên CMS: no-key thấy số tiền '0', chữ '***' (README dự án) — đúng không? Nút của no-key: '承認する' disabled, '差し戻し' (file ghi '承認しない') enabled? | 29, 31, 33, 34 | Đúng như README |
| G19 | Worker 'No key' (13, 14, 26, 28, 32, 33): báo giá do Admin tạo thay trên CMS nên không kiểm được phía worker → bỏ phần kiểm worker? | 13, 14, 26, 28, 32, 33 | Bỏ, ghi chú manual |

## E. Thiết bị / vai trò đặc biệt
| # | Câu hỏi | Case | Đề xuất |
|---|---|---|---|
| G25 | Case 24 iOS, 25 Android, 27 cross-device: phần thiết bị không test (báo giá admin tạo trên CMS) — OK? | 24, 25, 27 | OK, ghi chú manual / Appium sau |
| G9 | Case 24: các dòng 'duyệt NEW', 'báo cáo', 'kết quả NEW' ghi 🚫 → NEW dừng ở bước nào rồi sang Continue? | 24 | — |
| G10 | Case 26: Worker Company (05) đăng nhập CMS tự tạo báo giá được không, hay Admin tạo thay? | 26 | Admin tạo thay |
| G8 | Admin / Sub Admin là người thanh toán (作業完了確認) trên CMS được không? | 24, 25, 30, 35 | — |
| G26 | Case 39 'report with attach PDF': đính PDF ở hộp 報告書 (như phase007 TC-038)? File nào? | 39 | test1.pdf ở hộp 報告書 |
| G7 | Worker thứ 2 để đổi 作業スタッフ ở Continue (変更あり) | 31 case | — |

## F. Tổ chức file
| # | Câu hỏi | Đề xuất |
|---|---|---|
| G28 | Lưu ở projects/qnavi/qc/test-cases/e2e-suite/E2E-NN-<tên>-test-cases.md, mã TC 'E2ENN-TC-NNN' | OK |
