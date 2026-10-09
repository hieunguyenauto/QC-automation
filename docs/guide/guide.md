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

**Kiểm tra flow** — output của bước trước là input của bước sau:

| Bước | Input (phải có sẵn) | Output | Ở GĐ |
| --- | --- | --- | --- |
| Review spec (nên làm) | docs/spec/fs-user-list.md (đã duyệt) | qc/gap-reports/fs-user-list-gap-report.md, qc/open-questions.md | 1 |
| Thiết kế viewpoint | Spec + Gap Report | qc/test-viewpoints/fs-user-list-viewpoints.md (LOCKED) | 1 |
| Thiết kế test case | Viewpoint LOCKED | qc/test-cases/fs-user-list-test-cases.md (LOCKED, có Automation Eligibility) | 1 |
| Chạy thử automation | TC UI-AUTO | web/tests/spike/, mobile/test/specs/ | 2 |
| Automate thật | TC UI-AUTO/BOTH + Page Object + .env | web/tests/fs-user-list.spec.ts | 3 |
| Triage | Test fail + trace | Fix + lessons/ | 3–4 |
| Report | qc/test-cases + test-results/results.json | reports/ | 4 |

## Giai đoạn 0 — Kiến trúc

Dựng khung repo và luật cho AI, chưa có code. Chỉ cần Homebrew, Git, VS Code.

### 0.1 Hiểu kiến trúc

AI đọc tài liệu → sinh viewpoint, test case → sinh code Playwright/Appium. Code chạy hằng ngày không tốn token; AI chỉ được gọi lại khi test fail, mỗi lần fail để lại 1 lesson.

