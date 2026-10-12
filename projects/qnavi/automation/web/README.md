# Qnavi CMS — Playwright automation

Chạy test tự động cho **CMS web** (`qnavi-cms-frontend`).
- **Input duy nhất:** test case LOCKED trong `projects/qnavi/qc/test-cases/` (Automation Eligibility = UI-AUTO / BOTH).
- **Ngoài phạm vi:** Repair app, Shop app (native → Appium, làm sau). Estimation PWA, Trouble NAVI (web nhúng, cần token cookie → làm sau).

## 1. Điều kiện cần

| Cần | Kiểm tra | Ghi chú |
|---|---|---|
| macOS + Node.js 22 LTS (khuyên dùng) | `node -v` | `brew install node@22`. Node quá mới (vd 26) có thể làm `playwright install` treo |
| Google Chrome | Mở được Chrome | Mặc định test chạy bằng Chrome cài sẵn |
| Mạng vào được CMS môi trường test | Mở URL CMS trên trình duyệt | VPN / IP whitelist nếu có |
| Tài khoản loginId + password cho từng role | — | Không dùng tài khoản Microsoft (SSO không tự động hoá được) |
| URL CMS trong `env/<ENV>.json` | — | Sửa `cmsBaseUrl` |

## 2. Cài đặt (1 lần)

```bash
cd ~/work/qc-automation/projects/qnavi/automation/web
npm ci
# Mặc định chạy bằng Google Chrome cài sẵn trên Mac, không cần tải browser.
# Muốn dùng Chromium của Playwright: npx playwright install chromium + BROWSER_CHANNEL=chromium trong .env
cp .env.example .env           # điền ENV và tài khoản theo role
```

## 3. Chạy

| Mục đích | Lệnh |
|---|---|
| Chạy tất cả | `npm test` |
| Chọn môi trường | `ENV=dev npm test` |
| 1 TC (mọi role) | `npm test -- --grep @WB2-TC-001` |
| 1 role | `npm test -- --grep @role-99` |
| 1 sheet | `npm test -- tests/cms/WB2.spec.ts` |
| Xem trình duyệt khi chạy | `npm run test:headed -- --grep @WB2-TC-001` |
| Chế độ UI (debug từng bước) | `npm run test:ui` |
| Chỉ login lại các role | `npm run setup` |
| Liệt kê test | `npm run list` |
| Kiểm tra code TypeScript | `npm run typecheck` |
| Kịch bản E2E trouble (13 TC, nối tiếp, tạo trouble mới) | `npm run e2e:headed` |
| Chạy tiếp E2E trên trouble có sẵn (đúng trạng thái) | `E2E_TROUBLE_ID=1234 npm run e2e -- --grep "TC-00[5-9]\|TC-01"` |
| Lấy locator thật: đi qua các màn hình, **không lưu dữ liệu**, ghi aria snapshot + ảnh | `npm run recon` → `reports/recon-<lần chạy>/` (`_summary.txt` liệt kê bước lỗi) |
| Mở trình duyệt **đã qua Basic Auth**, đăng nhập sẵn, để xem / lấy locator (Inspector: Record, Pick locator) | `ACCOUNT=99 npm run open` · `ENV=est-test ACCOUNT=02:urgent URL=/admin/troubles npm run open` |

Mỗi lần chạy, project `setup` login từng role có tài khoản trong `.env` và lưu phiên vào `.auth/` (không commit). Role không có tài khoản → test của role đó **skip**, không fail.

## 4. Report
Mỗi lần chạy: `reports/<ngày-giờ>-<ENV>/` (`common/qc-reporter.ts`).

| File / thư mục | Nội dung |
|---|---|
| `SUMMARY.md` | Đọc đầu tiên: tổng / pass / fail / skip, bảng fail (TC, bước fail, lỗi, link chi tiết) |
| `failed/<TC ID>_<tên TC>_<dd-mm-yyyy>/FAIL.md` | Mỗi trường 1 dòng: test case, ngày chạy, môi trường, tài khoản, bước fail, lỗi, locator, expected / received, vị trí code, URL lúc fail, trouble |
| `failed/…/` | `screenshot.png`, `aria-snapshot.yml`, `error-context.md`, `trace.zip` (mở: `npx playwright show-trace <file>`) |
| `passed/PASSED.md` | Bảng TC pass: TC ID, tên, tài khoản, thời gian |
| `skipped/SKIPPED.md` | TC không chạy và lý do |
| `html/` · `results.json` · `junit.xml` · `artifacts/` | Report gốc của Playwright (`npm run report`) |
| `reports/HISTORY.md` | Mỗi lần chạy 1 dòng: ngày, môi trường, tổng / pass / fail / skip |

