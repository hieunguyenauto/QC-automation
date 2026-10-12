# 2026-10-12 Ghi dữ liệu then chốt trước bước phụ
- Loại: FLOW
- Nguồn: run 20261012-105319-dev, E2E-TC-002 bước 32 (thu nhỏ chat lỗi trước khi lưu 依頼番号 → không resume được TC-003+ bằng E2E_TROUBLE_ID)
- Function / màn hình: tests/cms/e2e-trouble-flow.spec.ts
- Cách fix: ghi trouble.id / number ngay sau khi tạo, rồi mới làm thao tác phụ (thu nhỏ chat).
- Rule rút ra: R14
- Áp dụng cho: mọi bước tạo dữ liệu dùng cho TC sau.
