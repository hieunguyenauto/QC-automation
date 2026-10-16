import { test, type Page, type Request, type Response } from '@playwright/test';
import { env } from './env';

/** Như waitForApi nhưng không làm fail test nếu API không gọi (vd trang dùng cache). */
export function waitForApiSafe(page: Page, urlPart: string, timeout = 15_000): Promise<Response | null> {
  return page.waitForResponse((r) => r.url().includes(urlPart) && r.status() < 400, { timeout }).catch(() => null);
}

/** Chờ 1 API trả về (vd 'troubles?'), dùng trước khi assert dữ liệu trên bảng. */
export function waitForApi(page: Page, urlPart: string, method = 'GET'): Promise<Response> {
  return page.waitForResponse(
    (res) => res.url().includes(urlPart) && res.request().method() === method && res.status() < 400,
  );
}

/**
 * Chờ loader toàn trang của CMS tắt. Loader thật = '#loader-container' (đè lên mọi nút, "intercepts pointer events";
 * dò thật dev 2026-10-13 ở hộp chọn tài sản khi danh sách lớn). Chờ tối đa 60s; quá thì để bước sau báo lỗi.
 */
const LOADER = '#loader-container, .app-loader, .ant-spin-spinning';
export async function waitForAppIdle(page: Page, timeout = 60_000): Promise<void> {
  await page.locator(LOADER).first().waitFor({ state: 'hidden', timeout }).catch(() => undefined);
}

/**
 * Đợi API trả về THỰC TẾ (R18) — gọi TRƯỚC thao tác kích hoạt request, await sau.
 * Đo từ lúc gọi hàm. Chậm hơn env.apiPerfLimitMs / không về trong env.apiMaxWaitMs / lỗi HTTP
 * → ghi annotation 'perf' (SUMMARY + reports/PERFORMANCE.md) để check sau, KHÔNG fail. Trả true nếu có response OK.
 * Request bị app huỷ (ERR_ABORTED — vd app huỷ request khi firebase-auth/exchange lỗi 504) → gọi onAbort
 * (đóng hộp lỗi như người dùng) rồi đợi tiếp lần gọi sau của app; không tự reload.
 */
export function waitApiPerf(page: Page, match: (url: URL, method: string) => boolean, label: string, onAbort?: () => Promise<unknown>): Promise<boolean> {
  const { apiPerfLimitMs: limit, apiMaxWaitMs: max } = env;
  const t0 = Date.now();
  let aborted = 0;
  const perf = (description: string) => {
    try { test.info().annotations.push({ type: 'perf', description }); } catch { /* ngoài test */ }
  };
  const onFail = (r: Request) => {
    if (!match(new URL(r.url()), r.method())) return;
    aborted += 1;
    if (onAbort) void onAbort().catch(() => {});
  };
  page.on('requestfailed', onFail);
  const note = () => (aborted ? `, app huỷ ${aborted} lần (ERR_ABORTED)` : '');
  return page.waitForResponse((r) => match(new URL(r.url()), r.request().method()), { timeout: max })
    .then((r) => {
      const ms = Date.now() - t0;
      if (!r.ok()) { perf(`${label}: HTTP ${r.status()} sau ${(ms / 1000).toFixed(1)}s${note()}`); return false; }
      if (ms > limit || aborted) perf(`${label}: trả về sau ${(ms / 1000).toFixed(1)}s (ngưỡng ${limit / 1000}s)${note()}`);
      return true;
    }, () => { perf(`${label}: không trả về trong ${max / 1000}s (ngưỡng ${limit / 1000}s)${note()}`); return false; })
    .finally(() => page.off('requestfailed', onFail));
}

// ---------------- Đợi API chạy xong hết (người dùng chốt 2026-10-13) ----------------
/** Kết nối mở liên tục (Firestore WebChannel / long-poll) — không bao giờ "xong", không tính. */
const LONG_LIVED = /firestore\.googleapis\.com|\/channel(\?|$)|\/Listen\/|\/Write\//;
const inflight = new WeakMap<Page, Map<Request, number>>();

/** Bắt đầu theo dõi XHR / fetch đang chạy của page (gọi 1 lần ngay khi tạo page; gọi lại không sao). */
export function trackApis(page: Page): void {
  if (inflight.has(page)) return;
  const m = new Map<Request, number>();
  inflight.set(page, m);
  page.on('request', (r) => {
    if (['xhr', 'fetch'].includes(r.resourceType()) && !LONG_LIVED.test(r.url())) m.set(r, Date.now());
  });
  const done = (r: Request) => { m.delete(r); };
  page.on('requestfinished', done);
  page.on('requestfailed', done);
  page.on('framenavigated', (f) => { if (f === page.mainFrame()) m.clear(); }); // request của trang cũ không còn
}

/**
 * Đợi tới khi KHÔNG còn API nào đang chạy và yên quietMs (mặc định 1s) — như người dùng đợi trang tải xong rồi mới thao tác.
 * Quá env.apiPerfLimitMs → ghi 'perf' (kèm API còn chạy); quá env.apiMaxWaitMs → ghi 'perf' rồi chạy tiếp. Không fail, không reload.
 */
export async function waitApisIdle(page: Page, label: string, quietMs = 1_000): Promise<void> {
  trackApis(page);
  const m = inflight.get(page)!;
  const { apiPerfLimitMs: limit, apiMaxWaitMs: max } = env;
  const t0 = Date.now();
  let quietSince = m.size ? 0 : Date.now();
  while (Date.now() - t0 < max) {
    if (page.isClosed()) return;
    // Request treo quá max (server không bao giờ trả lời): ghi perf 1 lần rồi bỏ khỏi danh sách, không chặn mọi lần chờ sau.
    for (const [r, start] of m) {
      if (Date.now() - start < max) continue;
      m.delete(r);
      const description = `${label}: bỏ chờ ${r.method()} ${new URL(r.url()).pathname} (treo > ${max / 1000}s)`;
      try { test.info().annotations.push({ type: 'perf', description }); } catch { /* ngoài test */ }
    }
    if (m.size) quietSince = 0;
    else if (!quietSince) quietSince = Date.now();
    else if (Date.now() - quietSince >= quietMs) break;
    await new Promise((r) => setTimeout(r, 100));
  }
  const ms = Date.now() - t0 - (m.size ? 0 : quietMs);
  if (m.size || ms > limit) {
    const left = [...m.keys()].map((r) => `${r.method()} ${new URL(r.url()).pathname}`).slice(0, 5).join(', ');
    const description = m.size
      ? `${label}: API chưa xong sau ${max / 1000}s (${left})`
      : `${label}: API chạy xong sau ${(ms / 1000).toFixed(1)}s (ngưỡng ${limit / 1000}s)`;
    try { test.info().annotations.push({ type: 'perf', description }); } catch { /* ngoài test */ }
  }
}