| Lớp | Thư mục | Vai trò | Có từ GĐ |
| --- | --- | --- | --- |
| Knowledge | docs/, screens/, lessons/ | AI đọc để hiểu sản phẩm, màn hình, lỗi đã gặp | 0 |
| Rules | CLAUDE.md, templates/ | Luật chung + mẫu file | 0 |
| Skills thiết kế | .claude/skills/spec-review, test-viewpoint, test-case | Gap → viewpoint → test case, có Lock và traceability | 1 |
| Output (người đọc) | qc/ | Gap report, Open Questions, viewpoint, test case | 1 |
| Output (máy chạy) | web/, mobile/ | Code test | 2 (spike), 3 (thật) |
| Skills automation | .claude/skills/tc-to-\*, failure-triage, screen-explorer | Sinh và sửa code test | 3 |
| Vận hành | scripts/, reports/ | Chạy đêm, report | 4 |

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
# Đã có repo remote thì thay 2 dòng trên bằng:
# cd ~/work && git clone https://github.com/<org>/qc-automation.git && cd qc-automation
mkdir -p docs/{spec,raw} qc/{gap-reports,test-viewpoints,test-cases}
mkdir -p screens/{web,mobile} lessons/{web,mobile,design} templates scripts reports
mkdir -p web mobile .vscode
touch CLAUDE.md docs/glossary.md qc/open-questions.md lessons/INDEX.md screens/web/_flow.md screens/mobile/_flow.md
pwd   # phải in ra .../work/qc-automation
```

Chữ trong `< >` là placeholder: thay bằng giá trị thật và bỏ dấu `< >`. Zsh hiểu `<` là chuyển hướng file nên lệnh sẽ lỗi. Mở repo trong VS Code: **File → Open Folder → \~/work/qc-automation** (hoặc `code .` khi lệnh `code` đã có).

Chưa tạo `.claude/skills/` — để GĐ1. Nếu đã lỡ tạo `viewpoints/`, `testcases/`, `docs/tickets/` theo bản cũ thì xóa: `rmdir viewpoints testcases docs/tickets`.

```text
qc-automation/
├── CLAUDE.md          # Luật chung cho AI (0.4)
├── .claude/skills/    # skill thiết kế (GĐ1) + skill automation (GĐ3)
├── docs/              # INPUT: spec đã duyệt, raw, glossary
├── qc/                # OUTPUT thiết kế
│   ├── open-questions.md
│   ├── gap-reports/
│   ├── test-viewpoints/
│   └── test-cases/
├── templates/         # Mẫu file (0.5)
├── screens/web|mobile/
├── lessons/           # + INDEX.md
├── web/               # rỗng — GĐ2 khối A điền
├── mobile/            # rỗng — GĐ2 khối B điền
├── scripts/  reports/
└── .vscode/
```

**.gitignore** (gốc repo):

```text
node_modules/
.env
.env.*
!.env.example
test-results/
playwright-report/
reports/
.auth/
.claude/settings.local.json
docs/**/raw/*.pdf
web/tests/spike/
```

docs/raw có thể chứa tài liệu mật của khách → hỏi PM trước khi commit; không được thì chỉ commit bản .md.

**.vscode/settings.json** — `files.encoding: utf8` bắt buộc vì tài liệu có tiếng Nhật:

Không cần gõ tay: copy nguyên đoạn dưới, dán vào terminal (đang đứng ở `~/work/qc-automation`), Enter. Lệnh tạo file và ghi nội dung luôn.

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
cat .vscode/settings.json   # kiểm tra
```

Cách khác: VS Code → Cmd+, → chọn tab **Workspace** → đổi 1 setting bất kỳ, VS Code tự tạo file này; hoặc sau khi cài Claude (GĐ1) thì nhờ Claude tạo.

### 0.4 CLAUDE.md — bản khung

Chỉ cần bối cảnh + luật sinh nội dung (đủ cho GĐ1). Luật code và lệnh chạy bổ sung ở GĐ3.

```markdown
# QC Automation — Luật cho AI

## Bối cảnh
- Sản phẩm thị trường Nhật. UI tiếng Nhật, team làm việc bằng tiếng Việt.
- Trả lời bằng tiếng Việt. Giữ nguyên text tiếng Nhật của UI trong locator và assert.

## Thứ tự đọc (bắt buộc)
1. lessons/INDEX.md
2. docs/spec/ — nguồn duy nhất để thiết kế viewpoint/test case
3. qc/test-viewpoints/ → qc/test-cases/ (bản LOCKED)
4. screens/<web|mobile>/_flow.md + file màn hình liên quan

## Luật QC chung
- Chỉ đọc spec mà người dùng đưa đường dẫn chính xác. Thiếu input → dừng, trả BLOCKED_INPUT và hỏi. Không tự đi tìm file.
- Không bịa requirement. Spec không rõ → ghi Open Question vào qc/open-questions.md.
- Draft trong chat trước, chờ duyệt nội dung + đường dẫn rồi mới ghi file. Im lặng không phải là duyệt.
- Không sửa file State = LOCKED. Cần đổi → tăng Revision, duyệt lại.
- ID: OQ-<CODE>-NNN, VP-<CODE>-NNN, TC-<CODE>-NNN. CODE = scope-code 2–12 ký tự in hoa.
```

### 0.5 Template

Lưu 6 file vào `templates/`. Viewpoint, test case, data test lấy đúng format file Excel test case của team Qnavi (sheet Test Viewpoint, Data test, Testcase): giữ nguyên tên cột và thứ tự cột để export sang Excel không phải đổi.

**templates/spec.md** — chuyển ticket Backlog thành spec, lưu vào `docs/spec/<scope-key>.md`. Skill chỉ đọc spec có ghi trạng thái phê duyệt.

```markdown
# <Tên chức năng>
- Nguồn: Backlog <mã ticket> — <url>
- Trạng thái: Approved · Revision: 1 · Người duyệt: <tên> · Ngày: <YYYY-MM-DD>
## Mô tả / Yêu cầu
## Acceptance criteria
## Màn hình ảnh hưởng
## Rule nghiệp vụ, giới hạn, thông báo lỗi
## Ghi chú từ dev / PM
```

**templates/viewpoint.md** — sheet Test Viewpoint, 8 cột:

```markdown
# Test Viewpoint — <Function>
- Scope Key: <scope-key> · Function code: <FUNC>
- Source: docs/spec/<scope-key>.md (rev N)
- State: DRAFT · Revision: 1 · Approved by / at:

| VP_ID | Category | Test Level | Function | View Point | Expected Results | Site | Note |
|---|---|---|---|---|---|---|---|
| VP-USRL-001 | Function | System | ユーザー一覧 | Verify that matching users are displayed in case ユーザーID exists | Hiển thị đúng các dòng khớp điều kiện | Common | spec §2.1 |

<!-- Category: UI / Function / Validation / Transition / Data / API / Security / Performance -->
<!-- Test Level: Unit / Integration / System / UAT / Regression -->
<!-- Site: theo sản phẩm, ví dụ Admin / User site / BE / Common -->
```

**templates/testcase.md** — sheet Testcase (mỗi function 1 file):

```markdown
# Testcase — <Function>
- Scope Key: <scope-key> · Function code: <FUNC>
- Viewpoint: qc/test-viewpoints/<scope-key>-viewpoints.md (rev N)
- Date: · P.I.C: · Screen URL:
- State: DRAFT · Revision: 1 · Approved by / at:

| No. | VP_ID | Priority | Category / Test items | Sub Category | Objective | Pre-condition | Data test | Test Steps | Expectation result | Automation Eligibility | Remarks |
|---|---|---|---|---|---|---|---|---|---|---|---|
| TC-USRL-001 | VP-USRL-001 | High | Search | ユーザーID | Verify that 1 row is displayed in case ユーザーID exists | Đã login admin | ユーザーID=U0001 | 1. Mở ユーザー一覧<br>2. Nhập ユーザーID<br>3. Bấm 検索 | Hiển thị 1 dòng U0001 | UI-AUTO | |
```

| Cột | Quy ước |
| --- | --- |
| No. | Ghi đầy đủ `TC-<FUNC>-NNN` — automation dùng làm tag `@TC-USRL-001` |
| Priority | `High` (happy case cho UAT/regression) / `Normal` |
| Objective | "Verify that + \<expectation> + in case/when + \<condition>" |
| Pre-condition | Không có thì ghi `-` |
| Data test | Data cụ thể hoặc trỏ No. trong templates/data-test.md |
| Automation Eligibility | Cột thêm cho automation, không có trong Excel gốc |
| Implementation 1st / 2nd (Result, Date confirmed, PIC, Link bugs) | Chỉ có trong file Excel khi chạy test, không ghi vào file .md |

**templates/data-test.md** — sheet Data test, bổ sung đủ theo sheet gốc của team:

```markdown
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
```

**templates/screen.md**

```markdown
# ユーザー一覧 (user-list)
- Route: /users
- Page Object: web/pages/UserListPage.ts
- Đi tới: login → dashboard → menu ユーザー管理
- Quyền: admin, staff (staff không thấy 削除)

| Element | Ý nghĩa | Dẫn tới |
|---|---|---|
| createBtn | 新規作成 | user-create |

## Lưu ý
- Table load async → chờ API /users trước khi assert
```

**templates/lesson.md**

```markdown
# <YYYY-MM-DD> <tóm tắt>
- Loại: DESIGN_GAP | LOCATOR | TIMING | DATA | ENV | PRODUCT_BUG
- Nguồn: bug <ID/link> hoặc @TC-xxx — file: web/tests/...
- Function / màn hình:
- Triệu chứng:
- Nguyên nhân gốc:
- Cách fix:
- Rule rút ra:
- Áp dụng cho (function / loại field / pattern):
```

Copy 1 ticket thật thành `docs/spec/fs-user-list.md` theo template spec. Tên file chính là scope-key: chữ thường, nối bằng gạch ngang. Chọn ticket có acceptance criteria rõ và có ít nhất 1 thao tác đơn giản (login/search) để GĐ2 automate được.

**Cổng qua GĐ0:** repo đủ thư mục, có .gitignore, CLAUDE.md khung, 6 template, 1 spec mẫu. Commit: `[arch] skeleton repo`.

## Giai đoạn 1 — Viewpoint & Test case

Chưa đụng Playwright/Appium, chưa cần Node. Tự tạo 3 skill thiết kế dùng chung cho mọi dự án: **spec-review → test-viewpoint → test-case**. Mỗi bước: AI draft trong chat → anh duyệt → mới ghi file → Lock.

### 1.1 Cài Claude Code và đăng nhập

Có 2 cách dùng, cài cả hai: **CLI** để gõ `claude` trong Terminal, **extension** để chat trong panel của VS Code. Cả hai đều đọc cùng `CLAUDE.md` và `.claude/` của repo.

**A. CLI (Terminal)**

```bash
curl -fsSL https://claude.ai/install.sh | bash
claude --version
cd ~/work/qc-automation && claude
# Chọn đăng nhập bằng tài khoản Claude, xác nhận trên trình duyệt
```

**B. Extension trong VS Code**

Yêu cầu: VS Code 1.94.0 trở lên (xem ở **Code → About Visual Studio Code**) và tài khoản Claude trả phí (Pro/Max/Team/Enterprise).

1. Cmd+Shift+X để mở Extensions.
2. Tìm **Claude Code**, chọn đúng bản của publisher **Anthropic** (ID `anthropic.claude-code`) → **Install**.
3. **File → Open Folder → \~/work/qc-automation**. Claude làm việc trong thư mục đang mở, nên phải mở đúng repo.
4. Mở panel Claude bằng 1 trong 3 cách: icon **Spark** (✳) ở thanh Activity Bar bên trái · **✻ Claude Code** ở Status Bar góc dưới phải · icon Spark góc trên phải editor (chỉ hiện khi đang mở 1 file).
5. Lần đầu: bấm **Sign in** → xác nhận trên trình duyệt.
6. Gõ thử trong panel: *"Liệt kê các thư mục trong repo này"* → AI trả lời đúng cấu trúc ở 0.3.

Mẹo: bôi đen vài dòng trong file rồi bấm Option+K để chèn tham chiếu `@file#dòng` vào prompt. Chế độ quyền (Manual / Plan / Auto) đổi ở dưới ô nhập; giai đoạn đầu nên để **Manual** để xem trước từng thay đổi file.

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| Cài xong không thấy icon Spark | Extension chưa load | Cmd+Shift+P → **Developer: Reload Window** |
| Không cài được, báo không tương thích | VS Code cũ hơn 1.94.0 | **Code → Check for Updates** |
| Hiện *Not logged in · Please run /login* | Phiên đăng nhập hết hạn | Reload Window để mở lại màn hình Sign in |
| Panel chạy được nhưng gõ `claude` trong terminal báo không tìm thấy | Extension có CLI riêng cho panel, chưa cài CLI | Làm phần A, mở terminal mới |
| AI không thấy file của repo | Mở sai thư mục | File → Open Folder đúng `~/work/qc-automation` |

### 1.2 Kiểm tra AI đã đọc CLAUDE.md

Trong phiên claude gõ `/memory` → phải thấy CLAUDE.md của repo. Hỏi: *"Luật sinh nội dung của repo này là gì?"* → AI trả lời đúng các luật ở 0.4.

Trong panel VS Code: gõ `/` → mục **Customize → Instructions** → phải thấy `CLAUDE.md` của repo.

### 1.3 Tạo 3 skill thiết kế

Skill là file Markdown, không phụ thuộc dự án nào. Phần riêng của từng dự án nằm ở `docs/` và `docs/glossary.md`, không nằm trong skill.

```bash
mkdir -p .claude/skills/spec-review
mkdir -p .claude/skills/test-viewpoint/references
mkdir -p .claude/skills/test-case/references
```

```text
.claude/skills/
├── spec-review/SKILL.md                  # tìm gap, ghi Open Question, kết luận Design Gate
├── test-viewpoint/
│   ├── SKILL.md                          # sheet Test Viewpoint, Lock
│   └── references/viewpoint-groups.md    # 8 nhóm viewpoint
└── test-case/
    ├── SKILL.md                          # sheet Testcase từ viewpoint LOCKED
    └── references/
        ├── test-design-techniques.md     # EP, BVA, Decision Table…
        └── automation-eligibility.md     # UI-AUTO / API-AUTO / BOTH / MANUAL / NEEDS_SPEC
# Format cột + data test dùng chung: templates/viewpoint.md, testcase.md, data-test.md (0.5)
```

Header dưới đây **không phải file cần tạo** — đây là quy ước AI tự ghi ở đầu mọi file nó sinh ra trong `qc/test-viewpoints/`, `qc/test-cases/`, `qc/gap-reports/`. `qc/` sẽ trống cho tới khi chạy skill ở 1.5. Quy ước này đã nằm trong `templates/viewpoint.md`, `templates/testcase.md` và 1 dòng trong mục Luật QC chung của CLAUDE.md:

```markdown
- Scope Key: fs-user-list · Scope Code: USRL
- Source: docs/spec/fs-user-list.md (rev 1)
- State: DRAFT | LOCKED · Revision: 1
- Approved by / at: <tên> / <YYYY-MM-DD>
```

Thêm dòng này vào cuối mục **Luật QC chung** trong CLAUDE.md:

```markdown
- Mọi file AI ghi vào qc/test-viewpoints/, qc/test-cases/, qc/gap-reports/ phải mở đầu bằng header: Scope Key · Scope Code / Source (path + rev) / State (DRAFT | LOCKED) · Revision / Approved by / at.
```

Và khởi tạo `qc/open-questions.md` (file duy nhất trong `qc/` cần tạo tay):

```markdown
# Open Questions

| OQ ID | Scope Key | Câu hỏi | Ảnh hưởng (VP/TC) | Status | Trả lời | Người trả lời / ngày |
|---|---|---|---|---|---|---|

<!-- Status: OPEN / ANSWERED / RESOLVED (đã cập nhật spec). Im lặng không đổi status. -->
```

**.claude/skills/spec-review/SKILL.md**

```markdown
---
name: spec-review
description: Review spec đã duyệt trong docs/spec/, tìm chỗ thiếu, mơ hồ, mâu thuẫn; ghi Open Question và kết luận Design Gate. Dùng khi người dùng nói "review spec", "tìm gap", "/spec-review".
---
# Input
- Đường dẫn spec chính xác + trạng thái duyệt / revision. Thiếu → dừng, trả BLOCKED_INPUT.
# Quy trình
1. Đề xuất scope-key (= tên file spec) và scope-code. Chờ xác nhận.
2. Liệt kê test item: chức năng, input, trigger, kết quả quan sát được, rule/data liên quan.
3. Đọc lessons/INDEX.md (mục Thiết kế test) + docs/bug-history.md: chỗ spec lặp lại pattern từng gây bug → ghi FND.
4. Mỗi item kiểm: thiếu · mơ hồ · mâu thuẫn · không kiểm chứng được. Mỗi phát hiện = FND-<CODE>-NNN.
5. Chỗ cần người quyết → OQ-<CODE>-NNN trong qc/open-questions.md (Status: OPEN).
6. Kết luận Design Gate: READY (đủ để thiết kế) · PARTIAL (ghi rõ phần bị chặn) · STOP.
7. Draft trong chat → chờ duyệt → ghi qc/gap-reports/<scope-key>-gap-report.md.
# Cấm
- Sửa spec · tự trả lời OQ · coi im lặng là đồng ý.
```

**.claude/skills/test-viewpoint/SKILL.md**

```markdown
---
name: test-viewpoint
description: Thiết kế Test Viewpoint theo format team (VP_ID, Category, Test Level, Function, View Point, Expected Results, Site, Note), trace về spec rồi Lock. Dùng khi người dùng nói "làm viewpoint", "góc kiểm thử", "/test-viewpoint".
---
# Input
- Spec đã duyệt + Gap Report có Design Gate READY/PARTIAL (hoặc người dùng nói rõ bỏ qua review).
- lessons/INDEX.md, docs/bug-history.md (nếu có).
- references/viewpoint-groups.md, templates/viewpoint.md, templates/data-test.md, docs/glossary.md.
# Quy trình
1. Liệt kê function / màn hình trong spec. Mỗi function 1 Function code (ví dụ USRL).
2. Mỗi function quét đủ 8 nhóm trong viewpoint-groups.md; mỗi input field soi qua data-test.md.
3. Mỗi viewpoint 1 dòng: VP_ID = VP-<FUNC>-NNN; View Point theo mẫu "Verify that … in case/when …"; Note ghi mục spec hoặc OQ.
4. Kiểm: mọi acceptance criteria có ≥1 VP; VP không chứa steps hay data cụ thể.
5. Draft → duyệt → ghi qc/test-viewpoints/<scope-key>-viewpoints.md theo templates/viewpoint.md → State = LOCKED khi được duyệt.
# Cấm
- Đổi tên / thứ tự cột · viết test case ở bước này · dịch text tiếng Nhật.
- Bịa function/field/message ngoài spec → ghi [cần confirm] và tạo OQ.
```

**.claude/skills/test-viewpoint/references/viewpoint-groups.md**

```markdown
Quét đủ 8 nhóm cho mỗi function, không bỏ sót:

| Nhóm | Category gợi ý | Hỏi gì |
|---|---|---|
| 1. UI / Layout | UI | Đúng design, empty state, trạng thái button/chip/badge, responsive |
| 2. Positive | Function | Luồng chính chạy đúng với data hợp lệ |
| 3. Negative | Validation | Data sai, bỏ trống bắt buộc, sai thứ tự, không có quyền |
| 4. Boundary / Edge | Validation | Min/max length, min/max value, 0 / 1 / nhiều / tối đa, ngày biên |
| 5. Data / Business rule | Data | Trạng thái dữ liệu, trùng lặp, ràng buộc quan hệ, tính toán |
| 6. Cross-cutting | Transition / Security | Chuyển màn hình, permission/role, message tiếng Nhật, session/timeout, SQL injection, trim |
| 7. Performance | Performance | Thời gian phản hồi màn hình/API, load nhiều data (list 1.000+ dòng, export, upload file lớn), nhiều user thao tác cùng lúc, double submit. Chỉ đặt ngưỡng khi spec có số; không có → tạo OQ hỏi ngưỡng |
| 8. Bài học / bug cũ | Regression | Đọc lessons/INDEX.md (mục Thiết kế test) + docs/bug-history.md. Bug/lesson nào cùng function, cùng loại field hoặc cùng pattern → ≥1 VP; Note ghi ID bug hoặc file lesson |

- Mọi input field: soi qua templates/data-test.md → nguồn viewpoint Negative / Boundary.
- Mẫu câu View Point: "Verify that + <expectation> + in case/when + <condition>".
```

**.claude/skills/test-case/SKILL.md**

```markdown
---
name: test-case
description: Sinh test case từ viewpoint đã LOCKED theo format team (No., VP_ID, Priority, Category / Test items, Sub Category, Objective, Pre-condition, Data test, Test Steps, Expectation result) kèm Automation Eligibility. Dùng khi người dùng nói "viết test case", "sinh TC", "/test-case".
---
# Input
- qc/test-viewpoints/<scope-key>-viewpoints.md có State = LOCKED. Chưa LOCKED → dừng.
- templates/testcase.md, templates/data-test.md, references/test-design-techniques.md, references/automation-eligibility.md.
# Quy trình
1. Mỗi VP: chọn kỹ thuật (EP, BVA, Decision Table…), khai triển theo trục biến thiên: mỗi giá trị data / trạng thái / nhánh điều kiện → 1 TC. Nhiều TC cùng 1 VP_ID là đúng.
2. No. = TC-<FUNC>-NNN. Priority: High (happy case cho UAT/regression) / Normal.
3. Objective: "Verify that + <expectation> + in case/when + <condition>". Có chữ "và" nối 2 ý độc lập → tách 2 TC.
4. Pre-condition không có ghi "-". Data test: data cụ thể hoặc trỏ No. trong data-test.md.
5. Test Steps đánh số "1. … 2. …", mỗi bước 1 hành động. Expectation result quan sát được, giữ nguyên tiếng Nhật.
   - MỖI TC CHỈ 1 EXPECTED RESULT. Không gộp nhiều kết quả vào 1 ô (không "và", không liệt kê 1) 2) 3), không "<br>" nhiều kết quả).
   - Cần kiểm nhiều thứ (message + màu field + không lưu DB…) → tách mỗi thứ 1 TC, cùng VP_ID, Test Steps giống nhau.
   - Ví dụ SAI: "Hiển thị message E001 và field viền đỏ và không lưu". ĐÚNG: 3 TC, mỗi TC 1 kết quả.
6. Gán Automation Eligibility theo automation-eligibility.md.
7. Đối soát: bảng VP_ID | Kỹ thuật | Số TC; VP nào 0 TC phải ghi lý do; TC không có VP_ID là lỗi.
8. VP nhóm 8 (bài học / bug cũ): Priority High, Remarks ghi ID bug.
9. Draft → duyệt → ghi qc/test-cases/<scope-key>-test-cases.md theo templates/testcase.md → Lock khi được duyệt.
# Cấm
- Gộp nhiều expected result vào 1 TC.
- Sửa viewpoint ở đây · đổi tên / thứ tự cột · dùng MANUAL để che thiếu spec (dùng NEEDS_SPEC) · bịa field/message.
```

**.claude/skills/test-case/references/test-design-techniques.md**

```markdown
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
```

**.claude/skills/test-case/references/automation-eligibility.md**

```markdown
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
```

Kiểm tra: mở phiên Claude mới → CLI gõ `/skills`, VS Code gõ `/` → **Slash commands** → thấy spec-review, test-viewpoint, test-case. Commit: `[skill] add design skills`.

### 1.4 Chuẩn bị input

| Input | File | Ghi chú |
| --- | --- | --- |
| Spec đã duyệt | docs/spec/fs-user-list.md | Tên file = scope-key; ghi trạng thái duyệt + revision (template 0.5) |
| Tài liệu gốc | docs/raw/ | PDF/Excel/Word → nhờ Claude chuyển sang .md vào docs/spec/ một lần |
| Thuật ngữ | docs/glossary.md | Thuật ngữ nghiệp vụ tiếng Nhật kèm nghĩa tiếng Việt |

Thêm `docs/bug-history.md` — nguồn cho viewpoint nhóm 8 (bài học / bug cũ). Export bug đã đóng từ Backlog, chỉ giữ cột cần cho thiết kế:

```markdown
| Bug ID | Function / màn hình | Mô tả ngắn | Pattern lỗi | Có TC bắt được không? |
|---|---|---|---|---|
```

Prompt chuyển tài liệu: `Đọc docs/raw/<file> và chuyển sang Markdown vào docs/spec/<scope-key>.md, giữ nguyên tiếng Nhật, bảng giữ dạng bảng.`

### 1.5 Chạy quy trình: review spec → viewpoint → test case

| Bước | Prompt mẫu | Output | Anh làm gì |
| --- | --- | --- | --- |
| 1. Review spec | `/spec-review docs/spec/fs-user-list.md (đã duyệt, rev 1), scope code USRL` | qc/gap-reports/fs-user-list-gap-report.md, OQ trong qc/open-questions.md, Design Gate | Trả lời OQ; STOP thì sửa spec trước |
| 2. Viewpoint | `/test-viewpoint fs-user-list` | qc/test-viewpoints/fs-user-list-viewpoints.md, VP-USRL-NNN | Review cây viewpoint, duyệt Lock |
| 3. Test case | `/test-case fs-user-list` | qc/test-cases/fs-user-list-test-cases.md, TC-USRL-NNN | Review, chốt Automation Eligibility, duyệt Lock |

AI hay sai gì (bịa rule, đổi cột, thiếu data Nhật…) thì thêm thẳng vào mục **Cấm** của skill tương ứng. Commit riêng: `[skill] update test-case`.

### 1.6 Chạy lại với spec thứ 2

| Lần | Spec | Mục đích |
| --- | --- | --- |
| 1 | fs-user-list | Làm quen các bước duyệt và Lock, sửa skill |
| 2 | 1 spec khác màn hình (hoặc dự án khác) | Kiểm tra skill dùng chung được, không dính dự án cũ |

Cần file Excel theo template team: dùng skill qa-testcase-writing đọc file trong `qc/test-cases/`, hoặc script export ở GĐ4.

**Lỗi hay gặp (GĐ1)**

| Lỗi | Nguyên nhân | Cách sửa |
| --- | --- | --- |
| `claude: command not found` | PATH chưa cập nhật | Mở Terminal mới hoặc `source ~/.zshrc` |
| Không thấy skill | Sai đường dẫn hoặc thiếu frontmatter `name` / `description` | File phải là `.claude/skills/<tên>/SKILL.md`; mở phiên mới / Reload Window |
| Skill không tự kích hoạt | description mơ hồ | Ghi rõ "Dùng khi người dùng nói …" hoặc gọi thẳng `/tên-skill` |
| AI dừng `BLOCKED_INPUT` | Thiếu đường dẫn hoặc trạng thái duyệt | Đưa path đầy đủ, ghi *"đã duyệt, rev N"* |
| AI không ghi file | Chưa duyệt rõ ràng | Trả lời *"Duyệt nội dung và path"* |
| Design Gate = STOP | Spec thiếu hành vi ảnh hưởng data / expected | Trả lời OQ, cập nhật spec, chạy lại |
| Text tiếng Nhật bị dịch | Luật chưa rõ | Thêm ví dụ vào CLAUDE.md |

**Cổng qua GĐ1:** 2 spec có viewpoint + test case ở trạng thái LOCKED, OQ ảnh hưởng đã xử lý, có ít nhất 1 TC `UI-AUTO` đơn giản (login/search) để dùng ở GĐ2. Commit: `[fs-user-list] viewpoints + test cases`.

## Giai đoạn 2 — Chạy thử automation từng khối

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

**A.3 Chạy 1 TC thật từ GĐ1** — mở `qc/test-cases/fs-user-list-test-cases.md`, chọn 1 TC `UI-AUTO` (ví dụ TC-USRL-001). Thao tác đúng theo cột Test Steps trong codegen:

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

**web/pages/UserListPage.ts** — chuyển locator từ `tests/spike/TC-USRL-001.spec.ts` sang. Locator là ví dụ, kiểm lại bằng Pick locator. Đồng thời tạo `screens/web/user-list.md` theo templates/screen.md.

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
- Mỗi test code có tag @<TC ID> @<VP ID> lấy từ qc/test-cases.
- Locator chỉ nằm trong Page Object / Screen Object. Cấm locator trong file spec.
- Ưu tiên locator: getByRole > getByTestId > getByLabel/Placeholder > getByText. Cấm XPath tuyệt đối, CSS class tự sinh.
- Cấm waitForTimeout / pause cố định. Chờ bằng expect, waitForResponse, waitForURL.
- Thiếu locator hoặc màn hình → dùng skill screen-explorer. Không đoán.
- Mỗi test độc lập, tự tạo và tự dọn data.
- Không hardcode tài khoản/URL. Lấy từ process.env.

## Khi test fail
- Bắt buộc dùng skill failure-triage, phân loại trước khi sửa.
- PRODUCT_BUG: KHÔNG sửa test cho pass. Báo lại để người log bug.
- Mỗi lần sửa xong ghi 1 lesson vào lessons/<web|mobile>/.

## Lệnh
- Web: cd web && npx playwright test --grep @TC-USRL-001
- Mobile: cd mobile && npx wdio run wdio.android.conf.ts --mochaOpts.grep @TC-USRL-010
```

Giữ CLAUDE.md dưới 150 dòng; rule lặp lại từ 2 lần → vào lessons/INDEX.md.

### 3.6 Skills automation + commands

Skill thiết kế (spec-review, test-viewpoint, test-case) đã có từ GĐ1. Tạo tiếp skill automation, từng skill một, test xong mới tạo tiếp:

| Thứ tự | Skill | Input → Output | Test bằng |
| --- | --- | --- | --- |
| 1 | tc-to-playwright | TC UI-AUTO/BOTH trong qc/test-cases → web/tests/\<scope-key>.spec.ts | Xóa spec viết tay ở 3.2, cho skill sinh lại TC-USRL-001 → phải pass |
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
description: Chuyển test case LOCKED trong qc/test-cases/*.md (Automation Eligibility = UI-AUTO hoặc BOTH) thành code Playwright TypeScript trong web/tests. Dùng khi người dùng nói "automate TC", "viết script", "chuyển sang playwright", "/automate".
---

# Quy trình
1. Đọc lessons/INDEX.md.
2. Đọc qc/test-cases/<scope-key>-test-cases.md. Chỉ nhận file có State = LOCKED. Lọc TC có Automation Eligibility UI-AUTO/BOTH (hoặc TC được chỉ định).
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
5. Ghi lessons/<web|mobile>/<YYYY-MM-DD>-<slug>.md theo templates/lesson.md.
6. Lesson cùng loại đã lặp từ 2 lần → đề xuất 1 rule cho lessons/INDEX.md.
```

**Slash command** — `.claude/commands/automate.md`:

```text
Automate các TC trong $ARGUMENTS bằng skill tc-to-playwright (web) hoặc tc-to-appium (mobile).
Chạy từng TC, nếu fail thì dùng failure-triage. Cuối cùng in bảng kết quả.
```

| Command | Ví dụ |
| --- | --- |
| /spec-review (GĐ1) | /spec-review docs/spec/fs-user-list.md |
| /test-viewpoint (GĐ1) | /test-viewpoint fs-user-list |
| /test-case (GĐ1) | /test-case fs-user-list |
| /automate | /automate qc/test-cases/fs-user-list-test-cases.md |
| /explore | /explore user-list /users |
| /triage | /triage @TC-USRL-001 |

Sau mỗi skill: gõ `/skills` để kiểm tra. Commit riêng: `[skill] add <tên>`.

**Cổng qua GĐ3:** TC-USRL-001 do `/automate` sinh ra, chạy qua Page Object, pass; `/triage` phân loại đúng 1 lỗi cố ý và ghi được lesson đầu tiên.

## Giai đoạn 4 — Vận hành

### 4.1 Quy trình hằng ngày cho 1 ticket

1. Chuyển ticket → `docs/spec/<scope-key>.md`, ghi trạng thái duyệt (bạn).
2. `/spec-review` → trả lời OQ trong `qc/open-questions.md`.
3. `/test-viewpoint` → review, duyệt Lock.
4. `/test-case` → review, chốt Automation Eligibility, duyệt Lock.
5. `/automate qc/test-cases/<scope-key>-test-cases.md` → xem diff trong Source Control.
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

**lessons/INDEX.md** — mỗi rule 1 dòng, có link lesson gốc:

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

1. Thêm 1 dòng vào `docs/bug-history.md` (cột *Có TC bắt được không?* = Không).
2. Ghi `lessons/design/<YYYY-MM-DD>-<slug>.md` theo templates/lesson.md, Loại = DESIGN\_GAP.
3. Pattern lặp từ 2 lần → thêm 1 rule vào mục **Thiết kế test** của lessons/INDEX.md.
4. Lần sau, spec-review và test-viewpoint đọc mục này và tự sinh viewpoint nhóm 8.

Mỗi tuần review lessons/ 15 phút; giữ INDEX dưới 50 rule.

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
| Excel theo template team | `scripts/export-excel.ts`: đọc `qc/test-cases/*.md` + kết quả theo @TC → ghi vào template Excel (exceljs). Xong thì thêm lệnh vào mục Lệnh của CLAUDE.md | Khi có \~10 test |
| Test report cho khách/PM | Nhờ Claude tổng hợp từ `test-results/results.json` + `qc/test-cases` → `reports/<scope-key>-report.md`. Thiếu tiêu chí release thì ghi `UNDETERMINED`, không tự kết luận GO/NO-GO | Khi cần nộp kết quả |
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
- [ ] CLAUDE.md khung + 6 template + 1 spec mẫu trong docs/spec/

**GĐ 1 — Viewpoint & Test case**

- [ ] Claude CLI + extension VS Code đã đăng nhập, thấy CLAUDE.md
- [ ] 3 skill spec-review, test-viewpoint, test-case hiện trong /skills
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
