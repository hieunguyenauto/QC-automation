# 2026-10-12 Upload S3 bất đồng bộ → chờ PUT xong mới upload tiếp
- Loại: TIMING
- Nguồn: @E2E-TC-009 — file: web/tests/cms/e2e-trouble-flow/e2e-trouble-flow.spec.ts (bước 5 ảnh 作業前 → 作業後)
- Function / màn hình: CMS 作業依頼詳細 – modal 報告書, dòng 作業前の写真 / 作業後の写真
- Triệu chứng: ảnh 作業後 set vào đúng input (files.length = 1) nhưng hộp con 'N / 20' không mở, dòng không có ảnh; thêm chờ 3s thì pass.
- Nguyên nhân gốc: 完了 → POST generate_presigned_url → PUT S3 (/modules/troubles/files/) chạy bất đồng bộ; trong lúc đó app bỏ qua file thả vào dropzone khác, không báo lỗi.
- Cách fix: trouble-detail.screen.ts uploadReportPhoto: waitForResponse PUT '/modules/troubles/files/' trước khi bấm 完了, kiểm ok() rồi mới đi tiếp.
- Rule rút ra: R16
- Áp dụng cho: mọi bước upload file (ảnh, PDF, 資産) có thao tác tiếp ngay sau.
