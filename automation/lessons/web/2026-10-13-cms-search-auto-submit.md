# 2026-10-13 Ô 依頼番号 có lúc tự tìm sau khi gõ → 検索 disabled, drawer đóng
- Loại: TIMING
- Nguồn: @P007-TC-045 — file: web/tests/cms/phase007-regression.spec.ts (dev)
- Function / màn hình: 作業依頼情報 › 高度な検索 (drawer)
- Triệu chứng: lần 1: '検索' "not stable" rồi "not enabled", URL đã có ?number=…; lần 2 (app không tự tìm): drawer còn mở che cột 報告書PDF ("drawer-overlay intercepts").
- Nguyên nhân gốc: app có lúc tự submit sau khi gõ (đóng drawer, reset form); lúc khác phải bấm 検索 và drawer vẫn mở.
- Cách fix: searchNumber(): fill → chờ URL ?number=<giá trị> 3s; chưa có mới bấm 検索; sau khi thấy dòng, drawer còn 'show' thì bấm × (.drawer__header i.fa-times).
- Rule rút ra: R28
- Áp dụng cho: ô tìm kiếm / filter có debounce tự tìm; panel che nội dung sau khi tìm.
