# Qnavi Estimation — hồ sơ dự án
> Nguồn: raw/knowledge-export.md (2026-10-09). Chỉ ghi phần riêng của dự án; luật chung nằm ở CLAUDE.md / skills.

## Bề mặt & role
- Surface: CMS (web admin) · Worker App · Store/Shop App (WebView + native iOS/Android).
- Role phía thợ: Admin · Sub Admin · Worker Company · Worker (APP).
- Role phía cửa hàng: Store Manager · Chain Store · Individual Store. Thêm: CMS ManagementCompany.
- Cột kết quả theo role/platform (chỉ trong Excel): CMS Admin · CMS SubAdmin · CMS ChainStore Manager · CMS ChainStore · CMS ManagementCompany · APP ChainStoreManager iOS/Android · APP ChainStore iOS/Android · APP Worker iOS/Android · Note.

## Quy ước ID / sheet
- Sheet prefix: WB, WB2, WB3, CMS, CMS2, CMS3, REG-En, REG-ATT, REG-PC, REG-EX, REG-MAIL, REG-N, ST. Mỗi sheet TC đi cặp `<tên>_Viewpoint`.
- CR: VP `VP-CR<n>-NN`, TC `TC-CR<n>-NNN`. Ticket enhancement: `EH-QNAVI-<ticket>-TC-NNN`.

## Nguồn & thứ tự ưu tiên → sources.md
## Thuật ngữ → glossary.md · Màn hình / luồng / permission → screens/_flow.md · Bug → bug-history.md

## Quy tắc riêng dự án
- Masking (mã hoá): field số tiền hiện `0`; chỉ field text (備考, 見積名) hiện `***`. Write key: nhập/xem; read key: xem; không key: masked.
- Release phase: luôn check ticket thuộc phase nào (vd QNAVI-1839 thuộc 2026.002, không vào 2026.006).
- Backlog: HQT ở picon.backlog.com (truy cập được); QNAVI ở globar.backlog.com (xem gián tiếp qua HQT). UAT story 2026.006: HQT-5369.
- Workbook TC trên Google Drive → export xlsx; header TC thường ở row 6 (dò literal `TC ID`).
- Release Sanity Checklist: ~50 case trọng tâm.

## Điểm mở [cần confirm]
- Error message phía Worker cho CR69 Scenario 2 · Expected UI VP-CR76-06 · TC-CR72-19 xung đột CR54 · TC089 (QNAVI-1945) đúng layer CSRF? · Masking amount `0` vs `***` (REG-En-06) · Approver chính thức ("chị i1").
