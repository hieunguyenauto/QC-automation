# Automation — Qnavi
Input duy nhất: test case LOCKED trong ../qc/test-cases/ (Automation Eligibility = UI-AUTO / BOTH). Knowledge ở đây do skill kb-update-automation cập nhật.

| Thư mục | Nội dung | Trạng thái |
|---|---|---|
| web/ | Playwright cho CMS (qnavi-cms-frontend). Cách chạy: web/README.md | Chạy được: tests/cms/e2e-trouble-flow/, phase007/, e2e-suite/ |
| web/screens/cms/ | Knowledge màn hình: mã màn hình, route, role, locator | Đã xác minh trên app thật (E2E 13/13 pass 2026-10-12): login, layout, trouble-create (+asset-select), trouble-list (openByNumber), trouble-detail (状態変更, 作業者, 見積もり, 報告書, 支払情報), trouble-edit. Role đã chạy: 99, 01 |
| mobile/ | Appium cho Repair app, Shop app (native) | Làm sau |

Mô tả màn hình (route, role, API): ../screens/catalog/ (cms-frontend, estimation-frontend, trouble-frontend, repair-app, shop-app).
Estimation PWA và Trouble NAVI là web nhúng trong app, cần token đặt sẵn vào cookie → làm sau, dùng chung khung web/.

## Môi trường / tài khoản test
- URL theo môi trường: web/env/<ENV>.json. Tài khoản theo role: web/.env (không commit), mẫu ở web/.env.example.
- est-test (2026-10-12): E2E chập chờn ở TC-002 bước 12 (modal 故障内容 quay spinner không hiện card, có lúc kèm dialog '表示に時間がかかっております。進行中の作業一覧を再読み込みし、ご確認ください。'), cũng gặp ở TC-004 (作業者). Backend có phản hồi (curl OK; trace có lần API trả 200 mà vẫn treo). Nguyên nhân CHƯA xác định — đã thử bỏ httpCredentials (Basic Auth qua URL): không hết lỗi, lại lộ mật khẩu trong trace → không dùng.
- dev (2026-10-13): cmsBaseUrl = https://cms-toridoll-test.qnavi.picontechnology.com (không Basic Auth; backend be-toridoll-v2). Có lúc API treo hàng phút (P007 lần 15/16: > 120s, có lần ghi 990s — có thể máy chạy test bị sleep) → chạy dài dùng caffeinate; lỗi kiểu này là ENV, không sửa code. Modal 故障内容 (作業登録) có lúc spinner > 5s dù GET largecategories đã 200 → chờ thẻ 30s. Trang có lúc không load (page.goto 30s) vì bundle JS 10.5MB (index-*.bundle.js) treo — bình thường ~2.3s; là ENV, chạy lại. Hộp chọn tài sản STORE00001 đã ~93 tài sản (Automation Asset do các lần chạy tạo) → tìm theo 名称, API tìm có lúc > 15s.
- est-test (2026-10-13, cập nhật): dialog trên phần lớn do test bấm sang trang khác khi GET /api/home (dashboard) chưa về; /api/home có lúc > 30s (API khác ~100ms). Cách xử lý (người dùng chốt, R18): đợi /api/home thực tế, quá 30s ghi PERFORMANCE (reports/PERFORMANCE.md) rồi chạy tiếp; dialog chỉ bấm OK + ghi env-warning, code không reload. Ngưỡng: env/<ENV>.json apiPerfLimitMs / apiMaxWaitMs (mặc định 30s / 120s); helper chung common/wait.ts waitApiPerf (dùng cả cho lưu 資産管理項目).
- toridoll-test (2026-10-16): mạng / server chập chờn (bundle JS, chunk webview, API /api/home > 120s, hộp '表示に時間がかかっております') → ENV, chạy lại; vòng chạy E2E kiểm tải bundle trước mỗi kịch bản. Dữ liệu bắt buộc có trước: tài sản 'TEST AUTOMATION' của LINKSYS STORE00006 (E2E-38; tạo lại bằng `RECON_PART=S npm run recon:e2e`). Mỗi lần chạy E2E-37 đăng ký thêm 1 'Automation Asset' cho STORE00006 (trùng tên tăng dần).
