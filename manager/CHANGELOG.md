# Changelog

## [Unreleased]
### Thêm
- [auto] E2E-01 đối chiếu TC rev 13: tạo trouble lấy id / 番号 từ response POST /troubles (submitTrouble / openCreated, bỏ recordNewest — E2E-01 + 23 spec sinh + khuôn generator); thêm kiểm còn thiếu theo TC (no '稟議承認中', 作業項目 trong 支払情報, '作業完了確認' biến mất, cả 2 trouble 完了, 店舗名); E2E-01 assertTcRevision; deleteDefaultRows chờ dòng mặc định (R30); env toridoll-test name 'dev' → 'toridoll-test' (.auth/toridoll-test/); lesson automation R41, R42
- [auto] Tên theo môi trường: common/env-names.ts (N, NR, envData) + env/<ENV>.json › rename; est-test: Arabica Coffee VietNam / Arabica Store<N> / ARABICA WORKER / arabica…; 674 chuỗi Linksys trong spec / data được bọc tự động
- [auto] est-test đổi sang tài khoản arabica… (adminTest2, arabicasubadmin, arabicamanager1–5, arabicastore1–9, arabicaworkercompany; worker arabicaworker1/2); mật khẩu riêng theo môi trường <ENV>_CMS_<role>_PASSWORD; npm run recon:names (dò tên hiển thị theo môi trường)
- [auto] E2E suite chạy thật toridoll-test 15–16/10: 36/37 kịch bản (E2E-02…39) pass; E2E-14 chờ chạy lại theo TC rev 12. Spec E2E-02…39 sinh từ TC (scripts/gen-e2e-specs.mjs, npm run gen:e2e; bỏ common/e2e-case.ts); waitApisIdle bỏ request treo; reporter che mật khẩu trong snapshot; 98 thao tác báo giá qua 状態変更; chờ /payments; kiểm tài sản qua 資産一覧; recon-e2e thêm RECON_PART=E / F / S (S tạo tài sản 'TEST AUTOMATION'); lesson automation R37–R40, mở rộng R34
- TC e2e-suite rev 8 → 12 (QUESTIONS lượt 10–14): 差し戻し → コピー; 取り下げ却下 có lý do, gốc = 失効; type 04 tự duyệt 税抜 < min_amount; urgent ≤ FIX tự duyệt; '_2' kế thừa 案件区分; Verify sau 取り下げ ở role Admin. Lesson QC D18
- [auto] Recon E2E còn lại trên toridoll-test: 13 tài khoản E2E đăng nhập OK (manager m2–m5 xác nhận loginId), 案件区分 role 99, hộp PDF 報告書 (.app-pdf-upload-modal), card báo giá 下書き / 承認待ち (編集 / コピー / 取り下げ申請), hộp 差し戻し ('見積もりを差し戻す' → '差し戻し実行' → '差し戻しをおこないますか？' 決定); e2e-case: 99 thao tác báo giá qua 状態変更; E2E-00/01 skip khi E2E_DRY; recon-e2e thêm RECON_PART=E / F; lesson automation R34–R36
- [auto] Cấu trúc automation/web: tests/cms/ chia theo bộ test (e2e-trouble-flow/, phase007/, e2e-suite/, smoke/); project e2e/cms chọn theo thư mục; npm run suite -- E2E-NN; bắt buộc ENV (mặc định từ .env); bỏ common/auth.ts, assert.ts, ui-wait.ts (gộp vào wait.ts)
- [auto] Recon (dò màn hình) là bắt buộc trước khi viết locator; kết quả chỉ ghi vào reports/_tmp_chk/recon*/ (ghi đè), không tạo reports/recon-* nữa (CLAUDE.md mục Automation)
- [auto] Automation E2E suite: E2E-00 (common setup) + E2E-01 pass 15/15 trên toridoll-test; screen mới trouble-navi.webview.ts, ChainSystemScreen (công tắc シサンNAVI / トラブルNAVI, store, 限度額), common/e2e-suite.ts, data/e2e-suite.json; lesson R31–R33 (bước wizard theo role, số có hậu tố, ant-select trong iframe)
- Lesson QC D17 (TC sinh bằng script phải tách bước theo nhánh, đối chiếu màn CMS web) từ e2e-suite TC-002; TC e2e-suite rev 3 (DRAFT)
- Sửa lesson QC D17: thêm trạng thái kỳ vọng theo nhánh (提示 ≤ FIX → 承認済み); TC e2e-suite rev 4 LOCKED
- [auto] Lesson automation R30 (count() trước khi dữ liệu async tải xong); P007-TC-051 sửa: chờ bảng tài sản trong modal 店舗・担当者編集 rồi mới xoá (TroubleEditScreen.removeAllItemEditAssets), gỡ test.fail BUG 2285-01 (người dùng thử tay: app đúng); TC-050 + 051 pass trên dev
- [auto] Report E2E: Passed gộp 1 thư mục / lần chạy (Passed/<kịch bản>_<ngày giờ>_<ENV>/PASSED.md + video-full.webm, mốc tua từng TC); Failed giữ từng TC + video-fail.webm (cắt bằng ffmpeg); bỏ thư mục Skipped (danh sách skip ở Runs/<lần chạy>/SUMMARY.md); Runs giữ nguyên
- [auto] Lesson automation R25–R29 (ô app tự tính, loader #loader-container, kết quả tìm cũ, ô tự tìm + drawer, trạng thái nhiều bước); P007 dev 64/65 pass, TC-051 đánh dấu bug đã biết 2285-01 (test.fail, FAIL.md có 'Bug đã biết'); TC phase007-regression rev 6 (TC-053/054 タスク範囲 '全て')
- [auto] P007 rà toàn bộ TC-039~065 sau vòng 19 (43/65 pass trên dev): pdfCard theo thẻ (TC-040), removePdf, đóng 報告書 từ 状態変更 bằng × (TC-044), TC-051 xoá tài sản trong modal 店舗・担当者編集 (Q11), rowOf 依頼番号 khớp đúng (list, 継続依頼), TC-042 chọn 対応区分 theo dòng
- [auto] Lesson automation R19–R24 (drawer ngoài màn hình, hasText chuỗi con, bảng lồng trong form, Enter đã gửi form, thumbnail role=button / modal preview PDF, cleanup form dở giữa TC serial) từ chạy P007 trên dev; sửa P007-TC-010/011/016/023/028/031/032/036/037/038/065 (locator .message--error, chờ thẻ 故障内容 30s, openAdvanced, estimationRow, assetRows, openPdfPreview); TC-024 theo TC rev 5
- Lesson QC D16 (lưu xong có hộp thoại hoàn tất → TC ghi bước 'OK') từ P007-TC-006; TC phase007-regression rev 4
- [auto] P007-TC-006: bấm 'OK' dialog '検索条件の保存が完了しました。' trước khi mở 'フィルタ' (theo TC rev 4); env/dev.json trả cmsBaseUrl về cms-toridoll-test
- Lesson QC D15 (màn master-edit lưu 2 tầng, TC ghi đủ cả 2) từ P007-TC-003; TC phase007-regression rev 3
- [auto] Lesson automation R18 (đợi /api/home thực tế sau login, quá ngưỡng ghi PERFORMANCE không fail; hộp 表示に時間がかかっております chỉ bấm OK, không reload) (D24); report thêm mục Cảnh báo môi trường, Performance, reports/PERFORMANCE.md; env apiPerfLimitMs / apiMaxWaitMs
- [auto] P007-TC-003~005: '保存' 2 tầng ở 資産管理項目 (AssetColumnScreen.saveAll) theo TC rev 3
- Nguồn message Qnavi: raw/List messages.xlsx → spec/messages.md (6 sheet), sources.md mã MSG; luật đối chiếu message khi viết TC và automation (D23)
- [auto] Automation Phase 007 Regression (65 TC): tests/cms/phase007-regression.spec.ts, screen mới chain-system, asset-column, subadmin, task/chat/asset-info; common/scenario.ts (khung chạy nối tiếp dùng chung); npm run p007
- [auto] E2E quay video cả lần chạy (reports/Runs/<run>/video, chỉ giữ khi có fail); FAIL.md có link video + mốc thời gian + cách mở trace
- [auto] Report: thư mục tổng reports/Passed, Failed, Skipped, Runs; tên theo [tên testcase]_[dd-mm-yyyy_HH-mm-ss]_[ENV]
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
