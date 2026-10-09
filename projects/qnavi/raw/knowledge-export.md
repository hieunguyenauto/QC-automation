# QNAVI Estimation — QA Knowledge Base

> Tổng hợp ngày 2026-10-09 · Project: *Test Case Generator - QNAVI* · Người tổng hợp: Claude cho HieuNT
> Quy ước: mỗi ý 1 dòng · `[nguồn]` ở cuối dòng · **[cần confirm]** = chưa chắc / còn mâu thuẫn giữa các nguồn.

**Mã nguồn dùng trong file**

| Mã | Nguồn |
|---|---|
| PI | Project instructions (Master Tester prompt) |
| BD-CMS | `CMS Estimation service design 1.xlsx` |
| BD-APP | `Estimation service Estimation basic design .xlsx` |
| BD-605 | `Qnavi_605 Basic Design .xlsx` |
| TC-006 | `Estimation Test Case 2026.006（2026_08_27リリース）.xlsx` |
| DOC-1945 | Doc `QNAVI-1945 Laravel 9-13 upgrade - viewpoint & testcase review.md` |
| chat:QA-rules | Các chat trước trong project — QA rules / verification (memory `qa-principles`) |
| chat:WoW | Các chat trước — sheet format, tooling (memory `ways-of-working`) |
| chat:Overview | Các chat trước — scope release, người liên quan (memory `overview`) |
| chat:Tooling | Các chat về test-case workflow, wfos, qc-automation (memory `qa-test-tooling`) |

---

## 1. Luật / quy ước bắt buộc

- Testcase luôn viết bằng **tiếng Anh** (kể cả khi chat bằng tiếng Việt). [PI; chat:WoW]
- Thuật ngữ/label UI tiếng Nhật giữ nguyên trong TC (VD: `'見積書作成'`, `見積名`), không dịch. [TC-006]
- Mỗi lần chỉ tạo TC cho **đúng 1 sheet** được chỉ định trong Test Viewpoint; không tự mở rộng scope. [PI; chat:WoW]
- TC tạo mới phải bám sát Test Viewpoint của sheet đó. [PI]
- TC mới không có trong viewpoint → **để trống Viewpoint ID**; cấm placeholder kiểu `CMS-NEW`. [PI; chat:QA-rules]
- Chỉ tạo viewpoint mới khi được yêu cầu rõ ràng. [chat:QA-rules]
- **1 TC = 1 behavior**: TC gộp nhiều scenario luôn phải tách ra (hard rule). [chat:QA-rules]
- Bắt buộc check duplicate TC và double-check tổng thể trước khi giao. [PI]
- Format TC: `TC ID / Viewpoint_ID / Test Level / Main Screen / Function / Pre-condition / Steps / Expected Results / Role / OS / Priority / Status`. [PI]
- Steps đánh số `1. … 2. …`, bước đầu thường là `Login as <Role>`. [TC-006]
- ID TC theo sheet: `<Prefix>-TC-NNN` (VD: `WB-TC-001`, `WB2-TC-001`, `CMS2-TC-001`, `REG-En-TC-001`, `ST-TC-001`). [TC-006]
- ID VP theo sheet: `<Prefix>-NN` (VD: `WB1-01`, `WB2-01`, `REG-En-01`). [TC-006]
- ID cho CR: VP = `VP-CR<n>-NN`, TC = `TC-CR<n>-NNN` (VD: `VP-CR37-01`, `TC-CR37-001`). [TC-006]
- ID cho ticket enhancement: `EH-QNAVI-<ticket>-TC-NNN` (VD: `EH-QNAVI-1817-TC-001`). [TC-006]
- Prefix sheet đang dùng: WB, WB2, WB3, CMS, CMS2, CMS3, REG-En, REG-ATT, REG-PC, REG-EX, REG-MAIL, REG-N, ST. [TC-006]
- Mỗi sheet TC đi cặp với sheet `<tên>_Viewpoint`. [TC-006]
- Priority trong workbook 2026.006: High / Medium / Low. [TC-006]
- Priority trong template chuẩn của team (skill): chỉ 2 mức High / Normal → khác với workbook QNAVI. **[cần confirm]** dùng bộ nào cho file mới. [chat:Tooling]
- Câu Objective theo template team: `Verify that + <expectation> + in case/when + <condition>`. [chat:Tooling]
- Giá trị kết quả: `Passed` / `Failed` / `Fixed` / `Pending` / `N/A`; `-` = role/platform không áp dụng. [TC-006]

