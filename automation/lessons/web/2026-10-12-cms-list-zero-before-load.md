# 2026-10-12 Danh sách CMS hiện "0件" trước khi tải xong
- Loại: TIMING
- Nguồn: recon v2 + browser thật (dialog 修理対象資産選択, 見積一覧)
- Function / màn hình: CMS các dialog/bảng có phân trang
- Triệu chứng: kiểm "không có dòng" pass sai / chọn dòng fail vì bảng lúc đầu là '該当データが0件でした'.
- Nguyên nhân gốc: dữ liệu tải bằng API sau khi modal mở; text 0件 là trạng thái tạm.
- Cách fix: asset-select.dialog.ts selectRows chờ '全 N 件中' (tối đa 10s) rồi mới đọc dòng; trạng thái dòng (承認待ち…) chờ tới 15s.
- Rule rút ra: R05
- Áp dụng cho: mọi list / bảng / badge trạng thái sau thao tác lưu.
