<!-- FILE TỰ SINH bởi manager/scripts/build_guide.py — sửa file nguồn rồi chạy lại. Version 0.1.0 -->
# QC Automation – Hướng dẫn A→Z

> Phần tường thuật cho người đọc. Nội dung skill, template, luật thật nằm ở file nguồn; bản hiện hành được gom tự động vào GUIDE.md (Phụ lục A).

Oct 9, 2026 · @Hieu Nguyen Thanh

## Nguyên tắc

Viewpoint và test case phải ra trước và chạy ổn định, sau đó mới làm automation. Automation chỉ là bước chuyển TC UI-AUTO thành code; chưa có TC thì không có gì để automate. **Chưa qua cổng thì không sang giai đoạn sau.**

*(Sơ đồ 5 giai đoạn: xem bản Claude Docs)*

Đi từ trên xuống; mỗi mũi tên là một cổng phải qua. TC không automate được ở GĐ2 thì quay lại GĐ1 tạo revision TC mới, đổi Automation Eligibility sang MANUAL hoặc NEEDS\_SPEC.

| Giai đoạn | Làm gì | Cài gì | Cổng qua |
| --- | --- | --- | --- |
| 0. Kiến trúc | Khung repo, CLAUDE.md, template, 1 spec mẫu | Homebrew, Git, VS Code | Repo đủ thư mục, commit lần đầu |
| 1. Viewpoint & Test case | Tự tạo 3 skill: spec-review → test-viewpoint → test-case, duyệt và Lock | Claude Code | 2 spec có VP + TC đã LOCKED, đã chốt Automation Eligibility |
| 2. Chạy thử automation | Mỗi khối chạy riêng 1 TC UI-AUTO lấy từ GĐ1 | Node, Playwright, JDK, Android Studio, Appium | TC spike pass trên từng khối |
| 3. Cài đặt đầy đủ | POM, auth, .env, quyền AI, MCP, skill automate/triage | Extension, MCP, APK thật, iOS | TC-USRL-001 sinh bằng skill, chạy qua Page Object |
| 4. Vận hành | Quy trình hằng ngày, lessons, chạy đêm, report | Không cài thêm | Chạy trọn 1 ticket thật |

**Kiểm tra flow** — output của bước trước là input của bước sau (<P> = projects/<dự án>, khai báo trong CLAUDE.md):

| Bước | Skill | Input (phải có sẵn) | Output | Ở GĐ |
| --- | --- | --- | --- | --- |
| 0. Import nguồn (khi spec là xlsx/pdf) | source-import | <P>/raw/<file> | <P>/spec/<scope-key>.md | 1 |
| 1–3. Đọc spec → knowledge → bài học | spec-review | spec + <P>/README, sources, glossary, screens + qc/lessons, <P>/bug-history | (đọc, chưa ghi) | 1 |
| 4. Q&A | spec-review | như trên | <P>/qc/gap-reports/<scope-key>-gap-report.md (có Context pack), <P>/qc/open-questions.md | 1 |
| 5. Viewpoint | test-viewpoint | Gap Report LOCKED + Context pack | <P>/qc/test-viewpoints/<scope-key>-viewpoints.md (LOCKED) | 1 |
| 6. Test case | test-case | Viewpoint LOCKED + Context pack | <P>/qc/test-cases/<scope-key>-test-cases.md (LOCKED, có Automation Eligibility) | 1 |
| Xuất Excel (chỉ khi được yêu cầu) | — | TC LOCKED | reports/ (file mới) | 1, 4 |
| Chạy thử automation | — | TC UI-AUTO | <P>/automation/web/tests/spike/, <P>/automation/mobile/ | 2 |
| Automate thật | tc-to-playwright / tc-to-appium | TC UI-AUTO/BOTH + Page Object + .env | <P>/automation/web/tests/<scope-key>.spec.ts | 3 |
| Triage | failure-triage | Test fail + trace | Fix + automation/lessons/ | 3–4 |

Mỗi bước có output (Gap Report, viewpoint, test case) đều: **draft → bạn duyệt → LOCKED**. Đây là process, không bỏ (D16). Quy ước 1 lần làm = 1 sheet / 1 scope giữ nguyên.


## Giai đoạn 0 — Kiến trúc

Dựng khung repo và luật cho AI, chưa có code. Chỉ cần Homebrew, Git, VS Code.

### 0.1 Hiểu kiến trúc

AI đọc tài liệu → sinh viewpoint, test case → sinh code Playwright/Appium. Code chạy hằng ngày không tốn token; AI chỉ được gọi lại khi test fail, mỗi lần fail để lại 1 lesson.

Repo chia theo vai trò (D12). Bản đồ chi tiết: manager/README.md.

| Thư mục | Vai trò | Có từ GĐ |
| --- | --- | --- |
| CLAUDE.md | Luật chung, thứ tự đọc, dự án đang làm (<P>) | 0 |
| .claude/skills/ | kb-update (manager) · source-import, spec-review, test-viewpoint, test-case (qc) · skill automation | 1, 3 |
| manager/ | GUIDE.md tự sinh, handbook.md, decisions.md, CHANGELOG, scripts/build_guide.py, templates/lesson.md | 0 |
| qc/ | Template thiết kế test + bài học thiết kế / Excel — dùng chung mọi dự án | 0 |
| automation/ | Template screen + bài học automation — dùng chung | 0 |
| projects/<p>/ | Knowledge dự án (README, sources, glossary, bug-history, screens, spec, raw) + output qc/ + code automation/ | 0 |
| reports/ | File xuất ra (gitignored) | 4 |

Phần chung (qc/, automation/, skills) không chứa nội dung riêng dự án; mọi thứ của Qnavi nằm ở projects/qnavi/.


### 0.2 Cài tối thiểu

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
# Chạy 2 dòng "Next steps" installer in ra, mở Terminal mới
brew install git
brew install --cask visual-studio-code
git config --global user.name "Hieu Nguyen"
git config --global user.email "hieu.nt@picontechnology.com"
git config --global core.autocrlf input
```

Kiểm tra: `git --version && code --version`. Nếu `code` không có: VS Code → Cmd+Shift+P → *Shell Command: Install 'code' command in PATH*.

**Lỗi hay gặp (GĐ0)**

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `zsh: command not found: code` | Chưa cài VS Code, hoặc chưa thêm `code` vào PATH | `ls /Applications \| grep -i "visual studio code"` → không có thì `brew install --cask visual-studio-code`; có rồi thì VS Code → Cmd+Shift+P → *Shell Command: Install 'code' command in PATH* → mở Terminal mới |
| Cách trên báo lỗi quyền | macOS chặn ghi vào /usr/local/bin | `echo 'export PATH="$PATH:/Applications/Visual Studio Code.app/Contents/Resources/app/bin"' >> ~/.zshrc && source ~/.zshrc` |
| `brew: command not found` | Chưa chạy 2 dòng "Next steps" sau khi cài Homebrew | `echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile && eval "$(/opt/homebrew/bin/brew shellenv)"` |

### 0.3 Tạo khung repo

Đặt repo ở `~/work/`, không đặt trong \~/Documents hay \~/Desktop (cron ở GĐ4 sẽ bị macOS chặn).

```bash
mkdir -p ~/work/qc-automation && cd ~/work/qc-automation
git init -b main
mkdir -p .claude/skills manager/{scripts,templates} qc/{templates,lessons/design} automation/{templates,lessons/{web,mobile}} reports .githooks .vscode
mkdir -p projects/<p>/{spec,raw,screens,qc/{gap-reports,test-viewpoints,test-cases},automation/{web,mobile}}
git config core.hooksPath .githooks
pwd   # phải in ra .../work/qc-automation
```

Chữ trong `< >` là placeholder: thay bằng giá trị thật (vd `qnavi`) và bỏ dấu `< >`. Không đặt tên thư mục có dấu cách / dấu tiếng Việt: hook và script sẽ không tìm thấy.

```text
qc-automation/
├── CLAUDE.md
├── .claude/skills/          # kb-update, source-import, spec-review, test-viewpoint, test-case
├── manager/                 # GUIDE.md (tự sinh), handbook, decisions, CHANGELOG, VERSION, scripts/, templates/lesson.md
├── qc/                      # templates/ (spec, gap-report, viewpoint, testcase, data-test), lessons/
├── automation/              # templates/screen.md, lessons/ (web, mobile)
├── projects/<p>/
│   ├── README.md  sources.md  glossary.md  bug-history.md
│   ├── raw/                 # tài liệu gốc của khách (xlsx/pdf không commit)
│   ├── spec/                # spec dạng .md (input thiết kế)
│   ├── screens/             # _flow.md + từng màn hình
│   ├── qc/                  # open-questions.md, gap-reports/, test-viewpoints/, test-cases/
│   └── automation/web|mobile/
├── reports/  .githooks/  .vscode/
```

**.gitignore**: node_modules, .env*, test-results, playwright-report, reports, .auth, .claude/settings.local.json, `projects/*/automation/web/tests/spike/`, `projects/**/raw/*.pdf|*.xlsx|*.csv`. Tài liệu mật của khách → hỏi PM trước khi commit; không được thì chỉ commit bản .md.

**.vscode/settings.json** — `files.encoding: utf8` bắt buộc vì tài liệu có tiếng Nhật:

```bash
cat > .vscode/settings.json <<'EOF'
{
  "editor.formatOnSave": true,
  "files.eol": "\n",
  "files.encoding": "utf8",
  "markdown.preview.breaks": true,
  "files.exclude": { "**/node_modules": true, "**/test-results": true },
  "terminal.integrated.defaultProfile.osx": "zsh"
}
EOF
```


### 0.4 Luật, template, knowledge

Không chép nội dung vào đây — bản hiện hành nằm ở file nguồn và được gom vào GUIDE.md (Phụ lục A).

| Thành phần | File | Ghi chú |
| --- | --- | --- |
| Luật cho AI | CLAUDE.md | Phạm vi: luật QC chỉ áp dụng cho task QC; câu hỏi ngoài luồng làm bình thường; câu hỏi về dự án tự tra trong <P>/ (D13) |
| Template thiết kế | qc/templates/spec.md, gap-report.md, viewpoint.md, testcase.md, data-test.md | Theo workbook Qnavi thực tế: VP 9 cột, TC 12 cột + Automation Eligibility, viết tiếng Anh (D10) |
| Template lesson | manager/templates/lesson.md | Loại DESIGN_GAP · LOCATOR · TIMING · DATA · ENV · PRODUCT_BUG |
| Knowledge dự án | projects/<p>/ | README (role, surface, quy ước ID), sources.md (nguồn nào thắng), glossary, screens/_flow, bug-history (D11) |
| Knowledge hub | skill kb-update + manager/scripts/build_guide.py + pre-commit hook | Repo là nguồn duy nhất; sửa luật/skill/template đi qua kb-update; GUIDE.md tự sinh (D07) |

**Knowledge từ chat / Claude Desktop** → dán vào phiên Claude Code, gọi kb-update: AI phân loại vào đúng file (luật / template / lesson / projects/<p>/), ghi decision + CHANGELOG, sinh lại GUIDE.

## Giai đoạn 1 — Viewpoint & Test case

Chưa cài Node, chưa đụng Playwright/Appium. Chỉ cần Claude Code + repo.

### 1.1 Cài Claude Code và đăng nhập

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
code --install-extension anthropic.claude-code   # VS Code ≥ 1.94
```

Mở repo trong VS Code → bấm icon Spark (Claude) → Sign in. Sửa CLAUDE.md hoặc skill xong phải **mở phiên mới** (hoặc Reload Window) thì Claude mới nạp lại.

### 1.2 Kiểm tra

| Lệnh / câu hỏi | Kết quả đúng |
| --- | --- |
| `/memory` | Thấy CLAUDE.md của repo |
| `/skills` | Thấy kb-update, source-import, spec-review, test-viewpoint, test-case, export-excel |
| "Qnavi có bao nhiêu role?" | Trả lời từ projects/qnavi/README.md, kèm nguồn |

### 1.3 Skill thiết kế

| Skill | Khi nào | Output |
| --- | --- | --- |
| source-import | Spec là xlsx / pdf / docx | <P>/spec/<scope-key>.md, bảng đối chiếu số dòng, danh sách phần bị mất (ảnh, màu, comment) |
| spec-review | Luôn chạy trước | Gap Report theo qc/templates/gap-report.md: Scope, Test item, FND, OQ, Design Gate, Context pack. DRAFT → LOCKED → [Done] (hết OQ OPEN + bạn xác nhận) → kb-update ghi knowledge vào projects/<p>/ (D17) |
| test-viewpoint | Gap Report READY / PARTIAL | Viewpoint = đối tượng × khía cạnh × trục; 1 VP sinh nhiều TC; dưới 3 TC thì gộp (D09) |
| test-case | Viewpoint LOCKED | 1 TC = 1 expected (D05); mỗi giá trị trên trục → 1 TC; đối chiếu 3 nguồn; cuối cùng hỏi "Xuất Excel không?" |
| export-excel | Bạn trả lời Có / tự yêu cầu | reports/<scope-key>-<ngày>.xlsx: sheet Viewpoint + sheet TC 12 cột + cột kết quả theo role/platform (D15) |

Skill tài khoản `qa-testcase-writing` dùng format cũ → trong repo này không dùng, trừ khi gọi đúng tên (D14).

### 1.4 Chạy thử

1. Đặt spec vào `projects/qnavi/spec/QNAVI-xxxx.md` (file .md, không phải thư mục). Nếu là Excel: đặt vào `projects/qnavi/raw/` rồi `/source-import`.
2. `/spec-review projects/qnavi/spec/QNAVI-xxxx.md` → trả lời OQ → duyệt Gap Report.
3. `/test-viewpoint` → duyệt → LOCKED.
4. `/test-case` → chốt Automation Eligibility → LOCKED.
5. Sai ở đâu → gọi kb-update ghi lesson / sửa skill. Chạy lại spec thứ 2 khác màn hình để kiểm skill.

