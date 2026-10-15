# 2026-10-13 Bấm tên file PDF không mở preview — phần bấm được là thumbnail role=button
- Loại: LOCATOR
- Nguồn: @P007-TC-038 (cùng preview ở TC-065) — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: form 報告書 › PDFファイル
- Triệu chứng: click thẻ 'test1.pdf' → không có gì; chờ canvas 20s fail.
- Nguyên nhân gốc: thẻ = .upload-pdf-holder: '.upload-pdf-holder__preview' (role=button, img[title=<tên>]) + footer p.pdf-filename (không có handler). Locator getByText(tên) trúng footer. Ngoài ra modal(page, tên) khớp cả form 報告書 (cũng chứa tên file và có 1 canvas riêng).
- Cách fix: openPdfPreview(name): bấm [role=button] có img[title=name]; preview = '.modal.show.app-pdf-preview-modal' có tên file → canvas, nút ダウンロード.
- Rule rút ra: R23
- Áp dụng cho: thẻ file / ảnh / card có thumbnail + caption; modal preview.