## 2. Quy trình làm việc

- B1: Đọc Test Viewpoint của sheet được chỉ định → sinh TC bám viewpoint. [PI]
- B2: Đối chiếu old TC QNAVI-1556 (CSV) để bổ sung case thiếu. [PI]
- B3: Đối chiếu Basic Design (CMS / Worker-Store app) để thêm case. [PI]
- B4: Check duplicate → double-check toàn bộ. [PI]
- **Three-source verification** trước khi coi 1 sheet là xong: (1) Test Viewpoint, (2) old TC QNAVI-1556, (3) Basic Design. [chat:QA-rules]
- Khi các nguồn mâu thuẫn: **BD CMS Estimation là nguồn authoritative**. [chat:QA-rules]
- Luôn xác minh role nào thuộc ticket/màn hình nào và ticket thuộc release phase nào trước khi đưa vào scope. [chat:QA-rules]
- Làm iterative: user sửa giữa chừng → áp dụng ngay và verify lại, không bảo vệ output cũ. [chat:WoW]
- Deliverable cho manager review: xuất file mới riêng, không sửa trực tiếp file gốc. [chat:WoW]
- Ai duyệt: "chị i1" (team lead/manager) **[cần confirm]** vai trò approver chính thức. [chat:Overview]
- Sau khi viết: Coverage & Traceability (VP ↔ TC) → thực thi theo assignee → Test Execution Summary. [TC-006]
- Phân công thực thi theo sheet: HieuNT, AnhBTM, ThaoLTH, ThaoTTT. [TC-006]
- Bug verify theo milestone/hotfix trong sheet `Verify Issue List`. [TC-006]
- Có Release Sanity Checklist (đã rút từ 151 → ~50 case). [chat:Overview]
- UAT story 2026.006: HQT-5369. [chat:Overview]
- Backlog: picon.backlog.com (HQT, truy cập được); QNAVI ở globar.backlog.com (không truy cập trực tiếp, xem gián tiếp qua HQT). [chat:WoW]
- Workbook TC trên Google Drive → tải bằng export xlsx → đọc bằng openpyxl. [chat:WoW]
- Báo cáo tiến độ test gửi Slack qua Google Apps Script (webhook). [chat:WoW]
- Workflow Claude Code 3 bước/ticket: conflict check → viewpoint/TC → update `basicdesign.md`. [chat:Tooling]
- wfos (`workflow_os`) QA pipeline: new → gap → viewpoint → cases → run → report; suite đầu tiên QNAVI-1841. [chat:Tooling]
- Từ Oct–Dec 2026: HieuNT bàn giao điều phối QA Qnavi cho ThảoLTH, chuyển sang lead automation; report LyHTY + ThảoLTH. [chat:Tooling/HQE]
- Công cụ: Backlog, Google Drive/Sheets, openpyxl, Claude Projects/Code, NotebookLM, Charles Proxy, Postman, Midscene YAML, Playwright, Appium. [chat:Tooling]

## 3. Thuật ngữ nghiệp vụ

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

## 4. Màn hình / chức năng / luồng đi

