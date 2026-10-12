# Rule đã học — automation (AI đọc trước khi viết / sửa code test)

## Web
- R01 Màn hình chưa chạy qua lần nào: lấy cây phần tử thật (error-context.md / aria snapshot / codegen) rồi mới viết locator; không viết chỉ dựa vào CSV hay catalog. Wizard / màn theo role hay có bước ẩn. (web/2026-10-12-cms-create-wizard-step0.md)
- R02 Hook chụp màn hình / snapshot luôn có timeout ≤ 10s và .catch(); context tự tạo (serial E2E) thì tự đính kèm ảnh + aria snapshot. (web/2026-10-12-afterEach-screenshot-hang.md)
- R03 Màn có dữ liệu tải sau (chi tiết trouble…): chờ 1 ô dữ liệu chính có giá trị (vd 番号 có số) trước khi kiểm / bấm; URL đúng hay networkidle chưa đủ. (web/2026-10-12-cms-detail-async-load.md)
- R04 Kiểm "nhãn = giá trị" bằng ô ngay sau nhãn (common/ui.ts valueOf), không kiểm cả dòng; tên nhãn lấy đúng như DOM (header CMS có ':', số trouble là '番号'). (web/2026-10-12-cms-label-layouts.md)
- R05 List / bảng / badge trạng thái tải sau: lúc đầu có thể hiện '0件' hoặc trạng thái cũ → chờ dấu hiệu đã tải ('全 N 件中', badge đúng giá trị, timeout ~15s) rồi mới kết luận. (web/2026-10-12-cms-list-zero-before-load.md)
- R06 Nhãn trong th có thêm badge (必須/任意) hoặc bọc span: khớp nhãn ở text node con, không so cả th. (web/2026-10-12-cms-th-span-badge-label.md)
- R07 Giá trị dropdown native kiểm bằng option:checked, không kiểm text dòng. (web/2026-10-12-cms-select-option-checked.md)
- R08 Nút × của modal có aria-label '閉じる' → không tìm nút 閉じる bằng role+name; dùng text hiển thị trong vùng cụ thể, × thì closeModal(). (web/2026-10-12-cms-close-button-name.md)
- R09 Modal lồng nhau: lọc modal bằng chữ / phần tử chỉ modal đó có (vd '施工業者', input[name=title]), không lọc bằng chữ tiêu đề. (web/2026-10-12-cms-modal-unique-text.md)
- R10 Nút bật/tắt (メニュー展開, accordion): kiểm trạng thái đang mở chưa rồi mới bấm, sau đó expect trạng thái. (web/2026-10-12-cms-toggle-expand.md)
- R11 Danh sách / lưới thẻ có ảnh: chờ ảnh tải xong, click bằng dispatchEvent (không theo toạ độ), rồi KIỂM giá trị đã chọn; sai thì chọn lại. (web/2026-10-12-cms-click-layout-shift.md)
- R12 Log có "intercepts pointer events" (popover/chat/overlay đè nút): dùng dispatchEvent('click') + kiểm trạng thái sau đó; không dùng force:true. (web/2026-10-12-cms-chat-overlay-intercepts.md)
- R13 Kịch bản serial dùng chung context: tắt trace/video tự động trong config, tự ghi trace theo chunk từng TC; mọi lệnh trong hook có giới hạn thời gian. (web/2026-10-12-e2e-shared-context-trace-hang.md)
- R14 Dữ liệu tạo ra cho TC sau (依頼番号, id…) phải ghi lại NGAY sau khi tạo, trước mọi thao tác phụ. (web/2026-10-12-e2e-record-key-data-first.md)
- R15 Hộp con / modal lồng nhau đóng chỉ bỏ class show (vẫn ở DOM): kiểm "đã đóng" bằng đúng phần tử vừa thao tác (elementHandle) hoặc loại modal cha bằng chữ chỉ cha có; không tìm lại bằng locator .last() lọc theo chữ. (web/2026-10-12-cms-nested-modal-hidden-keep-dom.md)
- R16 Upload file (S3) chạy bất đồng bộ sau 完了, app bỏ qua upload tiếp theo: chờ response upload (PUT S3) OK rồi mới thao tác tiếp; không dùng waitForTimeout. (web/2026-10-12-cms-s3-upload-async.md)
- R17 Hộp kết quả sau thao tác lưu (OK / 完了) hiện khi server xong: chờ với timeout dài (~30s), không dùng timeout mặc định 5s, không dùng waitForTimeout. (web/2026-10-12-cms-save-ok-dialog-slow.md)

## Mobile
<!-- M01 <rule> (mobile/<file>.md) -->
