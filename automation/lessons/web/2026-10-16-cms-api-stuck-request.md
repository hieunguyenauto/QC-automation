# 2026-10-16 Request treo không được chặn mọi lần chờ API sau đó
- Loại: TIMING
- Nguồn: @E2E06-TC-013 (toridoll-test 15/10) — file: web/common/wait.ts
- Function / màn hình: Trouble Detail › 状態変更 (日程確定 → 保存 → 決定)
- Triệu chứng: TC hết 5 phút dù hộp 'この情報の保存が完了しました。' đã hiện; perf ghi 'API chưa xong sau 120s (GET /api/troubles/<id>)'.
- Nguyên nhân gốc: server không bao giờ trả lời 1 request; waitApisIdle giữ request đó trong danh sách tới khi trang chuyển → mỗi lần gọi sau lại chờ đủ apiMaxWaitMs (120s), cộng dồn quá timeout TC.
- Cách fix: waitApisIdle bỏ request đã treo > apiMaxWaitMs khỏi danh sách và ghi 'perf' 1 lần (không fail, không retry — R18).
- Rule rút ra: R37 — Chờ API idle: request treo quá ngưỡng thì ghi perf một lần rồi bỏ khỏi danh sách; không để nó chặn mọi lần chờ sau.
- Áp dụng cho: common/wait.ts waitApisIdle, mọi cơ chế "chờ hết request".
