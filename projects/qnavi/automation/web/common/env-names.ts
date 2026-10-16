import { env } from './env';

/**
 * Tên hiển thị / login ID theo môi trường.
 * Code và data viết theo tên gốc (toridoll-test: Linksys…). Môi trường khác khai báo luật đổi tên trong
 * env/<ENV>.json › rename: [[pattern, thay bằng, flags?], …] — chạy lần lượt từ trên xuống (luật dài / cụ thể đặt trước).
 *   N('LINKSYS STORE00006')      → tên đúng môi trường (vd est-test: 'Arabica Store6')
 *   NR(/LINKSYS STORE0000\d/)   → regex đúng môi trường
 *   envData(json)               → đổi mọi chuỗi trong data/*.json
 * Không có rename → giữ nguyên (toridoll-test).
 */
const rules: [RegExp, string][] = (env.rename ?? []).map(([p, r, f]) => [new RegExp(p, f ?? 'g'), r]);

export function N(s: string): string {
  let out = s;
  for (const [re, r] of rules) out = out.replace(re, r);
  return out;
}
/** Regex đúng môi trường: dùng luật regexRename nếu có (vd 'LINKSYS STORE0000\\d' → 'Arabica Store\\d'), không thì giữ nguyên. */
export function NR(re: RegExp): RegExp {
  let src = re.source;
  for (const [p, r] of env.regexRename ?? []) src = src.split(p).join(r);
  return new RegExp(src, re.flags);
}
export function envData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data), (_k, v) => (typeof v === 'string' ? N(v) : v)) as T;
}
