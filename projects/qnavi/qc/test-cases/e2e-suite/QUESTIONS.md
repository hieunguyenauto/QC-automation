# Câu hỏi — E2E suite · cập nhật 13/10/2026 (lượt 2)
Còn mở **29 câu** (13 mới + 16 cũ). Anh điền cột "Trả lời của anh"; đồng ý đề xuất thì ghi "OK".

## A. Câu còn mở — anh trả lời ở đây
### A1. Approve type / số tiền
| # | Câu hỏi | Case | Đề xuất của em | Trả lời của anh |
|---|---|---|---|---|
| N1 | Type 04 (STORE00004): số tiền nào cần mấy cấp? Anh ghi "≤ 50,000 → 3 cấp" nhưng Lv4 = 50,000. Em hiểu: ≤ 20,000 → Lv1 · ≤ 30,000 → Lv1–2 · ≤ 40,000 → Lv1–3 · ≤ 50,000 → Lv1–4 | 04, 09–13, 17, 22, 26 | Như cách hiểu; case 4 (¥49,999) → 4 cấp | |
| N2 | STORE00009: MANAGER00001 = Lv0, nhưng cuối lại ghi "lv0 là empty"; Lv4 và Lv5 đều là MANAGER00004 — có nhầm không? | 07 | Lv0 = MANAGER00001 | |
| N3 | Type 03 dùng store nào? | 03, 06, 14, 25 | LINKSYS STORE00008 (APPROVE TYPE 3) | |
| N5 | Không đổi được 承認タイプ (G2) → case "đổi type khi 再提示" (12: 02→04, 13: 04→02, 16: 02→04) làm thế nào? | 12, 13, 16 | Bỏ phần đổi type, giữ 差し戻し / 取り下げ / 再提示 | |
| N10 | Case 5 '< ¥5,000 below min, auto-approve': store nào, mức tối thiểu ở đâu? | 05 | STORE00005 (AUTO APPROVE), số tiền ¥4,999 | |
| N12 | Case 31, 34 có số tiền ≤ FIX → tự duyệt, không kiểm được nút của người duyệt no-key / read-key. Đổi sang > FIX? | 31, 34 | Đổi sang > FIX | |
| N13 | Type 04: manager duyệt tuần tự hay Admin bấm hộ từng cấp? | 04, 07, 09–13, 16, 17, 22, 26 | Manager tuần tự; Admin chỉ ở case ghi 'Admin' | |
| G13 | Case 10: 'fix both' (dòng 14) hay 'fix only CONTINUE' (dòng 78)? | 10 | fix both | |
| G24 | ≤ FIX tự duyệt áp cho cả Continue? | 01–39 | Có | |

### A2. Tài khoản / cấu hình
| # | Câu hỏi | Case | Đề xuất của em | Trả lời của anh |
|---|---|---|---|---|
| N4 | Không sửa được cấu hình → store nào KHÔNG có 限度額 (case 8; Continue của 9, 27)? | 08, 09, 27 | — | |
| N6 | Store read-key 00001 / no-key 00002: 承認タイプ là gì? "Read-key store approves" = đăng nhập linksysstore00001 để duyệt? | 29–34 | Đăng nhập tài khoản store | |
| N7 | 'Chain Store' và 'CS Admin' (duyệt báo cáo / thanh toán 作業完了確認) dùng tài khoản nào? | 01–39 | Chain Store = tài khoản store của case; CS Admin = manager quản lý store | |
| N8 | 'chainstore manager' tạo trouble: manager nào? | 02–07, 09–11, 16–18, 22, 23, 26, 37, 38 | MANAGER00001 | |
| N9 | 'Store Manager' (case 10, 13, 35–39) là ai? | 10, 13, 35–39 | — | |
| N11 | G23 "nên bỏ mặc định": KHÔNG sửa 限度額 (dùng cấu hình sẵn), hay được sửa và không cần trả lại? | 01–39 | Chỉ bật/tắt トラブルNAVI / シサンNAVI; không sửa 限度額 | |
| G7 | Worker thứ 2 khi đổi 作業スタッフ (変更あり) | 31 case | linksysworkerqnavi | |
| G8 | Admin / Sub Admin làm 作業完了確認 (thanh toán) trên CMS được không? | 24, 25, 30, 35 | — | |
| G10 | Case 26: Worker Company (05) tự tạo báo giá trên CMS hay Admin tạo thay? | 26 | Admin tạo thay | |
| G19 | Case 'Worker NO key': gán linksysworkerqnavi làm 作業者? | 13, 14, 26, 32, 33 | Có | |

