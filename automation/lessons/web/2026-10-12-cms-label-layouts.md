# 2026-10-12 Nhãn trên CMS có 3 kiểu bố cục
- Loại: LOCATOR
- Nguồn: recon reports/recon-20261012-093334-dev (projects/qnavi/automation/web), file 25-trouble-detail.yml, 32-detail-header-報告書.yml
- Function / màn hình: CMS 作業依頼詳細 (header, bảng chi tiết), modal 報告書
- Triệu chứng: tìm nhãn '業者' không thấy (header ghi '業者:'); kiểm cả dòng '施工業者 … 施工担当者 …' khớp nhầm giá trị của cặp bên cạnh; dòng số trouble tên '番号' chứ không phải '依頼番号'.
- Nguyên nhân gốc: code đoán bố cục và tên nhãn từ TC / catalog thay vì DOM thật.
- Cách fix: common/ui.ts valueOf(scope, label) lấy ô ngay sau nhãn: <td>nhãn</td><td>giá trị</td>, hoặc <p>nhãn:</p> ở header; expectRow dùng valueOf.
- Rule rút ra: R04 — kiểm "nhãn = giá trị" bằng ô giá trị ngay sau nhãn (valueOf), không kiểm cả dòng; tên nhãn lấy đúng như DOM (có ':' / tên khác TC thì ghi chú trong screen).
- Áp dụng cho: mọi bảng thông tin, header chi tiết, modal 報告書 / 支払情報.
