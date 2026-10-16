import fs from 'fs';
import { execFileSync } from 'child_process';
import path from 'path';
import type { FullResult, Reporter, Suite, TestCase, TestResult, TestStep } from '@playwright/test/reporter';

/**
 * Report cho QC — 3 thư mục tổng, mọi tên theo [tên testcase]_[dd-mm-yyyy_HH-mm-ss]_[ENV]:
 *
 * reports/
 *   Passed/<kịch bản>_<ngày giờ>_<ENV>/      ← 1 thư mục / lần chạy (không tách từng TC)
 *       PASSED.md                   ← danh sách TC pass + mốc tua trong video
 *       video-full.webm             ← video ĐẦY ĐỦ cả lần chạy
 *   Failed/<TC ID>_<tên TC>_<ngày giờ>_<ENV>/
 *       FAIL.md                     ← mỗi trường 1 dòng: TC, ngày, môi trường, tài khoản, bước fail, lỗi, URL…
 *       video-fail.webm             ← đoạn video riêng của TC fail (cắt từ video cả lần chạy, cần ffmpeg)
 *       screenshot.png · aria-snapshot.yml · error-context.md · trace.zip
 *   Runs/<tên bộ test>_<ngày giờ>_<ENV>/
 *       SUMMARY.md                  ← tổng quan lần chạy: link Passed / Failed, danh sách TC bị bỏ qua (không còn thư mục Skipped)
 *       html/ · results.json · junit.xml · artifacts/   ← report gốc Playwright
 *       video/<lần chạy>.webm      ← video đầy đủ (chỉ khi lần chạy không có TC pass; có pass thì chuyển sang Passed/…/video-full.webm)
 *   HISTORY.md                      ← mỗi lần chạy 1 dòng
 */
type Row = { test: TestCase; result: TestResult };

const pad = (n: number) => String(n).padStart(2, '0');
const dmy = (d: Date) => `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
const stampOf = (d: Date) => `${dmy(d)}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
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
/** Cảnh báo môi trường (annotation 'env-warning', vd hộp lỗi app đã tự đóng) — gộp, bỏ trùng. */
function warnOf(test: TestCase): string {
  return [...new Set(test.annotations.filter((a) => a.type === 'env-warning').map((a) => a.description ?? ''))].join(' · ');
}
/** Cảnh báo performance (annotation 'perf') — lưu tạm để check sau, không làm fail TC. */
function perfOf(test: TestCase): string {
  return test.annotations.filter((a) => a.type === 'perf').map((a) => a.description ?? '').join(' · ');
}
function firstLine(msg: string): string {
  return strip(msg).split('\n').map((l) => l.trim()).find(Boolean) ?? '';
}
function grab(msg: string, label: string): string | undefined {
  return strip(msg).match(new RegExp(`^\\s*${label}:\\s*(.+)$`, 'm'))?.[1]?.trim();
}

/** Che giá trị ô mật khẩu trong snapshot: 'textbox "パスワード" [ref=e27]: xxx' → '…: ***'. */
export const maskSecrets = (text: string) =>
  text.replace(/(textbox "[^"]*(?:パスワード|[Pp]assword)[^"]*"(?: \[[^\]]*\])*): .+/g, '$1: ***');

export default class QcReporter implements Reporter {
  private rows: Row[] = [];
  private start = new Date();
  constructor(private opts: { reportsRoot: string; runDir: string; stamp?: string; envName?: string; baseUrl?: string }) {}

  onBegin(_config: unknown, _suite: Suite) {
    this.start = new Date();
  }
  onTestEnd(test: TestCase, result: TestResult) {
    // Lần retry cuối cùng mới tính.
    this.rows = this.rows.filter((r) => r.test.id !== test.id);
    this.rows.push({ test, result });
  }