- 3 surface: CMS (web admin), Worker App, Store/Shop App (WebView + native iOS/Android). [chat:Overview]
- Roles phía thợ: Admin, Sub Admin, Worker Company, Worker (APP). [BD-CMS]
- Roles phía cửa hàng: Store Manager, Chain Store, Individual Store (CMS + APP). [BD-CMS]
- Result columns còn có CMS ManagementCompany. [TC-006]
- Trouble `version = 'v2'` → form + logic báo giá mới; trouble cũ đã có báo giá (`version NULL`) → form cũ. [BD-CMS]
- Trouble cũ chưa có báo giá + mọi trouble mới → dùng Estimation Service mới. [BD-CMS]
- Bảng estimations cũ thêm cột `estimation_id` (default NULL) để map sang service mới. [BD-CMS]
- CMS screens: Create estimation, Estimation list_01 (modal đổi status), list_02/03 (list trên Trouble detail theo role), State change, Trouble list, Summary estimation, PDF & Excel file, Chat & Push. [BD-CMS]
- APP screens: Estimation list (WB), Create estimation (WB2), Estimation detail (WB3), Shop view estimation detail. [BD-APP; TC-006]
- APP functions trong BD: View list, Create, View detail, Cancel trouble, Bulk submit, Approval review, Bulk request cancel, Approval review request cancel. [BD-APP]
- State change: section báo giá xuất hiện khi trouble ở 受注/移動中/到着; Submit chỉ enable ở 到着 (02-04). [BD-CMS]
- Luồng chính: Draft → Submit → 承認待ち → (見積承認 → 承認済み | 稟議承認中 → 承認済み | 差し戻し → sửa → 再承認待ち). [BD-CMS]
- Luồng rút lại: 承認待ち → 取り下げ申請 → 取り下げ承認まち → (承認 → 再提出待ち | 却下 → 取り下げ却下). [BD-CMS]
- Re-submit: chỉ khi trouble chưa 完了; báo giá đã approved bị chuyển 失効 ngay. [BD-CMS]
- Vào 稟議承認中 → các báo giá live khác cùng trouble bị 失効 (cascade, CR54). [TC-006]
- Permission matrix quyết định nút theo status × role (Create/View/Edit/Copy/Delete/Submit/Request cancel/Approve/Return/Approve-Reject cancel). [BD-CMS]
- Draft & 再提出待ち: Edit/Copy/Delete/Submit; 承認待ち & 再承認待ち: phía store có Approve/Return. [BD-CMS]
- Matrix filter Worker App: 全て / 下書き / 要対応 / 提示済 / 取り下げ申請. [BD-APP]
- Matrix filter Shop App: 全て / 見積承認待ち / 取り下げ承認待ち. [BD-APP]
- Store đã approve request cancel (→ 再提出待ち) → báo giá biến khỏi list của Store. [BD-APP]
- Copy trên list → popup 見積書作成, nhập 見積名 (≤30) → sang màn Create với tên đã điền. [BD-APP]
- Chat tự động: tạo / duyệt / từ chối request cancel, reject báo giá — mỗi loại có format riêng và nhóm nhận riêng. [BD-CMS]
- Push riêng cho request cancel / approve / reject cancel (thay push chat chung). [BD-CMS]
- Trouble list CMS: date range From/To giới hạn lẫn nhau; chọn lại 1 field thì clear field kia. [BD-CMS]
- Mã hoá: user có write key nhập/xem; read key chỉ xem; không key → masked. [TC-006]
- Concurrency: Worker submit vs Store complete trouble cùng lúc (CR69, QNAVI-2186/2187). [TC-006; chat:Overview]
- Qnavi-605 screens: Mobile Shop/Worker, Create trouble, Create/View&Edit report, Download report, Repair history, Chain system, Asset list, Download excel, Bulk/Manual registration. [BD-605]

## 5. Bug hay gặp và pattern lỗi

