# Qnavi CMS — Playwright automation

Chạy test tự động cho **CMS web** (`qnavi-cms-frontend`).
- **Input duy nhất:** test case LOCKED trong `projects/qnavi/qc/test-cases/` (Automation Eligibility = UI-AUTO / BOTH).
- **Ngoài phạm vi:** Repair app, Shop app (native → Appium, làm sau). Estimation PWA, Trouble NAVI (web nhúng, cần token cookie → làm sau).

## 1. Điều kiện cần

| Cần | Kiểm tra | Ghi chú |
|---|---|---|
| macOS + Node.js 20 LTS trở lên | `node -v` | `brew install node@22` |
| Mạng vào được CMS môi trường test | Mở URL CMS trên trình duyệt | VPN / IP whitelist nếu có |
| Tài khoản loginId + password cho từng role | — | Không dùng tài khoản Microsoft (SSO không tự động hoá được) |
| URL CMS trong `env/<ENV>.json` | — | Sửa `cmsBaseUrl` |

## 2. Cài đặt (1 lần)

```bash
cd ~/work/qc-automation/projects/qnavi/automation/web
npm ci
npx playwright install chromium
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

Mỗi lần chạy, project `setup` login từng role có tài khoản trong `.env` và lưu phiên vào `.auth/` (không commit). Role không có tài khoản → test của role đó **skip**, không fail.

## 4. Report

Mỗi lần chạy ghi 1 thư mục `reports/<YYYYMMDD-HHmmss>-<ENV>/` (không commit):

| File | Dùng để |
|---|---|
| `html/` | Xem kết quả: `npm run report` (mở lần chạy mới nhất) hoặc `npm run report -- reports/<thư mục>` |
| `results.json` | Máy đọc: tổng hợp kết quả theo TC ID × role (export Excel sau này) |
| `junit.xml` | CI |
| `artifacts/` | Trace, ảnh, video của test fail. Mở trace: `npx playwright show-trace <file>.zip` |

## 5. Cấu trúc

| Thư mục | Chứa gì | Ai sửa |
|---|---|---|
| `env/` | Cấu hình theo môi trường: `cmsBaseUrl`, timeout | Người chạy |
| `.env` | ENV đang dùng + tài khoản theo role (không commit) | Người chạy |
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
| `Executable doesn't exist` | Chưa cài browser | `npx playwright install chromium` |
