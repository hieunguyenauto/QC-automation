# 2026-10-16 Spec sinh tự động bị sửa tay → sinh lại là mất
- Loại: DATA
- Nguồn: npm run gen:e2e 16/10/2026 (sau khi sửa khuôn TC-002) — file: web/scripts/gen-e2e-specs.mjs, web/tests/cms/e2e-suite/E2E-02…39.spec.ts
- Function / màn hình: bộ E2E suite (mọi kịch bản sinh từ TC)
- Triệu chứng: sinh lại để đổi 2 dòng, diff ra ~50 dòng / file: mất N() / NR() / envData (tên theo môi trường) của commit af690ea. `gen:e2e -- --check` vẫn báo ✓ (chỉ kiểm rev TC).
- Nguyên nhân gốc: commit af690ea bọc chuỗi Linksys bằng N() / envData thẳng trong spec sinh ra, không sửa generator → generator và spec lệch nhau; lần sinh sau ghi đè.
- Cách fix: khôi phục E2E-02…39 từ HEAD, chỉ áp đúng dòng mà khuôn mới sinh ra. Việc còn lại: đưa N() / envData vào gen-e2e-specs.mjs để sinh lại không mất.
- Rule rút ra: R42 — Spec sinh tự động chỉ sửa qua generator (cả thay đổi hàng loạt bằng script); trước khi sinh lại: sinh ra, xem git diff — có thay đổi ngoài phần khuôn vừa sửa thì dừng, đưa thay đổi đó vào generator trước.
- Áp dụng cho: scripts/gen-e2e-specs.mjs và mọi file "FILE SINH TỰ ĐỘNG — không sửa tay".