**Lỗi hay gặp (GĐ1)**

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `claude: command not found` | PATH chưa cập nhật | Mở Terminal mới hoặc `source ~/.zshrc` |
| `/skills` không thấy skill | Sai đường dẫn hoặc thiếu frontmatter | File phải là `.claude/skills/<tên>/SKILL.md`, có name/description, mở phiên mới |
| AI trả "không biết" câu hỏi dự án | Phiên cũ chưa nạp CLAUDE.md mới | Mở phiên mới |
| BLOCKED_INPUT | Chưa đưa đường dẫn spec chính xác / spec là thư mục rỗng | Đưa đúng file .md trong <P>/spec/ |
| Viewpoint ra case-by-case | Không ghi trục | Kiểm cột Note "Axis: …" (D09) |
| Commit bị chặn "GUIDE.md chưa cập nhật" | Sửa nguồn mà chưa sinh lại | `python3 manager/scripts/build_guide.py && git add manager/GUIDE.md` |

**Cổng qua GĐ1:** 2 spec có Gap Report + VP + TC đã LOCKED, OQ đã xử lý, có ít nhất 1 TC UI-AUTO.


## Giai đoạn 2 — Chạy thử automation từng khối

> Trong GĐ2–4, `web/` và `mobile/` hiểu là `<P>/automation/web/` và `<P>/automation/mobile/`. TC-USRL-001 / fs-user-list là ví dụ; thay bằng TC thật của dự án.


Input: TC **UI-AUTO** từ GĐ1. Mỗi khối: cài tối thiểu → chạy 1 TC dạng spike → sửa lỗi → cổng qua. Code spike để riêng (`web/tests/spike/`, `mobile/test/specs/`), GĐ3 viết lại bằng Page Object rồi xóa.

| Khối | Mục đích | Cài | Thời gian |
| --- | --- | --- | --- |
| A. Playwright web | Chạy được 1 TC web, biết debug, lấy locator | Node, Playwright | 2–3 giờ |
| B. Appium Android | Emulator + Appium + Inspector chạy được | JDK, Android Studio, Appium | Nửa ngày |
| C. iOS (tùy chọn) | Như B cho iOS | Xcode | Làm sau cùng |

### Khối A: Playwright web

**A.1 Cài**

```bash
brew install node && node -v
cd ~/work/qc-automation/web
npm init playwright@latest
# Chọn: TypeScript · thư mục tests · GitHub Actions: No · Install browsers: Yes
```

**A.2 Chạy test mẫu có sẵn** (trên playwright.dev, chưa đụng app thật)

```bash
npx playwright test
npx playwright show-report
```

**A.3 Chạy 1 TC thật từ GĐ1** — mở `<P>/qc/test-cases/fs-user-list-test-cases.md`, chọn 1 TC `UI-AUTO` (ví dụ TC-USRL-001). Thao tác đúng theo cột Test Steps trong codegen:

```bash
npx playwright codegen https://stg.example.jp   # thay bằng URL môi trường test
```

Copy code sinh ra vào `web/tests/spike/TC-USRL-001.spec.ts`, đặt tên test theo TC ID và tự thêm `expect` theo cột **Expectation result** (codegen không tự sinh assert). Tạm hardcode tài khoản — thư mục spike đã nằm trong .gitignore.

```typescript
test('TC-USRL-001 spike', { tag: ['@TC-USRL-001'] }, async ({ page }) => {
  // ...code codegen sinh ra theo Steps...
  await expect(page.getByRole('row')).toHaveCount(2); // header + 1 dòng U0001
});
```

```bash
npx playwright test tests/spike --headed
npx playwright test tests/spike --ui     # UI mode, xem từng bước
```

**A.4 Làm quen** — tự làm 3 việc này một lần:

| Việc | Lệnh / cách |
| --- | --- |
| Chạy 1 test theo tag | `npx playwright test --grep @TC-USRL-001` |
| Cố tình làm fail rồi xem trace | `npx playwright test --trace on` → `show-report` → mở trace |
| Lấy locator bằng tay | Cài extension `ms-playwright.playwright` → tab Testing → Pick locator |

**Lỗi hay gặp (khối A)**

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `npm: command not found` | Node chưa vào PATH | Mở Terminal mới |
| `Executable doesn't exist ... chromium` | Chưa tải browser | `npx playwright install chromium` |
| Timeout ở bước goto | VPN/IP whitelist của stg | Bật VPN, thử mở URL bằng Chrome trước |
| Locator codegen dạng `#id-123` | App thiếu label/role | GĐ3 xử lý bằng Page Object; nhờ dev thêm label/data-testid |
| Chữ Nhật lỗi trong file | Lưu Shift-JIS | Reopen with Encoding → Shift JIS → Save with Encoding UTF-8 |

**Cổng qua khối A:** TC-USRL-001 spike pass headed, kết quả khớp cột Expectation result; đã mở được trace của 1 lần fail cố ý. TC không automate được (thiếu locator, data không ổn định) → quay lại GĐ1 tạo revision TC mới, đổi Automation Eligibility sang `MANUAL` hoặc `NEEDS_SPEC`. Commit `web/package.json`, `web/playwright.config.ts`.

### Khối B: Appium Android

Thử trên app **Settings** có sẵn của emulator — chưa cần APK dự án, để tách lỗi môi trường khỏi lỗi app.

**B.1 Cài**

```bash
brew install openjdk@17   # Node đã cài ở khối A
brew install --cask android-studio
sudo ln -sfn $(brew --prefix)/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

Android Studio → More Actions → **SDK Manager**: tick 1 bản Android (SDK Platforms) + Build-Tools, Command-line Tools, Platform-Tools, Emulator (SDK Tools). **Device Manager → Create Device**: Pixel + system image Google APIs.

```bash
cat >> ~/.zshrc <<'EOF'
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator
EOF
source ~/.zshrc

npm i -g appium
appium driver install uiautomator2
appium driver doctor uiautomator2   # sửa hết mục đỏ trước khi đi tiếp
```

**B.2 Kiểm tra từng tầng** (bật emulator trước)

| Tầng | Lệnh | Kết quả đúng |
| --- | --- | --- |
| Java | `java -version` | 17.x |
| ADB | `adb devices` | `emulator-5554 device` |
| Appium | `appium` | `listener started on 0.0.0.0:4723` |
| Inspector | Tải [Appium Inspector](https://github.com/appium/appium-inspector/releases) (.dmg), connect với capability ở B.3 | Thấy cây element của Settings |

**B.3 Test hello** — khởi tạo WebdriverIO:

```bash
cd ~/work/qc-automation/mobile
npm init wdio@latest .
# E2E Testing → Mobile → Android → Appium → Mocha → TypeScript · Reporter: spec · Service: appium
```

Sửa capability trong file conf wizard sinh ra:

```typescript
capabilities: [{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'Android Emulator',
  'appium:appPackage': 'com.android.settings',
  'appium:appActivity': '.Settings',
}],
```

`mobile/test/specs/spike.e2e.ts`:

```typescript
describe('spike', () => {
  it('mở được Settings', async () => {
    const pkg = await driver.getCurrentPackage();
    expect(pkg).toEqual('com.android.settings');
  });
});
```

Chạy: `npx wdio run wdio.conf.ts`

**B.4 Soi app thật bằng Inspector** (nếu đã có APK): đổi capability sang `'appium:app': '<đường dẫn apk>'`, mở các màn hình trong TC mobile UI-AUTO của GĐ1, ghi lại element không có accessibility id / resource-id → gửi dev nhờ gắn trước khi sang GĐ3.

**Lỗi hay gặp (khối B)**

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `adb: command not found` | Thiếu biến môi trường | Chạy lại đoạn \~/.zshrc, mở Terminal / VS Code mới |
| `JAVA_HOME is not set` | Chưa link JDK | Lệnh `sudo ln -sfn` ở B.1, rồi `appium driver doctor uiautomator2` |
| `adb devices` trống | Emulator chưa bật | Bật từ Device Manager, chờ boot xong |
| `Could not find a connected Android device` | Appium chạy trước khi emulator boot | Bật emulator trước, chạy test sau |
| Lần đầu chạy rất lâu rồi timeout | Đang cài UiAutomator2 server lên máy | Chạy lại lần 2; tăng `mochaOpts.timeout` lên 120000 |

**Cổng qua khối B:** Inspector thấy được element, test spike pass, có danh sách element thiếu id gửi dev.

### Khối C: iOS (tùy chọn, làm sau cùng)

```bash
# Cài Xcode từ App Store, mở 1 lần
xcode-select --install
sudo xcodebuild -license accept
appium driver install xcuitest
appium driver doctor xcuitest
```

Thử giống khối B với Simulator: `platformName: 'iOS'`, `automationName: 'XCUITest'`, `deviceName: 'iPhone 15'`, `bundleId: 'com.apple.Preferences'`.

| Lỗi | Cách sửa |
| --- | --- |
| WebDriverAgent build fail | Mở WebDriverAgent.xcodeproj trong Xcode, chọn Team (Apple ID cá nhân dùng được cho máy mình) |
| iPhone thật không chạy | Cần Apple Developer Team của dự án → hỏi team dev |

## Giai đoạn 3 — Cài đặt đầy đủ automation

Đã có TC (GĐ1) và môi trường chạy được (GĐ2). Giai đoạn này thay code spike bằng cấu trúc thật và để AI tự automate TC.

| Bước | Việc | File tạo/sửa |
| --- | --- | --- |
| 3.1 | VS Code đầy đủ | .vscode/settings.json |
| 3.2 | Playwright thật | web/playwright.config.ts, .env, pages/, fixtures/, tests/auth.setup.ts |
| 3.3 | Appium thật | mobile/wdio.android.conf.ts, screens/, .env |
| 3.4 | Quyền AI + MCP | .claude/settings.json, .mcp.json |
| 3.5 | CLAUDE.md đầy đủ | CLAUDE.md (thêm luật code + lệnh) |
| 3.6 | Skills automation + commands | .claude/skills/tc-to-*, failure-triage, screen-explorer; .claude/commands/* |

### 3.1 VS Code đầy đủ

```bash
code --install-extension ms-playwright.playwright
code --install-extension bierner.markdown-mermaid
code --install-extension yzhang.markdown-all-in-one
code --install-extension GrapeCity.gc-excelviewer
code --install-extension esbenp.prettier-vscode
```

Bổ sung vào `.vscode/settings.json`: `"editor.defaultFormatter": "esbenp.prettier-vscode"`, `"playwright.reuseBrowser": true`, `"playwright.showTrace": true`. Chỉ cài các extension này — càng nhiều VS Code càng chậm.

### 3.2 Playwright thật

Xóa `web/tests/example.spec.ts`. Giữ `tests/spike/` làm tham chiếu đến khi 3.2 chạy xong rồi xóa.

```bash
cd web
npm i -D dotenv
mkdir -p pages fixtures utils .auth
```

**web/.env.example** (copy thành .env, điền giá trị thật, không commit):

```text
BASE_URL=https://stg.example.jp
ADMIN_USER=
ADMIN_PASS=
```

**web/playwright.config.ts** — `trace: retain-on-failure` bắt buộc, là input chính cho failure-triage:

```typescript
import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never' }], ['json', { outputFile: 'test-results/results.json' }]],
  use: {
    baseURL: process.env.BASE_URL,
    locale: 'ja-JP',
    timezoneId: 'Asia/Tokyo',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: '.auth/admin.json' },
      dependencies: ['setup'],
    },
  ],
});
```

**web/pages/LoginPage.ts** — chuyển locator từ test spike ở khối A sang đây:

```typescript
import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly userId: Locator;
  readonly password: Locator;
  readonly loginBtn: Locator;

  constructor(private page: Page) {
    this.userId = page.getByLabel('ユーザーID');
    this.password = page.getByLabel('パスワード');
    this.loginBtn = page.getByRole('button', { name: 'ログイン' });
  }
  async goto() { await this.page.goto('/login'); }
  async login(user: string, pass: string) {
    await this.userId.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.click();
    await expect(this.page).not.toHaveURL(/login/);
  }
}
```

**web/tests/auth.setup.ts** — login 1 lần, mọi test dùng lại:

```typescript
import { test as setup } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

setup('login admin', async ({ page }) => {
  const login = new LoginPage(page);
  await login.goto();
  await login.login(process.env.ADMIN_USER!, process.env.ADMIN_PASS!);
  await page.context().storageState({ path: '.auth/admin.json' });
});
```

**web/pages/UserListPage.ts** — chuyển locator từ `tests/spike/TC-USRL-001.spec.ts` sang. Locator là ví dụ, kiểm lại bằng Pick locator. Đồng thời tạo `screens/web/user-list.md` theo automation/templates/screen.md.

```typescript
import { Page, Locator } from '@playwright/test';

export class UserListPage {
  readonly keyword: Locator;
  readonly searchBtn: Locator;
  readonly rows: Locator;

  constructor(private page: Page) {
    this.keyword = page.getByLabel('ユーザーID');
    this.searchBtn = page.getByRole('button', { name: '検索' });
    this.rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
  }
  async goto() { await this.page.goto('/users'); }
  async search(id: string) {
    await this.keyword.fill(id);
    await this.searchBtn.click();
  }
}
```

**web/fixtures/index.ts**

```typescript
import { test as base } from '@playwright/test';
import { UserListPage } from '../pages/UserListPage';

type Pages = { userList: UserListPage };

export const test = base.extend<Pages>({
  userList: async ({ page }, use) => { await use(new UserListPage(page)); },
});
export { expect } from '@playwright/test';
```

**web/tests/fs-user-list.spec.ts** — viết tay 1 lần để làm mẫu chuẩn cho skill ở 3.6 (1 file = 1 scope, 1 test = 1 TC):

```typescript
import { test, expect } from '../fixtures';

