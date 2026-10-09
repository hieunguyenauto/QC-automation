import fs from 'fs';
import path from 'path';
import type { CmsRole } from '../data/roles';

/** File lưu phiên đăng nhập (localStorage TOKEN / ADMIN_INFO) của 1 role. Thư mục .auth/ bị gitignore. */
export function authFile(role: CmsRole): string {
  return path.resolve(__dirname, `../.auth/cms-${role}.json`);
}

export function hasAuth(role: CmsRole): boolean {
  return fs.existsSync(authFile(role));
}
