# 2026-10-12 Lọc modal theo chữ chỉ modal đó có
- Loại: LOCATOR
- Nguồn: browser thật (modal 報告書 mở chồng trên 状態変更; form 見積もり mở chồng trên 見積一覧)
- Function / màn hình: CMS 作業依頼詳細 – modal lồng nhau
- Triệu chứng: modal(page,'報告書') có thể khớp 状態変更 (có dòng '報告書'); form đăng ký 見積もり không chứa '見積一覧' nên modal(page,'見積一覧') trỏ sai.
- Nguyên nhân gốc: modal lồng nhau, tiêu đề không nằm trong .modal-title; chữ tiêu đề xuất hiện ở modal khác.
- Cách fix: trouble-detail.screen.ts reportModal = modal(page,'施工業者'); estimateForm = modal có input[name="title"].
- Rule rút ra: R09
- Áp dụng cho: mọi modal lồng nhau.