test.describe('fs-user-list ユーザー一覧 検索', () => {
  test('TC-USRL-001 Verify that search returns 1 row when ユーザーID exists',
    { tag: ['@TC-USRL-001', '@VP-USRL-001', '@high'] },
    async ({ userList }) => {
      await userList.goto();
      await userList.search('U0001');
      await expect(userList.rows).toHaveCount(1);
    });
});
```

**web/package.json** — thêm scripts:

```json
"scripts": {
  "test": "playwright test",
  "test:high": "playwright test --grep @high",
  "test:tc": "playwright test --grep",
  "report": "playwright show-report"
}
```

Kiểm tra: `npx playwright test --project=setup` pass trước (tách lỗi login), rồi `npm run test:tc -- @TC-USRL-001`. Pass rồi mới xóa `tests/spike/`.

| Lệnh | Mục đích |
| --- | --- |
| `npm test` | Chạy tất cả |
| `npm run test:tc -- @TC-USRL-001` | Theo TC |
| `npm run test:high` | Chỉ TC High |
| `npx playwright test --ui` | Debug |
| `npm run report` | Xem report/trace |

### 3.3 Appium thật

Đổi tên file conf wizard thành `mobile/wdio.android.conf.ts`, chuyển từ app Settings sang APK dự án (đặt trong `mobile/apps/`).

```bash
cd mobile && npm i -D dotenv && mkdir -p screens tests apps test-results
```

**mobile/wdio.android.conf.ts**

```typescript
import 'dotenv/config';

export const config: WebdriverIO.Config = {
  runner: 'local',
  specs: ['./tests/**/*.spec.ts'],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': 'Android Emulator',
    'appium:app': process.env.ANDROID_APP_PATH,   // ./apps/app-stg.apk
    'appium:autoGrantPermissions': true,
    'appium:language': 'ja',
    'appium:locale': 'JP',
    'appium:newCommandTimeout': 240,
  }],
  services: ['appium'],
  framework: 'mocha',
  mochaOpts: { timeout: 120000 },
  reporters: ['spec'],
  afterTest: async (test, _ctx, { passed }) => {
    if (!passed) await browser.saveScreenshot(`./test-results/${test.title}.png`);
  },
};
```

**mobile/screens/LoginScreen.ts** (`~` = accessibility id, lấy từ Appium Inspector):

```typescript
class LoginScreen {
  get userId()   { return $('~login_user_id'); }
  get password() { return $('~login_password'); }
  get loginBtn() { return $('~login_submit'); }

  async login(user: string, pass: string) {
    await this.userId.setValue(user);
    await this.password.setValue(pass);
    await this.loginBtn.click();
  }
}
export default new LoginScreen();
```

`mobile/screens/HomeScreen.ts` tạo tương tự (getter `header`).

**mobile/tests/fs-user-list.spec.ts**

```typescript
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';

describe('fs-user-list Login', () => {
  it('TC-USRL-010 @TC-USRL-010 @VP-USRL-005 Verify that home shows when login is valid', async () => {
    await LoginScreen.login(process.env.APP_USER!, process.env.APP_PASS!);
    await expect(HomeScreen.header).toBeDisplayed();
  });
});
```

Chạy: `npx wdio run wdio.android.conf.ts --mochaOpts.grep @TC-USRL-010`

### 3.4 Quyền AI + Playwright MCP

**.claude/settings.json** — cho AI tự chạy test, chặn đọc file bí mật:

```json
{
  "permissions": {
    "allow": [
      "Bash(npx playwright test:*)",
      "Bash(npx playwright show-report:*)",
      "Bash(npx wdio run:*)",
      "Bash(npm run:*)",
      "Bash(git status)", "Bash(git diff:*)", "Bash(git log:*)"
    ],
    "deny": [
      "Read(./**/.env)", "Read(./**/.env.*)",
      "Bash(git push:*)"
    ]
  }
}
```

**Playwright MCP** (chỉ cho skill screen-explorer, không dùng để chạy test):

```bash
claude mcp add --scope project playwright -- npx @playwright/mcp@latest
```

Kiểm tra: trong claude gõ `/mcp` → thấy playwright. Không thấy → mở VS Code bằng `code .` từ Terminal.

### 3.5 CLAUDE.md — bổ sung phần code

Thêm vào cuối CLAUDE.md (lệnh đã xác nhận chạy được ở 3.2, 3.3):

```markdown
## Luật viết code test
- Chỉ automate TC LOCKED có Automation Eligibility = UI-AUTO hoặc BOTH.
- Mỗi test code có tag @<TC ID> @<VP ID> lấy từ <P>/qc/test-cases.
- Locator chỉ nằm trong Page Object / Screen Object. Cấm locator trong file spec.
- Ưu tiên locator: getByRole > getByTestId > getByLabel/Placeholder > getByText. Cấm XPath tuyệt đối, CSS class tự sinh.
- Cấm waitForTimeout / pause cố định. Chờ bằng expect, waitForResponse, waitForURL.
- Thiếu locator hoặc màn hình → dùng skill screen-explorer. Không đoán.
- Mỗi test độc lập, tự tạo và tự dọn data.
- Không hardcode tài khoản/URL. Lấy từ process.env.

## Khi test fail
- Bắt buộc dùng skill failure-triage, phân loại trước khi sửa.
- PRODUCT_BUG: KHÔNG sửa test cho pass. Báo lại để người log bug.
- Mỗi lần sửa xong ghi 1 lesson vào automation/lessons/<web|mobile>/.

## Lệnh
- Web: cd web && npx playwright test --grep @TC-USRL-001
- Mobile: cd mobile && npx wdio run wdio.android.conf.ts --mochaOpts.grep @TC-USRL-010
```

Giữ CLAUDE.md dưới 150 dòng; rule lặp lại từ 2 lần → vào automation/lessons/INDEX.md.

### 3.6 Skills automation + commands

Skill thiết kế (spec-review, test-viewpoint, test-case) đã có từ GĐ1. Tạo tiếp skill automation, từng skill một, test xong mới tạo tiếp:

| Thứ tự | Skill | Input → Output | Test bằng |
| --- | --- | --- | --- |
| 1 | tc-to-playwright | TC UI-AUTO/BOTH trong <P>/qc/test-cases → web/tests/\<scope-key>.spec.ts | Xóa spec viết tay ở 3.2, cho skill sinh lại TC-USRL-001 → phải pass |
| 2 | failure-triage | log/trace → fix + lesson | Cố tình làm fail TC-USRL-001 |
| 3 | screen-explorer | URL → screens/\*.md + Page Object | 1 màn hình chưa có POM |
| 4 | tc-to-appium | TC UI-AUTO mobile → mobile/tests/\<scope-key>.spec.ts | Automate TC-USRL-010 |

```bash
mkdir -p .claude/skills/{tc-to-playwright,failure-triage,screen-explorer,tc-to-appium}
```

**.claude/skills/tc-to-playwright/SKILL.md**

```markdown
---
name: tc-to-playwright
description: Chuyển test case LOCKED trong <P>/qc/test-cases/*.md (Automation Eligibility = UI-AUTO hoặc BOTH) thành code Playwright TypeScript trong web/tests. Dùng khi người dùng nói "automate TC", "viết script", "chuyển sang playwright", "/automate".
---

# Quy trình
1. Đọc automation/lessons/INDEX.md.
2. Đọc <P>/qc/test-cases/<scope-key>-test-cases.md. Chỉ nhận file có State = LOCKED. Lọc TC có Automation Eligibility UI-AUTO/BOTH (hoặc TC được chỉ định).
3. Với mỗi màn hình trong Test Steps:
   - Đọc screens/web/<screen>.md và web/pages/<Screen>Page.ts.
   - Thiếu Page Object/locator → gọi skill screen-explorer. KHÔNG đoán locator.
4. Sinh 1 file spec cho 1 scope: web/tests/<scope-key>.spec.ts
   - 1 test() = 1 TC. Tên: "<No.> <Objective>".
   - tag: ['@<TC ID>', '@<VP ID>', '@high'|'@normal' theo Priority]
   - Pre-condition/Data test → setup; Test Steps → method Page Object; Expectation result → expect().
   - Tài khoản, URL lấy từ process.env.
5. Chạy: npx playwright test --grep @<TC ID>
6. Fail → chuyển sang skill failure-triage. Tối đa 3 vòng sửa.
7. Báo cáo: bảng TC ID | Trạng thái | Ghi chú.

# Cấm
- Sửa file trong qc/ · locator trong file spec · waitForTimeout · test.only · sửa expect cho khớp app khi TC nói khác.
- TC sai hoặc thiếu → báo lại để tạo revision mới bằng skill test-case.
```

**.claude/skills/failure-triage/SKILL.md**

```markdown
---
name: failure-triage
description: Phân tích test Playwright/Appium bị fail, phân loại nguyên nhân, sửa code nếu là lỗi script và ghi lesson. Dùng khi test fail hoặc người dùng nói "triage", "sao test fail".
---
1. Đọc error message, screenshot, trace (web: test-results/**/trace.zip).
2. Phân loại: LOCATOR | TIMING | DATA | ENV | PRODUCT_BUG. Giải thích bằng chứng.
3. So expected trong test case với hành vi thật:
   - App sai so với spec → PRODUCT_BUG → DỪNG. Soạn bug (Tiêu đề JP, Steps, Actual, Expected).
   - Không chắc → hỏi người dùng, không tự quyết.
