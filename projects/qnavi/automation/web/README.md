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
| Chọn môi trường (bắt buộc; mặc định lấy `ENV=` trong `.env`) | `ENV=est-test npm test` · có: `toridoll-test`, `est-test`, `stg` |
| 1 TC (mọi role) | `npm test -- --grep @WB2-TC-001` |
| 1 role | `npm test -- --grep @role-99` |
| 1 bộ test (thư mục) | `npm test -- tests/cms/phase007/` |
| Xem trình duyệt khi chạy | `npm run test:headed -- --grep @WB2-TC-001` |
| Chế độ UI (debug từng bước) | `npm run test:ui` |
| Chỉ login lại các role | `npm run setup` |
| Liệt kê test | `npm run list` |
| Kiểm tra code TypeScript | `npm run typecheck` |
| Kịch bản E2E trouble (13 TC, nối tiếp, tạo trouble mới) | `npm run e2e:headed` |
| 1 kịch bản trong bộ E2E suite (E2E-00 … E2E-39) | `ENV=toridoll-test npm run suite:headed -- E2E-01` (bỏ `:headed` để chạy ẩn) |
| Sinh lại spec E2E-02…39 từ TC LOCKED (sau khi TC đổi revision; E2E-00 / 01 viết tay) | `npm run gen:e2e` · 1 kịch bản: `npm run gen:e2e -- 12` |
| Kiểm TC E2E suite ↔ code khớp (không mở app, < 1 giây) | `npm run gen:e2e -- --check` |
| Regression Phase 007 | `ENV=est-test npm run p007:headed` |
| Chạy tiếp E2E trên trouble có sẵn (đúng trạng thái) | `E2E_TROUBLE_ID=1234 npm run e2e -- --grep "TC-00[5-9]\|TC-01"` |
| Lấy locator thật: đi qua các màn hình, **không lưu dữ liệu**, ghi aria snapshot + ảnh | `npm run recon` / `npm run recon:e2e` → `reports/_tmp_chk/recon*/` (tạm, mỗi lần ghi đè; viết locator vào `screens/` xong là bỏ) (`_summary.txt` liệt kê bước lỗi) |
| Mở trình duyệt **đã qua Basic Auth**, đăng nhập sẵn, để xem / lấy locator (Inspector: Record, Pick locator) | `ACCOUNT=99 npm run open` · `ENV=est-test ACCOUNT=02:urgent URL=/admin/troubles npm run open` |

Mỗi lần chạy, project `setup` login từng role có tài khoản trong `.env` và lưu phiên vào `.auth/` (không commit). Role không có tài khoản → test của role đó **skip**, không fail.

## 3b. Bộ regression theo phase
| Bộ | TC | Lệnh |
|---|---|---|
| E2E trouble flow (13 TC) | qc/test-cases/e2e-trouble-flow-test-cases.md | `npm run e2e:headed` |
| Phase 007 Regression (65 TC) | qc/test-cases/phase007-regression-test-cases.md | `ENV=est-test npm run p007:headed` · chạy 1 phần: `ENV=est-test npm run p007 -- -g "P007-TC-01[6-9]"` |

Phase 007 chạy nối tiếp (common/scenario.ts): T1…T5 tạo trong lần chạy; TC cần trouble chưa tạo được → skip. TC-050 (至急) cần chạy trong giờ làm việc.

## 4. Report
3 thư mục tổng trong `reports/`, mọi tên theo **[tên testcase]_[dd-mm-yyyy_HH-mm-ss]_[ENV]** (`common/qc-reporter.ts`). Xem nhanh lần mới nhất: `npm run summary`.

