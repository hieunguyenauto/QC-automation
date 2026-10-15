# 2026-10-13 Loader toàn trang #loader-container chặn click
- Loại: TIMING
- Nguồn: @P007-TC-016 — file: web/tests/cms/phase007-regression.spec.ts (dev)
- Function / màn hình: 作業依頼登録 › 修理対象資産選択 (hộp chọn tài sản, ~95 tài sản)
- Triệu chứng: click '新しい機器を登録する' timeout: "<div id="loader-container"> intercepts pointer events".
- Nguyên nhân gốc: danh sách lớn tải chậm, app phủ loader toàn trang; selector LOADER trong common/wait.ts là đoán ('.app-loader…', ghi [cần kiểm]) nên waitForAppIdle không chờ gì.
- Cách fix: LOADER = '#loader-container, …', waitForAppIdle chờ tới 60s; gọi trước thao tác trong AssetSelectDialog (selectRows, openRegister).
- Rule rút ra: R26
- Áp dụng cho: mọi thao tác ngay sau khi mở màn / hộp có danh sách lớn.
