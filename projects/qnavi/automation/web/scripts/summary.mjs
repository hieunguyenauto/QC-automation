// In SUMMARY.md của lần chạy mới nhất (hoặc thư mục truyền vào: npm run summary -- reports/<run>).
import fs from 'fs';
import path from 'path';
const root = path.resolve(process.cwd(), 'reports', 'Runs');
let dir = process.argv[2];
if (!dir) {
  const runs = fs.existsSync(root) ? fs.readdirSync(root).filter((d) => fs.existsSync(path.join(root, d, 'SUMMARY.md'))).sort() : [];
  if (!runs.length) { console.error('Chưa có SUMMARY.md nào trong reports/. Chạy test trước.'); process.exit(1); }
  dir = path.join(root, runs[runs.length - 1]);
}
console.log(`Thư mục: ${path.relative(process.cwd(), dir)}\n`);
console.log(fs.readFileSync(path.join(dir, 'SUMMARY.md'), 'utf8'));
console.log('Thư mục tổng: reports/Passed · reports/Failed · reports/Skipped · lịch sử: reports/HISTORY.md');