| Thư mục / file | Nội dung |
|---|---|
| `reports/Failed/<TC ID>_<tên TC>_<ngày giờ>_<ENV>/` | `FAIL.md` (mỗi trường 1 dòng: test case, ngày chạy, môi trường, tài khoản, bước fail, lỗi, locator, expected / received, vị trí code, URL lúc fail, trouble) + `video-fail.webm` (đoạn video của TC fail), `screenshot.png`, `aria-snapshot.yml`, `error-context.md`, `trace.zip` |
| `reports/Passed/<kịch bản>_<ngày giờ>_<ENV>/` | 1 thư mục / lần chạy: `PASSED.md` (TC pass, tài khoản, thời gian, mốc tua video) + `video-full.webm` (video đầy đủ cả lần chạy) |
| `reports/Runs/<tên bộ test>_<ngày giờ>_<ENV>/` | `SUMMARY.md` (tổng, link Passed / Failed, danh sách TC bị bỏ qua + lý do) và report gốc Playwright: `html/` (`npm run report`), `results.json`, `junit.xml`, `artifacts/` |
| `reports/HISTORY.md` | Mỗi lần chạy 1 dòng: ngày, môi trường, tổng / pass / fail / skip |

**Xem lại lỗi (đầy đủ hơn ảnh):**

| Cách | Xem được gì | Mở bằng |
|---|---|---|
| Trace `Failed/<TC>/trace.zip` | Từng bước theo thời gian, ảnh trước/sau mỗi thao tác, DOM, network, console | `npx playwright show-trace "reports/Failed/<TC>/trace.zip"` hoặc kéo file vào https://trace.playwright.dev |
| Video `Runs/<lần chạy>/video/*.webm` (kịch bản e2e) | Quay cả lần chạy; `FAIL.md` ghi mốc phút:giây của TC fail | Mở bằng trình duyệt / QuickTime (VLC nếu QuickTime không mở được .webm). Chỉ giữ khi có fail; tắt: `E2E_VIDEO=off` |
| Report HTML `npm run report` | Danh sách test, bấm TC fail → ảnh, trace, lỗi | Trình duyệt |

## 5. Cấu trúc

| Thư mục | Chứa gì | Ai sửa |
|---|---|---|
| `env/` | Cấu hình theo môi trường (`toridoll-test`, `est-test`, `stg`): `cmsBaseUrl`, timeout, **tài khoản test theo role** (`accounts`), **Basic Auth** (`httpAuth.username`; mật khẩu ở `.env` `HTTP_AUTH_PASSWORD`). Đổi môi trường: `ENV=est-test npm run e2e` | Lead |
| `.env` | ENV đang dùng + **mật khẩu** theo role `CMS_<role>_PASSWORD` (không commit). `CMS_<role>_ID` chỉ để ghi đè loginId | Người chạy |
| `data/roles.ts` | Mã role ↔ tên cột Excel ↔ trang chủ sau login | kb-update-automation |
| `data/<scope-key>.json` | Data test theo TC ID | Khi automate TC |
| `common/` | Dùng chung: `env.ts` (môi trường), `session.ts` (đăng nhập / phiên), `ui.ts` (thao tác UI), `wait.ts` (chờ API / loader), `scenario.ts` (khung kịch bản nối tiếp + video / trace), `e2e-suite.ts` (bước dùng chung bộ E2E), `qc-reporter.ts` (report), `fixtures.ts` + `roles.ts` (test smoke theo role) | kb-update-automation |
| `screens/cms/*.screen.ts` | **Knowledge màn hình**: mã màn hình, route, role, locator, thao tác ngắn | kb-update-automation |
| `tests/cms/<bộ test>/` | Mỗi bộ test 1 thư mục: `e2e-trouble-flow/`, `phase007/`, `e2e-suite/` (E2E-00…39), `smoke/` (test lẻ theo role). Thư mục ≠ `smoke/` chạy bằng project `e2e` (nối tiếp) | Khi automate TC |
| `tests/tools/` | Công cụ phụ trợ, không phải test: `open` (mở trình duyệt đã đăng nhập), `recon*` (dò màn hình) | Khi cần |
| `scripts/gen-e2e-specs.mjs` | Sinh `tests/cms/e2e-suite/E2E-02…39.spec.ts` từ TC LOCKED (mỗi loại TC = 1 khuôn code; spec sinh ra **không sửa tay**, ghi rev TC và tự dừng nếu TC đổi rev) | Khi TC đổi / cần thao tác mới |
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
