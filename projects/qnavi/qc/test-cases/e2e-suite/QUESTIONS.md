# Câu hỏi — E2E suite · cập nhật 13/10/2026 (lượt 2)
Trả lời theo số. "Đề xuất" = em sẽ làm vậy nếu anh ghi "OK".

## 1. Thông tin anh đã cung cấp (em hiểu như sau — anh kiểm lại)
| Chủ đề | Em hiểu |
|---|---|
| Type 01 | LINKSYS STORE00006. Người duyệt: MANAGER00005 hoặc MANAGER00003 — 1 người duyệt là xong |
| Type 02 | LINKSYS STORE00007. MANAGER00001 duyệt trước → MANAGER00002 phải duyệt tiếp. MANAGER00002 duyệt trực tiếp → xong luôn |
| Type 03 | MANAGER00004: ￥10,000～￥20,000 (税込). MANAGER00005: ￥0～無制限. Ngoài khoảng → người đó không duyệt được |
| Type 04 | LINKSYS STORE00004. Lv1 20,000 (MANAGER00001) · Lv2 30,000 (MANAGER00002) · Lv3 40,000 (MANAGER00003) · Lv4 50,000 (MANAGER00004). Admin: bấm duyệt lần lượt từng cấp. Manager: duyệt tuần tự 1 → 2 → 3; người đã duyệt thì không còn nút 承認する |
| Type 04 + Lv0 | LINKSYS STORE00009. MANAGER00001 = Lv0 → duyệt thẳng, không qua cấp khác |
| Urgent | Vào 編集 trouble → 案件区分 '営業停止案件' → 保存. Không cần duyệt báo giá nhưng vẫn qua 02-07 (作業中) |
| Key | Store read-key: LINKSYS STORE00001 (TORIDOLL) · Store no-key: LINKSYS STORE00002 (QNAVI) · Worker write-key: linksysworker · Worker no-key: linksysworkerqnavi |
| Đã chốt | G2 cấu hình đã set sẵn, không đổi · G3 税込 · G12 chainstore · G11 bỏ case 28 (còn 38 case) · G27 ≤ FIX tự duyệt, > FIX người đó duyệt · G28 lưu ở qc/test-cases/e2e-suite |

## 2. Câu mới phát sinh từ thông tin trên
| # | Câu hỏi | Case | Đề xuất của em |
|---|---|---|---|
| N1 | Type 04: số tiền nào cần mấy cấp? Anh ghi "≤ 50,000 → duyệt 3 cấp", nhưng Lv4 = 50,000. Em hiểu: ≤ 20,000 → Lv1 · ≤ 30,000 → Lv1–2 · ≤ 40,000 → Lv1–3 · ≤ 50,000 → Lv1–4, đúng không? | 04, 09, 10, 11, 12, 13, 17, 22, 26 | Theo cách hiểu trên; case 4 (¥49,999) → 4 cấp |
| N2 | STORE00009: anh ghi MANAGER00001 = Lv0, nhưng cuối lại ghi "lv0 là empty"; Lv4 và Lv5 đều là MANAGER00004 — có nhầm không? | 07 | Lv0 = MANAGER00001 |
| N3 | Type 03 dùng store nào? | 03, 06, 14, 25 | LINKSYS STORE00008 (APPROVE TYPE 3) |
| N4 | Vì không đổi được cấu hình (G2): store nào KHÔNG có 限度額 (case 8; Continue của 9, 27)? | 08, 09, 27 | — |
| N5 | Vì không đổi được 承認タイプ: các case "đổi type khi 再提示" (12: 02→04, 13: 04→02, 16: 02→04) làm thế nào? | 12, 13, 16 | Bỏ phần đổi type, chỉ giữ 差し戻し / 取り下げ / 再提示 trên 1 store |
| N6 | Store read-key 00001 và no-key 00002: 承認タイプ là gì, ai duyệt? "Read-key store approves" là đăng nhập tài khoản store (linksysstore00001) để duyệt? | 29–34 | Đăng nhập tài khoản store |
| N7 | Vai trò 'Chain Store' và 'CS Admin' (người duyệt báo cáo / thanh toán 作業完了確認) đăng nhập bằng tài khoản nào? | 01–39 | Chain Store = tài khoản store của case; CS Admin = manager quản lý store đó |
| N8 | 'chainstore manager' tạo trouble: tài khoản manager nào? | 02–07, 09–11, 16–18, 22, 23, 26, 37, 38 | MANAGER00001 |
| N9 | 'Store Manager' (case 10, 13, 35–39) là ai? | 10, 13, 35–39 | — |
| N10 | Case 5 '< ¥5,000 below min, auto-approve': store nào, mức tối thiểu ở đâu? | 05 | STORE00005 (AUTO APPROVE), số tiền ¥4,999 |
| N11 | G23 anh ghi "nên bỏ mặc định": nghĩa là KHÔNG sửa 限度額 / toggle (dùng cấu hình sẵn), hay được sửa và không cần trả lại? | 01–39 | Chỉ bật/tắt トラブルNAVI và シサンNAVI; không sửa 限度額 |
| N12 | Case 34 (no-key: '承認する' disabled) và 31 (kiểm mã hoá) có số tiền ≤ FIX → tự duyệt theo G27, nên không kiểm được nút của người duyệt. Đổi 2 case này sang > FIX? | 31, 34 | Đổi sang > FIX |
| N13 | Type 04: dùng tài khoản manager duyệt tuần tự hay Admin bấm hộ từng cấp? | 04, 07, 09–13, 16, 17, 22, 26 | Manager duyệt tuần tự (đúng nghiệp vụ); Admin chỉ dùng ở case ghi 'Admin' |

