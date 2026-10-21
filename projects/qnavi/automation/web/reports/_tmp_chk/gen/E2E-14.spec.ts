import { runCase } from '../../../common/e2e-case';

/**
 * E2E-14 · ReqCancel→REJECT→ / 取下却下→COPY→new · LINKSYS STORE00008 — TC: projects/qnavi/qc/test-cases/e2e-suite/E2E-14-reqcancel-reject-test-cases.md (LOCKED rev 7, 16 TC).
 * Test sinh trực tiếp từ file TC (common/e2e-case.ts): 1 test() = 1 TC, test.step = cột Steps. Chạy nối tiếp; TC fail → TC sau skip.
 * Chạy lẻ: ENV=toridoll-test npm run suite -- E2E-14
 */
runCase(14);