4. LOCATOR/TIMING/DATA → sửa, chạy lại (tối đa 3 vòng).
5. Ghi automation/lessons/<web|mobile>/<YYYY-MM-DD>-<slug>.md theo manager/templates/lesson.md.
6. Lesson cùng loại đã lặp từ 2 lần → đề xuất 1 rule cho automation/lessons/INDEX.md.
```

**Slash command** — `.claude/commands/automate.md`:

```text
Automate các TC trong $ARGUMENTS bằng skill tc-to-playwright (web) hoặc tc-to-appium (mobile).
Chạy từng TC, nếu fail thì dùng failure-triage. Cuối cùng in bảng kết quả.
```

| Command | Ví dụ |
| --- | --- |
| /spec-review (GĐ1) | /spec-review <P>/spec/fs-user-list.md |
| /test-viewpoint (GĐ1) | /test-viewpoint fs-user-list |
| /test-case (GĐ1) | /test-case fs-user-list |
| /automate | /automate <P>/qc/test-cases/fs-user-list-test-cases.md |
| /explore | /explore user-list /users |
| /triage | /triage @TC-USRL-001 |

Sau mỗi skill: gõ `/skills` để kiểm tra. Commit riêng: `[skill] add <tên>`.

**Cổng qua GĐ3:** TC-USRL-001 do `/automate` sinh ra, chạy qua Page Object, pass; `/triage` phân loại đúng 1 lỗi cố ý và ghi được lesson đầu tiên.

## Giai đoạn 4 — Vận hành

### 4.1 Quy trình hằng ngày cho 1 ticket

1. Chuyển ticket → `<P>/spec/<scope-key>.md`, ghi trạng thái duyệt (bạn).
2. `/spec-review` → trả lời OQ trong `<P>/qc/open-questions.md`.
3. `/test-viewpoint` → review, duyệt Lock.
4. `/test-case` → review, chốt Automation Eligibility, duyệt Lock.
5. `/automate <P>/qc/test-cases/<scope-key>-test-cases.md` → xem diff trong Source Control.
6. Commit; code chạy bằng lệnh hoặc lịch đêm, không cần AI.
7. Test fail → `/triage @<TC ID>` → sửa code hoặc log bug.

Nhánh PRODUCT\_BUG không bao giờ quay lại sửa test.

### 4.2 Vòng lặp lessons

Hai vòng knowledge tách nhau (D19): **QC** (spec, VP, TC, bug-history) → `kb-update`; **Automation** (locator, timing, data, env, screens cho automation) → `kb-update-automation`. Automation chỉ dựa vào TC LOCKED; PRODUCT_BUG hoặc TC sai thì chuyển sang QC.

| Loại | Ví dụ | AI được làm | Ghi lesson |
| --- | --- | --- | --- |
| LOCATOR | Nút đổi 登録 → 保存 | Sửa Page Object + screens/\*.md | Có |
| TIMING | Assert trước khi API trả về | Thêm waitForResponse / expect | Có |
| DATA | Data test bị xóa/trùng | Sửa fixture, tự tạo data | Có |
| ENV | Server stg chết, token hết hạn | Không sửa code, báo lại | Không |
| PRODUCT\_BUG | App tính sai tổng tiền 合計 | **Không sửa test**, soạn bug | Không |

**automation/lessons/INDEX.md** (và qc/lessons/INDEX.md cho Thiết kế test) — mỗi rule 1 dòng, có link lesson gốc:

```markdown
# Rule đã học (AI bắt buộc đọc)
## Thiết kế test (viewpoint / test case bị sót)
- D01 Field ngày: luôn có VP cho cuối tháng và năm nhuận. (design/2026-10-20-date-month-end.md)
## Web
- R01 Mọi màn hình list: chờ API list trả về trước khi assert số dòng. (web/2026-10-12-table-async.md)
- R02 Dialog 確認: dùng getByRole('dialog') rồi mới tìm nút bên trong.
## Mobile
- M01 Android: driver.hideKeyboard() trước khi bấm nút cuối form.
```

**Vòng lặp cho thiết kế test (DESIGN\_GAP):** bug do dev, PM hoặc khách tìm ra mà không TC nào bắt được thì:

1. Thêm 1 dòng vào `<P>/bug-history.md` (cột *Có TC bắt được không?* = Không).
2. Ghi `qc/lessons/design/<YYYY-MM-DD>-<slug>.md` theo manager/templates/lesson.md, Loại = DESIGN\_GAP.
3. Pattern lặp từ 2 lần → thêm 1 rule vào mục **Thiết kế test** của qc/lessons/INDEX.md.
4. Lần sau, spec-review và test-viewpoint đọc mục này và tự sinh viewpoint nhóm 8.

Mỗi tuần review qc/lessons/ + automation/lessons/ 15 phút; giữ INDEX dưới 50 rule.

### 4.3 Chạy đêm

**scripts/run-nightly.sh**

```bash
#!/bin/zsh
export PATH=/opt/homebrew/bin:$PATH
cd ~/work/qc-automation/web
npx playwright test > ../reports/nightly.log 2>&1
```

```bash
chmod +x ~/work/qc-automation/scripts/run-nightly.sh
crontab -e
# Thêm:
0 1 * * * ~/work/qc-automation/scripts/run-nightly.sh
```

Chạy tay script 1 lần trước khi đăng ký cron. Mac mini: System Settings → Energy → bật *Prevent automatic sleeping when the display is off*, hoặc `sudo pmset repeat wakeorpoweron MTWRFSU 00:55:00`. Mobile chạy tay khi cần.

### 4.4 Report

| Đầu ra | Cách làm | Khi nào |
| --- | --- | --- |
| HTML | `npm run report` | Ngay từ đầu |
| Excel theo template team | Chỉ chạy khi bạn yêu cầu (D15). Đọc `<P>/qc/test-cases/*.md` (+ kết quả theo @TC nếu có) → file mới trong reports/, không sửa workbook gốc (T07) | Khi được yêu cầu |
| Test report cho khách/PM | Nhờ Claude tổng hợp từ `test-results/results.json` + `<P>/qc/test-cases` → `reports/<scope-key>-report.md`. Thiếu tiêu chí release thì ghi `UNDETERMINED`, không tự kết luận GO/NO-GO | Khi cần nộp kết quả |
| Tóm tắt Slack | Script đọc test-results/results.json → webhook | Làm sau cùng |

### 4.5 Git cá nhân

| Mục | Quy ước |
| --- | --- |
| Branch | Commit thẳng main; chỉ tạo branch khi đổi cấu trúc / nâng version |
| Commit prefix | `[arch]` `[fs-user-list]` `[lesson]` `[skill]` `[rule]` |
| Tần suất | Commit sau mỗi ticket; push cuối ngày |
| Trước khi commit | Xem diff các dòng `expect` AI đã sửa |
| Không commit | .env, .auth/, report, tests/spike, tài liệu mật |

Skill/CLAUDE.md làm AI tệ đi → `git revert` commit `[skill]`/`[rule]` đó.

## Checklist theo giai đoạn

**GĐ 0 — Kiến trúc**

- [ ] git, code chạy được
- [ ] Repo đủ thư mục, .gitignore, .vscode/settings.json
- [ ] CLAUDE.md khung + template qc/ + automation/ + 1 spec mẫu trong <P>/spec/

**GĐ 1 — Viewpoint & Test case**

- [ ] Claude CLI + extension VS Code đã đăng nhập, thấy CLAUDE.md
- [ ] skill source-import, spec-review, test-viewpoint, test-case, kb-update hiện trong /skills
- [ ] fs-user-list: viewpoint + test case LOCKED, OQ đã xử lý
- [ ] Spec thứ 2 LOCKED; có ít nhất 1 TC UI-AUTO

**GĐ 2 — Chạy thử automation**

- [ ] TC-USRL-001 spike pass headed, mở được trace
- [ ] adb thấy emulator, Inspector thấy element, spike Settings pass
- [ ] Danh sách element thiếu id đã gửi dev

**GĐ 3 — Cài đặt đầy đủ**

- [ ] `--project=setup` pass; TC-USRL-001 viết tay qua Page Object pass
- [ ] /mcp thấy playwright; TC-USRL-001 do /automate sinh lại vẫn pass
- [ ] /triage phân loại đúng lỗi cố ý, có lesson đầu tiên
- [ ] TC-USRL-010 mobile pass với APK dự án

**GĐ 4 — Vận hành**

- [ ] Chạy trọn quy trình 1 ticket thật
- [ ] Cron chạy đêm, sáng xem được report

## Phụ lục A — Nguồn hiện hành (v0.1.0, tự sinh)

### Luật chung cho AI

#### `CLAUDE.md`

~~~~markdown
# QC Automation — Luật cho AI

## Bối cảnh
- Sản phẩm thị trường Nhật. UI tiếng Nhật, team làm việc bằng tiếng Việt.
- Trả lời / chat bằng tiếng Việt. Viewpoint và test case viết bằng TIẾNG ANH; label / message tiếng Nhật giữ nguyên trong '' (không dịch).
- Dự án đang làm: qnavi → <P> = projects/qnavi. Hồ sơ dự án: <P>/README.md, thứ tự ưu tiên nguồn: <P>/sources.md.
- Câu hỏi về dự án (role, màn hình, thuật ngữ, luồng, bug…): tự đọc / grep trong <P>/ (README.md, glossary.md, screens/_flow.md, screens/catalog/, bug-history.md, spec/) rồi trả lời kèm nguồn — không cần xin phép. Chỉ nói "không biết" khi đã tìm trong <P>/ mà không có.

## Thứ tự đọc khi thiết kế test (bắt buộc)
0. Spec là xlsx / pdf / docx → skill source-import (gốc ở <P>/raw/, md ở <P>/spec/)
1. Spec: <P>/spec/<scope-key>.md (đường dẫn người dùng đưa)
2. Knowledge: <P>/README.md, <P>/sources.md, <P>/glossary.md, <P>/screens/_flow.md + màn hình liên quan, <P>/qc/ của function liên quan (bản LOCKED)
3. Bài học: qc/lessons/INDEX.md (mục Thiết kế test), <P>/bug-history.md (chỉ dòng cùng function / pattern)
4. Q&A: skill spec-review → Gap Report + Context pack + Open Questions. Hết OQ OPEN + người dùng xác nhận → [Done] → kb-update ghi knowledge vào <P>/
5. Viewpoint: skill test-viewpoint (Context pack trước, rồi knowledge + bài học của đúng function / màn hình)
6. Test case: skill test-case (viewpoint LOCKED + Context pack + knowledge + bài học của đúng function)
Khi đọc / ghi Excel: qc/lessons/INDEX.md mục Excel / công cụ.

## Automation (luồng riêng: Spec → Test case → Automation)
- Input duy nhất: test case LOCKED <P>/qc/test-cases/ có Automation Eligibility UI-AUTO / BOTH. Không đọc spec, Gap Report, viewpoint, qc/lessons, bug-history.
- Đọc thêm: automation/lessons/INDEX.md, <P>/automation/README.md, <P>/automation/web/README.md (quy ước TC → code), <P>/automation/web/screens/ của màn hình liên quan; mô tả màn hình tra <P>/screens/catalog/.
- TC thiếu / mâu thuẫn với app → dừng, báo người dùng; không tự sửa TC, không sửa expect cho khớp app.
- Knowledge automation cập nhật bằng skill kb-update-automation (không dùng kb-update).
- Đăng nhập trong test: CHỈ dùng <P>/automation/web/common/session.ts (loginAs(page, '02:urgent'), logout, forAccounts([...]) ). Không tự viết hàm login, không ghi loginId / mật khẩu trong spec. Tài khoản: env/<ENV>.json › accounts + .env.
- Sinh / sửa code test: đọc automation/lessons/INDEX.md TRƯỚC; locator chỉ lấy / ghi ở screens/. Sửa xong 1 lỗi test fail → luôn đề xuất lesson (bản nháp: loại, nguyên nhân gốc, rule) cho người dùng duyệt rồi ghi vào automation/lessons/ + INDEX; lỗi do TC sai → lesson phía QC (qc/lessons).

## Skill dùng trong repo
- Thiết kế test dùng skill của repo: source-import, spec-review, test-viewpoint, test-case, export-excel (chỉ khi người dùng đồng ý); sửa knowledge: kb-update.
- KHÔNG dùng skill tài khoản qa-testcase-writing (format cũ, khác D10) trừ khi người dùng gọi đúng tên nó.
- Mỗi bước (Gap Report, viewpoint, test case) phải: draft → người dùng duyệt → LOCKED. Không bỏ bước duyệt.

## Tiết kiệm token
- Khi làm task QC: KHÔNG đọc manager/ (GUIDE.md, handbook.md, decisions.md, CHANGELOG.md). Người dùng hỏi về quyết định / lịch sử / hướng dẫn thì đọc.
- Chỉ đọc phần file liên quan (grep theo function / ID), không đọc cả thư mục.

## Luật QC chung
- Các luật dưới đây chỉ áp dụng khi đang làm task QC (thiết kế viewpoint / test case, automation). Câu hỏi khác, tra cứu, sửa repo theo yêu cầu: làm bình thường, được đọc manager/ khi người dùng hỏi.
- Khi thiết kế test: chỉ dùng spec mà người dùng đưa đường dẫn chính xác làm input. Thiếu → dừng, trả BLOCKED_INPUT. (Luật này KHÔNG áp dụng cho câu hỏi tra cứu.)
- Không bịa requirement. Spec không rõ → ghi Open Question vào <P>/qc/open-questions.md.
- Draft trong chat trước, chờ duyệt nội dung + đường dẫn rồi mới ghi file. Im lặng không phải là duyệt.
- Không sửa file State = LOCKED. Cần đổi → tăng Revision, duyệt lại.
- ID: OQ-<CODE>-NNN · viewpoint <PREFIX>-NN · test case <PREFIX>-TC-NNN (PREFIX = sheet prefix; quy ước riêng dự án ở <P>/README.md).
- Nguồn mâu thuẫn → theo thứ tự ưu tiên trong <P>/sources.md; permission matrix của nguồn authoritative override mọi suy luận từ UI.
- Mỗi lần chỉ làm đúng 1 sheet / function được chỉ định; không tự mở rộng scope. Chỉ tạo viewpoint mới khi được yêu cầu.
- Deliverable cho người review: xuất file mới, không sửa file gốc.
- Mọi file AI ghi vào <P>/qc/test-viewpoints/, test-cases/, gap-reports/ phải mở đầu bằng header: Project · Scope Key · Sheet prefix / Source (path + rev) / State (DRAFT | LOCKED) · Revision / Approved by / at.

## Knowledge
- Mọi thay đổi luật, skill, template, bài học, quy trình → dùng skill kb-update (sửa đúng 1 file nguồn, ghi decision + CHANGELOG, chạy manager/scripts/build_guide.py).
- manager/GUIDE.md là file tự sinh. Không sửa tay.
~~~~

### Skills

#### `.claude/skills/export-excel/SKILL.md`

~~~~markdown
---
name: export-excel
description: Xuất viewpoint + test case đã LOCKED ra file Excel mới trong reports/ theo format workbook của dự án. Chỉ chạy khi người dùng đồng ý / yêu cầu ("xuất excel", "export excel", "/export-excel", hoặc trả lời "Có" khi skill test-case hỏi).
---
# Khi nào chạy
- Chỉ khi người dùng yêu cầu, hoặc trả lời "Có" cho câu hỏi cuối skill test-case: "TC đã LOCKED. Xuất Excel không?". Không tự xuất.

# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md và <P>/qc/test-cases/<scope-key>-test-cases.md, cả hai State = LOCKED. Chưa LOCKED → dừng.
- Danh sách cột kết quả theo role / platform: <P>/README.md (mục cột kết quả). Chỉ lấy role / OS thuộc scope (Gap Report).
- Bài học Excel: qc/lessons/INDEX.md mục Excel / công cụ (T01–T07).

# Output
- File MỚI: reports/<scope-key>-<YYYYMMDD>.xlsx. Không mở / sửa workbook gốc của dự án (T07). Trùng tên → thêm -v2, -v3.
- Sheet 1 `<PREFIX>_Viewpoint`: 9 cột đúng qc/templates/viewpoint.md.
- Sheet 2 `<PREFIX>`: 12 cột TC (TC ID · Viewpoint ID · Test Level · Main Screen · Function · Pre-condition · Steps · Expected Results · Role · OS · Priority · Status). KHÔNG xuất Automation Eligibility (chỉ dùng nội bộ repo).
- Sau 12 cột: cột kết quả theo role / platform (để trống cho tester điền; giá trị Passed / Failed / Fixed / Pending / N/A).
- Tên sheet ≤ 31 ký tự (T01). Text bắt đầu bằng "=" ghi dạng text (T05). Steps xuống dòng trong ô, wrap text, freeze hàng header.

# Quy trình
1. Kiểm 2 file LOCKED, đếm số VP / TC.
2. Tạo workbook bằng openpyxl (skill xlsx nếu có).
3. Đối chiếu: số dòng VP / TC trong Excel = số dòng trong md; mọi Viewpoint ID trong sheet TC có trong sheet Viewpoint (trừ ô trống hợp lệ).
4. Báo: đường dẫn file, bảng Sheet | Số dòng | Khớp?.

# Cấm
- Sửa file md / workbook gốc · thêm hoặc đổi thứ tự cột · điền sẵn kết quả test.
~~~~

#### `.claude/skills/kb-update-automation/SKILL.md`

~~~~markdown
---
name: kb-update-automation
description: Cập nhật knowledge của phần AUTOMATION (bài học locator / timing / data / env, mô tả màn hình cho automation, template automation, luật viết code test). Dùng khi test automation fail đã tìm ra nguyên nhân, khi đổi locator / Page Object, hoặc người dùng nói "ghi lesson automation", "cập nhật knowledge automation", "/kb-update-automation".
---
# Nguyên tắc
- Automation chỉ dựa vào test case LOCKED. Knowledge automation tách riêng knowledge QC: skill này không sửa spec, Gap Report, viewpoint, test case, qc/lessons, glossary, <P>/screens/ (nghiệp vụ).

# Bản đồ knowledge automation — mỗi loại 1 file nguồn
| Loại | File nguồn |
|---|---|
| Rule đã học (dùng chung) | automation/lessons/INDEX.md (Web R.., Mobile M..) |
| Bài học chi tiết | automation/lessons/<web\|mobile>/<YYYY-MM-DD>-<slug>.md theo manager/templates/lesson.md |
| Template automation | automation/templates/*.md |
| Màn hình cho automation (mã màn hình, route, role, locator, thao tác) | <P>/automation/web/screens/<app>/<screen>.screen.ts theo automation/templates/screen.md. Mô tả màn hình KHÔNG chép lại: tra <P>/screens/catalog/ |
| Môi trường, role ↔ tài khoản, data test | <P>/automation/web/env/*.json · data/roles.ts · data/<scope-key>.json (mật khẩu chỉ ở .env) |
| Code dùng chung (login, chờ, assert) | <P>/automation/web/common/ |
| Ghi chú môi trường / data / tài khoản test (không ghi mật khẩu) | <P>/automation/README.md |
| Luật viết code test | CLAUDE.md mục Automation |

# Phân loại khi có lỗi
| Loại lesson | Ai xử lý | File |
|---|---|---|
| LOCATOR · TIMING · DATA | Skill này | lesson + <P>/automation/web/screens/ hoặc common/ |
| ENV | Skill này (chỉ ghi chú, không sửa code) | <P>/automation/README.md |
| PRODUCT_BUG | KHÔNG sửa test. Soạn bug → chuyển cho kb-update (QC) ghi <P>/bug-history.md | — |
| TC sai / thiếu / mâu thuẫn với app | KHÔNG tự sửa TC. Báo người dùng → QC sửa TC (revision mới) qua test-case / kb-update | — |

# Quy trình
1. Xác định loại theo bảng trên. Không thuộc automation → dừng, chỉ ra skill đúng.
2. Draft thay đổi (trước / sau) trong chat → chờ duyệt.
3. Sửa file nguồn. Ghi lesson nếu loại LOCATOR / TIMING / DATA.
4. Lesson cùng loại lặp từ 2 lần → đề xuất 1 rule cho automation/lessons/INDEX.md.
5. Đổi luật / cách làm automation → thêm 1 dòng vào manager/decisions.md; luôn thêm 1 dòng manager/CHANGELOG.md (ghi [auto]).
6. Chạy python3 manager/scripts/build_guide.py. Báo file đã đổi + commit "[auto] <tóm tắt>".

# Cấm
- Sửa expect cho khớp app khi TC nói khác · sửa file trong <P>/qc/ · ghi mật khẩu / token vào repo · sửa manager/GUIDE.md bằng tay.
~~~~

#### `.claude/skills/kb-update/SKILL.md`

~~~~markdown
---
name: kb-update
description: Cập nhật knowledge phần QC + quản lý của repo (luật, skill, template, bài học thiết kế test, knowledge dự án, quy trình); phần automation dùng kb-update-automation và tự ghi tài liệu (decision, CHANGELOG, GUIDE.md). Dùng khi người dùng nói "thêm luật", "sửa skill", "cập nhật template", "ghi lại bài học", "từ giờ phải…", "/kb-update".
---
# Bản đồ knowledge — mỗi loại chỉ có 1 file nguồn
| Loại | File nguồn |
|---|---|
| Luật chung cho AI | CLAUDE.md |
| Cách làm từng bước | .claude/skills/<skill>/SKILL.md (+ references/) |
| Format output | qc/templates/*.md (thiết kế) · automation/templates/*.md (automation) · manager/templates/*.md (lesson) |
| Bài học chung | qc/lessons/design/*.md + qc/lessons/INDEX.md · automation/lessons/<web\|mobile>/*.md + automation/lessons/INDEX.md (rule chỉ đúng cho 1 dự án → projects/<project>/README.md mục Quy tắc riêng) |
| Knowledge riêng dự án | projects/<project>/: README.md, sources.md, glossary.md, bug-history.md, screens/, spec/, raw/ |
| Hướng dẫn cho người (tường thuật) | manager/handbook.md |
| Lý do của quyết định | manager/decisions.md (1 dòng / quyết định) |
| Tài liệu tổng hợp | manager/GUIDE.md — TỰ SINH, không sửa tay |

# Phạm vi
- Không sửa knowledge automation (automation/, <P>/automation/, luật code test) → dùng kb-update-automation.
- Nhận bàn giao từ kb-update-automation: PRODUCT_BUG → <P>/bug-history.md; TC sai → đề xuất revision TC.

# Quy trình
0. Nguồn kích hoạt thường gặp: Gap Report chuyển [Done] (spec-review bước 10) → chỉ sửa knowledge trong projects/<project>/, không cần decision / handbook.
1. Xác định thay đổi thuộc loại nào → chọn đúng file nguồn. Không chép nội dung skill/template sang file khác.
2. Draft thay đổi (trước/sau) trong chat → chờ duyệt.
3. Sửa file nguồn.
4. Thay đổi luật hoặc cách làm → thêm 1 dòng lên đầu bảng manager/decisions.md (ID Dnn tiếp theo).
5. Thêm 1 dòng vào manager/CHANGELOG.md, mục [Unreleased], nhóm Thêm / Sửa / Bỏ, kèm ID Dnn nếu có.
6. Thay đổi ảnh hưởng quy trình đọc của người → sửa phần tường thuật trong manager/handbook.md.
7. Chạy: python3 manager/scripts/build_guide.py
8. Báo lại: danh sách file đã đổi + commit message gợi ý "[kb] <tóm tắt>".

# Release
- Người dùng nói "release": đổi [Unreleased] thành [x.y.z] - YYYY-MM-DD, tăng manager/VERSION (luật/skill thay đổi hành vi → y; sửa chữ → z), chạy lại build_guide.py.

# Cấm
- Sửa manager/GUIDE.md bằng tay · bỏ qua CHANGELOG · sửa file LOCKED trong qc/ · ghi cùng 1 nội dung ở 2 file nguồn.
~~~~

#### `.claude/skills/source-import/SKILL.md`

~~~~markdown
---
name: source-import
description: Chuyển tài liệu nguồn của khách (xlsx, csv, docx, pdf) sang Markdown để làm input thiết kế test. Gốc giữ ở <P>/raw/, bản md ở <P>/spec/. Dùng khi người dùng nói "import spec", "chuyển excel sang md", "thêm file excel vào spec", "/source-import", hoặc đưa file .xlsx làm spec.
---
# Input
- File gốc ở <P>/raw/ (người dùng đưa đường dẫn). File chưa nằm trong raw/ → đề nghị chuyển vào trước. raw/*.xlsx|pdf|csv bị .gitignore: không commit tài liệu mật của khách.
- scope-key do người dùng xác nhận.

# Quy trình
1. Liệt kê sheet / trang: tên, số dòng có dữ liệu, có ảnh / màu / comment / ô gộp / công thức không. Hỏi sheet nào cần import (mặc định: tất cả sheet có dữ liệu).
2. Mỗi sheet → 1 bảng Markdown. Header dò theo literal (T03), không hard-code hàng. Ô gộp → lặp giá trị cho từng ô (T04). Công thức → lấy giá trị đã tính; ô "=..." dạng text giữ nguyên (T05). Tiếng Nhật giữ nguyên, không dịch.
3. Ghi ra:
   - 1 file: <P>/spec/<scope-key>.md (spec chính) hoặc <P>/spec/<scope-key>/<sheet>.md khi nhiều sheet lớn.
   - Đầu mỗi file: `<!-- Nguồn: <P>/raw/<file> · Sheet: … · Import: YYYY-MM-DD · Revision gốc: … -->`
4. Đối chiếu: bảng Sheet | Số dòng gốc | Số dòng md | Khớp?. Lệch → sửa trước khi báo xong.
5. Báo phần MẤT khi chuyển (ảnh, màu ô có ý nghĩa, comment, hyperlink, data validation / dropdown) kèm vị trí ô. Màu / comment có ý nghĩa nghiệp vụ → chép thành chữ vào cột "Ghi chú import".
6. Nguồn mới → đề xuất thêm 1 dòng vào <P>/sources.md (mức ưu tiên do người dùng quyết).

# Cấm
- Sửa file gốc trong raw/ · tóm tắt / bỏ dòng · dịch tiếng Nhật · tự suy ra nội dung ảnh.
~~~~

#### `.claude/skills/spec-review/SKILL.md`

~~~~markdown
---
name: spec-review
description: Bước Q&A trước khi thiết kế test - đọc spec, đọc knowledge, đọc bài học, rồi tìm gap, ghi Open Question, kết luận Design Gate và ghi Context pack cho bước viewpoint/test case. Dùng khi người dùng nói "review spec", "tìm gap", "Q&A spec", "/spec-review".
---
# Input
- <P> = projects/<project> (CLAUDE.md). Đường dẫn spec chính xác <P>/spec/<scope-key>.md + trạng thái duyệt / revision. Thiếu → dừng, trả BLOCKED_INPUT. Spec chỉ có dạng xlsx / pdf → chạy skill source-import trước.

# Quy trình (đúng thứ tự)
1. Đọc spec. Đề xuất scope-key (= tên file spec), sheet prefix, code cho OQ. Chờ xác nhận.
2. Đọc knowledge (chỉ phần liên quan, grep theo function / màn hình):
   - <P>/README.md, <P>/sources.md (nguồn nào authoritative)
   - <P>/glossary.md, <P>/screens/_flow.md + màn hình liên quan (permission matrix, state transition)
   - <P>/qc/test-viewpoints/, test-cases/ bản LOCKED của function liên quan
3. Đọc bài học: qc/lessons/INDEX.md mục "Thiết kế test"; <P>/bug-history.md chỉ dòng cùng function / loại field / pattern.
4. Kiểm scope: role nào thuộc ticket, ticket thuộc release phase nào, có ticket cha / con không (qc/lessons D11).
5. Q&A: liệt kê test item (chức năng, input, trigger, kết quả quan sát được, rule/data). Mỗi item kiểm: thiếu · mơ hồ · mâu thuẫn giữa các nguồn · không kiểm chứng được · lặp pattern từng gây bug → FND-<CODE>-NNN. Mâu thuẫn → ghi nguồn nào thắng theo sources.md. Chỗ cần người quyết → OQ-<CODE>-NNN trong <P>/qc/open-questions.md (Status: OPEN).
6. Kết luận Design Gate: READY · PARTIAL (ghi rõ phần bị chặn) · STOP.
7. Ghi Context pack ở cuối Gap Report (ngày + revision của qc/lessons/INDEX.md), mỗi dòng ≤ 1 câu, có nguồn:
   | Loại (Thuật ngữ / Màn hình / Permission / VP-TC cũ / Lesson / Bug / Scope) | Nguồn (file#mục hoặc ID) | Nội dung rút gọn |
8. Viết đúng qc/templates/gap-report.md. Draft trong chat → chờ duyệt → ghi <P>/qc/gap-reports/<scope-key>-gap-report.md (State: DRAFT); người dùng duyệt → LOCKED.
9. Chuyển [Done] khi đủ 3 điều kiện: Gap Report đã LOCKED · mọi OQ của scope trong <P>/qc/open-questions.md là ANSWERED / RESOLVED (không còn OPEN) · người dùng xác nhận "Done". Thiếu 1 điều kiện → giữ LOCKED, liệt kê OQ còn OPEN.
10. Khi [Done]: gọi kb-update để cập nhật knowledge dự án — chỉ điều đã chắc chắn (spec đã duyệt + câu trả lời OQ):
    | Loại | File đích |
    |---|---|
    | Thuật ngữ mới | <P>/glossary.md |
    | Màn hình, permission, state transition | <P>/screens/ |
    | Rule nghiệp vụ, quy ước dùng chung nhiều ticket | <P>/README.md |
    | Nguồn tài liệu mới | <P>/sources.md |
    Draft bảng trước/sau → người dùng duyệt → ghi. Xong: OQ đã đưa vào knowledge → RESOLVED; ghi danh sách file đã cập nhật vào mục 7 của Gap Report.

# Cấm
- Cập nhật knowledge dự án khi Gap Report chưa [Done] · ghi điều chỉ đúng cho 1 ticket vào knowledge chung của dự án.
- Sửa spec · tự trả lời OQ · coi im lặng là đồng ý · đọc cả thư mục thay vì phần liên quan.
~~~~

#### `.claude/skills/test-case/SKILL.md`

~~~~markdown
---
name: test-case
description: Sinh test case từ viewpoint đã LOCKED theo format sheet TC (TC ID, Viewpoint ID, Test Level, Main Screen, Function, Pre-condition, Steps, Expected Results, Role, OS, Priority, Status) kèm Automation Eligibility, rồi đối chiếu 3 nguồn. Dùng khi người dùng nói "viết test case", "sinh TC", "/test-case".
---
# Input
- <P>/qc/test-viewpoints/<scope-key>-viewpoints.md có State = LOCKED. Chưa LOCKED → dừng.
- Context pack trong <P>/qc/gap-reports/<scope-key>-gap-report.md (đọc trước).
- Knowledge + bài học (đọc có chọn lọc, grep theo function / màn hình, không đọc cả thư mục):
  | Đọc | Để làm gì |
  |---|---|
  | qc/lessons/INDEX.md mục Thiết kế test | Case hay sót (ngày cuối tháng, double-submit…) |
  | <P>/bug-history.md — dòng cùng function | Mỗi bug "Không" bắt được → ít nhất 1 TC, Priority High |
  | <P>/screens/ — màn hình liên quan | Steps đúng luồng, permission theo role, label tiếng Nhật chính xác |
  | <P>/glossary.md | Đúng label / message '' |
  | <P>/qc/test-cases/ bản LOCKED cùng function + TC cũ theo sources.md | Đối chiếu 3 nguồn, tránh trùng |
  | <P>/README.md mục role / OS / quy ước ID | Role, OS, TC ID đúng dự án |
- qc/templates/testcase.md, qc/templates/data-test.md, references/test-design-techniques.md, references/automation-eligibility.md.
- Chỉ làm đúng 1 sheet được chỉ định.

# Quy trình
1. Mỗi VP: đọc "Axis" ở cột Note; mỗi giá trị trên trục → 1 TC. Chọn kỹ thuật (EP, BVA, Decision Table…). Nhiều TC cùng 1 Viewpoint ID là đúng.
2. TC ID = <PREFIX>-TC-NNN (quy ước CR / enhancement theo <P>/README.md). Viết tiếng Anh, label tiếng Nhật giữ nguyên trong ''.
3. 1 TC = 1 behavior = 1 Expected Result.
   - Không gộp nhiều kết quả vào 1 ô (không "and", không liệt kê 1) 2) 3), không "<br>" nhiều kết quả).
   - Cần kiểm nhiều thứ (message + màu field + không lưu DB…) → tách mỗi thứ 1 TC, cùng Viewpoint ID, Steps giống nhau.
4. Pre-condition không có ghi "-". Steps đánh số "1. … 2. …", bước 1 thường là "Login as <Role>". Role / OS theo spec.
5. Priority: High (luồng chính, UAT) · Medium (negative / validation chính) · Low (UI, hiếm gặp). VP nhóm 8 (bài học / bug cũ) → High, ghi bug ID ở Function hoặc ghi chú. Status để trống.
6. Gán Automation Eligibility theo automation-eligibility.md.
7. Đối chiếu 3 nguồn trước khi coi là xong: (1) viewpoint, (2) TC cũ của function (nếu sources.md có), (3) basic design. Case thiếu → bổ sung; TC bổ sung không map được viewpoint nào → ĐỂ TRỐNG Viewpoint ID, liệt kê riêng để người quyết có tạo VP mới không. Mâu thuẫn → theo sources.md.
8. Kiểm trùng theo NỘI DUNG (không chỉ theo ID) và trace 2 chiều: in bảng Viewpoint ID | Kỹ thuật | Số TC; VP nào 0 TC ghi lý do; TC trỏ VP không tồn tại là lỗi.
9. Draft → duyệt → ghi <P>/qc/test-cases/<scope-key>-test-cases.md theo qc/templates/testcase.md → Lock khi được duyệt.
10. Sau khi LOCKED: hỏi đúng 1 câu "TC đã LOCKED. Xuất Excel không?". Có → skill export-excel. Không → dừng.

# Cấm
- Gộp nhiều expected result / scenario vào 1 TC · đặt Viewpoint ID giả (vd CMS-NEW) · tự tạo viewpoint mới.
- Đổi tên / thứ tự cột · dùng MANUAL để che thiếu spec (dùng NEEDS_SPEC) · bịa field/message · suy quyền từ UI thay vì permission matrix.
~~~~

#### `.claude/skills/test-case/references/automation-eligibility.md`

~~~~markdown
| Giá trị | Dùng khi | Đi tiếp |
|---|---|---|
| UI-AUTO | Kết quả kiểm tra được bằng UI automation, ổn định | Playwright / Appium |
| API-AUTO | Có đủ method, endpoint, auth, payload, response | Để sau |
| BOTH | Cùng mục tiêu kiểm được ở cả UI và API | Playwright trước |
| MANUAL | Cần mắt người: layout, font, in ấn, thiết bị thật | Chạy tay |
| NEEDS_SPEC | Thiếu expected result, data hoặc contract | Quay lại spec-review |

- Không dùng MANUAL để che thiếu spec.
- UI-AUTO là "đủ điều kiện automate", chưa có nghĩa đã có code hay đã chạy.
- Mọi TC vẫn phải chạy tay được trước khi có code.
~~~~

#### `.claude/skills/test-case/references/test-design-techniques.md`

~~~~markdown
| Kỹ thuật | Dùng khi | Coverage |
|---|---|---|
| EP — Phân vùng tương đương | Input có nhóm hợp lệ / không hợp lệ | Mỗi vùng ≥1 TC |
| BVA — Giá trị biên | Có min/max, độ dài, ngưỡng | min-1, min, max, max+1 |
| Decision Table | Nhiều điều kiện kết hợp ra kết quả khác nhau | Mỗi rule ≥1 TC |
| State Transition | Có trạng thái + chuyển trạng thái | Mọi transition hợp lệ + transition cấm quan trọng |
| Scenario / Use flow | Luồng nghiệp vụ nhiều bước | Luồng chính + luồng thay thế |
| Role matrix | Quyền khác nhau theo role | Mỗi ô role × thao tác có trong spec |
| Combination (pairwise) | Nhiều tham số độc lập | Mỗi cặp giá trị xuất hiện ≥1 lần |
| Error guessing | Lỗi hay gặp theo kinh nghiệm | Ghi rõ lý do |
~~~~

#### `.claude/skills/test-viewpoint/SKILL.md`

~~~~markdown
---
name: test-viewpoint
description: Thiết kế Test Viewpoint theo format sheet Viewpoint (ID, Screen, Test Level/Test Type, Function, Test Viewpoint, Expected Result, Role, Site, Note). Mỗi viewpoint là 1 góc kiểm thử có trục biến thiên để sinh nhiều test case, trace về spec rồi Lock. Dùng khi người dùng nói "làm viewpoint", "góc kiểm thử", "/test-viewpoint".
---
# Input
- <P>/spec/<scope-key>.md đã duyệt + <P>/qc/gap-reports/<scope-key>-gap-report.md đã LOCKED, Design Gate READY/PARTIAL, có Context pack.
- Knowledge + bài học (đọc có chọn lọc, grep theo function / màn hình của sheet, không đọc cả thư mục):
  | Đọc | Để làm gì |
  |---|---|
  | Context pack (bắt buộc, đọc trước) | Tóm tắt đã lọc ở spec-review |
  | qc/lessons/INDEX.md mục Thiết kế test | Rule VP hay bị sót (nhóm 8) |
  | <P>/bug-history.md — dòng cùng function / pattern | VP nhóm 8; ưu tiên dòng "Có TC bắt được" = Không |
  | <P>/screens/ — màn hình liên quan | Permission matrix, state transition → trục role / trạng thái |
  | <P>/qc/test-viewpoints/ bản LOCKED cùng function | Không trùng / không sót VP cũ |
  | <P>/glossary.md — chỉ khi gặp thuật ngữ lạ | Đúng tên đối tượng |
- Thông tin mới tìm thấy mà Context pack chưa có → ghi thêm 1 dòng "Nguồn: <file#mục>" ở Note của VP liên quan.
- references/viewpoint-groups.md, qc/templates/viewpoint.md, qc/templates/data-test.md.

# Viewpoint là gì (đọc kỹ trước khi viết)
- Viewpoint = 1 ĐỐI TƯỢNG × 1 KHÍA CẠNH cần verify, có 1 TRỤC BIẾN THIÊN (axis). Test case = 1 giá trị trên trục đó.
- 3 loại trục: data (các dòng data-test, các giá trị input) · trạng thái (status, có/không data, role) · tổ hợp điều kiện.
- Test Viewpoint (tiếng Anh): "Verify that <object> <aspect> in case/when <GROUP of conditions>". Điều kiện là một nhóm, không phải 1 giá trị.

| Sai (case-by-case) | Đúng (viewpoint) |
|---|---|
| Verify that error is shown when '見積名' is blank | Verify that '見積名' is validated in case of invalid input (Note: Axis: data — D01–D14) |
| Verify that error is shown when '見積名' exceeds 30 chars | (gộp vào dòng trên) |
| Verify that Submit is enabled at '到着' | Verify that the submit button works correctly by trouble status (Note: Axis: status — 受注 / 移動中 / 到着) |
| Verify that Approve button is hidden for Worker | Verify that action buttons are displayed by role and status (Note: Axis: permission matrix — role × status) |

# Quy trình
1. Liệt kê screen / function trong spec, đúng sheet được chỉ định. Mỗi sheet 1 prefix (vd WB2).
2. Mỗi function đi qua 8 nhóm trong viewpoint-groups.md; nhóm 8 lấy từ Context pack + qc/lessons/INDEX.md + bug-history (dòng cùng function).
3. Trong mỗi nhóm, gom theo đối tượng (field / vùng màn hình / nút / API / rule): mỗi đối tượng × khía cạnh = 1 VP. Mỗi input field = 1 VP validation duy nhất, data-test là trục của nó. Nút theo role → trục là permission matrix của nguồn authoritative.
4. Mỗi VP 1 dòng: ID = <PREFIX>-NN · Expected Result ở mức tổng quát · Role, Site theo spec · Note: "Axis: <loại> — <các giá trị dự kiến>" + nguồn (mã nguồn §mục) / OQ.
5. Tự kiểm trước khi đưa người duyệt — in bảng ID | Axis | Số TC dự kiến:
   - VP dự kiến < 3 TC → gộp vào VP cùng đối tượng / khía cạnh (ngoại lệ: rule chỉ có 1 trường hợp, ghi lý do ở Note).
   - Hai VP chỉ khác nhau 1 giá trị điều kiện → gộp.
   - Mọi acceptance criteria có ≥1 VP; VP không chứa steps hay data cụ thể.
6. Draft → duyệt → ghi <P>/qc/test-viewpoints/<scope-key>-viewpoints.md theo qc/templates/viewpoint.md → State = LOCKED khi được duyệt.

# Cấm
- Viết VP cho từng giá trị / từng điều kiện (đó là test case) · tách VP theo từng dòng data-test.
- Đổi tên / thứ tự cột · viết test case ở bước này · dịch text tiếng Nhật.
- Bịa function/field/message ngoài spec → ghi [cần confirm] và tạo OQ.
~~~~

#### `.claude/skills/test-viewpoint/references/viewpoint-groups.md`

~~~~markdown
Quét đủ 8 nhóm cho mỗi function, không bỏ sót:

| Nhóm | Test Type gợi ý | Hỏi gì |
|---|---|---|
| 1. UI / Layout | UI | Đúng design, empty state, trạng thái button/chip/badge, responsive |
| 2. Positive | Function | Luồng chính chạy đúng với data hợp lệ |
| 3. Negative | Validation | Data sai, bỏ trống bắt buộc, sai thứ tự, không có quyền |
| 4. Boundary / Edge | Validation | Min/max length, min/max value, 0 / 1 / nhiều / tối đa, ngày biên |
| 5. Data / Business rule | Data | Trạng thái dữ liệu, trùng lặp, ràng buộc quan hệ, tính toán |
| 6. Cross-cutting | Transition / Security | Chuyển màn hình, permission/role, message tiếng Nhật, session/timeout, SQL injection, trim |
| 7. Performance | Performance | Thời gian phản hồi màn hình/API, load nhiều data (list 1.000+ dòng, export, upload file lớn), nhiều user thao tác cùng lúc, double submit. Chỉ đặt ngưỡng khi spec có số; không có → tạo OQ hỏi ngưỡng |
| 8. Bài học / bug cũ | Regression | Lấy từ dòng Lesson / Bug trong Context pack của Gap Report (qc/lessons/INDEX.md D01–D13 + bug-history của dự án). Bug/lesson nào cùng function, cùng loại field hoặc cùng pattern → ≥1 VP; Note ghi ID bug hoặc file lesson |

- Mỗi nhóm thường ra 1–vài VP cho 1 function, KHÔNG phải 1 VP cho mỗi câu hỏi trong cột "Hỏi gì" — các câu hỏi đó là giá trị trên trục, thành test case.
- Mỗi input field = 1 VP validation; các dòng qc/templates/data-test.md là trục data của VP đó.
- Mẫu câu Test Viewpoint (tiếng Anh): "Verify that <object> <aspect> in case/when <group of conditions>".
~~~~

### Templates

#### `automation/templates/screen.md`

~~~~markdown
# Template màn hình cho automation (web, Playwright)
1 file = 1 màn hình: `<P>/automation/web/screens/<app>/<screen>.screen.ts`. Mô tả đầy đủ màn hình nằm ở `<P>/screens/catalog/` — chỉ ghi mã màn hình để tra ngược, không chép mô tả.

```ts
import { BaseScreen } from '../base.screen';

/**
 * <Tên màn hình tiếng Nhật> — catalog: <file>.md › "<mục>"
 * Role: <theo permission matrix / catalog>. Chờ: <API cần chờ trước khi assert>.
 * [cần kiểm trên app thật] <locator nào chưa xác minh>
 */
