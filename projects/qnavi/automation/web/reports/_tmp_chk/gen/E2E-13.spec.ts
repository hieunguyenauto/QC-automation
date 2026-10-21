import { runCase } from '../../../common/e2e-case';

/**
 * E2E-13 · ReqCancel→APPROVE→ / resubmit type 04→02 · LINKSYS STORE00004 — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-13-reqcancel-approve-test-cases.md (LOCKED rev 7, 16 TC).
 * Test sinh trực tiếp từ file TC (common/e2e-case.ts): 1 test() = 1 TC, test.step = cột Steps. Chạy nối tiếp; TC fail → TC sau skip.
 * Chạy lẻ: ENV=toridoll-test npm run suite -- E2E-13
 */
runCase(13);