### A3. Luồng / kiểm tra
| # | Câu hỏi | Case | Đề xuất của em | Trả lời của anh |
|---|---|---|---|---|
| G6 | トラブルNAVI OFF → tạo trouble bằng form web như file CSV? Admin tạo trouble luôn dùng form web? | 15 case | Đúng như CSV | |
| G9 | Case 24: các dòng NEW ghi 🚫 → NEW dừng ở đâu rồi sang Continue? | 24 | — | |
| G14 | 'non-target → 失効' khi chỉ có 1 báo giá (12, 29, 33) và 'approved → 失効' (16): báo giá nào bị 失効? | 12, 16, 29, 33 | — | |
| G15 | Case 17: 3 báo giá '1 duyệt → 2 失効, 下書き giữ lại' → 提示 mấy cái? Case 22 tương tự (urgent) | 17, 22 | 提示 3, duyệt 1 → 2 失効 | |
| G16 | Case 18 'bulk → 1 notification': kiểm trên CMS ở đâu? | 18 | Chỉ kiểm hộp xác nhận 3 báo giá; push để manual | |
| G17 | Case 22 (urgent): ai duyệt 1 báo giá để các cái khác 失効? | 22 | Admin | |
| G18 | No-key thấy số tiền '0', chữ '***'; '承認する' disabled, '差し戻し' enabled? | 29, 31, 33, 34 | Đúng như README dự án | |
| G25 | Case 24, 25, 27 (iOS / Android / cross-device): phần thiết bị không test — OK? | 24, 25, 27 | OK | |
| G26 | Case 39: đính PDF ở hộp 報告書 (như phase007 TC-038), file test1.pdf? | 39 | OK | |
| G29 | Case 37 (シサンNAVI ON, トラブルNAVI OFF): em tự xem trên app — anh đăng nhập Browser pane (dev) giúp em | 37 | — | |

## B. Đã chốt (không cần trả lời)
| # | Kết quả |
|---|---|
| G1 | Key: store read-key LINKSYS STORE00001 (TORIDOLL) · store no-key LINKSYS STORE00002 (QNAVI) · worker write-key linksysworker · worker no-key linksysworkerqnavi |
| G2 | Cấu hình approve type đã set sẵn, không đổi được |
| G3 | So 限度額 theo 税込 (tổng ở 見積もり) |
| G4 | Theo thông số approve type bên dưới |
| G5 | Urgent: 編集 trouble → 案件区分 '営業停止案件' → 保存. Không cần duyệt báo giá, vẫn qua 02-07 |
| G11 | Bỏ case 28 → còn 38 case |
| G12 | Case 34: người tạo = chainstore |
| G21 / G22 | Theo type 04 + Lv0 và type 02 bên dưới |
| G23 | Được bật/tắt (xem N11) |
| G27 | ≤ FIX tự duyệt; > FIX người đó duyệt |
| G28 | Lưu ở projects/qnavi/qc/test-cases/e2e-suite/ |
| Q2–Q9 | Đã áp từ lượt 1 (store đăng nhập CMS role 02, luồng トラブルNAVI, 限度額 ở チェーンシステム情報, ≤ 限度額 tự duyệt, 継続依頼 '_2', báo cáo = đổi trạng thái, bỏ 日程承認, môi trường tuỳ biến) |

### Thông số approve type (anh cung cấp 13/10)
| Type | Store | Người duyệt |
|---|---|---|
| 01 | LINKSYS STORE00006 | MANAGER00005 hoặc MANAGER00003 — 1 người duyệt là xong |
| 02 | LINKSYS STORE00007 | MANAGER00001 duyệt trước → MANAGER00002 duyệt tiếp; MANAGER00002 duyệt trực tiếp → xong |
| 03 | [N3] | MANAGER00004: ￥10,000～￥20,000 · MANAGER00005: ￥0～無制限 (税込; ngoài khoảng không duyệt được) |
| 04 | LINKSYS STORE00004 | Lv1 20,000 MANAGER00001 · Lv2 30,000 MANAGER00002 · Lv3 40,000 MANAGER00003 · Lv4 50,000 MANAGER00004. Admin bấm từng cấp; manager duyệt tuần tự, đã duyệt thì mất nút 承認する |
| 04 + Lv0 | LINKSYS STORE00009 | MANAGER00001 = Lv0 → duyệt thẳng [N2] |