  async onEnd(full: FullResult) {
    // --list / không có test nào chạy → không ghi report, không thêm HISTORY.
    if (!this.rows.length) return;
    const root = path.resolve(this.opts.reportsRoot);
    const out = path.resolve(this.opts.runDir);
    fs.mkdirSync(out, { recursive: true });
    for (const d of ['Passed', 'Failed']) fs.mkdirSync(path.join(root, d), { recursive: true });
    const passed = this.rows.filter((r) => r.result.status === 'passed');
    const failed = this.rows.filter((r) => r.result.status === 'failed' || r.result.status === 'timedOut' || r.result.status === 'interrupted');
    const skipped = this.rows.filter((r) => r.result.status === 'skipped');
    const env = this.opts.envName ?? process.env.ENV ?? '-';
    const stamp = this.opts.stamp ?? stampOf(this.start);
    const nameOf = (t: TestCase) => `${tcId(t)}_${slug(tcName(t))}_${stamp}_${env}`;
    const rel = (p: string) => path.relative(out, p).split(path.sep).join('/');
    // Video cả kịch bản (e2e): reports/Runs/<lần chạy>/video/*.webm + start.txt (mốc 00:00).
    const videoDir = path.join(out, 'video');
    let video = fs.existsSync(videoDir) ? fs.readdirSync(videoDir).find((f) => f.endsWith('.webm')) : undefined;
    // Đặt tên video theo lần chạy cho dễ tìm: video/<tên lần chạy>.webm
    if (video && video !== `${path.basename(out)}.webm`) {
      try { fs.renameSync(path.join(videoDir, video), path.join(videoDir, `${path.basename(out)}.webm`)); video = `${path.basename(out)}.webm`; } catch { /* giữ tên cũ */ }
    }
    const videoStart = video && fs.existsSync(path.join(videoDir, 'start.txt')) ? Number(fs.readFileSync(path.join(videoDir, 'start.txt'), 'utf8')) : undefined;
    const at = (d: Date) => {
      if (!videoStart) return '';
      const s = Math.max(0, Math.round((d.getTime() - videoStart) / 1000));
      return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
    };
    /** Cắt đoạn video [from, to] (ms tính từ đầu video) ra file riêng. Cần ffmpeg (brew install ffmpeg) hoặc FFMPEG_PATH. */
    const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
    let ffmpegMissing = false;
    const clip = (fromMs: number, toMs: number, target: string): boolean => {
      if (!video || ffmpegMissing) return false;
      const src = path.join(videoDir, video);
      const ss = Math.max(0, fromMs / 1000).toFixed(1);
      const t = Math.max(1, (toMs - fromMs) / 1000).toFixed(1);
      const tries = [
        ['-y', '-ss', ss, '-i', src, '-t', t, '-an', '-c:v', 'libvpx', '-b:v', '1M', '-deadline', 'realtime', '-cpu-used', '8', target],
        ['-y', '-ss', ss, '-i', src, '-t', t, '-c', 'copy', target],
      ];
      for (const args of tries) {
        try { execFileSync(ffmpeg, args, { stdio: 'ignore', timeout: 120_000 }); if (fs.existsSync(target) && fs.statSync(target).size > 0) return true; }
        catch (e) { if ((e as NodeJS.ErrnoException).code === 'ENOENT') { ffmpegMissing = true; return false; } }
      }
      return false;
    };
    const when = dmyhm(this.start);
    // Nơi để video đầy đủ sau cùng: có TC pass → Passed/<lần chạy>/video-full.webm, không thì giữ ở Runs/<lần chạy>/video/.
    const passDir = path.join(root, 'Passed', path.basename(out));
    const finalVideo = video ? (passed.length ? path.join(passDir, 'video-full.webm') : path.join(videoDir, video)) : undefined;
    const linkVideo = (from: string) => (finalVideo ? path.relative(from, finalVideo).split(path.sep).join('/') : '');
    const sortById = (a: Row, b: Row) => tcId(a.test).localeCompare(tcId(b.test), 'en', { numeric: true });

    // ---------- failed/ ----------
    const failLinks: string[] = [];
    for (const { test, result } of failed.sort(sortById)) {
      const dir = path.join(root, 'Failed', nameOf(test));
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
          if (/\.(yml|md|txt)$/.test(target)) {
            // Snapshot trang (aria / error-context) ghi cả giá trị ô mật khẩu → che trước khi ghi vào reports/.
            const text = a.path && fs.existsSync(a.path) ? fs.readFileSync(a.path, 'utf8') : a.body?.toString();
            if (text == null) continue;
            fs.writeFileSync(target, maskSecrets(text));
          } else if (a.path && fs.existsSync(a.path)) fs.copyFileSync(a.path, target);
          else if (a.body) fs.writeFileSync(target, a.body);
          else continue;
          files.push(path.basename(target));
        } catch { /* bỏ qua file đính kèm lỗi */ }
      }
      // Đoạn video riêng của TC fail: từ 3s trước khi TC bắt đầu → 3s sau khi fail.
      let failClip = false;
      if (video && videoStart) {
        const from = result.startTime.getTime() - videoStart - 3000;
        const to = result.startTime.getTime() + result.duration - videoStart + 3000;
        failClip = clip(from, to, path.join(dir, 'video-fail.webm'));
        if (failClip) files.push('video-fail.webm');
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
        ['Bug đã biết', test.annotations.find((a) => a.type === 'fail')?.description ?? '-'],
        ['Thời gian chạy', secs(result.duration)],
        ['Bước fail', failedStep(result.steps) ?? '-'],
        ['Lỗi', firstLine(msg) || '-'],
        ['Locator', grab(msg, 'Locator') ?? '-'],
        ['Expected', grab(msg, 'Expected(?: substring| string| value)?') ?? '-'],
        ['Received', grab(msg, 'Received(?: string| value)?') ?? '-'],
        ['Vị trí code', loc],
        ['URL lúc fail', url ?? '-'],
        ['Dữ liệu (trouble)', trouble ?? '-'],
        ['Cảnh báo môi trường', warnOf(test) || '-'],
        ['Performance', perfOf(test) || '-'],
        ['Video đoạn fail', failClip ? 'video-fail.webm (từ 3s trước khi TC bắt đầu → 3s sau khi fail)' : video ? (ffmpegMissing ? '- (chưa cài ffmpeg: brew install ffmpeg — xem video cả lần chạy bên dưới)' : '- (cắt video lỗi — xem video cả lần chạy)') : '-'],
        ['Video cả lần chạy', video ? `${linkVideo(dir)} — tua tới ${at(result.startTime)} (TC bắt đầu) → ${at(new Date(result.startTime.getTime() + result.duration))} (fail)` : '- (chỉ có ở kịch bản e2e; tắt bằng E2E_VIDEO=off)'],
        ['Trace (xem từng bước)', files.includes('trace.zip') ? 'trace.zip — mở: npx playwright show-trace trace.zip (hoặc kéo file vào https://trace.playwright.dev)' : '-'],
        ['File đính kèm', files.length ? files.join(', ') : '-'],
        ['File spec', `${path.relative(process.cwd(), test.location.file)}:${test.location.line}`],
      ];
      const md = [
        `# FAIL · ${tcId(test)} · ${dmyhm(result.startTime)} · ${env}`,
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
      failLinks.push(`| ${tcId(test)} | ${cell(tcName(test))} | ${cell(failedStep(result.steps) ?? '-')} | ${cell(firstLine(msg).slice(0, 120))} | [FAIL.md](${rel(path.join(dir, 'FAIL.md'))}) |`);
    }

