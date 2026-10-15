# 2026-10-12 Hook chụp màn hình sau khi fail bị treo
- Loại: TIMING
- Nguồn: @E2E-TC-002 — tests/cms/e2e-trouble-flow/e2e-trouble-flow.spec.ts (afterEach), report 20261012-090955-dev
- Function / màn hình: hook afterEach của kịch bản E2E (context tự tạo bằng browser.newContext)
- Triệu chứng: test fail sau 5 giây nhưng cả lần chạy treo thêm ~2 phút, báo 'Test timeout of 120000ms exceeded'.
- Nguyên nhân gốc: page.screenshot({ fullPage: true }) không có timeout, bị treo trên trang có layout cố định.
- Cách fix: screenshot không fullPage, timeout 10s, .catch(); đính kèm thêm aria snapshot của body.
- Rule rút ra: R02 — hook chụp màn hình / snapshot luôn có timeout ≤ 10s và bắt lỗi; context tự tạo thì tự đính kèm ảnh + aria snapshot.
- Áp dụng cho: mọi afterEach / afterAll, đặc biệt kịch bản serial dùng context riêng.
