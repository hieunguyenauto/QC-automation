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
  /** Ngưỡng performance khi đợi API thực tế (common/wait.ts waitApiPerf; mặc định 30s). Quá ngưỡng → ghi cảnh báo PERFORMANCE, không fail. */
  apiPerfLimitMs: number;
  /** Đợi API tối đa bao lâu (mặc định 120s); quá → ghi PERFORMANCE rồi chạy tiếp. */
  apiMaxWaitMs: number;
  /** Basic Auth của môi trường (hộp đăng nhập trình duyệt). Mật khẩu: .env HTTP_AUTH_PASSWORD. */
  httpAuth?: { username: string };
  /** Tính sẵn từ httpAuth + .env để truyền vào Playwright (undefined = môi trường không có Basic Auth). */
  httpCredentials?: { username: string; password: string };
  /** Tài khoản test theo role (không có mật khẩu). Mật khẩu: .env CMS_<role>_PASSWORD. */
  accounts?: Record<string, Account & { variants?: Record<string, Account & { storeName?: string }> }>;
};

function loadEnv(): EnvConfig {
  const list = fs.readdirSync(path.resolve(__dirname, '../env')).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, ''));
  const envName = process.env.ENV;
  // Bắt buộc chọn môi trường: không có mặc định để tránh chạy nhầm.
  if (!envName) throw new Error(`Chưa chọn môi trường. Thêm ENV=<tên> trước lệnh, vd: ENV=est-test npm run suite -- E2E-01. Có: ${list.join(', ')}`);
  const file = path.resolve(__dirname, `../env/${envName}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Không thấy env/${envName}.json. Có: ${list.join(', ')} — hoặc tạo file mới trong env/.`);
  }
  const cfg = JSON.parse(fs.readFileSync(file, 'utf-8')) as EnvConfig;
  if (process.env.CMS_BASE_URL) cfg.cmsBaseUrl = process.env.CMS_BASE_URL;
  cfg.apiPerfLimitMs ??= 30_000;
  cfg.apiMaxWaitMs ??= 120_000;
  if (cfg.httpAuth) {
    const username = (process.env.HTTP_AUTH_USER || cfg.httpAuth.username || '').trim();
    const password = (process.env.HTTP_AUTH_PASSWORD || '').trim();
    if (!password) throw new Error(`env/${envName}.json có Basic Auth → cần HTTP_AUTH_PASSWORD trong .env`);
    cfg.httpCredentials = { username, password };
  }
  return cfg;
}

export const env = loadEnv();
