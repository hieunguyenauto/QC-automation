# 2026-10-12 Màn chi tiết CMS tải dữ liệu sau khi mở
- Loại: TIMING
- Nguồn: recon reports/recon-20261012-093334-dev (projects/qnavi/automation/web), file 25-trouble-detail.yml, 47-manager-trouble-detail.yml
- Function / màn hình: CMS 作業依頼詳細 (/admin/troubles/:id/detail)
- Triệu chứng: ngay sau khi vào trang, mọi ô bảng trống, nút ' クイック操作' [disabled]; kiểm giá trị lúc này sẽ fail hoặc khớp sai.
- Nguyên nhân gốc: dữ liệu (GET /troubles/:id…) tải bất đồng bộ sau khi route đổi; URL đúng chưa có nghĩa là dữ liệu đã có.
- Cách fix: TroubleDetailScreen.expectOpened() chờ ô giá trị của '番号' có số (timeout 20s) rồi mới kiểm / bấm.
- Rule rút ra: R03 — màn có dữ liệu tải sau: chờ 1 ô dữ liệu chính có giá trị (vd 番号) trước khi kiểm hoặc thao tác; không dựa vào URL / networkidle.
- Áp dụng cho: mọi màn chi tiết / danh sách CMS, recon.
