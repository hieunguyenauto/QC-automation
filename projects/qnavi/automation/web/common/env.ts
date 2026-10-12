import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export type Account = { loginId: string; displayName?: string; chainSystem?: string; storeName?: string; note?: string };

export type EnvConfig = {
  name: string;
  cmsBaseUrl: string;
  actionTimeoutMs: number;
  navigationTimeoutMs: number;
  testTimeoutMs: number;
  /** Basic Auth của môi trường (hộp đăng nhập trình duyệt). Mật khẩu: .env HTTP_AUTH_PASSWORD. */
  httpAuth?: { username: string };
  /** Tính sẵn từ httpAuth + .env để truyền vào Playwright (undefined = môi trường không có Basic Auth). */
  httpCredentials?: { username: string; password: string };
  /** Tài khoản test theo role (không có mật khẩu). Mật khẩu: .env CMS_<role>_PASSWORD. */
  accounts?: Record<string, Account & { variants?: Record<string, Account & { storeName?: string }> }>;
};

function loadEnv(): EnvConfig {
  const envName = process.env.ENV || 'stg';
  const file = path.resolve(__dirname, `../env/${envName}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Không thấy env/${envName}.json. Đặt ENV=dev|stg hoặc tạo file mới trong env/.`);
  }
  const cfg = JSON.parse(fs.readFileSync(file, 'utf-8')) as EnvConfig;
  if (process.env.CMS_BASE_URL) cfg.cmsBaseUrl = process.env.CMS_BASE_URL;
  if (cfg.httpAuth) {
    const username = (process.env.HTTP_AUTH_USER || cfg.httpAuth.username || '').trim();
    const password = (process.env.HTTP_AUTH_PASSWORD || '').trim();
    if (!password) throw new Error(`env/${envName}.json có Basic Auth → cần HTTP_AUTH_PASSWORD trong .env`);
    cfg.httpCredentials = { username, password };
  }
  return cfg;
}

export const env = loadEnv();