| Bug ID | Function | Pattern |
|---|---|---|
| QNAVI-1706 | Create estimation | Double-submit: nhấn Enter nhiều lần khi loading → tạo trùng báo giá [TC-006] |
| QNAVI-1771 | CMS thêm item báo giá | Tăng số lượng → nhân bản dòng item [TC-006] |
| QNAVI-1787 | Approve type 3 (App Store) | Boundary: số tiền = MIN → server error [TC-006] |
| QNAVI-2093 | Shop phê duyệt theo số tiền | Gửi lẫn báo giá duyệt được/không được → server error [TC-006] |
| QNAVI-1765 | CMS State change (continue trouble từ app) | Status cũ「見積承認待ち」không được clear [TC-006] |
| QNAVI-1786 | Auto task | Task tự động không xoá được khi trouble đã hoàn thành [TC-006] |
| QNAVI-2047 | Auto task / chat | Sai thứ tự message khi store approve type 04 [TC-006] |
| QNAVI-2186 / 2187 | Submit vs complete trouble | Race condition (2186 CMS-only, 2187 App-only) [chat:QA-rules] |
| QNAVI-1839 / 1863 | Nút 稟議進捗 | Trắng trang do lỗi quyền (admin) / không hiện ở continue trouble [TC-006] |
| QNAVI-1773 | CMS chọn ứng viên | Nút hiển thị sai role (Sub Admin) [TC-006] |
| QNAVI-1900 | CMS tạo báo giá | Tạo thành công nhưng dialog không đóng [TC-006] |
| QNAVI-1108 / 1927 | List CMS | Pagination không giữ / reset về trang 1 khi Back [TC-006] |
| QNAVI-1896 / 1899 | Store App | Sai context: mở/ tạo request cho cửa hàng khác [TC-006] |
| QNAVI-2012 | Worker App | Không xem được báo giá/báo cáo khi trouble completed [TC-006] |
| QNAVI-2032 / 2038 / 2048 / 1764 | Firebase chat | Thiếu validate giới hạn (>1000 ký tự, >5 ảnh, >50MB không báo lỗi, video 5MB) [TC-006] |
| QNAVI-2029 / 2049 / 1966 | App upload ảnh | Chậm/mất ảnh, crash khi background lúc upload, crash khi lưu ảnh sau update [TC-006] |
| QNAVI-1757 / 1758 / 2033 / 2082 | Chat đã đọc/chưa đọc | Sai trạng thái read/unread và đếm unread [TC-006] |
| QNAVI-2083 | Store App chat | SSO login → không hiện tin gửi cho mình [TC-006] |
| QNAVI-2077 / 2079 / 2080 | Firebase chat PROD | Lỗi sau update app / lỗi quyền [TC-006] |
| QNAVI-2084 / 2085 | CMS chat list | Sort theo sender lỗi / không chạy [TC-006] |
| QNAVI-1908 / 2024 / 1767 / 1768 | UI | Layout vỡ, bottom sheet thừa, dropdown bị cắt/tràn [TC-006] |

**Pattern tổng quát** (rút từ bảng trên):
- Boundary & limit validation bị thiếu (MIN amount, max ký tự/ảnh/dung lượng). [TC-006]
- Double-click / double-submit khi loading. [TC-006]
- Concurrency / race condition giữa Worker và Store. [TC-006; chat:Overview]
- State/status bị "dính" hoặc không chuyển đúng ở continue trouble. [TC-006]
- Permission/role hiển thị sai nút hoặc lỗi quyền. [TC-006]
- State UI (pagination, dialog, read/unread) không được giữ/đóng đúng. [TC-006]
- Sai context (store/trouble khác) trên app. [TC-006]

## 6. Bài học: lỗi khi viết test / khi AI làm sai, và cách tránh

- Gộp nhiều scenario vào 1 TC → luôn tách 1 behavior/TC. [chat:QA-rules]
- AI tự đặt VP ID giả (`CMS-NEW`) → để trống nếu không map được. [chat:QA-rules]
- Suy luận quyền theo UI giống nhau (VD cho 見積承認 ở 再提出待ち/再編集) → luôn tra Permission matrix BD. [chat:QA-rules]
- Lẫn role giữa ticket (2186 CMS-only vs 2187 App-only) → check role scope từng ticket. [chat:QA-rules]
- Đưa ticket sai phase (QNAVI-1839 thuộc 2026.002) vào 2026.006 → check phase trước. [chat:QA-rules]
- Bỏ sót ticket cha (QNAVI-1191 – action buttons Trouble List) → luôn tra parent/child ticket. [chat:Overview]
- Masking: amount mã hoá hiện `0`, chỉ text (備考, 見積名) hiện `***` — đừng viết `***` cho mọi field. [chat:QA-rules]
- Mâu thuẫn: VP `REG-En-06` trong workbook vẫn ghi cột 金額 hiện `***` → **[cần confirm]** với dev/sheet nào đúng. [TC-006]
- Tab Google Sheets >31 ký tự bị đổi tên (Sheet62, Sheet63…) khi export xlsx → công thức INDIRECT phải theo tên mới. [chat:QA-rules; TC-006]
- LibreOffice/Excel không đọc `FILTER`, `MAP`, `LAMBDA` → lỗi `#REF!/#NAME?` có sẵn, không phải do mình sửa. [chat:QA-rules; DOC-1945]
- Header TC không cố định hàng → dò literal `TC ID` thay vì hard-code row. [chat:WoW]
- Merged cells → clear merge range trước khi ghi bằng openpyxl. [chat:WoW]
- Block TC bị copy lặp nguyên khối (TC347–356) → check duplicate theo nội dung, không chỉ theo ID. [DOC-1945]
- TC có VP nhưng VP không tồn tại (orphan VP-110→114) → check 2 chiều VP↔TC. [DOC-1945]
- Ô text bắt đầu bằng `=+` bị Excel hiểu là công thức → lỗi; nhập text thuần. [DOC-1945]
- "Total TCs" ở đầu sheet là số ô kết quả (TC × cột role/platform), không phải số TC → đừng báo cáo nhầm. [DOC-1945]
- TC có thể test sai layer (TC089 CSRF chỉ gắn route `web`) → hỏi dev, thêm case negative. [DOC-1945]
- Chỉ test happy-path push → thiếu case gửi push lỗi không được rollback nghiệp vụ. [DOC-1945]
- Assertion không đồng nhất giữa các batch cùng impact (thiếu "data parses") → so assertion giữa các nhóm tương tự. [DOC-1945]
- Permission chỉ test ở bản cuối → khi nâng cấp nhiều bước phải test ở từng bước trung gian. [DOC-1945]
- Sanity checklist ban đầu quá dài (151) → rút gọn ~50 case trọng tâm. [chat:Overview]

