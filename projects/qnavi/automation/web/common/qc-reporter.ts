import fs from 'fs';
import path from 'path';
import type { FullResult, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

/**
 * Report dễ đọc cho QC, ghi cạnh report HTML của Playwright:
 *
 * reports/<lần chạy>/
 *   SUMMARY.md                         ← tổng quan: số pass / fail / skip, link tới từng fail
 *   passed/PASSED.md                   ← bảng các TC pass
 *   failed/<TC ID>_<tên TC>_<dd-mm-yyyy>/
 *       FAIL.md                        ← mỗi trường 1 dòng: TC, ngày, môi trường, tài khoản, bước fail, lỗi, URL…
 *       screenshot.png · aria-snapshot.yml · error-context.md · trace.zip
 *   skipped/SKIPPED.md                 ← TC không chạy (vd TC trước fail ở kịch bản nối tiếp)
 *   html/ · results.json · junit.xml   ← report gốc của Playwright (giữ nguyên)
 * reports/HISTORY.md                   ← mỗi lần chạy thêm 1 dòng (ngày, môi trường, pass / fail)
 */
type Row = { test: TestCase; result: TestResult };

const pad = (n: number) => String(n).padStart(2, '0');
const dmy = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const dmyhm = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const secs = (ms: number) => `${(ms / 1000).toFixed(1)}s`;
const strip = (s: string) => s.replace(/\u001b\[[0-9;]*m/g, '');
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n+/g, ' ');
const slug = (s: string) =>
  s.normalize('NFKC').replace(/[\\/:*?"<>|#%{}^~[\]`'.,()（）「」]+/g, ' ').trim().replace(/\s+/g, '-').slice(0, 50) || 'test';

function tcId(test: TestCase): string {
  const fromTitle = test.title.match(/[A-Z][A-Z0-9]*-TC-\d+/)?.[0];
  const fromTag = test.tags.map((t) => t.replace(/^@/, '')).find((t) => /-TC-\d+$/.test(t));
  return fromTitle ?? fromTag ?? 'NO-ID';
}
function tcName(test: TestCase): string {
  return test.title.replace(/^[A-Z][A-Z0-9]*-TC-\d+\s*/, '').trim() || test.title;
}
function role(test: TestCase): string {
  const r = test.tags.find((t) => t.startsWith('@role-'))?.replace('@role-', '');
  const desc = test.parent?.title?.match(/^\[(.+)\]$/)?.[1];
  return [r, desc].filter(Boolean).join(' · ') || '-';
}
/** Bước (test.step) sâu nhất có lỗi, kèm đường dẫn bước cha. */
function failedStep(steps: TestStep[], trail: string[] = []): string | undefined {
  for (const s of steps) {
    if (!s.error) continue;
    const here = s.category === 'test.step' ? [...trail, s.title] : trail;
    return failedStep(s.steps, here) ?? (here.length ? here.join(' › ') : undefined);
  }
  return undefined;
}
function firstLine(msg: string): string {
  return strip(msg).split('\n').map((l) => l.trim()).find(Boolean) ?? '';
}
function grab(msg: string, label: string): string | undefined {
  return strip(msg).match(new RegExp(`^\\s*${label}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}

export default class QcReporter implements Reporter {
  private rows: Row[] = [];
  private start = new Date();
  constructor(private opts: { outputFolder: string; envName?: string; baseUrl?: string }) {}

  onBegin(_config: unknown, _suite: Suite) {
    this.start = new Date();
  }
  onTestEnd(test: TestCase, result: TestResult) {
    // Lần retry cuối cùng mới tính.
    this.rows = this.rows.filter((r) => r.test.id !== test.id);
    this.rows.push({ test, result });
  }

  async onEnd(full: FullResult) {
    const out = path.resolve(this.opts.outputFolder);
    fs.mkdirSync(out, { recursive: true });
    const passed = this.rows.filter((r) => r.result.status === 'passed');
    const failed = this.rows.filter((r) => r.result.status === 'failed' || r.result.status === 'timedOut' || r.result.status === 'interrupted');
    const skipped = this.rows.filter((r) => r.result.status === 'skipped');
    const env = this.opts.envName ?? process.env.ENV ?? '-';
    const when = dmyhm(this.start);
    const sortById = (a: Row, b: Row) => tcId(a.test).localeCompare(tcId(b.test), 'en', { numeric: true });

    // ---------- failed/ ----------
    const failLinks: string[] = [];
    for (const { test, result } of failed.sort(sortById)) {
      const dir = path.join(out, 'failed', `${tcId(test)}_${slug(tcName(test))}_${dmy(result.startTime)}`);
      fs.mkdirSync(dir, { recursive: true });
      const files: string[] = [];
      let n = 0;
      for (const a of result.attachments) {
        const ext = a.contentType.includes('png') ? '.png' : a.contentType.includes('yaml') ? '.yml'
          : a.contentType.includes('zip') ? '.zip' : a.contentType.includes('markdown') ? '.md' : path.extname(a.path ?? '') || '.txt';
        const base = a.name === 'screenshot' ? 'screenshot' : a.name === 'aria-snapshot' ? 'aria-snapshot'
          : a.name === 'trace' ? 'trace' : a.name === 'error-context' ? 'error-context' : slug(a.name);
        let target = path.join(dir, base + ext);
        if (fs.existsSync(target)) target = path.join(dir, `${base}-${++n}${ext}`);
        try {
          if (a.path && fs.existsSync(a.path)) fs.copyFileSync(a.path, target);
          else if (a.body) fs.writeFileSync(target, a.body);
          else continue;
          files.push(path.basename(target));
        } catch { /* bỏ qua file đính kèm lỗi */ }
      }
      const err = result.errors[0];
      const msg = err?.message ?? err?.value ?? '';
      const loc = err?.location ? `${path.relative(process.cwd(), err.location.file)}:${err.location.line}` : '-';
      const trouble = test.annotations.find((a) => a.type === 'trouble')?.description;
      const url = result.attachments.find((a) => a.name === 'url')?.body?.toString();
      const fields: [string, string][] = [
        ['Test case', `${tcId(test)} — ${tcName(test)}`],
        ['Ngày chạy', dmyhm(result.startTime)],
        ['Môi trường', `${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''}`],
        ['Tài khoản / role', role(test)],
        ['Kết quả', result.status === 'timedOut' ? 'FAILED (timeout)' : 'FAILED'],
        ['Thời gian chạy', secs(result.duration)],
        ['Bước fail', failedStep(result.steps) ?? '-'],
        ['Lỗi', firstLine(msg) || '-'],
        ['Locator', grab(msg, 'Locator') ?? '-'],
        ['Expected', grab(msg, 'Expected(?: substring| string| value)?') ?? '-'],
        ['Received', grab(msg, 'Received(?: string| value)?') ?? '-'],
        ['Vị trí code', loc],
        ['URL lúc fail', url ?? '-'],
        ['Dữ liệu (trouble)', trouble ?? '-'],
        ['File đính kèm', files.length ? files.join(', ') : '-'],
        ['File spec', `${path.relative(process.cwd(), test.location.file)}:${test.location.line}`],
      ];
      const md = [
        `# FAIL · ${tcId(test)} · ${dmy(result.startTime)}`,
        '',
        '| Trường | Giá trị |',
        '|---|---|',
        ...fields.map(([k, v]) => `| ${k} | ${cell(v)} |`),
        '',
        '## Lỗi đầy đủ',
        '```',
        strip(msg).trim() || '(không có)',
        '```',
        '',
        files.includes('trace.zip') ? 'Xem trace: `npx playwright show-trace "' + path.join(dir, 'trace.zip') + '"`' : '',
        '',
      ].join('\n');
      fs.writeFileSync(path.join(dir, 'FAIL.md'), md);
      failLinks.push(`| ${tcId(test)} | ${cell(tcName(test))} | ${cell(failedStep(result.steps) ?? '-')} | ${cell(firstLine(msg).slice(0, 120))} | [FAIL.md](failed/${path.basename(dir)}/FAIL.md) |`);
    }

    // ---------- passed/ ----------
    if (passed.length) {
      fs.mkdirSync(path.join(out, 'passed'), { recursive: true });
      fs.writeFileSync(path.join(out, 'passed', 'PASSED.md'), [
        `# PASSED · ${when} · ${env}`, '',
        '| TC ID | Test case | Tài khoản / role | Thời gian |', '|---|---|---|---|',
        ...passed.sort(sortById).map(({ test, result }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${role(test)} | ${secs(result.duration)} |`), '',
      ].join('\n'));
    }
    // ---------- skipped/ ----------
    if (skipped.length) {
      fs.mkdirSync(path.join(out, 'skipped'), { recursive: true });
      fs.writeFileSync(path.join(out, 'skipped', 'SKIPPED.md'), [
        `# SKIPPED · ${when} · ${env}`, '',
        '| TC ID | Test case | Lý do |', '|---|---|---|',
        ...skipped.sort(sortById).map(({ test }) => {
          const why = test.annotations.find((a) => a.type === 'skip')?.description ?? 'Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện)';
          return `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(why)} |`;
        }), '',
      ].join('\n'));
    }
    // ---------- SUMMARY.md ----------
    const total = this.rows.length;
    fs.writeFileSync(path.join(out, 'SUMMARY.md'), [
      `# Kết quả chạy · ${when} · ${env}`, '',
      '| Tổng | Pass | Fail | Skip | Thời gian | Trạng thái |', '|---|---|---|---|---|---|',
      `| ${total} | ${passed.length} | ${failed.length} | ${skipped.length} | ${secs(full.duration)} | ${full.status.toUpperCase()} |`, '',
      ...(failLinks.length ? ['## Fail', '', '| TC ID | Test case | Bước fail | Lỗi | Chi tiết |', '|---|---|---|---|---|', ...failLinks, ''] : ['## Fail', '', 'Không có.', '']),
      passed.length ? '## Pass\n\nXem `passed/PASSED.md`.\n' : '',
      skipped.length ? '## Skip\n\nXem `skipped/SKIPPED.md`.\n' : '',
      'Report gốc của Playwright: `npm run report` (thư mục `html/`).', '',
    ].join('\n'));

    // ---------- reports/HISTORY.md ----------
    const hist = path.join(path.dirname(out), 'HISTORY.md');
    if (!fs.existsSync(hist)) fs.writeFileSync(hist, '# Lịch sử chạy\n\n| Ngày | Môi trường | Tổng | Pass | Fail | Skip | Thư mục |\n|---|---|---|---|---|---|---|\n');
    fs.appendFileSync(hist, `| ${when} | ${env} | ${total} | ${passed.length} | ${failed.length} | ${skipped.length} | ${path.basename(out)} |\n`);

    console.log(`\n[QC report] Pass ${passed.length} · Fail ${failed.length} · Skip ${skipped.length} → ${path.relative(process.cwd(), path.join(out, 'SUMMARY.md'))}`);
  }

  printsToStdio() {
    return false;
  }
}
