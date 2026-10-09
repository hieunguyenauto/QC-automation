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

export function credentials(role: CmsRole): { loginId: string; password: string } | null {
  const loginId = process.env[`CMS_${role}_ID`];
  const password = process.env[`CMS_${role}_PASSWORD`];
  return loginId && password ? { loginId, password } : null;
}
