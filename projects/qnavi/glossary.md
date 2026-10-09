# Thuật ngữ Qnavi (JP → VI)

| Tiếng Nhật | Nghĩa tiếng Việt | Ghi chú |
|---|---|---|
| 見積 / 見積書 | Báo giá / phiếu báo giá (Estimation) | [BD-CMS] |
| 見積書作成 | Tạo báo giá | Title màn Create estimation [TC-006] |
| 見積名 | Tên báo giá | Max 30 ký tự; lỗi `見積名入力してください。` / `見積名は30文字以内で入力して下さい。` [BD-APP] |
| 見積書宛名 | Người nhận (địa chỉ gửi) báo giá | [TC-006] |
| 見積有効期限 | Hạn hiệu lực báo giá | Có search trên Trouble list CMS [chat:Overview] |
| 作業項目 | Hạng mục công việc | Placeholder đổi thành「項目名を入力」(CR61) [TC-006] |
| 部材 | Vật tư | Loại item [TC-006] |
| 特記事項 | Ghi chú đặc biệt | [TC-006] |
| 備考 | Ghi chú | Field text mã hoá → hiện `***` khi không có key [chat:QA-rules] |
| 単価 / 数量 / 小計 | Đơn giá / Số lượng / Tạm tính | 小計 = 単価 × 数量, read-only (CR41) [TC-006] |
| 店舗向け単価 | Đơn giá cho cửa hàng | Label đổi thành「単価」(CR63) [TC-006] |
| 価格 | Giá | Field mã hoá [TC-006] |
| 金額(税抜) / 金額(税込) | Số tiền chưa thuế / đã gồm thuế | [TC-006] |
| 作業報酬金額（税抜） | Tiền công thợ (chưa thuế) | [TC-006] |
| 店舗請求金額（税抜） | Số tiền tính cho cửa hàng (chưa thuế) | [TC-006] |
| 現場調査費 / 出張費 | Phí khảo sát hiện trường / Phí đi lại | Rate riêng Sub Admin (CR70) [TC-006] |
| 登録 / 追加 | Đăng ký / Thêm mới | [BD-CMS; BD-APP] |
| 閲覧 | Xem chi tiết (+ download) | [BD-CMS] |
| 編集 / コピー(複製) / 削除 | Sửa / Copy / Xoá | Xoá có popup `見積書を削除します。よろしいですか？` [BD-APP] |
| 提出 / 提示する | Nộp (submit) báo giá | [BD-CMS; BD-APP] |
| 下書き | Nháp (Draft) | [BD-CMS] |
| 承認待ち / 見積承認待ち | Chờ duyệt | [BD-CMS] |
| 見積承認 | Duyệt báo giá | [BD-CMS] |
| 差し戻し | Trả lại (Reject/Return) | Nút APP đổi từ「再提出を依頼する」(CR62) [TC-006] |
| 承認しない | Không duyệt (Reject Est, Shop App) | [BD-APP] |
| 再承認待ち | Chờ duyệt lại | [BD-CMS] |
| 再提出待ち / 再編集 | Chờ nộp lại / Sửa lại | [BD-CMS] |
| 見積再提出 | Nộp lại báo giá (sau khi đã duyệt) | Bản đã approved → 失効 ngay [BD-CMS] |
| 稟議 / 稟議承認中 | Ringi — phê duyệt nội bộ / đang phê duyệt Ringi | [BD-CMS] |
| 承認済み | Đã duyệt | [BD-CMS] |
| 失効 | Hết hiệu lực (Expired) | [BD-CMS] |
| 取り下げ / 取り下げ申請 | Torisage — rút lại / yêu cầu rút lại (Request cancel) | [BD-CMS] |
| 取り下げ承認(まち) | Duyệt (chờ duyệt) yêu cầu rút lại | [BD-CMS] |
| 取り下げ却下 | Từ chối yêu cầu rút lại | [BD-CMS] |
| 要対応 | Cần xử lý (Redo Action) | Filter Worker App [BD-APP] |
| 提示済 | Đã gửi (Presented) | Filter Worker App [BD-APP] |
| 全て | Tất cả | Filter [BD-APP] |
| 依頼をキャンセルする | Huỷ yêu cầu (Cancel Trouble) | Shop App [BD-APP] |
| 対応中の状態 | Trạng thái đang xử lý của trouble | [BD-CMS] |
| 受注 (02-02) / 移動中 (02-03) / 到着 (02-04) | Thợ nhận việc / đang di chuyển / đã đến | Chỉ 到着 mới cho Submit [BD-CMS] |
| 完了 (03-01→03-07) | Hoàn thành | Điều kiện re-submit [BD-CMS] |
| 高度な検索 | Tìm kiếm nâng cao | Rule From/To date [BD-CMS] |
| 作業依頼 / 作業報告 | Yêu cầu công việc / Báo cáo công việc | [TC-006] |
| 履歴 / 操作名 | Lịch sử / Tên thao tác | 「アプリからのアクション」cho mọi action từ App (CR48) [TC-006] |
| 見積再承認済 | Badge "đã duyệt lại báo giá" | CR40 [TC-006] |
| 全角 / 半角 | Full-width / Half-width | CR75 [TC-006] |
| トラブルNAVI | Trouble Navi (luồng tạo trouble có symptom_id) | [TC-006] |
| 諸経費 | Chi phí khác | **[cần confirm]** text bị cắt trong sheet ("作業 / 部材 / 諸…") |
