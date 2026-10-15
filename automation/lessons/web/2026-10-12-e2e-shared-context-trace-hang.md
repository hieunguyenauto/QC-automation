# 2026-10-12 Trace tự động cho context dùng chung làm treo 120s, trace.zip hỏng
- Loại: FRAMEWORK
- Nguồn: run 20261012-104903-dev và 20261012-105319-dev (cả 2 lần: fail ở ~50s nhưng run kéo dài ~2–3 phút, báo "Test timeout of 120000ms exceeded", trace.zip không giải nén được)
- Function / màn hình: tests/cms/e2e-trouble-flow/e2e-trouble-flow.spec.ts (serial, context tạo trong beforeAll)
- Triệu chứng: sau khi TC fail, teardown treo tới hết timeout; trace.zip bị cắt dở.
- Nguyên nhân gốc: config trace 'retain-on-failure' áp lên context tự tạo, ghi suốt nhiều TC → lưu rất lâu khi fail, bị kill giữa chừng.
- Cách fix: playwright.config.ts project e2e: trace/video 'off'. Spec tự ghi: tracing.start ở beforeAll, startChunk/beforeEach, stopChunk({path}) + attach khi fail (bỏ khi pass), mọi lệnh trong hook bọc within(…, ms); afterAll tracing.stop + close mỗi cái ≤15s.
- Rule rút ra: R13 (mở rộng R02)
- Áp dụng cho: mọi kịch bản serial dùng chung BrowserContext.
