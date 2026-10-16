# 2026-10-16 TC báo giá giả định nút / quy tắc tự duyệt chưa đối chiếu app
- Loại: DESIGN_GAP
- Nguồn: e2e-suite rev 7 → rev 12 (projects/qnavi/qc/test-cases/e2e-suite/), automation E2E-02…39 chạy thật trên toridoll-test 15–16/10/2026
- Function / màn hình: Trouble Detail › 見積もり (差し戻し, 取り下げ申請, 提示 / tự duyệt)
- Triệu chứng: TC fail trên app dù app đúng (Hieu Nguyen xác nhận): (1) 差し戻し → TC "re-edit" nhưng app chỉ có 'コピー'; (2) 取り下げ却下 mở hộp lý do mà TC không ghi; gốc thành '失効' chứ không phải '取り下げ却下'; (3) type 04 tự duyệt khi 税抜 < min_amount Lv1 (TC chỉ so 税込 với FIX); (4) urgent + ≤ FIX vẫn tự duyệt (TC giả định urgent không tự duyệt); (5) 継続依頼 kế thừa 案件区分 urgent (TC bắt chọn lại + 保存 → nút disabled); (6) sau 取り下げ manager mất nút '見積もり' (TC bắt manager kiểm trạng thái).
- Nguyên nhân gốc: generator suy luận nút / trạng thái / quy tắc tự duyệt từ CSV + Q&A, không dò thật màn từng trạng thái báo giá và từng 承認タイプ trước khi LOCK.
- Cách fix: TC rev 8–12 (QUESTIONS lượt 10–14: R8-1…R12-2).
- Rule rút ra: D18 — TC có luồng theo trạng thái báo giá / 承認タイプ: trước khi LOCK, dò thật (hoặc hỏi) nút có ở từng trạng thái (下書き, 承認待ち, 差し戻し, 取り下げ…), trạng thái sau mỗi hành động, và điều kiện tự duyệt đầy đủ (税込 / 税抜, min_amount theo Lv, urgent, nhiều báo giá); bước Verify đặt ở role thật sự nhìn thấy được.
- Áp dụng cho: TC báo giá / phê duyệt, TC sinh hàng loạt bằng script.