## 7. Template / format file đang dùng

- **TC sheet (project instructions, 12 cột):** TC ID · Viewpoint ID · Test Level · Main Screen · Function · Pre-condition · Steps · Expected Results · Role · OS · Priority · Status. [PI; chat:WoW]
- **TC sheet thực tế 2026.006:** 11 cột đầu như trên, rồi cột kết quả theo role/platform: CMS Admin · CMS SubAdmin · CMS ChainStore Manager · CMS ChainStore · CMS ManagementCompany · APP ChainStoreManager iOS · APP ChainStoreManager Android · APP ChainStore iOS · APP ChainStore Android · APP Worker iOS · APP Worker Android · Note. [TC-006]
- Đầu sheet TC có block metric: Total TCs · High · Medium · Low · Passed · Failed · Fixed · Pending · N/A · % Pass rate · % Executed. [TC-006]
- Header TC thường ở row 6, data từ row 7 (pandas `header=5`); có sheet lệch → dò `TC ID`. [chat:WoW]
- **VP sheet (9 cột):** ID · Screen · Test Level/Test Type · Function · Test Viewpoint · Expected Result · Role · Site · Note. [chat:WoW; TC-006 CR_Viewpoint]
- VP sheet cũ (WB/CMS): ID · Screen · Test Level/Test Type · Function · Test view point · Expected Result · Comment · PIC · Dev result · Date time. [TC-006]
- VP ID nằm ở cột B; không có cột "No" chạy số. [chat:WoW]
- **Coverage & Traceability:** mỗi section `▶ <Sheet>` + SUMMARY (VPs, TCs written, Unmapped TCs); cột: VP ID · Test Level · Function · Viewpoint Description · Covered Test Cases · TC Count · Status. [TC-006]
- **Test Execution Summary:** Sheet · Total TCs · Passed · Failed · Fixed · Pending · N/A · Assigned · % Pass Rate · % Execution; kèm breakdown theo Priority và Test Type. [TC-006]
- **Verify Issue List:** # · Milestone · Issue Key · Summary · Priority · Verify status (+ bản dịch tiếng Việt). [TC-006]
- **Log API sheet (QNAVI-2099):** No · VP ID · Endpoint · Role/Platform · Action · … · payload mẫu. [TC-006] **[cần confirm]** tên đủ các cột.
- **Template chuẩn team (skill):** Cover · Data test · Testcase (theo function) · Summary; cột TC: TC No. · Priority · Category · Sub Category · Objective · Pre-condition · Data test · Test Steps · Expectation result · Implementation 1st/2nd · Remarks. [chat:Tooling]
- Đề xuất bổ sung template: sheet Test Viewpoint (VP_ID, Category, Test Level, Function, View Point, Expected Results, Site, Note), cột VP_ID trong TC, Summary theo dõi NG→OK. [chat:Tooling]

