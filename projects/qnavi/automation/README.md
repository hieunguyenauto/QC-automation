# Automation — Qnavi
Input duy nhất: test case LOCKED trong ../qc/test-cases/ (Automation Eligibility = UI-AUTO / BOTH). Knowledge ở đây do skill kb-update-automation cập nhật.

| Thư mục | Nội dung | Trạng thái |
|---|---|---|
| web/ | Playwright cho CMS (qnavi-cms-frontend). Cách chạy: web/README.md | Chạy được: tests/cms/e2e-trouble-flow.spec.ts |
| web/screens/cms/ | Knowledge màn hình: mã màn hình, route, role, locator | Đã xác minh trên app thật (E2E 13/13 pass 2026-10-12): login, layout, trouble-create (+asset-select), trouble-list (openByNumber), trouble-detail (状態変更, 作業者, 見積もり, 報告書, 支払情報), trouble-edit. Role đã chạy: 99, 01 |
| mobile/ | Appium cho Repair app, Shop app (native) | Làm sau |

Mô tả màn hình (route, role, API): ../screens/catalog/ (cms-frontend, estimation-frontend, trouble-frontend, repair-app, shop-app).
Estimation PWA và Trouble NAVI là web nhúng trong app, cần token đặt sẵn vào cookie → làm sau, dùng chung khung web/.

## Môi trường / tài khoản test
- URL theo môi trường: web/env/<ENV>.json. Tài khoản theo role: web/.env (không commit), mẫu ở web/.env.example.
- est-test (2026-10-12): E2E chập chờn ở TC-002 bước 12 (modal 故障内容 quay spinner không hiện card, có lúc kèm dialog '表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。'), cũng gặp ở TC-004 (作業者). Backend có phản hồi (curl OK; trace có lần API trả 200 mà vẫn treo). Nguyên nhân CHƯA xác định — đã thử bỏ httpCredentials (Basic Auth qua URL): không hết lỗi, lại lộ mật khẩu trong trace → không dùng. Không sửa test để bỏ qua dialog.
