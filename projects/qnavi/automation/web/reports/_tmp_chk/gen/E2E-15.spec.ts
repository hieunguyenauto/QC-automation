import { runCase } from '../../../common/e2e-case';

/**
 * E2E-15 · Re-submit AFTER approved / → old 承認済み→失効 · LINKSYS STORE00006 — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-15-re-submit-after-approved-test-cases.md (LOCKED rev 7, 16 TC).
 * Test sinh trực tiếp từ file TC (common/e2e-case.ts): 1 test() = 1 TC, test.step = cột Steps. Chạy nối tiếp; TC fail → TC sau skip.
 * Chạy lẻ: ENV=toridoll-test npm run suite -- E2E-15
 */
runCase(15);
