# Câu hỏi — E2E suite · cập nhật 14/10/2026 (lượt 7)
**Đã chốt hết — không còn câu mở.**
Suite sau lượt 7 (TC Revision 3): bỏ case 28 (G11) và case 16 (G14) → còn **37 case**.

## A. Câu còn mở
(không còn)

## B. Đã chốt (không cần trả lời)
### Lượt 7 (14/10) — khi recon cho automation → TC Revision 3
| # | Kết quả |
|---|---|
| ENV | Môi trường tham chiếu: toridoll-test (est-test lỗi môi trường ở luồng tạo trouble) |
| FIX | 限度額 (継続依頼にも適用する) đã set: STORE00001 ¥10,000 · 00004 / 00005 / 00006 / 00007 / 00009 ¥20,000 · 00008 ¥5,000 · 00002 trống. 00001 決済承認 = 許可する |
| T1 | Category '操作テスト' (cột gốc トラブルNAVI OFF) không có webview → TC-002 đi luồng CMS thường (case 04, 09, 26, 37, 39) |
| T2 | Category '水' → webview 'トラブル相談内容' (iframe); TC-002 thêm Step 1 (store: 担当者選択; manager: チェーン店舗選択 + 担当者選択) |
| T3 | 承認タイプ theo chữ trên app: 01 個人承認 · 02 階層承認（No順） · 03 金額承認 · 04 金額と階層承認 (No順) |
| T4 | Case 08 dùng STORE00002 (không 限度額) |
| T5 | Case 17 Continue (2 báo giá ≤ FIX, không tự duyệt): MANAGER00001 (Lv1) duyệt 1 cái, cái còn lại 失効 |

### Lượt 6 (14/10) — khi sinh TC Revision 2
| # | Kết quả |
|---|---|
| R3 | Người làm báo cáo / thanh toán "CS Admin" = manager duyệt cuối của store (01: MANAGER00005 · 02: MANAGER00002 · 03: MANAGER00005 · 04: MANAGER00004 · 00009 / 00005 / 00001: MANAGER00001) |
| R14 | Case 17, 22: tạo 4 báo giá, 提示 3, giữ 1 '下書き'; duyệt 1 → 2 cái '失効' |
| N16 | STORE00005 set auto approve; > FIX → MANAGER00001 duyệt (hoặc chính store). STORE00001 / 00002 không có approve type |
| N17 | Case 08 (không 限度額) dùng STORE00001. Case 09 / 10 giữ STORE00005, không phân biệt FIX New / Continue |
| N18 | MANAGER00001 không có quyền trên STORE00006 → case 35–39 dùng MANAGER00005 |
| CF1 | Case key 29–34: chỉ dùng STORE00001 (bỏ thao tác store no-key 00002 và phần kiểm hiển thị no-key) |
| CF2 | Bỏ kiểm câu 'この見積は承認済みです。現在実行できるアクションはありません' |
| CF3 | Nhiều báo giá ≤ FIX cùng 提示 (case 17 Continue): không cái nào tự duyệt |

### Lượt 5 (14/10)
| # | Kết quả |
|---|---|
| C2 | Chốt chắc: chỉ dùng linksysworker; không quan tâm key của worker (write / read / no-key) |
| N14 | Chain manager của STORE00001 / 00002 / 00005 = MANAGER00001 |
| N15 | Bước 変更あり (đổi 作業スタッフ): giữ nguyên linksysworker từ đầu đến cuối luồng (case 01, 03–08, 10–13, 15, 17–21, 23–26, 29–31, 34–39) |
| Case 13, 14, 26, 32, 33 | Worker = linksysworker, bỏ phần "Worker NO key". Case 32 chỉ kiểm read-key approve; case 33 chỉ kiểm store no-key reject → read-key approve (giữ kiểm hiển thị phía store theo C3) |

