# Rule đã học — thiết kế test (AI đọc ở bước 3 của luồng thiết kế)

## Thiết kế test (viewpoint / test case bị sót)
- D01 Mọi nút submit / save: có case double-click, Enter nhiều lần khi đang loading → không tạo trùng.
- D02 Field số tiền / số lượng: có boundary MIN, MAX, 0, số âm — không chỉ giá trị thường.
- D03 Upload / chat / text dài: có case vượt giới hạn (số ký tự, số ảnh, dung lượng) phải báo lỗi.
- D04 Hai bên thao tác cùng lúc (worker submit vs store complete…): có case race condition.
- D05 Đổi trạng thái: kiểm status cũ được clear, status mới đúng, kể cả luồng tiếp tục / làm lại.
- D06 Nút theo role: tra permission matrix trong basic design, không suy từ UI giống nhau; test từng role.
- D07 Trạng thái UI phải giữ / đóng đúng: pagination khi Back, dialog sau khi lưu, read/unread, badge.
- D08 Dữ liệu đúng ngữ cảnh: không mở / tạo cho cửa hàng, trouble, user khác.
- D09 Happy path của push/notification/tích hợp ngoài → luôn thêm case gửi lỗi, nghiệp vụ không bị rollback sai.
- D10 Cùng loại impact thì assertion phải đồng nhất giữa các nhóm TC; nâng cấp nhiều bước → test permission ở từng bước trung gian.
- D11 Trước khi đưa ticket vào scope: check role scope của ticket, release phase, ticket cha/con.
- D12 Check duplicate theo nội dung (không chỉ theo ID) và trace 2 chiều VP ↔ TC (không VP rỗng, không TC trỏ VP không tồn tại).
- D14 Nhập TC E2E từ file ngoài (CSV viết tay…): đối chiếu từng bước với catalog / màn hình thật, bổ sung bước bắt buộc bị bỏ. (design/2026-10-12-e2e-missing-ui-step.md)
- D15 Màn master-edit có 2 tầng lưu (modal thêm dòng → '保存' của trang): TC phải ghi đủ cả 2 tầng và kiểm dữ liệu còn sau reload. (design/2026-10-13-two-level-save.md)
- D16 Lưu xong mà app hiện hộp thoại hoàn tất (…が完了しました。 + 'OK'): Steps phải ghi "Verify: dialog '<message>' → 'OK'" trước bước tiếp theo. (design/2026-10-13-save-done-dialog.md)
- D17 Luồng lấy từ CSV / app mobile: đối chiếu màn CMS web (catalog / recon) trước khi LOCK; mỗi nhánh điều kiện (ON / OFF, category, ≤ / > FIX…) có bước và trạng thái kỳ vọng riêng, không dùng chung 1 template khi sinh TC bằng script. (design/2026-10-14-e2e-branch-flow-template.md)
- D18 TC theo trạng thái báo giá / 承認タイプ: trước khi LOCK dò thật nút ở từng trạng thái (下書き / 承認待ち / 差し戻し / 取り下げ…), trạng thái sau mỗi hành động, điều kiện tự duyệt đầy đủ (税込 / 税抜, min_amount theo Lv, urgent, nhiều báo giá); Verify đặt ở role nhìn thấy được. (design/2026-10-16-estimate-state-actions.md)
- D19 Form có dòng mặc định / ô app tự tính (báo giá…): Steps ghi rõ dòng mặc định giữ hay xoá, ô nào nhập giá trị nào (作業会社単価 / 店舗向け 単価), tổng theo 税込 hay 税抜 — không chỉ ghi "so that total = …". (design/2026-10-16-estimate-input-every-field.md)
- D13 Kiểm đúng layer: rule bảo mật / middleware gắn ở route nào thì test đúng route đó + case negative.

## Excel / công cụ
- T01 Tên tab Google Sheets > 31 ký tự bị đổi tên khi export xlsx → công thức INDIRECT theo tên mới.
- T02 FILTER / MAP / LAMBDA không chạy trong LibreOffice / openpyxl → #REF!/#NAME? có sẵn, không phải do mình sửa.
- T03 Header không cố định hàng → dò literal header (vd "TC ID"), không hard-code row.
- T04 Merged cells → bỏ merge vùng định ghi trước khi ghi bằng openpyxl.
- T05 Text bắt đầu bằng "=" hoặc "=+" bị hiểu là công thức → ghi dạng text.
- T06 "Total TCs" ở đầu sheet = số ô kết quả (TC × role/platform), không phải số TC.
- T07 Deliverable cho người review: xuất file mới, không sửa file gốc.
