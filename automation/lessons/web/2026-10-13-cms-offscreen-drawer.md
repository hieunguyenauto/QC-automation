# 2026-10-13 Drawer '高度な検索' đóng nằm ngoài màn hình → nút trong drawer không bấm được
- Loại: LOCATOR
- Nguồn: @P007-TC-023 (cũng dùng ở TC-045) — file: web/tests/cms/phase007/phase007-regression.spec.ts (dev)
- Function / màn hình: 作業依頼情報 (/admin/troubles) › 高度な検索
- Triệu chứng: fill input[name=number] thành công nhưng click '検索' timeout 15s (không có lỗi "intercepts").
- Nguyên nhân gốc: form.filter-advance nằm trong '.drawer.drawer-right'; khi đóng drawer ở ngoài viewport (x = chiều rộng màn hình), thiếu class 'show'. Playwright vẫn coi input là "visible" (có bbox) nên fill được. Thêm nữa, nút 条件解除 / 検索 ở đầu drawer, NGOÀI form.filter-advance → locator theo form không thấy.
- Cách fix: TroubleListScreen.openAdvanced(): chưa có class 'show' → bấm '高度な検索', expect class show; bấm '検索' trong '.drawer.drawer-right'.
- Rule rút ra: R19
- Áp dụng cho: mọi drawer / off-canvas / panel trượt (lọc nâng cao, menu bên).