### Lượt 4 (14/10)
| # | Kết quả |
|---|---|
| N7 | Store của case theo row 14 / row 78 (approve type của case → bảng thông số); chain manager = manager của store đó (store ngoài bảng: N14) |
| N9 | 'Store Manager' (case 10, 13, 35–39) = MANAGER00001 |
| N12 | (a) Giữ ≤ FIX; case 31, 34 chỉ kiểm màn chi tiết sau khi tự duyệt (số tiền '0' / '***'), không kiểm nút |
| G13 | Case 10 dùng STORE00005 |
| G14 | Case 12, 29, 33: tạo thêm 1 báo giá (tổng 2), duyệt 1 → cái còn lại 失効. Case 16: không kiểm được → bỏ case 16; 'approved → 失効' đã có ở case 15 |
| G7 / G19 / G1 | ~~Dùng thêm linksysworkerqnavi~~ — đã sửa ở lượt 5 (C2): chỉ dùng linksysworker |
| C1 | Case 08 / 09 / 10 dùng STORE00005; FIX riêng cho New / Continue đã cấu hình sẵn |
| C3 | Giữ kiểm hiển thị no-key / read-key ở case 29–34. N6 = không quản lý key trên CMS, nhưng vẫn kiểm hiển thị; G18 giữ nguyên — đã sửa ở lượt 6 (CF1): chỉ dùng STORE00001, bỏ phần no-key |
| C4 | トラブルNAVI luôn ON. Case CSV ghi OFF → big category '操作テスト'; ghi ON → '水' |
| G29 (sửa) | Case 37 pre-condition: Dashboard → チェーンシステム情報 → tìm LinkSys → bấm LinkSys → kiểm シサンNAVI ON (không kiểm トラブルNAVI OFF, theo C4). Tạo trouble với big category '操作テスト' |
| C5 | ¥50,000 cần 4 cấp. Type 04: số tiền ≥ ngưỡng Lv nào thì cần Lv đó (case 11: ¥50,000 → Lv1–4) |
| C6 / N5 (sửa) | 承認タイプ chỉ theo cấu hình store, không chọn trên báo giá → bỏ bước đổi type ở case 12 (02→04), 13 (04→02), 16 (đã bỏ case); giữ 差し戻し / 取り下げ / 再提示 |

### Lượt 3 (14/10)
| # | Kết quả |
|---|---|
| N1 | ¥49,999 chỉ cần duyệt Lv1–3. Quy tắc: 20,000–29,999 → Lv1 · 30,000–39,999 → Lv1–2 · 40,000–49,999 → Lv1–3 · ≥ 50,000 → Lv1–4 (chốt ở C5) |
| N2 | Lv0 = MANAGER00001. Mỗi store cấu hình riêng; Lv4 và Lv5 cùng MANAGER00004 là đúng theo cấu hình |
| N3 | Type 03 dùng LINKSYS STORE00008 |
| N4 | Case 08, 09, 27 dùng STORE00005; Continue phải đi tiếp trên đúng trouble của New |
| N5 | ~~Giữ bước đổi type ở case 12, 13, 16~~ — đã sửa ở lượt 4 (C6): bỏ bước đổi type |
| N6 | read-key / write-key không quan trọng với CMS — đã làm rõ ở lượt 4 (C3): vẫn kiểm hiển thị case 29–34 |
| N8 | Chainstore manager tạo trouble = MANAGER00001 |
| N10 | Case 5: STORE00005 (AUTO APPROVE), FIX = ¥20,000; giữ ¥4,999 (≤ FIX → tự duyệt). Không có cấu hình "mức tối thiểu ¥5,000" |
| N11 | Không sửa 限度額, dùng cấu hình sẵn; chỉ bật/tắt トラブルNAVI / シサンNAVI |
| N13 | Chia 2 nhánh: có case Admin bấm duyệt thay, có case Manager duyệt; mặc định Manager. Phân bổ case → nhánh em đề xuất khi viết lại TC |
| G6 | Không cần tắt トラブルNAVI, mặc định ON. Case CSV ghi OFF → big category '操作テスト'; ghi ON → category '水' (luồng webview phụ thuộc category) |
| G8 | Admin / Sub Admin không làm 作業完了確認 → đổi sang store hoặc store-manager (case 24, 25, 30, 35) |
| G9 | Case 24: New dừng ở 到着 02-04 → 見積承認待ち 02-05; bỏ phần Continue |
| G10 | Case 26: Worker Company tự tạo báo giá trên CMS |
| G15 | 提示 3 báo giá, duyệt 1 → 2 cái 失効, 下書き giữ lại (case 17, 22) |
| G16 | Bỏ push notification; case 18 chỉ kiểm hộp xác nhận 3 báo giá |
| G17 | Case 22: Admin duyệt |
| G18 | No-key: số tiền '0', chữ '***'; '承認する' disabled, '差し戻し' enabled |
| G24 | ≤ FIX tự duyệt áp cho cả Continue |
| G25 | Chỉ web, không mobile; bỏ phần thiết bị ở case 24, 25, 27 |
| G26 | Case 39: đính PDF ở hộp 報告書; đổi tên file thành automation.pdf |
| G29 | ~~Kiểm シサンNAVI ON, トラブルNAVI OFF~~ — đã sửa ở lượt 4 (C4) |