    // ---------- Passed/<lần chạy>/ (1 thư mục, không tách từng TC) ----------
    let passedMd = '';
    if (passed.length) {
      fs.mkdirSync(passDir, { recursive: true });
      if (video) {
        try { fs.renameSync(path.join(videoDir, video), path.join(passDir, 'video-full.webm')); fs.rmSync(videoDir, { recursive: true, force: true }); }
        catch { try { fs.copyFileSync(path.join(videoDir, video), path.join(passDir, 'video-full.webm')); } catch { /* bỏ qua */ } }
      }
      passedMd = path.join(passDir, 'PASSED.md');
      fs.writeFileSync(passedMd, [
        `# PASSED · ${path.basename(out)}`, '',
        `Chạy lúc ${when} · môi trường ${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''} · Pass ${passed.length} / ${this.rows.length}`, '',
        video ? `Video đầy đủ: [video-full.webm](video-full.webm) — cột "Tua video" là mốc mm:ss của từng TC.` : 'Video: - (chỉ có ở kịch bản e2e; tắt bằng E2E_VIDEO=off)', '',
        '| TC ID | Test case | Tài khoản / role | Thời gian | Tua video | Ghi chú |', '|---|---|---|---|---|---|',
        ...passed.sort(sortById).map(({ test, result }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${role(test)} | ${secs(result.duration)} | ${video ? `${at(result.startTime)} → ${at(new Date(result.startTime.getTime() + result.duration))}` : '-'} | ${cell([perfOf(test), warnOf(test)].filter(Boolean).join(' · ')) || '-'} |`),
        '', `Report gốc: reports/Runs/${path.basename(out)}/SUMMARY.md`, '',
      ].join('\n'));
    }
    const passLinks = passed.sort(sortById).map(({ test, result }) =>
      `| ${tcId(test)} | ${cell(tcName(test))} | ${role(test)} | ${secs(result.duration)} | ${video ? at(result.startTime) : '-'} |`);
    // ---------- Skipped: không tạo file riêng, chỉ liệt kê trong SUMMARY ----------
    const skipLinks = skipped.sort(sortById).map(({ test }) => {
      const why = test.annotations.find((a) => a.type === 'skip')?.description ?? 'Không chạy (TC trước fail trong kịch bản nối tiếp, hoặc thiếu điều kiện)';
      return `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(why)} |`;
    });
    // ---------- SUMMARY.md ----------
    const total = this.rows.length;
    const warnLinks = this.rows.filter(({ test }) => warnOf(test)).sort(sortById)
      .map(({ test }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(warnOf(test))} |`);
    const perfRows = this.rows.filter(({ test }) => perfOf(test)).sort(sortById);
    const perfLinks = perfRows.map(({ test }) => `| ${tcId(test)} | ${cell(tcName(test))} | ${cell(perfOf(test))} |`);
    if (perfRows.length) {
      // Log tạm dồn qua các lần chạy → check sau (reports/PERFORMANCE.md)
      const pf = path.join(root, 'PERFORMANCE.md');
      if (!fs.existsSync(pf)) fs.writeFileSync(pf, '# Performance cần check (lưu tạm, không làm fail TC)\n\n| Ngày | Môi trường | TC ID | Chi tiết | Lần chạy |\n|---|---|---|---|---|\n');
      fs.appendFileSync(pf, perfRows.map(({ test }) => `| ${when} | ${env} | ${tcId(test)} | ${cell(perfOf(test))} | ${path.basename(out)} |`).join('\n') + '\n');
    }
    fs.writeFileSync(path.join(out, 'SUMMARY.md'), [
      `# ${path.basename(out)}`, '',
      `Chạy lúc ${when} · môi trường ${env}${this.opts.baseUrl ? ` (${this.opts.baseUrl})` : ''}`, '',
      '| Tổng | Pass | Fail | Skip | Thời gian | Trạng thái |', '|---|---|---|---|---|---|',
      `| ${total} | ${passed.length} | ${failed.length} | ${skipped.length} | ${secs(full.duration)} | ${full.status.toUpperCase()} |`, '',
      ...(warnLinks.length ? ['## Cảnh báo môi trường (app hiện hộp lỗi, test đã tự đóng — cần báo dev / theo dõi)', '', '| TC ID | Test case | Cảnh báo |', '|---|---|---|', ...warnLinks, ''] : []),
      ...(perfLinks.length ? ['## Performance (lưu tạm để check sau — không làm fail TC; log dồn: reports/PERFORMANCE.md)', '', '| TC ID | Test case | Chi tiết |', '|---|---|---|', ...perfLinks, ''] : []),
      '## Failed', '', ...(failLinks.length ? ['| TC ID | Test case | Bước fail | Lỗi | Chi tiết |', '|---|---|---|---|---|', ...failLinks] : ['Không có.']), '',
      '## Passed', '', ...(passLinks.length ? [`Chi tiết + video đầy đủ: [PASSED.md](${rel(passedMd)})`, '', '| TC ID | Test case | Tài khoản / role | Thời gian | Tua video |', '|---|---|---|---|---|', ...passLinks] : ['Không có.']), '',
      '## Skipped', '', ...(skipLinks.length ? ['| TC ID | Test case | Lý do |', '|---|---|---|', ...skipLinks] : ['Không có.']), '',
      finalVideo ? `Video cả lần chạy: [${linkVideo(out)}](${linkVideo(out)}) — mốc tua từng TC ghi trong PASSED.md / FAIL.md; TC fail có thêm video-fail.webm.${ffmpegMissing ? ' (Chưa cắt được đoạn fail: cài ffmpeg bằng `brew install ffmpeg`.)' : ''}\n` : '',
      'Report gốc của Playwright: `npm run report` (thư mục `html/` cạnh file này) — bấm vào TC fail để xem trace / ảnh.', '',
    ].join('\n'));

    // Video cả lần chạy luôn được giữ (kể cả khi pass hết) — theo yêu cầu 14/10.

    // ---------- reports/HISTORY.md ----------
    const hist = path.join(root, 'HISTORY.md');
    if (!fs.existsSync(hist)) fs.writeFileSync(hist, '# Lịch sử chạy\n\n| Ngày | Môi trường | Tổng | Pass | Fail | Skip | Lần chạy (reports/Runs/) |\n|---|---|---|---|---|---|---|\n');
    fs.appendFileSync(hist, `| ${when} | ${env} | ${total} | ${passed.length} | ${failed.length} | ${skipped.length} | ${path.basename(out)} |\n`);

    console.log(`\n[QC report] Pass ${passed.length} · Fail ${failed.length} · Skip ${skipped.length}\n  → reports/Passed/<lần chạy> · reports/Failed\n  → ${path.relative(process.cwd(), path.join(out, 'SUMMARY.md'))}`);
  }

  printsToStdio() {
    return false;
  }
}
