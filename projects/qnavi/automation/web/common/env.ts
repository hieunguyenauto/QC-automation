import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

export type EnvConfig = {
  name: string;
  cmsBaseUrl: string;
  actionTimeoutMs: number;
  navigationTimeoutMs: number;
  testTimeoutMs: number;
};

function loadEnv(): EnvConfig {
  const envName = process.env.ENV || 'stg';
  const file = path.resolve(__dirname, `../env/${envName}.json`);
  if (!fs.existsSync(file)) {
    throw new Error(`Không thấy env/${envName}.json. Đặt ENV=dev|stg hoặc tạo file mới trong env/.`);
  }
  const cfg = JSON.parse(fs.readFileSync(file, 'utf-8')) as EnvConfig;
  if (process.env.CMS_BASE_URL) cfg.cmsBaseUrl = process.env.CMS_BASE_URL;
  return cfg;
}

export const env = loadEnv();