## 8. Quyết định đã chốt và lý do

| Quyết định | Lý do | Nguồn |
|---|---|---|
| BD CMS Estimation là nguồn authoritative khi mâu thuẫn | Có 1 nguồn chốt để tránh tranh cãi | chat:QA-rules |
| Permission matrix BD override mọi suy luận | UI giống nhau nhưng quyền khác (VD 見積承認) | chat:QA-rules |
| VP ID để trống nếu không map | Giữ traceability sạch, không tạo VP ảo | PI; chat:QA-rules |
| 1 behavior / TC | Dễ thực thi, dễ trace bug | chat:QA-rules |
| TC viết tiếng Anh | Chuẩn deliverable của team | PI; chat:WoW |
| Mỗi lần 1 sheet | Kiểm soát scope, dễ review | PI |
| Output ra file riêng, không sửa file gốc | Phục vụ manager review | chat:WoW |
| QNAVI-1839 loại khỏi scope 2026.006 | Thuộc phase 2026.002 | chat:QA-rules |
| Coverage Trouble List (CMS) 2026.006 chỉ gồm tính năng estimation | Giới hạn theo scope release (見積有効期限 search, list, open-detail, download) | chat:Overview |
| QNAVI-1945: PHP runtime = 8.4 | Dev impact list xác nhận (Dockerfile L12→L13) | DOC-1945 |
| QNAVI-1945: thêm VP-110→114 | Hết orphan TC357–361 | DOC-1945 |
| QNAVI-1945: test permission VP-30→36 ở từng bước L10/L11/L12 | `registerPolicies()` bị comment từ L10 (rủi ro High) | DOC-1945 |
| QNAVI-1945: xoá block TC duplicate (371 → 361 TC) | Lặp 100% | DOC-1945 |
| VP-115 / TC362 (push send failure isolation) | Đã soạn nháp, **[cần confirm]** user duyệt chèn vào Excel | DOC-1945 |

**Các điểm đang mở [cần confirm]**
- Error message phía Worker cho CR69 Scenario 2. [chat:Overview]
- Expected UI của VP-CR76-06. [chat:Overview]
- TC-CR72-19 (draft exemption) xung đột với CR54. [chat:Overview]
- TC089 (QNAVI-1945) test đúng layer CSRF hay không. [DOC-1945]
- Masking amount `0` vs `***` (REG-En-06). [TC-006; chat:QA-rules]

---

## Danh sách tài liệu trong project

| Tài liệu | Mô tả 1 dòng |
|---|---|
| `CMS Estimation service design 1.xlsx` | BD phía CMS: versioning v2, màn Create/List/State change/Trouble list/Summary/PDF-Excel/Chat, Permission matrix. |
| `Estimation service Estimation basic design .xlsx` | BD Worker/Store App: requirement, screen transition, state transition, Matrix Filter–Action button, 8 function (list, create, detail, cancel, bulk submit, approve, request cancel). |
| `Qnavi_605 Basic Design .xlsx` | BD QNAVI-605: trouble/report CMS, Mobile Shop/Worker, download report, repair history, chain system, asset, bulk/manual registration. |
| `Estimation Test Case 2026.006（2026_08_27リリース）.xlsx` | Workbook test release 2026.006: 47 sheet VP/TC (WebView, CMS, Regression, ST, CR, tickets), Coverage & Traceability, Execution Summary (6,759 TC), Verify Issue List. |
| `claude/QNAVI-1945 Laravel 9-13 upgrade - viewpoint & testcase review.md` | Review VP/TC nâng cấp Laravel 9→13: 6 điểm đã sửa, 2 gap Push Notification, traceability sau sửa. |
| `Estimation Coverage Traceability TestscaseQNAVI1556.csv` | Old TC QNAVI-1556 dùng đối chiếu — **[cần confirm]** hiện không còn trong danh sách file project. |
| `[Estimation] Test Coverage` (Google Drive) | Nguồn Test Viewpoint + TC mới theo project instructions — nằm ngoài project, trên Drive. |
