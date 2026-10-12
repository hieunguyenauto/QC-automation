import { env } from '../common/env';

/**
 * Role CMS. Mã role theo RolePermission của Qnavi.
 * label = tên cột kết quả trong Excel (projects/qnavi/README.md).
 * [cần confirm] map 01 / 02 / 05 với tên cột Excel.
 */
export const CMS_ROLES = {
  '99': { label: 'CMS Admin', code: 'SYSTEM_ADMIN', home: '/admin' },
  '98': { label: 'CMS SubAdmin', code: 'SUB_ADMIN', home: '/admin' },
  '01': { label: 'CMS ChainStore Manager', code: 'STORE_ADMIN', home: '/admin' },
  '02': { label: 'CMS ChainStore', code: 'STORE_GENBA', home: '/admin' },
  '05': { label: 'CMS ManagementCompany', code: 'WORKER_COMPANY', home: '/admin/troubles' },
} as const;

export type CmsRole = keyof typeof CMS_ROLES;

/** Thông tin tài khoản (không mật khẩu) của role trong môi trường đang chạy: env/<ENV>.json › accounts. */
export function account(role: CmsRole) {
  return env.accounts?.[role];
}

/**
 * loginId: .env CMS_<role>_ID (nếu có, để ghi đè) → env/<ENV>.json › accounts.<role>.loginId.
 * password: CHỈ lấy từ .env CMS_<role>_PASSWORD (không commit).
 */
export function credentials(role: CmsRole): { loginId: string; password: string } | null {
  const loginId = (process.env[`CMS_${role}_ID`] || account(role)?.loginId || '').trim();
  const password = (process.env[`CMS_${role}_PASSWORD`] || '').trim();
  return loginId && password ? { loginId, password } : null;
}