### Lượt 1–2
| # | Kết quả |
|---|---|
| G1 | Key (chỉ phía store): read-key LINKSYS STORE00001 (TORIDOLL) · no-key LINKSYS STORE00002 (QNAVI). Worker: chỉ linksysworker, không xét key (C2 lượt 5) |
| G2 | Cấu hình approve type đã set sẵn trên store, không đổi được (C6) |
| G3 | So 限度額 theo 税込 (tổng ở 見積もり) |
| G4 | Theo thông số approve type bên dưới |
| G5 | Urgent: 編集 trouble → 案件区分 '営業停止案件' → 保存. Không cần duyệt báo giá, vẫn qua 02-07 |
| G11 | Bỏ case 28 |
| G12 | Case 34: người tạo = chainstore |
| G21 / G22 | Theo type 04 + Lv0 và type 02 bên dưới |
| G23 | Được bật/tắt (xem N11) |
| G27 | ≤ FIX tự duyệt; > FIX người đó duyệt |
| G28 | Lưu ở projects/qnavi/qc/test-cases/e2e-suite/ |
| Q2–Q9 | Đã áp từ lượt 1 (store đăng nhập CMS role 02, luồng トラブルNAVI, 限度額 ở チェーンシステム情報, ≤ 限度額 tự duyệt, 継続依頼 '_2', báo cáo = đổi trạng thái, bỏ 日程承認, môi trường tuỳ biến) |

### Thông số approve type (anh cung cấp 13/10, cập nhật 14/10)
| Type | Store | Người duyệt |
|---|---|---|
| 01 | LINKSYS STORE00006 | MANAGER00005 hoặc MANAGER00003 — 1 người duyệt là xong |
| 02 | LINKSYS STORE00007 | MANAGER00001 duyệt trước → MANAGER00002 duyệt tiếp; MANAGER00002 duyệt trực tiếp → xong |
| 03 | LINKSYS STORE00008 | MANAGER00004: ￥10,000～￥20,000 · MANAGER00005: ￥0～無制限 (税込; ngoài khoảng không duyệt được) |
| 04 | LINKSYS STORE00004 | Lv1 20,000 MANAGER00001 · Lv2 30,000 MANAGER00002 · Lv3 40,000 MANAGER00003 · Lv4 50,000 MANAGER00004. Số tiền ≥ ngưỡng Lv nào thì cần Lv đó (¥49,999 → Lv1–3 · ¥50,000 → Lv1–4). Admin bấm từng cấp; manager duyệt tuần tự, đã duyệt thì mất nút 承認する |
| 04 + Lv0 | LINKSYS STORE00009 | MANAGER00001 = Lv0 → duyệt thẳng |
| AUTO APPROVE | LINKSYS STORE00005 | FIX = ¥20,000 (≤ FIX tự duyệt); FIX riêng New / Continue đã cấu hình sẵn |