## 5. Cấu trúc

| Thư mục | Chứa gì | Ai sửa |
|---|---|---|
| `env/` | Cấu hình theo môi trường (`dev`, `stg`, `est-test`): `cmsBaseUrl`, timeout, **tài khoản test theo role** (`accounts`), **Basic Auth** (`httpAuth.username`; mật khẩu ở `.env` `HTTP_AUTH_PASSWORD`). Đổi môi trường: `ENV=est-test npm run e2e` | Lead |
| `.env` | ENV đang dùng + **mật khẩu** theo role `CMS_<role>_PASSWORD` (không commit). `CMS_<role>_ID` chỉ để ghi đè loginId | Người chạy |
| `data/roles.ts` | Mã role ↔ tên cột Excel ↔ trang chủ sau login | kb-update-automation |
| `data/<scope-key>.json` | Data test theo TC ID | Khi automate TC |
| `common/` | Dùng chung: env, login (`auth.setup.ts`), `forRoles`, chờ API, assert message | kb-update-automation |
| `screens/cms/*.screen.ts` | **Knowledge màn hình**: mã màn hình, route, role, locator, thao tác ngắn | kb-update-automation |
| `tests/cms/<scope-key>.spec.ts` | 1 file = 1 sheet TC | Khi automate TC |
| `reports/` | Kết quả mỗi lần chạy | Tự sinh |

Mô tả đầy đủ màn hình (route, role, API, modal): `projects/qnavi/screens/catalog/cms-frontend.md`. File `.screen.ts` ghi mã màn hình để tra ngược, **không chép lại mô tả**.

## 6. Quy ước TC → code

| TC | Code |
|---|---|
| TC ID | Tên test bắt đầu bằng TC ID + tag `@<TC ID>` |
| Role (nhiều role) | `forRoles([...], (role) => { test(...) })` → 1 test / role, tên có `[CMS Admin]`…, tag `@role-99` |
| Pre-condition | Phiên login của role + data trong `data/` |
| Steps | Mỗi bước 1 `test.step('1. …')` |
| Expected Result (1 TC = 1 expected) | 1 `expect` chính |
| Label / message tiếng Nhật trong `''` | Dùng nguyên văn trong locator / assert |
| MANUAL / NEEDS_SPEC | Không viết code |

Luật:
- Màn hình mới / chưa chạy qua: chạy `npm run recon` (hoặc đọc `error-context.md` của lần fail) để lấy cây phần tử thật rồi mới viết locator (automation/lessons R01).
- Locator chỉ khai báo trong `screens/`. Spec không viết selector.
- Ưu tiên locator: `getByRole` / `getByLabel` / `getByText` (label tiếng Nhật) → `#id` / `data-testid` → CSS (cuối cùng).
- Không `waitForTimeout`, không `test.only`. Chờ bằng `waitForApi` hoặc `expect(...)`.
- Không sửa `expect` cho khớp app khi TC nói khác → báo QC (TC sai) hoặc ghi bug (PRODUCT_BUG).
- Locator ghi `[cần kiểm trên app thật]` là chưa xác minh: dùng `npx playwright codegen <url>` hoặc Pick locator để lấy đúng rồi bỏ ghi chú.

## 7. Lỗi hay gặp

| Lỗi | Nguyên nhân | Cách sửa |
|---|---|---|
| `Không thấy env/<x>.json` | ENV sai tên | `ENV=stg` hoặc tạo file trong `env/` |
| Mọi test **skipped** | `.env` chưa có tài khoản, hoặc login trong setup fail | Điền `.env`, chạy `npm run setup -- --headed` xem login |
| Setup fail ở `toHaveURL` | Sai mật khẩu, hoặc trang chủ của role khác `data/roles.ts` | Kiểm tài khoản; sửa `home` trong `data/roles.ts` |
| `locator ... not found` ở login | Locator input chưa đúng | Sửa `screens/cms/login.screen.ts` (dùng codegen) |
| `Executable doesn't exist` / `Chromium Framework (no such file)` | Chromium của Playwright chưa cài hoặc giải nén dở | Dùng `BROWSER_CHANNEL=chrome` (mặc định); hoặc xoá `~/Library/Caches/ms-playwright/chromium-*` rồi cài lại |
| `npx playwright install` treo sau 100% | Giải nén bị chặn (Node quá mới / phần mềm bảo mật) | Ctrl+C, dùng Chrome có sẵn; nên dùng Node 22 LTS |
| Lệnh `npx playwright` báo cần build khác (vd 1248) | Chạy ngoài thư mục `web/` nên npx tải bản mới nhất | `cd projects/qnavi/automation/web` rồi chạy lại |
