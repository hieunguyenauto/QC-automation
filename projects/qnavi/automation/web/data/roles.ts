import { env } from '../common/env';

/**
 * Role CMS. Mã role theo RolePermission của Qnavi.
 * label = tên cột kết quả trong Excel (projects/qnavi/README.md).
 * Xác nhận 2026-10-12 (anh Hiếu): 02 = tài khoản store (linksysstore0000N), 05 = worker company (linksysworkercompany).
 */
export const CMS_ROLES = {
  '99': { label: 'CMS Admin', code: 'SYSTEM_ADMIN', home: '/admin' },
  '98': { label: 'CMS SubAdmin', code: 'SUB_ADMIN', home: '/admin' },
  '01': { label: 'CMS ChainStore Manager', code: 'STORE_ADMIN', home: '/admin' },
  '02': { label: 'CMS ChainStore', code: 'STORE_GENBA', home: '/admin' },
  '05': { label: 'CMS ManagementCompany', code: 'WORKER_COMPANY', home: '/admin/troubles' },
} as const;

export type CmsRole = keyof typeof CMS_ROLES;

/**
 * Thông tin tài khoản (không mật khẩu) của role trong môi trường đang chạy: env/<ENV>.json › accounts.
 * variant: chọn tài khoản cụ thể trong accounts.<role>.variants (vd role 02: 'urgent', 'ringi', 'approveType1'…).
 */
export function account(role: CmsRole, variant?: string) {
  const a = env.accounts?.[role];
  if (!variant) return a;
  const v = a?.variants?.[variant];
  if (!v) throw new Error(`Không có tài khoản ${role}/${variant} trong env/${env.name}.json › accounts.${role}.variants`);
  return v;
}

/**
 * loginId: .env CMS_<role>[_<VARIANT>]_ID (ghi đè) → env/<ENV>.json › accounts.
 * password: CHỈ từ .env — CMS_<role>_<VARIANT>_PASSWORD (nếu có) → CMS_<role>_PASSWORD (dùng chung cho role).
 */
export function credentials(role: CmsRole, variant?: string): { loginId: string; password: string } | null {
  const key = variant ? `CMS_${role}_${variant.toUpperCase()}` : `CMS_${role}`;
  const loginId = (process.env[`${key}_ID`] || (!variant && process.env[`CMS_${role}_ID`]) || account(role, variant)?.loginId || '').trim();
  const password = (process.env[`${key}_PASSWORD`] || process.env[`CMS_${role}_PASSWORD`] || '').trim();
  return loginId && password ? { loginId, password } : null;
}
