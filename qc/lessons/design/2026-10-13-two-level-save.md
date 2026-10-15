# 2026-10-13 Màn master-edit lưu 2 tầng, TC chỉ ghi '保存' của modal
- Loại: DESIGN_GAP
- Nguồn: P007-TC-003 (projects/qnavi/qc/test-cases/phase007-regression-test-cases.md, rev 3), nhập từ CSV regression
- Function / màn hình: 資産管理項目マスター編集 (/admin/asset-column/<chain>/edit)
- Triệu chứng: TC ghi "Click '保存' → '決定'" nhưng '保存' của modal 資産管理項目追加 chỉ thêm dòng tạm trên bảng, không hiện '決定', không gửi request lưu → automation chờ '決定' rồi fail.
- Nguyên nhân gốc: màn lưu 2 tầng (modal thêm / sửa dòng → nút '保存' của trang → '決定'); file gốc chỉ ghi tầng modal.
- Cách fix: thêm bước 3a "Click '保存' of page → '決定' (→ 'OK')" vào TC-003 (rev 3); TC-004/005 theo TC-003.
- Rule rút ra: D15 — màn master-edit có 2 tầng lưu: TC ghi đủ cả 2 tầng và kiểm dữ liệu còn sau reload.
- Áp dụng cho: mọi màn sửa danh sách / master có nút '保存' chung của trang (資産管理項目, các bảng cấu hình tương tự).
