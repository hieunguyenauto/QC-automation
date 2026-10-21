import { runCase } from '../../../common/e2e-case';

/**
 * E2E-09 · fix only NEW / (continue none) · LINKSYS STORE00005 — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-09-fix-only-new-test-cases.md (LOCKED rev 7, 15 TC).
 * Test sinh trực tiếp từ file TC (common/e2e-case.ts): 1 test() = 1 TC, test.step = cột Steps. Chạy nối tiếp; TC fail → TC sau skip.
 * Chạy lẻ: ENV=toridoll-test npm run suite -- E2E-09
 */
runCase(9);
