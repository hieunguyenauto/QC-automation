# 2026-10-15 Tên menu danh sách trouble khác theo role
- Loại: LOCATOR
- Nguồn: recon E2E (RECON_PART=E) + Hieu Nguyen xác nhận 15/10/2026 — file: web/screens/cms/layout.screen.ts (toridoll-test)
- Function / màn hình: Sidebar CMS → danh sách trouble (/admin/troubles)
- Triệu chứng: layout.menu('進行中のトラブル一覧') với role 99 timeout, trang vẫn ở /admin.
- Nguyên nhân gốc: role 99 không có menu '進行中のトラブル一覧'; danh sách trouble của 99 là '作業依頼情報'. Role 01 / 02 / 98 là '進行中のトラブル一覧'.
- Cách fix: ghi tên menu theo role ở CmsLayout.menu; recon mở thẳng /admin/troubles.
- Rule rút ra: R35 — Tên menu sidebar khác theo role (danh sách trouble: 99 '作業依頼情報', 01/02/98 '進行中のトラブル一覧'): gọi menu đúng tên của role đang đăng nhập, hoặc mở thẳng URL khi TC không kiểm menu.
- Áp dụng cho: mọi bước điều hướng bằng sidebar trong kịch bản đổi tài khoản.
