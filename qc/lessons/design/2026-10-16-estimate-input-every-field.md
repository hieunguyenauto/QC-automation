# 2026-10-16 TC tạo báo giá không ghi dòng mặc định bị xoá và giá nhập từng ô
- Loại: DESIGN_GAP
- Nguồn: review E2E-01 ↔ code automation 16/10/2026 (projects/qnavi/qc/test-cases/e2e-suite/E2E-01-type01-direct-test-cases.md rev 13 → 14)
- Function / màn hình: Trouble Detail › 見積もり (form '登録': 作業項目追加, 作業会社単価, 店舗向け 単価, 会計)
- Triệu chứng: TC chỉ ghi "'作業', 作業項目 'Autotest', 単価 so that total = FIX − 1". Code phải tự thêm các thao tác không có trong TC: nhập 作業会社単価 '1000', xoá dòng mặc định '出張費' / '現場調査費', rồi nhập 店舗向け 単価 để total (税込) = FIX − 1. Người đọc TC không tái hiện được, reviewer không biết automation làm thêm.
- Nguyên nhân gốc: TC mô tả kết quả (total) thay cho thao tác; form báo giá có dòng mặc định và 2 loại 単価 (app tự tính 店舗向け từ 作業会社単価) nhưng TC không nói ô nào nhập giá trị nào.
- Cách fix: TC E2E-01 rev 14: TC-005 bước 2 / TC-011 bước 1 ghi đủ 作業会社単価 '1000' → '決定' → xoá '出張費' / '現場調査費' ('削除') → 店舗向け 単価 cho total (税込) = FIX − 1 (sinh bằng _tools/gen_e2e.py, ngoại lệ REV của E2E-01).
- Rule rút ra: D19 — TC tạo / sửa form có dòng mặc định hoặc ô app tự tính (báo giá…): Steps ghi rõ dòng mặc định giữ hay xoá, ô nào nhập giá trị nào (作業会社単価 / 店舗向け 単価), tổng tính theo 税込 hay 税抜; không chỉ ghi kết quả "so that total = …".
- Áp dụng cho: TC báo giá / form nhiều dòng có giá trị mặc định, TC sinh hàng loạt bằng script (37 file e2e-suite còn khuôn cũ).