## 3. Câu cũ còn mở
| # | Câu hỏi | Case | Đề xuất |
|---|---|---|---|
| G6 | トラブルNAVI OFF → tạo trouble bằng form web như file CSV? Admin tạo trouble luôn dùng form web? | 15 case | Đúng như CSV |
| G7 | Worker thứ 2 khi đổi 作業スタッフ (変更あり) | 31 case | linksysworkerqnavi (lưu ý: đổi sang worker no-key) |
| G8 | Admin / Sub Admin làm 作業完了確認 (thanh toán) trên CMS được không? | 24, 25, 30, 35 | — |
| G9 | Case 24: các dòng NEW ghi 🚫 → NEW dừng ở đâu rồi sang Continue? | 24 | — |
| G10 | Case 26: Worker Company (05) tự tạo báo giá trên CMS hay Admin tạo thay? | 26 | Admin tạo thay |
| G13 | Case 10: 'fix both' (dòng 14) hay 'fix only CONTINUE' (dòng 78)? | 10 | fix both |
| G14 | 'non-target → 失効' khi chỉ có 1 báo giá (12, 29, 33) và 'approved → 失効' (16): báo giá nào bị 失効? | 12, 16, 29, 33 | — |
| G15 | Case 17: 3 báo giá '1 duyệt → 2 失効, 下書き giữ lại' → 提示 mấy cái? Case 22: urgent 3 báo giá | 17, 22 | 17: 提示 3, duyệt 1 → 2 失効 |
| G16 | Case 18 'bulk → 1 notification': trên CMS kiểm ở đâu? | 18 | Chỉ kiểm hộp xác nhận 3 báo giá; push để manual |
| G17 | Case 22 (urgent, không cần duyệt): ai duyệt 1 báo giá để các cái khác 失効? | 22 | Admin |
| G18 | No-key thấy số tiền '0', chữ '***'; nút '承認する' disabled, '差し戻し' enabled — đúng không? | 29, 31, 33, 34 | Đúng như README dự án |
| G19 | Case 'Worker NO key' (32, 33): gán linksysworkerqnavi làm 作業者? | 13, 14, 26, 32, 33 | Gán linksysworkerqnavi |
| G24 | ≤ FIX tự duyệt áp cho cả Continue? | 01–39 | Có |
| G25 | Case 24, 25, 27 (iOS / Android / cross-device): phần thiết bị không test — OK? | 24, 25, 27 | OK |
| G26 | Case 39: đính PDF ở hộp 報告書 (như phase007 TC-038), file test1.pdf? | 39 | OK |
| G29 | Case 37 (シサンNAVI ON, トラブルNAVI OFF): em tự xem trên app — cần anh đăng nhập Browser pane (dev) | 37 | — |
