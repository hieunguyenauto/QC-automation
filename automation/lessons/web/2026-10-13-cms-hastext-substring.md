# 2026-10-13 hasText khớp chuỗi con: dòng 'Test' bắt nhầm 'EnterTest'
- Loại: LOCATOR
- Nguồn: @P007-TC-032 (cùng kiểu ở TC-053 dòng E.main) — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: Trouble Detail › 見積もり管理 (bảng 見積一覧)
- Triệu chứng: expect dòng 'Test' = '承認待ち' nhận "1EnterTest…下書き…".
- Nguyên nhân gốc: locator('tr', { hasText: 'Test' }) khớp chuỗi con, không phân biệt hoa thường → dòng 'EnterTest' (TC-028 tạo trước) đứng trên được chọn bởi first().
- Cách fix: helper estimationRow(box, name): tr.estimation-row có td khớp exact(name) (common/ui.ts exact). Screen đã có estimateRow / estimateRows cùng cách.
- Rule rút ra: R20
- Gặp lại: @P007-TC-040 — pdfCard tìm 'test.jpg' bằng getByText trong ô PDFファイル, trúng message lỗi 'test.jpg: ファイルの形式は正しくありません。' → đổi sang thẻ '.pdf-report-items__item' có img[title]. Dòng 依頼番号 ở 作業依頼一覧 / chọn 継続依頼 cũng đổi sang khớp đúng (số có đuôi '_2').
- Áp dụng cho: chọn dòng / thẻ theo tên do test đặt (tên ngắn dễ là chuỗi con của tên khác: Test, AT_..., số 依頼番号).
