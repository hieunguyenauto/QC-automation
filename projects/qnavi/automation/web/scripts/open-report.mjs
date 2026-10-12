// Mở report HTML của lần chạy mới nhất (hoặc thư mục truyền vào: npm run report -- reports/<run>).
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const root = path.resolve(process.cwd(), 'reports', 'Runs');
let dir = process.argv[2];
if (!dir) {
  const runs = fs.existsSync(root)
    ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'html'))).sort()
    : [];
  if (!runs.length) {
    console.error('Chưa có report nào trong reports/. Chạy npm test trước.');
    process.exit(1);
  }
  dir = path.join(root, runs[runs.length - 1]);
}
execSync(`npx playwright show-report "${path.join(dir, 'html')}"`, { stdio: 'inherit' });
