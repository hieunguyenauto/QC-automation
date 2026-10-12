# Rule đã học — automation (AI đọc trước khi viết / sửa code test)

## Web
- R01 Màn hình chưa chạy qua lần nào: lấy cây phần tử thật (error-context.md / aria snapshot / codegen) rồi mới viết locator; không viết chỉ dựa vào CSV hay catalog. Wizard / màn theo role hay có bước ẩn. (web/2026-10-12-cms-create-wizard-step0.md)
- R02 Hook chụp màn hình / snapshot luôn có timeout ≤ 10s và .catch(); context tự tạo (serial E2E) thì tự đính kèm ảnh + aria snapshot. (web/2026-10-12-afterEach-screenshot-hang.md)
- R03 Màn có dữ liệu tải sau (chi tiết trouble…): chờ 1 ô dữ liệu chính có giá trị (vd 番号 có số) trước khi kiểm / bấm; URL đúng hay networkidle chưa đủ. (web/2026-10-12-cms-detail-async-load.md)
- R04 Kiểm "nhãn = giá trị" bằng ô ngay sau nhãn (common/ui.ts valueOf), không kiểm cả dòng; tên nhãn lấy đúng như DOM (header CMS có ':', số trouble là '番号'). (web/2026-10-12-cms-label-layouts.md)

## Mobile
<!-- M01 <rule> (mobile/<file>.md) -->
