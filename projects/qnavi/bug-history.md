# Bug history Qnavi (nguồn viewpoint nhóm 8)

> Cột "Có TC bắt được không?": Có / Không / ? (= chưa đối chiếu). Cập nhật khi chạy test-case cho function liên quan (bước 7 đối chiếu) hoặc khi có bug mới (DESIGN_GAP → Không). Dòng = Không là input bắt buộc cho viewpoint nhóm 8.

| Bug ID | Function / màn hình | Mô tả / pattern | Có TC bắt được không? |
|---|---|---|---|
| QNAVI-1706 | Create estimation | Double-submit: nhấn Enter nhiều lần khi loading → tạo trùng báo giá | ? |
| QNAVI-1771 | CMS thêm item báo giá | Tăng số lượng → nhân bản dòng item | ? |
| QNAVI-1787 | Approve type 3 (App Store) | Boundary: số tiền = MIN → server error | ? |
| QNAVI-2093 | Shop phê duyệt theo số tiền | Gửi lẫn báo giá duyệt được/không được → server error | ? |
| QNAVI-1765 | CMS State change (continue trouble từ app) | Status cũ「見積承認待ち」không được clear | ? |
| QNAVI-1786 | Auto task | Task tự động không xoá được khi trouble đã hoàn thành | ? |
| QNAVI-2047 | Auto task / chat | Sai thứ tự message khi store approve type 04 | ? |
| QNAVI-2186 / 2187 | Submit vs complete trouble | Race condition (2186 CMS-only, 2187 App-only) | ? |
| QNAVI-1839 / 1863 | Nút 稟議進捗 | Trắng trang do lỗi quyền (admin) / không hiện ở continue trouble | ? |
| QNAVI-1773 | CMS chọn ứng viên | Nút hiển thị sai role (Sub Admin) | ? |
| QNAVI-1900 | CMS tạo báo giá | Tạo thành công nhưng dialog không đóng | ? |
| QNAVI-1108 / 1927 | List CMS | Pagination không giữ / reset về trang 1 khi Back | ? |
| QNAVI-1896 / 1899 | Store App | Sai context: mở/ tạo request cho cửa hàng khác | ? |
| QNAVI-2012 | Worker App | Không xem được báo giá/báo cáo khi trouble completed | ? |
| QNAVI-2032 / 2038 / 2048 / 1764 | Firebase chat | Thiếu validate giới hạn (>1000 ký tự, >5 ảnh, >50MB không báo lỗi, video 5MB) | ? |
| QNAVI-2029 / 2049 / 1966 | App upload ảnh | Chậm/mất ảnh, crash khi background lúc upload, crash khi lưu ảnh sau update | ? |
| QNAVI-1757 / 1758 / 2033 / 2082 | Chat đã đọc/chưa đọc | Sai trạng thái read/unread và đếm unread | ? |
| QNAVI-2083 | Store App chat | SSO login → không hiện tin gửi cho mình | ? |
| QNAVI-2077 / 2079 / 2080 | Firebase chat PROD | Lỗi sau update app / lỗi quyền | ? |
| QNAVI-2084 / 2085 | CMS chat list | Sort theo sender lỗi / không chạy | ? |
| QNAVI-1908 / 2024 / 1767 / 1768 | UI | Layout vỡ, bottom sheet thừa, dropdown bị cắt/tràn | ? |
