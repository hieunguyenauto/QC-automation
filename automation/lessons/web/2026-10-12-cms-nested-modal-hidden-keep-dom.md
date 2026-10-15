# 2026-10-12 Hộp con đóng vẫn ở DOM → bám đúng phần tử vừa thao tác
- Loại: LOCATOR
- Nguồn: @E2E-TC-009 — file: web/tests/cms/e2e-trouble-flow/e2e-trouble-flow.spec.ts (bước 5 ảnh 作業前/作業後, bước 6 ảnh 資産登録)
- Function / màn hình: CMS 作業依頼詳細 – modal 報告書 (hộp chọn ảnh 'N / 20', hộp 写真を選択)
- Triệu chứng: sau 完了 hộp con đã đóng nhưng expect(box).toBeHidden() / expect(done).toBeHidden() fail, locator vẫn resolve ra phần tử visible.
- Nguyên nhân gốc: hộp con là .modal lồng trong .modal-body của modal 報告書; đóng chỉ bỏ class show (display:none), vẫn ở DOM → modal cha chứa chữ '0 / 20'. Locator `.filter({ hasText }).last()` / `getByRole('button',{name:'完了'}).last()` được tìm lại sau khi đóng → trỏ sang modal 報告書 / nút 完了 của modal 報告書.
- Cách fix: trouble-detail.screen.ts uploadReportPhoto lọc hộp con thêm hasNotText '施工業者'; common/ui.ts uploadVia giữ elementHandle của nút 完了 vừa bấm rồi expect.poll(handle.isVisible()) = false.
- Rule rút ra: R15
- Áp dụng cho: mọi hộp con / modal lồng nhau, mọi bước "bấm rồi kiểm đã đóng".
