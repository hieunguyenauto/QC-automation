# 2026-10-13 Chạy nối tiếp: TC trước để form nhập dở → TC sau bị hộp 破棄 chặn menu
- Loại: DATA (trạng thái giữa các TC)
- Nguồn: @P007-TC-010 → @P007-TC-011 — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: サブアドミン詳細 › 症状グループ追加 (/presets)
- Triệu chứng: TC-011 bước 1 (menu サブアドミン情報) timeout; ảnh: hộp '画面の編集内容が破棄されますが、処理を続行しますか？' (いいえ / はい).
- Nguyên nhân gốc: TC-010 (lỗi tên trống) kết thúc khi form còn dữ liệu; app chặn rời trang. Context dùng chung giữa các TC (R13).
- Cách fix: cuối TC-010 thêm step 'Cleanup' (không thuộc TC): SubAdminScreen.discardGroupForm() — 戻る → はい. Không xử lý hộp 破棄 chung trong menu() để khỏi che lỗi ở chỗ khác.
- Rule rút ra: R24
- Áp dụng cho: kịch bản serial có TC kết thúc ở form chưa lưu (validate lỗi, キャンセル không dùng).
