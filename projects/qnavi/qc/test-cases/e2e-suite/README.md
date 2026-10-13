# E2E suite — 39 kịch bản (DRAFT, 13/10/2026)

Nguồn: projects/qnavi/spec/e2e-suite.md. Câu hỏi: QUESTIONS.md.

Tổng: 39 file · 593 TC.

| Case | Biến thể | Số TC | Câu hỏi | File |
|---|---|---|---|---|
| E2E-01 | Type01 direct / approver=Chain Store | 15 | G1, G2, G5, G7, G27 | [E2E-01-type01-direct-test-cases.md](E2E-01-type01-direct-test-cases.md) |
| E2E-02 | Type02 multi-level / highest must approve | 15 | G1, G2, G5, G22 | [E2E-02-type02-multi-level-test-cases.md](E2E-02-type02-multi-level-test-cases.md) |
| E2E-03 | Type03 amount-range | 15 | G1, G2, G4, G5, G7 | [E2E-03-type03-amount-range-test-cases.md](E2E-03-type03-amount-range-test-cases.md) |
| E2E-04 | Type04 Ringi / sequential Lv1→3 | 15 | G1, G2, G4, G6, G7, G20, G27 | [E2E-04-type04-ringi-test-cases.md](E2E-04-type04-ringi-test-cases.md) |
| E2E-05 | Type04 auto-approve / (< ¥5,000 below min) | 15 | G1, G2, G4, G5, G7 | [E2E-05-type04-auto-approve-test-cases.md](E2E-05-type04-auto-approve-test-cases.md) |
| E2E-06 | Type03 full-permission / account (range 0→∞) | 15 | G1, G2, G4, G5, G7 | [E2E-06-type03-full-permission-test-cases.md](E2E-06-type03-full-permission-test-cases.md) |
| E2E-07 | Type04 Level 0 / substitute approver | 15 | G1, G2, G5, G7, G20, G21 | [E2E-07-type04-level-0-test-cases.md](E2E-07-type04-level-0-test-cases.md) |
| E2E-08 | fix_amount NOT set / (none) both phases | 15 | G1, G2, G5, G7, G23 | [E2E-08-fix-amount-not-set-test-cases.md](E2E-08-fix-amount-not-set-test-cases.md) |
| E2E-09 | fix only NEW / (continue none) | 16 | G1, G2, G6, G20, G23 | [E2E-09-fix-only-new-test-cases.md](E2E-09-fix-only-new-test-cases.md) |
| E2E-10 | fix both NEW and CONTINUE | 15 | G1, G2, G5, G7, G20 | [E2E-10-fix-both-new-and-continue-test-cases.md](E2E-10-fix-both-new-and-continue-test-cases.md) |
| E2E-11 | Boundary / est amount == fix | 15 | G1, G2, G5, G7 | [E2E-11-boundary-test-cases.md](E2E-11-boundary-test-cases.md) |
| E2E-12 | Reject 差し戻し → / re-edit, type 02→04 | 16 | G1, G2, G5, G7, G14, G20 | [E2E-12-reject-test-cases.md](E2E-12-reject-test-cases.md) |
| E2E-13 | ReqCancel→APPROVE→ / resubmit type 04→02 | 16 | G1, G2, G6, G7, G19 | [E2E-13-reqcancel-approve-test-cases.md](E2E-13-reqcancel-approve-test-cases.md) |
| E2E-14 | ReqCancel→REJECT→ / 取下却下→COPY→new | 16 | G1, G2, G4, G6, G19 | [E2E-14-reqcancel-reject-test-cases.md](E2E-14-reqcancel-reject-test-cases.md) |
| E2E-15 | Re-submit AFTER approved / → old 承認済み→失効 | 16 | G1, G2, G5, G7 | [E2E-15-re-submit-after-approved-test-cases.md](E2E-15-re-submit-after-approved-test-cases.md) |
| E2E-16 | Re-submit after approved / ×2 + type 02→04 | 18 | G1, G2, G5, G7, G14, G20 | [E2E-16-re-submit-after-approved-test-cases.md](E2E-16-re-submit-after-approved-test-cases.md) |
| E2E-17 | Multi-est 3: 1 approve / → 2 失効 (draft kept) | 17 | G1, G2, G5, G7, G15, G20 | [E2E-17-multi-est-3-1-approve-test-cases.md](E2E-17-multi-est-3-1-approve-test-cases.md) |
| E2E-18 | Bulk submit 3 drafts / → 1 notification | 16 | G1, G2, G5, G7, G16 | [E2E-18-bulk-submit-3-drafts-test-cases.md](E2E-18-bulk-submit-3-drafts-test-cases.md) |
| E2E-19 | Urgent NEW only / (continue normal) | 14 | G1, G2, G5, G7 | [E2E-19-urgent-new-only-test-cases.md](E2E-19-urgent-new-only-test-cases.md) |
| E2E-20 | Urgent CONTINUE only / (new normal) | 14 | G1, G2, G5, G7 | [E2E-20-urgent-continue-only-test-cases.md](E2E-20-urgent-continue-only-test-cases.md) |
| E2E-21 | Urgent BOTH phases / skip approval | 13 | G1, G2, G5, G7 | [E2E-21-urgent-both-phases-test-cases.md](E2E-21-urgent-both-phases-test-cases.md) |
| E2E-22 | Urgent NEW + multi-est / (失効 under urgent) | 15 | G1, G2, G5, G15, G17 | [E2E-22-urgent-new-multi-est-test-cases.md](E2E-22-urgent-new-multi-est-test-cases.md) |
| E2E-23 | Urgent CONTINUE / + staff change | 14 | G1, G2, G5, G7 | [E2E-23-urgent-continue-test-cases.md](E2E-23-urgent-continue-test-cases.md) |
| E2E-24 | Worker(iOS) create → / Admin approve (CMS) | 12 | G1, G2, G6, G7, G8, G9, G25, G27 | [E2E-24-worker-ios-create-test-cases.md](E2E-24-worker-ios-create-test-cases.md) |
| E2E-25 | Worker(Android) → / Sub-Admin approve (CMS) | 15 | G1, G2, G4, G6, G7, G8, G25, G27 | [E2E-25-worker-android-test-cases.md](E2E-25-worker-android-test-cases.md) |
| E2E-26 | Worker Company / creates est (Type04) | 15 | G1, G2, G6, G7, G10, G19, G20, G27 | [E2E-26-worker-company-test-cases.md](E2E-26-worker-company-test-cases.md) |
| E2E-27 | Cross-device iOS→ / Android→Webview | 16 | G1, G2, G5, G23, G25, G27 | [E2E-27-cross-device-ios-test-cases.md](E2E-27-cross-device-ios-test-cases.md) |
| E2E-28 | OLD version → / continue stays OLD | 15 | G1, G2, G6, G11, G19, G27 | [E2E-28-old-version-test-cases.md](E2E-28-old-version-test-cases.md) |
| E2E-29 | ★KEY: No-key approver → / reject only → read-key approves | 16 | G1, G2, G5, G7, G14, G18, G27 | [E2E-29-key-no-key-approver-test-cases.md](E2E-29-key-no-key-approver-test-cases.md) |
| E2E-30 | ★KEY: Sub-Admin read-key / approves (CMS) | 15 | G1, G2, G6, G7, G8, G27 | [E2E-30-key-sub-admin-read-key-test-cases.md](E2E-30-key-sub-admin-read-key-test-cases.md) |
| E2E-31 | ★KEY: encryption integrity / write→read across continue | 16 | G1, G2, G5, G7, G18, G27 | [E2E-31-key-encryption-integrity-test-cases.md](E2E-31-key-encryption-integrity-test-cases.md) |
| E2E-32 | ★KEY: Worker NO key / (admin-created est) | 15 | G1, G2, G6, G19 | [E2E-32-key-worker-no-key-test-cases.md](E2E-32-key-worker-no-key-test-cases.md) |
| E2E-33 | ★KEY: Worker No key + Store No key / → reject → read-key approve | 16 | G1, G2, G6, G14, G18, G19 | [E2E-33-key-worker-no-key-store-no-key-test-cases.md](E2E-33-key-worker-no-key-store-no-key-test-cases.md) |
| E2E-34 | ★KEY: No-key approver UI / approve disabled / reject only | 16 | G1, G2, G6, G7, G12, G18, G27 | [E2E-34-key-no-key-approver-ui-test-cases.md](E2E-34-key-no-key-approver-ui-test-cases.md) |
| E2E-35 | Create trouble via non-trouble navi | 15 | G1, G2, G6, G7, G8, G27 | [E2E-35-create-trouble-via-non-trouble-navi-test-cases.md](E2E-35-create-trouble-via-non-trouble-navi-test-cases.md) |
| E2E-36 | Create trouble via trouble navi | 15 | G1, G2, G5, G7, G27 | [E2E-36-create-trouble-via-trouble-navi-test-cases.md](E2E-36-create-trouble-via-trouble-navi-test-cases.md) |
| E2E-37 | Create trouble with asset via non-trouble navi | 15 | G1, G2, G6, G7, G27, G29 | [E2E-37-create-trouble-with-asset-via-non-troubl-test-cases.md](E2E-37-create-trouble-with-asset-via-non-troubl-test-cases.md) |
| E2E-38 | Create trouble with asset via trouble navi | 15 | G1, G2, G5, G7, G27 | [E2E-38-create-trouble-with-asset-via-trouble-na-test-cases.md](E2E-38-create-trouble-with-asset-via-trouble-na-test-cases.md) |
| E2E-39 | Create report with attach PDF file | 15 | G1, G2, G6, G7, G26, G27 | [E2E-39-create-report-with-attach-pdf-file-test-cases.md](E2E-39-create-report-with-attach-pdf-file-test-cases.md) |
