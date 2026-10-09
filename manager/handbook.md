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
| spec-review | Luôn chạy trước | Gap Report theo qc/templates/gap-report.md: Scope, Test item, FND, OQ, Design Gate, Context pack |
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
