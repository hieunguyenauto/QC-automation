# Changelog

## [Unreleased]
### Thêm
- [auto] Ghi chú ENV est-test: E2E chập chờn ở modal 故障内容 / 作業者 (spinner treo, dialog 表示に時間がかかっております), nguyên nhân chưa xác định — sửa ghi chú sai trước đó (get_qa_category vẫn phản hồi)
- [auto] Lesson automation R17 (hộp OK sau lưu chờ ~30s) từ E2E-TC-002 trên est-test; acknowledgeOk chờ 30s
- [auto] npm run open: mở trình duyệt đã qua Basic Auth + đăng nhập ACCOUNT để xem / lấy locator
- [auto] Đăng nhập dùng chung common/session.ts: loginAs(page, 'role[:variant]'), logout, forAccounts; phiên .auth/<ENV>/ dùng lại 8h (D22)
- [auto] Môi trường est-test (CMS Qnavi Estimation, cms-test.estimation…) có Basic Auth: env/est-test.json › httpAuth + .env HTTP_AUTH_PASSWORD; Playwright dùng httpCredentials
- [auto] Tài khoản SubAdmin (98: linksyssubadmin); xác nhận role 02 = store, 05 = worker company; tên store 00006–00009
- [auto] Tài khoản store (role 02, 9 loại: toridoll, qnavi, urgent, ringi, autoApprove, approveType1-3, ringi0_99) và worker company (05) trong env/dev.json › accounts; chọn bằng credentials('02', '<variant>')
- [auto] Tài khoản test theo role đưa vào env/<ENV>.json › accounts (loginId, tên hiển thị); mật khẩu vẫn chỉ ở .env
- [auto] E2E trouble flow (13 TC) pass 13/13 trên CMS dev; locator TC-002→013 xác minh bằng browser thật
- [auto] Lesson automation R05–R14 (list tải chậm, nhãn th/badge, option:checked, nút 閉じる trùng tên, modal lồng nhau, toggle, click lệch do ảnh, overlay chặn click, trace theo chunk, ghi dữ liệu then chốt trước)
- [auto] Lesson automation R15 (modal lồng nhau đóng vẫn ở DOM), R16 (chờ upload S3 xong) từ E2E-TC-009
- Lesson automation R03 (chờ dữ liệu tải), R04 (nhãn = giá trị theo ô) từ recon CMS
- Lesson automation R01, R02; lesson QC D14; luật: sửa xong lỗi test → đề xuất lesson (D21)
- Khung Playwright CMS projects/qnavi/automation/web (README cách chạy, env, data, common, screens, report theo lần chạy); catalog màn hình 5 app ở projects/qnavi/screens/catalog/ (D20)
- Skill kb-update-automation; projects/qnavi/automation/README.md + screens/ (D19)
- spec-review: trạng thái [Done] → cập nhật knowledge dự án qua kb-update; Gap Report mục 7 (D17)
- Skill source-import (xlsx/pdf → md) (D14), skill export-excel (chỉ khi được đồng ý) (D15)
- Template qc/templates/gap-report.md; qc/README.md, automation/README.md (D16)
- Bản đồ repo manager/README.md
- Import knowledge Qnavi: projects/qnavi/ (README, sources, glossary 50 thuật ngữ, screens/_flow, bug-history 22 dòng) (D11)
- lessons/INDEX.md: 13 rule Thiết kế test (D01–D13) + 7 rule Excel/công cụ (T01–T07)
### Sửa
- test-viewpoint, test-case đọc thêm knowledge + bài học theo function; test-viewpoint đòi Gap Report LOCKED (D18)
- CLAUDE.md: luật QC chỉ áp dụng cho task QC, tra cứu dự án tự tìm trong <P>/ (D13); không dùng qa-testcase-writing trong repo; mọi bước draft → duyệt → LOCKED (D14, D16)
- handbook.md viết lại theo cấu trúc mới (luồng 6 bước + import + export); bug-history ghi nghĩa cột "Có TC bắt được"
- Tổ chức lại thư mục: manager/ · qc/ · automation/ · projects/<p>/ (D12)
- Template + skill theo format workbook Qnavi, TC tiếng Anh, Priority 3 mức, đối chiếu 3 nguồn, không đặt VP ID giả (D10)
- test-viewpoint: viewpoint có trục biến thiên, 1 VP → nhiều TC; gộp VP case-by-case (D09)
- Luồng thiết kế 6 bước + Context pack; gộp decisions thành 1 file docs/decisions.md (D08, D07)

## [0.1.0] - 2026-10-09
### Thêm
- Kiến trúc 5 giai đoạn có cổng (D01, D02)
- 3 skill thiết kế dùng chung: spec-review, test-viewpoint, test-case (D03)
- 6 template theo format Excel của team (D04)
- Luật mỗi TC 1 expected result (D05)
- Nhóm viewpoint 7 Performance, 8 Bài học / bug cũ; lesson DESIGN_GAP (D06)
- Knowledge hub: skill kb-update, build_guide.py, decisions, pre-commit hook (D07)
