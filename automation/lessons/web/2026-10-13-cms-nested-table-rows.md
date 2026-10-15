# 2026-10-13 Bảng lồng trong bảng form: 'tbody tr' / 'tbody' bắt cả bảng ngoài
- Loại: LOCATOR
- Nguồn: @P007-TC-031, @P007-TC-036, @P007-TC-037 — file: web/tests/cms/phase007-regression.spec.ts (dev)
- Function / màn hình: form 見積もり (2 tbody: thông tin chung + hạng mục kéo thả); form 報告書 › 修理対象資産選択 (bảng tài sản lồng trong tr của form)
- Triệu chứng: TC-031 strict mode "tbody resolved to 2 elements"; TC-036 đếm 3 select / 2 dòng, rồi "dòng đầu có 2 select".
- Nguyên nhân gốc: form CMS là table; bảng con nằm trong td của tr ngoài → tr ngoài cũng "has" select / text của bảng con; form 見積もり có 2 tbody.
- Cách fix: estimateItemsBody = tbody[data-rbd-droppable-id="dnd-create-estimates"]; assetRows = tr có select types.* và hasNot tr (tr trong cùng); assetTypeSelect(i) lấy theo dòng.
- Rule rút ra: R21
- Áp dụng cho: mọi bảng dữ liệu nằm trong form dạng table (CMS chi tiết / sửa / modal).
