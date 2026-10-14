# E2E suite — 37 kịch bản + common setup (LOCKED · Revision 2, 14/10/2026)

Nguồn: projects/qnavi/spec/e2e-suite.md. Quyết định: QUESTIONS.md (lượt 1–6) + quy tắc R1–R20. Sinh bằng _tools/gen_e2e.py.
Bỏ case 16 (G14) và case 28 (G11).

## Thứ tự chạy
- Chạy lẻ từng case: chạy E2E00-TC-001 (シサンNAVI OFF) trước, riêng E2E-37 / E2E-38 chạy E2E00-TC-002 (シサンNAVI ON) trước.
- Không chạy song song case nhóm OFF với E2E-37 / E2E-38 (シサンNAVI là cấu hình chung của chain).

Tổng: 38 file · 562 TC.

| Case | Biến thể | Store | Số TC | File |
|---|---|---|---|---|
| E2E-00 | Common setup (トラブルナビ ON · シサンNAVI OFF / ON) | Linksys Chain System | 2 | [E2E-00-common-setup-test-cases.md](E2E-00-common-setup-test-cases.md) |
| E2E-01 | Type01 direct / approver=Chain Store | LINKSYS STORE00006 | 15 | [E2E-01-type01-direct-test-cases.md](E2E-01-type01-direct-test-cases.md) |
| E2E-02 | Type02 multi-level / highest must approve | LINKSYS STORE00007 | 15 | [E2E-02-type02-multi-level-test-cases.md](E2E-02-type02-multi-level-test-cases.md) |
| E2E-03 | Type03 amount-range | LINKSYS STORE00008 | 15 | [E2E-03-type03-amount-range-test-cases.md](E2E-03-type03-amount-range-test-cases.md) |
| E2E-04 | Type04 Ringi / sequential Lv1→3 | LINKSYS STORE00004 | 15 | [E2E-04-type04-ringi-test-cases.md](E2E-04-type04-ringi-test-cases.md) |
| E2E-05 | Type04 auto-approve / (< ¥5,000 below min) | LINKSYS STORE00005 | 15 | [E2E-05-type04-auto-approve-test-cases.md](E2E-05-type04-auto-approve-test-cases.md) |
| E2E-06 | Type03 full-permission / account (range 0→∞) | LINKSYS STORE00008 | 15 | [E2E-06-type03-full-permission-test-cases.md](E2E-06-type03-full-permission-test-cases.md) |
| E2E-07 | Type04 Level 0 / substitute approver | LINKSYS STORE00009 | 15 | [E2E-07-type04-level-0-test-cases.md](E2E-07-type04-level-0-test-cases.md) |
| E2E-08 | fix_amount NOT set / (none) both phases | LINKSYS STORE00001 | 15 | [E2E-08-fix-amount-not-set-test-cases.md](E2E-08-fix-amount-not-set-test-cases.md) |
| E2E-09 | fix only NEW / (continue none) | LINKSYS STORE00005 | 15 | [E2E-09-fix-only-new-test-cases.md](E2E-09-fix-only-new-test-cases.md) |
| E2E-10 | fix both NEW and CONTINUE | LINKSYS STORE00005 | 15 | [E2E-10-fix-both-new-and-continue-test-cases.md](E2E-10-fix-both-new-and-continue-test-cases.md) |
| E2E-11 | Boundary / est amount == fix | LINKSYS STORE00004 | 15 | [E2E-11-boundary-test-cases.md](E2E-11-boundary-test-cases.md) |
| E2E-12 | Reject 差し戻し → / re-edit, type 02→04 | LINKSYS STORE00007 | 17 | [E2E-12-reject-test-cases.md](E2E-12-reject-test-cases.md) |
| E2E-13 | ReqCancel→APPROVE→ / resubmit type 04→02 | LINKSYS STORE00004 | 16 | [E2E-13-reqcancel-approve-test-cases.md](E2E-13-reqcancel-approve-test-cases.md) |
| E2E-14 | ReqCancel→REJECT→ / 取下却下→COPY→new | LINKSYS STORE00008 | 16 | [E2E-14-reqcancel-reject-test-cases.md](E2E-14-reqcancel-reject-test-cases.md) |
| E2E-15 | Re-submit AFTER approved / → old 承認済み→失効 | LINKSYS STORE00006 | 16 | [E2E-15-re-submit-after-approved-test-cases.md](E2E-15-re-submit-after-approved-test-cases.md) |
| E2E-17 | Multi-est 3: 1 approve / → 2 失効 (draft kept) | LINKSYS STORE00004 | 17 | [E2E-17-multi-est-3-1-approve-test-cases.md](E2E-17-multi-est-3-1-approve-test-cases.md) |
| E2E-18 | Bulk submit 3 drafts / → 1 notification | LINKSYS STORE00007 | 16 | [E2E-18-bulk-submit-3-drafts-test-cases.md](E2E-18-bulk-submit-3-drafts-test-cases.md) |
| E2E-19 | Urgent NEW only / (continue normal) | LINKSYS STORE00006 | 15 | [E2E-19-urgent-new-only-test-cases.md](E2E-19-urgent-new-only-test-cases.md) |
| E2E-20 | Urgent CONTINUE only / (new normal) | LINKSYS STORE00006 | 15 | [E2E-20-urgent-continue-only-test-cases.md](E2E-20-urgent-continue-only-test-cases.md) |
| E2E-21 | Urgent BOTH phases / skip approval | LINKSYS STORE00006 | 15 | [E2E-21-urgent-both-phases-test-cases.md](E2E-21-urgent-both-phases-test-cases.md) |
| E2E-22 | Urgent NEW + multi-est / (失効 under urgent) | LINKSYS STORE00004 | 16 | [E2E-22-urgent-new-multi-est-test-cases.md](E2E-22-urgent-new-multi-est-test-cases.md) |
| E2E-23 | Urgent CONTINUE / + staff change | LINKSYS STORE00007 | 15 | [E2E-23-urgent-continue-test-cases.md](E2E-23-urgent-continue-test-cases.md) |
| E2E-24 | Worker(iOS) create → / Admin approve (CMS) | LINKSYS STORE00007 | 5 | [E2E-24-worker-ios-create-test-cases.md](E2E-24-worker-ios-create-test-cases.md) |
| E2E-25 | Worker(Android) → / Sub-Admin approve (CMS) | LINKSYS STORE00008 | 15 | [E2E-25-worker-android-test-cases.md](E2E-25-worker-android-test-cases.md) |
| E2E-26 | Worker Company / creates est (Type04) | LINKSYS STORE00004 | 15 | [E2E-26-worker-company-test-cases.md](E2E-26-worker-company-test-cases.md) |
| E2E-27 | Cross-device iOS→ / Android→Webview | LINKSYS STORE00005 | 15 | [E2E-27-cross-device-ios-test-cases.md](E2E-27-cross-device-ios-test-cases.md) |
| E2E-29 | ★KEY: No-key approver → / reject only → read-key approves | LINKSYS STORE00001 | 17 | [E2E-29-key-no-key-approver-test-cases.md](E2E-29-key-no-key-approver-test-cases.md) |
| E2E-30 | ★KEY: Sub-Admin read-key / approves (CMS) | LINKSYS STORE00001 | 15 | [E2E-30-key-sub-admin-read-key-test-cases.md](E2E-30-key-sub-admin-read-key-test-cases.md) |
| E2E-31 | ★KEY: encryption integrity / write→read across continue | LINKSYS STORE00001 | 16 | [E2E-31-key-encryption-integrity-test-cases.md](E2E-31-key-encryption-integrity-test-cases.md) |
| E2E-32 | ★KEY: Worker NO key / (admin-created est) | LINKSYS STORE00001 | 15 | [E2E-32-key-worker-no-key-test-cases.md](E2E-32-key-worker-no-key-test-cases.md) |
| E2E-33 | ★KEY: Worker No key + Store No key / → reject → read-key approve | LINKSYS STORE00001 | 17 | [E2E-33-key-worker-no-key-store-no-key-test-cases.md](E2E-33-key-worker-no-key-store-no-key-test-cases.md) |
| E2E-34 | ★KEY: No-key approver UI / approve disabled / reject only | LINKSYS STORE00001 | 16 | [E2E-34-key-no-key-approver-ui-test-cases.md](E2E-34-key-no-key-approver-ui-test-cases.md) |
| E2E-35 | Create trouble via non-trouble navi | LINKSYS STORE00006 | 15 | [E2E-35-create-trouble-via-non-trouble-navi-test-cases.md](E2E-35-create-trouble-via-non-trouble-navi-test-cases.md) |
| E2E-36 | Create trouble via trouble navi | LINKSYS STORE00006 | 15 | [E2E-36-create-trouble-via-trouble-navi-test-cases.md](E2E-36-create-trouble-via-trouble-navi-test-cases.md) |
| E2E-37 | Create trouble with asset via non-trouble navi | LINKSYS STORE00006 | 15 | [E2E-37-create-trouble-with-asset-via-non-troubl-test-cases.md](E2E-37-create-trouble-with-asset-via-non-troubl-test-cases.md) |
| E2E-38 | Create trouble with asset via trouble navi | LINKSYS STORE00006 | 15 | [E2E-38-create-trouble-with-asset-via-trouble-na-test-cases.md](E2E-38-create-trouble-with-asset-via-trouble-na-test-cases.md) |
| E2E-39 | Create report with attach PDF file | LINKSYS STORE00006 | 15 | [E2E-39-create-report-with-attach-pdf-file-test-cases.md](E2E-39-create-report-with-attach-pdf-file-test-cases.md) |
