# Rule đã học — automation (AI đọc trước khi viết / sửa code test)

## Web
- R01 Màn hình chưa chạy qua lần nào: lấy cây phần tử thật (error-context.md / aria snapshot / codegen) rồi mới viết locator; không viết chỉ dựa vào CSV hay catalog. Wizard / màn theo role hay có bước ẩn. (web/2026-10-12-cms-create-wizard-step0.md)
- R02 Hook chụp màn hình / snapshot luôn có timeout ≤ 10s và .catch(); context tự tạo (serial E2E) thì tự đính kèm ảnh + aria snapshot. (web/2026-10-12-afterEach-screenshot-hang.md)
- R03 Màn có dữ liệu tải sau (chi tiết trouble…): chờ 1 ô dữ liệu chính có giá trị (vd 番号 có số) trước khi kiểm / bấm; URL đúng hay networkidle chưa đủ. (web/2026-10-12-cms-detail-async-load.md)
- R04 Kiểm "nhãn = giá trị" bằng ô ngay sau nhãn (common/ui.ts valueOf), không kiểm cả dòng; tên nhãn lấy đúng như DOM (header CMS có ':', số trouble là '番号'). (web/2026-10-12-cms-label-layouts.md)
- R05 List / bảng / badge trạng thái tải sau: lúc đầu có thể hiện '0件' hoặc trạng thái cũ → chờ dấu hiệu đã tải ('全 N 件中', badge đúng giá trị, timeout ~15s) rồi mới kết luận. (web/2026-10-12-cms-list-zero-before-load.md)
- R06 Nhãn trong th có thêm badge (必須/任意) hoặc bọc span: khớp nhãn ở text node con, không so cả th. (web/2026-10-12-cms-th-span-badge-label.md)
- R07 Giá trị dropdown native kiểm bằng option:checked, không kiểm text dòng. (web/2026-10-12-cms-select-option-checked.md)

## Mobile
<!-- M01 <rule> (mobile/<file>.md) -->