export class XxxScreen extends BaseScreen {
  readonly id = '<mã màn hình, vd CMS0050>';
  readonly path = '<route>';
  readonly roles = ['99'] as const;

  // Locator: getByRole / getByLabel / getByText (label JP) → #id / data-testid → CSS
  readonly saveButton = this.page.getByRole('button', { name: '保存' });

  async save(): Promise<void> { await this.saveButton.click(); }
}
```

Luật: locator chỉ ở file screen · không waitForTimeout · thao tác ngắn, không chứa assert.
~~~~

#### `manager/templates/lesson.md`

~~~~markdown
# <YYYY-MM-DD> <tóm tắt>
- Loại: DESIGN_GAP | LOCATOR | TIMING | DATA | ENV | PRODUCT_BUG
- Nguồn: bug <ID/link> hoặc @TC-xxx — file: web/tests/...
- Function / màn hình:
- Triệu chứng:
- Nguyên nhân gốc:
- Cách fix:
- Rule rút ra:
- Áp dụng cho (function / loại field / pattern):
~~~~

#### `qc/templates/data-test.md`

~~~~markdown
| No. | Item | Test content | Test Data | Remarks |
|---|---|---|---|---|
| D01 | Blank | Bỏ trống field bắt buộc | (trống) | |
| D02 | White space | Space đầu/cuối phải được trim | "  abc  " | |
| D03 | Hiragana | | ひらがな | |
| D04 | Katakana full-width | | カタカナ | |
| D05 | Katakana half-width | | ｶﾀｶﾅ | |
| D06 | Kanji | | 漢字 | |
| D07 | Romaji full-width | | Ｍａｎｇａ | |
| D08 | Số full-width | | ０１２３ | |
| D09 | JP sign | | ，．。「」（）【】・ | |
| D10 | Emoji / symbol number | | 🙇‍♀️ ① ② | |
| D11 | SQL injection | Không trả về DB | SELECT * FROM Users WHERE UserId=105 OR 1=1; | |
| D12 | Max length | max / max+1 | 255 / 256 ký tự | 1 break line = 1 char |
| D13 | Date | Năm nhuận / không nhuận / sai format | 2020/02/29 · 2022/02/29 · 2022-20-20 | |
| D14 | int32 | min / max | -2147483648 / 2147483647 | |
~~~~

#### `qc/templates/gap-report.md`

~~~~markdown
# Gap Report — <scope-key>
<!-- State: DRAFT | LOCKED | DONE · Spec: <P>/spec/<scope-key>.md (revision …) · Ngày: YYYY-MM-DD · Người duyệt: … -->

## 1. Scope
| Mục | Giá trị |
|---|---|
| Ticket / CR | |
| Sheet prefix / Code | <PREFIX> / <CODE> |
| Role trong scope | |
| Site / OS | |
| Release phase | |
| Ticket cha / con | |
| Ngoài scope | |

## 2. Test item
| # | Test item (chức năng / input / trigger / kết quả quan sát được) | Nguồn (file#mục) |
|---|---|---|

## 3. Findings
| ID | Test item | Loại (Thiếu / Mơ hồ / Mâu thuẫn / Không kiểm chứng được / Lặp bug cũ) | Mô tả | Nguồn thắng (theo sources.md) | OQ |
|---|---|---|---|---|---|
| FND-<CODE>-001 | | | | | OQ-<CODE>-001 |

## 4. Open Questions (đã ghi vào <P>/qc/open-questions.md)
| ID | Câu hỏi | Ảnh hưởng | Status |
|---|---|---|---|

## 5. Design Gate
**READY | PARTIAL | STOP** — lý do. PARTIAL: liệt kê phần bị chặn và phần được thiết kế trước.

## 6. Context pack
<!-- Ngày: YYYY-MM-DD · qc/lessons/INDEX.md revision: <git short hash> -->
| Loại (Thuật ngữ / Màn hình / Permission / VP-TC cũ / Lesson / Bug / Scope) | Nguồn (file#mục hoặc ID) | Nội dung rút gọn (≤ 1 câu) |
|---|---|---|

## 7. Cập nhật knowledge (khi DONE)
<!-- DONE = Gap Report LOCKED + không còn OQ OPEN + người dùng xác nhận. Chưa DONE thì để trống. -->
| File | Thay đổi | Từ (spec#mục / OQ ID) |
|---|---|---|
~~~~

#### `qc/templates/spec.md`

~~~~markdown
# <Tên chức năng>
- Nguồn: Backlog <mã ticket> — <url>
- Trạng thái: Approved · Revision: 1 · Người duyệt: <tên> · Ngày: <YYYY-MM-DD>
## Mô tả / Yêu cầu
## Acceptance criteria
## Màn hình ảnh hưởng
## Rule nghiệp vụ, giới hạn, thông báo lỗi
## Ghi chú từ dev / PM
~~~~

#### `qc/templates/testcase.md`

~~~~markdown
# Test case — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Viewpoint: projects/<project>/qc/test-viewpoints/<scope-key>-viewpoints.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| WB2-TC-001 | WB2-02 | System | Create estimation | Submit estimation | Trouble status is '到着' | 1. Login as Worker<br>2. Open trouble detail<br>3. Tap '提出' | Estimation status changes to '承認待ち' | Worker | iOS, Android | High | | UI-AUTO |

| Cột | Quy ước |
|---|---|
| TC ID | `<PREFIX>-TC-NNN` (CR: `TC-CR<n>-NNN`, enhancement: `EH-<ticket>-TC-NNN` — theo projects/<p>/README.md) |
| Viewpoint ID | ID trong file viewpoint. TC bổ sung từ nguồn khác không map được → ĐỂ TRỐNG, không đặt ID giả |
| Steps | Đánh số `1. … 2. …`, bước 1 thường là `Login as <Role>` |
| Expected Results | 1 kết quả / TC, viết tiếng Anh, label/message tiếng Nhật giữ nguyên trong '' |
| Role / OS | Role áp dụng · Web / iOS / Android (nhiều giá trị cách nhau dấu phẩy) |
| Priority | High (luồng chính, UAT) · Medium (negative / validation chính) · Low (UI, hiếm gặp) |
| Status | Để trống khi thiết kế. Khi chạy (Excel): Passed / Failed / Fixed / Pending / N/A; `-` = role/platform không áp dụng |
| Automation Eligibility | Cột thêm cho automation, không có trong Excel gốc |
~~~~

#### `qc/templates/viewpoint.md`

~~~~markdown
# Test Viewpoint — <Sheet / Function>
- Project: <project> · Scope Key: <scope-key> · Sheet prefix: <PREFIX>
- Source: projects/<project>/spec/<scope-key>.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| ID | Screen | Test Level/Test Type | Function | Test Viewpoint | Expected Result | Role | Site | Note |
|---|---|---|---|---|---|---|---|---|
| WB2-01 | Create estimation | System / Function | 見積名 input | Verify that '見積名' is validated in case of invalid input | Invalid input shows the error message defined in spec and the estimation is not saved | Worker | APP | Axis: data — D01–D14 (data-test.md) · BD-APP §Create |
| WB2-02 | Create estimation | System / Function | Submit estimation | Verify that the submit button works correctly by trouble status | Submit is enabled only at status allowed by spec; other statuses disable it | Worker | APP | Axis: status — 受注 / 移動中 / 到着 · BD-CMS §State change |

<!-- Test Level/Test Type: System / UAT / Regression × Function / UI / Validation / Transition / Data / API / Security / Performance -->
<!-- ID: <PREFIX>-NN. Viết tiếng Anh, label tiếng Nhật giữ nguyên trong ''. Note bắt buộc ghi "Axis: …" + nguồn. -->
~~~~

### Bài học đã nâng thành rule

#### `qc/lessons/INDEX.md`

~~~~markdown
# Rule đã học — thiết kế test (AI đọc ở bước 3 của luồng thiết kế)

## Thiết kế test (viewpoint / test case bị sót)
- D01 Mọi nút submit / save: có case double-click, Enter nhiều lần khi đang loading → không tạo trùng.
- D02 Field số tiền / số lượng: có boundary MIN, MAX, 0, số âm — không chỉ giá trị thường.
- D03 Upload / chat / text dài: có case vượt giới hạn (số ký tự, số ảnh, dung lượng) phải báo lỗi.
- D04 Hai bên thao tác cùng lúc (worker submit vs store complete…): có case race condition.
- D05 Đổi trạng thái: kiểm status cũ được clear, status mới đúng, kể cả luồng tiếp tục / làm lại.
- D06 Nút theo role: tra permission matrix trong basic design, không suy từ UI giống nhau; test từng role.
- D07 Trạng thái UI phải giữ / đóng đúng: pagination khi Back, dialog sau khi lưu, read/unread, badge.
- D08 Dữ liệu đúng ngữ cảnh: không mở / tạo cho cửa hàng, trouble, user khác.
- D09 Happy path của push/notification/tích hợp ngoài → luôn thêm case gửi lỗi, nghiệp vụ không bị rollback sai.
- D10 Cùng loại impact thì assertion phải đồng nhất giữa các nhóm TC; nâng cấp nhiều bước → test permission ở từng bước trung gian.
- D11 Trước khi đưa ticket vào scope: check role scope của ticket, release phase, ticket cha/con.
- D12 Check duplicate theo nội dung (không chỉ theo ID) và trace 2 chiều VP ↔ TC (không VP rỗng, không TC trỏ VP không tồn tại).
- D14 Nhập TC E2E từ file ngoài (CSV viết tay…): đối chiếu từng bước với catalog / màn hình thật, bổ sung bước bắt buộc bị bỏ. (design/2026-10-12-e2e-missing-ui-step.md)
- D13 Kiểm đúng layer: rule bảo mật / middleware gắn ở route nào thì test đúng route đó + case negative.

## Excel / công cụ
- T01 Tên tab Google Sheets > 31 ký tự bị đổi tên khi export xlsx → công thức INDIRECT theo tên mới.
- T02 FILTER / MAP / LAMBDA không chạy trong LibreOffice / openpyxl → #REF!/#NAME? có sẵn, không phải do mình sửa.
- T03 Header không cố định hàng → dò literal header (vd "TC ID"), không hard-code row.
- T04 Merged cells → bỏ merge vùng định ghi trước khi ghi bằng openpyxl.
- T05 Text bắt đầu bằng "=" hoặc "=+" bị hiểu là công thức → ghi dạng text.
- T06 "Total TCs" ở đầu sheet = số ô kết quả (TC × role/platform), không phải số TC.
- T07 Deliverable cho người review: xuất file mới, không sửa file gốc.
~~~~

#### `automation/lessons/INDEX.md`

~~~~markdown
# Rule đã học — automation (AI đọc trước khi viết / sửa code test)

## Web
- R01 Màn hình chưa chạy qua lần nào: lấy cây phần tử thật (error-context.md / aria snapshot / codegen) rồi mới viết locator; không viết chỉ dựa vào CSV hay catalog. Wizard / màn theo role hay có bước ẩn. (web/2026-10-12-cms-create-wizard-step0.md)
- R02 Hook chụp màn hình / snapshot luôn có timeout ≤ 10s và .catch(); context tự tạo (serial E2E) thì tự đính kèm ảnh + aria snapshot. (web/2026-10-12-afterEach-screenshot-hang.md)
- R03 Màn có dữ liệu tải sau (chi tiết trouble…): chờ 1 ô dữ liệu chính có giá trị (vd 番号 có số) trước khi kiểm / bấm; URL đúng hay networkidle chưa đủ. (web/2026-10-12-cms-detail-async-load.md)
- R04 Kiểm "nhãn = giá trị" bằng ô ngay sau nhãn (common/ui.ts valueOf), không kiểm cả dòng; tên nhãn lấy đúng như DOM (header CMS có ':', số trouble là '番号'). (web/2026-10-12-cms-label-layouts.md)
- R05 List / bảng / badge trạng thái tải sau: lúc đầu có thể hiện '0件' hoặc trạng thái cũ → chờ dấu hiệu đã tải ('全 N 件中', badge đúng giá trị, timeout ~15s) rồi mới kết luận. (web/2026-10-12-cms-list-zero-before-load.md)
- R06 Nhãn trong th có thêm badge (必須/任意) hoặc bọc span: khớp nhãn ở text node con, không so cả th. (web/2026-10-12-cms-th-span-badge-label.md)
- R07 Giá trị dropdown native kiểm bằng option:checked, không kiểm text dòng. (web/2026-10-12-cms-select-option-checked.md)
- R08 Nút × của modal có aria-label '閉じる' → không tìm nút 閉じる bằng role+name; dùng text hiển thị trong vùng cụ thể, × thì closeModal(). (web/2026-10-12-cms-close-button-name.md)
- R09 Modal lồng nhau: lọc modal bằng chữ / phần tử chỉ modal đó có (vd '施工業者', input[name=title]), không lọc bằng chữ tiêu đề. (web/2026-10-12-cms-modal-unique-text.md)
- R10 Nút bật/tắt (メニュー展開, accordion): kiểm trạng thái đang mở chưa rồi mới bấm, sau đó expect trạng thái. (web/2026-10-12-cms-toggle-expand.md)
- R11 Danh sách / lưới thẻ có ảnh: chờ ảnh tải xong, click bằng dispatchEvent (không theo toạ độ), rồi KIỂM giá trị đã chọn; sai thì chọn lại. (web/2026-10-12-cms-click-layout-shift.md)
- R12 Log có "intercepts pointer events" (popover/chat/overlay đè nút): dùng dispatchEvent('click') + kiểm trạng thái sau đó; không dùng force:true. (web/2026-10-12-cms-chat-overlay-intercepts.md)
- R13 Kịch bản serial dùng chung context: tắt trace/video tự động trong config, tự ghi trace theo chunk từng TC; mọi lệnh trong hook có giới hạn thời gian. (web/2026-10-12-e2e-shared-context-trace-hang.md)
- R14 Dữ liệu tạo ra cho TC sau (依頼番号, id…) phải ghi lại NGAY sau khi tạo, trước mọi thao tác phụ. (web/2026-10-12-e2e-record-key-data-first.md)
- R15 Hộp con / modal lồng nhau đóng chỉ bỏ class show (vẫn ở DOM): kiểm "đã đóng" bằng đúng phần tử vừa thao tác (elementHandle) hoặc loại modal cha bằng chữ chỉ cha có; không tìm lại bằng locator .last() lọc theo chữ. (web/2026-10-12-cms-nested-modal-hidden-keep-dom.md)
- R16 Upload file (S3) chạy bất đồng bộ sau 完了, app bỏ qua upload tiếp theo: chờ response upload (PUT S3) OK rồi mới thao tác tiếp; không dùng waitForTimeout. (web/2026-10-12-cms-s3-upload-async.md)
- R17 Hộp kết quả sau thao tác lưu (OK / 完了) hiện khi server xong: chờ với timeout dài (~30s), không dùng timeout mặc định 5s, không dùng waitForTimeout. (web/2026-10-12-cms-save-ok-dialog-slow.md)

## Mobile
<!-- M01 <rule> (mobile/<file>.md) -->
~~~~

### Quyết định

#### `manager/decisions.md`

~~~~markdown
# Decisions — mới nhất ở trên
<!-- Mỗi quyết định 1 dòng. Chỉ người đọc khi cần biết "vì sao"; AI không đọc file này khi làm task thường. -->

| ID | Ngày | Quyết định | Lý do | File ảnh hưởng |
|---|---|---|---|---|
| D22 | 2026-10-12 | Đăng nhập test dùng chung common/session.ts: tài khoản 'role[:variant]', phiên lưu .auth/<ENV>/ (dùng lại 8h), tự logout khi đổi tài khoản | Mỗi spec tự viết login, phiên dev/est-test đè nhau, chưa hỗ trợ 9 store | common/session.ts, common/roles.ts, CLAUDE.md |
| D21 | 2026-10-12 | Mỗi lỗi khi chạy code test do AI sinh → sửa screens/ (locator) + ghi lesson automation (rule vào automation/lessons/INDEX.md) sau khi người dùng duyệt; lỗi do TC → lesson QC. AI đọc INDEX trước khi sinh code | Lỗi đã gặp không lặp lại khi sinh code mới | CLAUDE.md, automation/lessons/, qc/lessons/ |
| D20 | 2026-10-09 | Dựng khung Playwright CMS ở projects/qnavi/automation/web: env/ + .env (tài khoản theo role), data/, common/ (login 1 lần / role, forRoles), screens/<app>/*.screen.ts là knowledge locator (ghi mã màn hình, không chép mô tả), tests/<app>/<scope-key>.spec.ts, reports/<run>/ (html, json, junit, artifacts). 1 TC × 1 role = 1 test. Catalog màn hình 5 app lưu ở projects/qnavi/screens/catalog/ dùng chung QC + automation. Native app (repair, shop) và web nhúng làm sau | Khớp cột kết quả theo role; locator 1 chỗ; report theo lần chạy | projects/qnavi/automation/, kb-update-automation, automation/templates/screen.md, CLAUDE.md |
| D19 | 2026-10-09 | Automation là luồng riêng Spec → Test case → Automation: chỉ dựa vào TC LOCKED (UI-AUTO/BOTH); knowledge automation (automation/, <P>/automation/screens, README) do skill kb-update-automation quản lý, tách khỏi kb-update (QC). PRODUCT_BUG / TC sai thì bàn giao sang QC | TC đã chứa đủ thông tin; tách 2 vòng knowledge cho gọn, ít token | CLAUDE.md, kb-update, kb-update-automation, projects/<p>/automation/ |
| D18 | 2026-10-09 | test-viewpoint và test-case đọc thêm knowledge + bài học (lessons INDEX, bug-history, screens, glossary, VP/TC LOCKED cũ) — chỉ phần cùng function / màn hình; Context pack vẫn đọc trước. test-viewpoint yêu cầu Gap Report LOCKED. Sửa một phần D08 | Context pack tóm tắt có thể thiếu chi tiết (permission, label, bug cũ) → VP/TC kém | test-viewpoint, test-case, CLAUDE.md |
| D17 | 2026-10-09 | Gap Report có 3 trạng thái DRAFT → LOCKED → DONE. DONE khi Gap Report LOCKED + không còn OQ OPEN + người dùng xác nhận; khi DONE gọi kb-update ghi knowledge đã chắc chắn vào projects/<p>/ (glossary, screens, README, sources), OQ → RESOLVED | Knowledge dự án lớn dần theo ticket, chỉ ghi điều đã được trả lời nên không sai | spec-review, gap-report.md, kb-update, open-questions.md, CLAUDE.md |
| D16 | 2026-10-09 | Giữ draft → duyệt → LOCKED ở mọi bước (Gap Report, VP, TC) là process; giữ quy ước 1 lần làm = 1 sheet / scope (đổi sau khi cần); không thêm bước Coverage / Execution Summary. Thêm template qc/templates/gap-report.md | Rà workflow 10 điểm; người dùng chốt | CLAUDE.md, spec-review, qc/templates/gap-report.md |
| D15 | 2026-10-09 | Skill export-excel: chỉ chạy khi người dùng đồng ý (test-case hỏi 1 câu sau LOCKED); xuất file mới reports/<scope-key>-<ngày>.xlsx; sheet Viewpoint + sheet TC 12 cột (không có Automation Eligibility) + cột kết quả theo role/platform | Team / khách dùng Excel; không sửa workbook gốc (T07) | export-excel, test-case, handbook 4.4 |
| D14 | 2026-10-09 | Skill repo ưu tiên: trong repo không dùng skill tài khoản qa-testcase-writing (format cũ) trừ khi gọi đúng tên. Thêm skill source-import: xlsx/pdf/docx ở <P>/raw/ → md ở <P>/spec/, đối chiếu số dòng, báo phần bị mất | Spec sẽ có thêm file Excel; tránh 2 skill cùng kích hoạt cho "viết testcase" | CLAUDE.md, source-import, spec-review |
| D13 | 2026-10-09 | Luật QC trong CLAUDE.md chỉ áp dụng cho task QC; câu hỏi ngoài luồng / sửa repo làm bình thường; câu hỏi về dự án tự tra trong <P>/ rồi trả lời kèm nguồn | Claude trong VS Code trả "không biết" số role do luật quá chặt | CLAUDE.md |
| D12 | 2026-10-09 | Chia repo theo vai trò: manager/ (quản lý knowledge) · qc/ (thiết kế test, chung) · automation/ (automation, chung) · projects/<p>/ (knowledge + output + code automation của dự án). Skill giữ tên cũ trong .claude/skills/. Narrative đổi tên handbook.md (macOS không phân biệt guide.md / GUIDE.md) | Dễ biết file nào thuộc nhóm nào; code automation đi theo dự án | toàn repo, manager/README.md |
| D11 | 2026-10-09 | Knowledge riêng dự án để ở projects/<project>/ (README, sources, glossary, bug-history, screens, spec, raw, qc); phần chung ở gốc. CLAUDE.md khai báo dự án đang làm (<P>) | Repo dùng chung nhiều dự án; import knowledge Qnavi không làm bẩn phần chung | CLAUDE.md, 3 skill thiết kế, kb-update, projects/qnavi/ |
| D10 | 2026-10-09 | Template theo format workbook Qnavi thực tế: VP 9 cột (ID, Screen, Test Level/Test Type, Function, Test Viewpoint, Expected Result, Role, Site, Note), TC 12 cột (TC ID … Priority, Status) + Automation Eligibility; viết tiếng Anh; Priority High/Medium/Low; Viewpoint ID để trống nếu không map; đối chiếu 3 nguồn; nguồn authoritative theo sources.md. Thay D04 | Export knowledge Qnavi cho thấy template cũ (từ skill qa-testcase-writing) khác workbook đang dùng | templates/, test-viewpoint, test-case, spec-review, CLAUDE.md, lessons/INDEX.md |
| D09 | 2026-10-09 | Viewpoint = 1 đối tượng × 1 khía cạnh + 1 trục biến thiên; giá trị trên trục là test case. Note ghi "Trục"; VP dự kiến < 3 TC thì gộp | Lần chạy QNAVI-1614 ra viewpoint case-by-case: skill cũ bắt "mỗi viewpoint 1 dòng" theo mẫu câu có điều kiện cụ thể, không có luật về độ thô | test-viewpoint/SKILL.md, viewpoint-groups.md, templates/viewpoint.md, test-case/SKILL.md |
| D08 | 2026-10-09 | Luồng thiết kế: đọc spec → đọc knowledge → đọc bài học → Q&A → viewpoint → test case. spec-review ghi "Context pack" để bước sau không đọc lại toàn bộ | Đúng thứ tự tư duy QA, giảm token | spec-review, test-viewpoint, test-case, CLAUDE.md |
| D07 | 2026-10-09 | Repo là nguồn knowledge duy nhất; sửa qua skill kb-update; GUIDE.md tự sinh; decisions gộp 1 file | Tránh 3 bản sao lệch nhau, giảm token | kb-update, build_guide.py, GUIDE.md, CHANGELOG.md, docs/decisions.md |
| D06 | 2026-10-09 | Thêm nhóm viewpoint 7 Performance (chỉ đặt ngưỡng khi spec có số) và 8 Bài học / bug cũ; lesson DESIGN_GAP | 6 nhóm cũ thiếu performance; bug lọt lưới không được dùng lại | viewpoint-groups.md, lesson.md, lessons/INDEX.md, docs/bug-history.md |
| D05 | 2026-10-09 | Mỗi TC chỉ 1 expected result; nhiều thứ cần kiểm → tách TC cùng VP_ID | Dễ biết chỗ fail, 1 test() = 1 assert chính | test-case/SKILL.md |
| D04 | 2026-10-09 | (Thay bởi D10) Template giữ đúng cột file Excel của team; No. = TC-<FUNC>-NNN; thêm cột Automation Eligibility | Export Excel không phải đổi cột | templates/viewpoint.md, testcase.md, data-test.md |
| D03 | 2026-10-09 | Tự viết skill dùng chung, chỉ mượn ý tưởng (SKILL.md + references, OQ, Design Gate, LOCKED, BLOCKED_INPUT) | Package ngoài không hợp dự án khác | .claude/skills/*, CLAUDE.md |
| D02 | 2026-10-09 | Viewpoint/test case phải chạy được trước automation | Chưa có TC thì không có gì để automate | guide, test-viewpoint, test-case |
| D01 | 2026-10-09 | 5 giai đoạn có cổng: kiến trúc → thiết kế → chạy thử → cài đầy đủ → vận hành | Lỗi khoanh trong từng khối | guide |
~~~~

## Phụ lục B — Thay đổi gần đây

# Changelog

## [Unreleased]
### Thêm
- [auto] Report QC (common/qc-reporter.ts): SUMMARY.md, passed/, failed/<TC ID>_<tên>_<dd-mm-yyyy>/FAIL.md (mỗi trường 1 dòng + ảnh, trace), skipped/, reports/HISTORY.md
- [auto] Ghi chú ENV est-test: E2E chập chờn ở modal 故障内容 / 作業者 (spinner treo, dialog 表示に時間がかかっております), nguyên nhân chưa xác định — sửa ghi chú sai trước đó (get_qa_category vẫn phản hồi)
- [auto] Lesson automation R17 (hộp OK sau lưu chờ ~30s) từ E2E-TC-002 trên est-test; acknowledgeOk chờ 30s
- [auto] npm run open: mở trình duyệt đã qua Basic Auth + đăng nhập ACCOUNT để xem / lấy locator
- [auto] Đăng nhập dùng chung common/session.ts: loginAs(page, 'role[:variant]'), logout, forAccounts; phiên .auth/<ENV>/ dùng lại 8h (D22)
- [auto] Môi trường est-test (CMS Qnavi Estimation, cms-test.estimation…) có Basic Auth: env/est-test.json › httpAuth + .env HTTP_AUTH_PASSWORD; Playwright dùng httpCredentials
- [auto] Tài khoản SubAdmin (98: linksyssubadmin); xác nhận role 02 = store, 05 = worker company; tên store 00006–00009
- [auto] Tài khoản store (role 02, 9 loại: toridoll, qnavi, urgent, ringi, autoApprove, approveType1-3, ringi0_99) và worker company (05) trong env/dev.json › accounts; chọn bằng credentials('02', '<variant>')
- [auto] Tài khoản test theo role đưa vào env/<ENV>.json › accounts (loginId, tên hiển thị); mật khẩu vẫn chỉ ở .env
- [auto] E2E trouble flow (13 TC) pass 13/13 trên CMS dev; locator TC-002→013 xác minh bằng browser thật
- [auto] Lesson automation R05–R14 (list tải chậm, nhãn th/badge, option:checked, nút 閉じる trùng tên, modal lồng nhau, toggle, click lệch do ảnh, overlay chặn click, trace theo chunk, ghi dữ liệu then chốt trước)
- [auto] Lesson automation R15 (modal lồng nhau đóng vẫn ở DOM), R16 (chờ upload S3 xong) từ E2E-TC-009
- Lesson automation R03 (chờ dữ liệu tải), R04 (nhãn = giá trị theo ô) từ recon CMS
- Lesson automation R01, R02; lesson QC D14; luật: sửa xong lỗi test → đề xuất lesson (D21)
- Khung Playwright CMS projects/qnavi/automation/web (README cách chạy, env, data, common, screens, report theo lần chạy); catalog màn hình 5 app ở projects/qnavi/screens/catalog/ (D20)
- Skill kb-update-automation; projects/qnavi/automation/README.md + screens/ (D19)
- spec-review: trạng thái [Done] → cập nhật knowledge dự án qua kb-update; Gap Report mục 7 (D17)
- Skill source-import (xlsx/pdf → md) (D14), skill export-excel (chỉ khi được đồng ý) (D15)
- Template qc/templates/gap-report.md; qc/README.md, automation/README.md (D16)
- Bản đồ repo manager/README.md
- Import knowledge Qnavi: projects/qnavi/ (README, sources, glossary 50 thuật ngữ, screens/_flow, bug-history 22 dòng) (D11)
- lessons/INDEX.md: 13 rule Thiết kế test (D01–D13) + 7 rule Excel/công cụ (T01–T07)
### Sửa
- test-viewpoint, test-case đọc thêm knowledge + bài học theo function; test-viewpoint đòi Gap Report LOCKED (D18)
- CLAUDE.md: luật QC chỉ áp dụng cho task QC, tra cứu dự án tự tìm trong <P>/ (D13); không dùng qa-testcase-writing trong repo; mọi bước draft → duyệt → LOCKED (D14, D16)
- handbook.md viết lại theo cấu trúc mới (luồng 6 bước + import + export); bug-history ghi nghĩa cột "Có TC bắt được"
- Tổ chức lại thư mục: manager/ · qc/ · automation/ · projects/<p>/ (D12)
- Template + skill theo format workbook Qnavi, TC tiếng Anh, Priority 3 mức, đối chiếu 3 nguồn, không đặt VP ID giả (D10)
- test-viewpoint: viewpoint có trục biến thiên, 1 VP → nhiều TC; gộp VP case-by-case (D09)
- Luồng thiết kế 6 bước + Context pack; gộp decisions thành 1 file docs/decisions.md (D08, D07)

## [0.1.0] - 2026-10-09
### Thêm
- Kiến trúc 5 giai đoạn có cổng (D01, D02)
- 3 skill thiết kế dùng chung: spec-review, test-viewpoint, test-case (D03)
- 6 template theo format Excel của team (D04)
- Luật mỗi TC 1 expected result (D05)
- Nhóm viewpoint 7 Performance, 8 Bài học / bug cũ; lesson DESIGN_GAP (D06)
- Knowledge hub: skill kb-update, build_guide.py, decisions, pre-commit hook (D07)
