# Changelog

## [Unreleased]
### Thêm
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
