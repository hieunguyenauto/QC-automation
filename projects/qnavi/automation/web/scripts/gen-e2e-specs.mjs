#!/usr/bin/env node
/**
 * Sinh tests/cms/e2e-suite/E2E-NN.spec.ts (E2E-02 … E2E-39) từ file TC LOCKED:
 *   projects/qnavi/qc/test-cases/e2e-suite/E2E-NN-*-test-cases.md
 * Mỗi TC = 1 tc(...), mỗi bước = 1 step('<nguyên văn cột Steps>') với code thao tác cụ thể; đọc được như E2E-01.
 * TC sinh từ cùng 1 khuôn (_tools/gen_e2e.py) → mỗi loại TC (cột Function) = 1 khuôn code bên dưới.
 * TC không thuộc loại nào / số bước khác khuôn → dừng, báo (thêm khuôn, không sửa TC).
 *
 * Chạy:   node scripts/gen-e2e-specs.mjs            (sinh lại tất cả — sau khi TC đổi revision)
 *         node scripts/gen-e2e-specs.mjs 12 13      (chỉ E2E-12, E2E-13)
 *         node scripts/gen-e2e-specs.mjs --check    (không ghi: báo file nào lệch TC — thay cho dry-run)
 * E2E-00 / E2E-01 viết tay, không sinh.
 */
import fs from 'fs';
import path from 'path';

const WEB = path.resolve(import.meta.dirname, '..');
const TC_DIR = path.resolve(WEB, '../../qc/test-cases/e2e-suite');
const OUT_DIR = path.resolve(WEB, 'tests/cms/e2e-suite');
const data = JSON.parse(fs.readFileSync(path.join(WEB, 'data/e2e-suite.json'), 'utf8'));

// ---------- đọc TC ----------
function loadCase(no) {
  const nn = String(no).padStart(2, '0');
  const file = fs.readdirSync(TC_DIR).find((f) => f.startsWith(`E2E-${nn}-`) && f.endsWith('-test-cases.md'));
  if (!file) return null;
  const text = fs.readFileSync(path.join(TC_DIR, file), 'utf8');
  const st = text.match(/State: (\w+) · Revision: (\d+)/);
  if (st?.[1] !== 'LOCKED') throw new Error(`${file}: State ≠ LOCKED`);
  const title = text.match(/^# Test case — (.*)$/m)?.[1] ?? `E2E-${nn}`;
  const rows = text.split('\n').filter((l) => l.startsWith(`| E2E${nn}-TC-`)).map((l) => {
    const c = l.replace(/^\|\s*/, '').replace(/\s*\|\s*$/, '').split(' | ').map((x) => x.trim());
    return { id: c[0], func: c[4], pre: c[5], steps: c[6].split('<br>'), exp: c[7], role: c[8] };
  });
  return { nn, file: `projects/qnavi/qc/test-cases/e2e-suite/${file}`, rev: Number(st[2]), title, rows };
}

// ---------- tham số từ chữ TC → biểu thức code ----------
/** Chuỗi TS: nháy đơn; chứa ' (chữ TC) mà không chứa " → nháy kép cho dễ đọc. */
const q = (s) => {
  const v = String(s).replace(/\\/g, '\\\\');
  return v.includes("'") && !v.includes('"') ? `"${v}"` : `'${v.replace(/'/g, "\\'")}'`;
};
/** Chữ hiển thị có tên Linksys (tiêu đề tc / step) → N(…) đổi theo môi trường (common/env-names.ts, env/<ENV>.json › rename). */
const nq = (s) => (/linksys/i.test(String(s)) ? `N(${q(s)})` : q(s));
const WHO = [
  [/ChainStore Manager 'LINKSYS MANAGER(\d{5})'/g, (m) => `managerWho('${m[1]}')`, (m) => data.managers[m[1]]],
  [/ChainStore \(02\) 'linksysstore(\d{5})'/g, (m) => `storeWho('${m[1]}')`, (m) => data.stores[m[1]]?.who],
  [/SubAdmin \(98\)/g, () => "'98'", () => '98'],
  [/Worker Company \(05\)/g, () => "'05'", () => '05'],
  [/(?<!Sub)Admin \(99\)/g, () => "'99'", () => '99'],
];
/** Tài khoản theo thứ tự xuất hiện: { code, who }. */
function whosIn(text) {
  const found = [];
  for (const [re, code, who] of WHO) for (const m of text.matchAll(re)) found.push({ i: m.index, code: code(m), who: who(m) });
  return found.sort((a, b) => a.i - b.i);
}
const who1 = (text) => { const w = whosIn(text)[0]; if (!w) throw new Error(`TC không ghi tài khoản: ${text}`); return w; };
const namesIn = (text) => [...new Set([...text.matchAll(/'(E2E\d{2}-(?:New|Cont)[\w-]*)'/g)].map((m) => m[1]))];
function statusesIn(text) {
  const out = []; let pending = [];
  for (const m of text.matchAll(/'([^']+)'/g)) {
    if (/^E2E\d{2}-/.test(m[1])) pending.push(m[1]);
    else if (pending.length) { for (const n of pending) out.push([n, m[1]]); pending = []; }
  }
  return out;
}
function badgesIn(text) {
  const m = text.match(/[Bb]adge(?: stays)? '([^']+)'(?: \/ '([^']+)')?/);
  return m ? [m[1], m[2]].filter(Boolean) : [];
}
/** Tổng 税込 theo chữ TC → { expr, fix } (fix: cần FIX từ TC-001). */
function totalIn(text) {
  if (/within ¥10,000–¥20,000/.test(text)) return { expr: 'Math.min(20_000, Math.max(FIX! + 1, 15_000))', fix: true };
  const y = text.match(/total = ¥([\d,]+)/);
  if (y) return { expr: y[1].replace(/,/g, '_').replace(/^_/, ''), fix: false };
  if (/FIX − 1/.test(text)) return { expr: 'FIX! - 1', fix: true };
  if (/FIX \+ 1/.test(text)) return { expr: 'FIX! + 1', fix: true };
  if (/FIX \(boundary\)/.test(text)) return { expr: 'FIX!', fix: true };
  throw new Error(`Không đọc được số tiền trong TC: ${text}`);
}
const approvedStatus = (s) => /Verify: '承認済み'/.test(s) || /Verify: .*'承認済み' \(/.test(s);
const badgeLines = (text) => { const b = badgesIn(text); return b.length ? [`await d.expectBadges(${b.map(q).join(', ')});`] : []; };
const statusLines = (text) => statusesIn(text).map(([n, s]) => `await d.expectEstimateStatus(${q(n)}, ${q(s)});`);

// ---------- khuôn code theo loại TC ----------
/** Trạng thái lúc sinh (biết trước theo thứ tự TC): báo giá được duyệt / vừa 提示 của từng phase → TC thanh toán. */
function makeState() { return { approved: { new: undefined, cont: undefined }, last: { new: undefined, cont: undefined } }; }

function handler(r, g) {
  const f = r.func;
  const ph = f.startsWith('CONTINUE') ? 'cont' : 'new';
  const T = ph === 'cont' ? 't2' : 't';
  const S = r.steps.filter((s) => /^\d/.test(s));

  if (/^SETUP · /.test(f)) {
    const type = S[1].match(/承認タイプ = '([^']+)'/);
    const check = type ? [`await expect(e.chain.storeValue('承認タイプ')).toContainText(${q(type[1])});`]
      : /no 承認タイプ/.test(S[1]) ? [`await expect(e.chain.storeValue('承認タイプ'), "store không có dòng '承認タイプ'").toHaveCount(0);`]
      : /auto approve/.test(S[1]) ? [
        "// 'auto approve is set' = chi tiết store có '限度額' (Hieu Nguyen confirm 15/10/2026, dò thật toridoll-test STORE00005).",
        "await expect(e.chain.storeValue('限度額'), \"auto approve: '限度額' có giá trị\").toContainText(/[¥￥]\\s*[\\d,]+/);"]
      : [];
    const empty = /is empty/.test(S[2]);
    return {
      pre: [`await e.commonSetup(${/シサンNAVI ON/.test(r.pre)});`],
      steps: [
        ['await e.openChain();'],
        ['await e.chain.openStore(storeName(STORE));', "await expect(e.chain.storeValue('限度額')).toBeVisible({ timeout: 20_000 });", ...check],
        empty ? ['const fix = await e.chain.limitAmount();', "expect(fix, \"'限度額' phải trống\").toBeNull();", 'FIX = null;']
          : ['const fix = await e.chain.limitAmount();', "expect(fix, '限度額 trống — TC cần FIX').not.toBeNull();", 'FIX = fix;'],
      ],
      exp: [/no 限度額/.test(r.exp) ? 'expect(FIX).toBeNull();' : 'expect(FIX).toBeGreaterThan(0);'],
    };
  }

  if (/creates trouble \(トラブルナビ/.test(f)) {
    const w = who1(S[0]);
    const asset = /'資産' \(field shown/.test(S[3]);
    return {
      timeout: 480_000,
      steps: [
        [`await e.switchTo(${w.code});`],
        [`await e.createStep1(STORE, ${w.who.startsWith('01')});`],
        ['await c.openTroubleNavi(data.categories.navi);', 'await e.navi.expectOpened(data.categories.navi);'],
        [
          "for (const l of ['中項目', '小項目', '症状']) await e.navi.pick(l);",
          asset ? "await e.navi.pick('資産', data.asset.navi);" : "await expect(e.navi.hasSelect('資産'), \"no field '資産' because シサンNAVI OFF\").toHaveCount(0);",
          'await e.navi.next();',
        ],
        [
          'await e.navi.requestAsIsButton().click();',
          '// TC: bấm 2 lần (E2E-01 recon 14/10: sau lần 1 vẫn còn nút).',
          "await expect(e.navi.requestAsIsButton(), \"TC bước 5: nút 'このまま依頼する' lần 2\").toBeVisible({ timeout: 15_000 });",
          'await e.navi.requestAsIsButton().click();',
        ],
        ['await e.navi.uploadPhoto(data.files.fault);', 'await e.navi.sendDetail(e.note);'],
        ["await e.navi.chooseTiming('至急');", 'await e.submitTrouble(t);   // R14: id / 番号 từ response POST /troubles'],
        [
          "test.info().annotations.push({ type: 'webview-done', description: (await e.navi.doneText()).slice(0, 300) });",
          'await e.navi.backToTop();',
          'await e.openCreated(t, STORE);',
        ],
      ],
      exp: [
        "await d.expectBadges('問い合わせ中', '受注待ち');", "await d.expectInfo('業者', '未確定');", "await d.expectInfo('見積書', '未提出');",
        ...(asset ? ['await e.edit.expectAssetInList(data.asset.navi);   // hàng 資産 chỉ có nút 資産一覧 → modal (dò thật 2026-10-16)'] : []),
      ],
    };
  }

  if (/creates trouble \(web form/.test(f)) {
    const w = who1(S[0]);
    const asset = S.some((s) => /新しい機器を登録する/.test(s));
    const steps = [[`await e.switchTo(${w.code});`]];
    if (w.who === '99') {
      steps.push(["await e.layout.menu('作業依頼登録');", 'await c.startNew();']);
      steps.push([
        'await c.openChainStoreSearch();', "await c.expandSearch('店名');", "await c.fillSearch('社名', data.chain.companyQuery);",
        "await c.fillSearch('店名', storeName(STORE));", 'await c.search();', 'await c.pickStore(storeName(STORE));',
        'await c.openStaff();', 'await c.pickFirstStaff();', "await c.next('作業項目選択');",
      ]);
    } else steps.push([`await e.createStep1(STORE, ${w.who.startsWith('01')});`]);
    steps.push([
      'await c.openCategory(0); await c.chooseCategory(data.categories.noNavi);',
      'await c.openCategory(1); await c.chooseCategory(data.categories.medium);',
      'await c.openCategory(2); await c.chooseCategory(data.categories.small);',
    ]);
    if (asset) steps.push([
      'await c.tickHasAsset();', 'await c.openAssetSelect();', 'await c.assets.openRegister();',
      "await c.assets.fillField('名称', data.asset.name);", "await c.assets.fillField('型式', data.asset.model);",
      "await c.assets.fillField('製造番号', data.asset.serial);", 'await c.assets.uploadImage(0, data.files.asset);',
      'await c.assets.save();', 'expect(await c.assets.selectRows(data.asset.name, 1)).toBe(1);', 'await c.assets.decide();',
      'await expect(c.content).toContainText(data.asset.name);',
    ]);
    steps.push(["await c.next('故障詳細');", 'await c.uploadFaultImage(0, data.files.fault);', 'await c.fillFaultDetail(e.note);']);
    steps.push([
      'Object.assign(t, await c.submitWithDateFallback());   // R14',
      'if (!t.id || !t.number) {',
      '  await d.expectOpened(t.id);',
      '  t.id ??= sc.page.url().match(/troubles\\/(\\d+)\\/detail/)?.[1];',
      '  t.number ??= await d.number();',
      '}',
      'await minimizeChat(sc.page);',
    ]);
    return {
      timeout: 480_000, steps,
      exp: [
        "expect(t.id ?? t.number, 'Không lấy được id / 依頼番号 của trouble vừa tạo').toBeTruthy();",
        'await e.openTrouble(t);',
        "await d.expectBadges('問い合わせ中', '受注待ち');", "await d.expectInfo('業者', '未確定');", "await d.expectInfo('見積書', '未提出');",
        ...(asset ? ['await e.edit.expectAssetInList(data.asset.name);   // hàng 資産 chỉ có nút 資産一覧 → modal (dò thật 2026-10-16)'] : []),
      ],
    };
  }

  if (/Set urgent: 案件区分 営業停止案件/.test(f)) return {
    steps: [
      [`await e.open('99', ${T});`, "await d.headerButton('編集');", 'await e.edit.expectOpened();'],
      ["await e.edit.setCaseType('営業停止案件');", 'await e.edit.save();'],
    ],
    exp: [`await e.openTrouble(${T});`, "await expect(rowOf(d.content, '案件区分')).toContainText('営業停止案件');"],
  };

  if (/Urgent inherited: 案件区分 営業停止案件/.test(f)) return {
    steps: [["await e.open('99', t2);", "await expect(rowOf(d.content, '案件区分')).toContainText('営業停止案件');"]],
    exp: ["await expect(rowOf(d.content, '案件区分')).toContainText('営業停止案件');"],
  };

  if (/Admin: 対応中 \+ assign worker/.test(f)) return {
    steps: [
      ["await e.open('99', t);"],
      ['await d.openQuickAction();', "await d.setStatus('対応中');"],
      ["await d.editRow('作業者');", 'await d.expandSearch();', 'await d.searchWorker(data.worker.companyQuery);',
        'await d.pickWorker(data.worker.loginId);', 'await expect(d.statusModal).toContainText(data.worker.companyName);'],
      ['await d.saveStatus();'],
    ],
    exp: ["await d.expectBadges('対応中', '受注待ち');", "await d.expectInfo('業者', data.worker.companyName);"],
  };

  if (/NEW · 受注 → 移動中 → 到着/.test(f)) return {
    pre: ["await e.open('99', t);"],
    steps: ['受注', '移動中', '到着'].map((l) => [`await e.moveFlow(${q(l)});`]),
    exp: ["await d.expectBadges('対応中', '到着');"],
  };

  if (/^NEW · Create \d+ estimate/.test(f)) {
    const w = who1(S[0]);
    const names = namesIn(S[1]);
    const sub = /Tick all/.test(S[2]) ? names : namesIn(S[2].split(';')[0]).filter((n) => names.includes(n));
    const card = S[0].match(/見積もり '(必須|任意)'/)?.[1] ?? '必須';
    const status = approvedStatus(S[2]) ? '承認済み' : '承認待ち';
    const tot = totalIn(f);
    g.last.new = sub[0]; if (status === '承認済み') g.approved.new = sub[0];
    return {
      steps: [
        [...(tot.fix ? ['needFix();'] : []), `await e.open(${w.code}, t);`, 'await d.openQuickAction();', "await d.setFlow('見積承認待ち');",
          `await expect(rowOf(d.statusModal, '見積もり')).toContainText(${q(card)});`],
        ['await d.openEstimateFromStatus();', `for (const n of [${names.map(q).join(', ')}]) { await e.newEstimate(n, ${tot.expr}); totals.set(n, ${tot.expr}); }`],
        [`await d.submitEstimates([${sub.map(q).join(', ')}], ${q(status)});`,
          ...names.filter((x) => !sub.includes(x)).map((n) => `await d.expectEstimateStatus(${q(n)}, '下書き');`)],
        ['await d.closeEstimateModal();', ...(/select '作業中'/.test(S[3]) ? ["await d.setFlow('作業中');"] : []), 'await d.saveStatus();'],
      ],
      exp: [
        ...badgeLines(r.exp),
        ...(/見積書 = 税抜/.test(r.exp) ? [`await d.expectInfo('見積書', new RegExp(\`[¥￥]\\\\s*\${Number(storePriceFor(totals.get(${q(sub[0])})!)).toLocaleString('en-US')}\`));`] : []),
        ...(/見積書 'あり'/.test(r.exp) ? ["await d.expectInfo('見積書', 'あり');"] : []),
      ],
    };
  }

  if (/^CONTINUE · Create \d+ estimate/.test(f)) {
    const names = namesIn(S[0]);
    const status = approvedStatus(S[1]) ? '承認済み' : '承認待ち';
    const tot = totalIn(f);
    g.last.cont = names[0]; if (status === '承認済み') g.approved.cont = names[0];
    return {
      steps: [
        [...(tot.fix ? ['needFix();'] : []), "await e.open('99', t2);", 'await d.openQuickAction();', 'await d.openEstimateFromStatus();',
          `for (const n of [${names.map(q).join(', ')}]) { await e.newEstimate(n, ${tot.expr}); totals.set(n, ${tot.expr}); }`],
        [`await d.submitEstimates([${names.map(q).join(', ')}], ${q(status)});`],
        ['await d.closeEstimateModal();', ...(/select '見積承認待ち'/.test(S[2]) ? ["await d.setContinuationFlow('見積承認待ち');"] : []), 'await d.saveStatus();'],
      ],
      exp: badgeLines(r.exp),
    };
  }

  if (/· Approve \(\d+ level/.test(f)) {
    const name = namesIn(S[0])[0];
    return {
      steps: S.map((s) => {
        if (/Login/.test(s)) {
          const w = who1(s);
          return [`await e.open(${w.code}, ${T});`, `await e.openEstimatesAs(${w.code});`, `await d.openEstimateMenu(${q(name)});`,
            "for (const b of ['承認する', '差し戻し']) await expect(d.estimateAction('manager', b), `card 店舗 has '${b}'`).toBeVisible();"];
        }
        const lines = [`await d.approveEstimate(${q(name)});`];
        if (/Verify: '稟議承認中' \(not yet '承認済み'\)/.test(s)) lines.push(`await d.expectEstimateStatus(${q(name)}, '稟議承認中');`);
        else if (/not yet '承認済み'/.test(s)) lines.push(`await expect(d.estimateRow(${q(name)}).locator('.badge')).not.toHaveText('承認済み');`);
        else if (/Verify: '稟議承認中'/.test(s)) lines.push(`await d.expectEstimateStatus(${q(name)}, '稟議承認中');`);
        else { lines.push(`await d.expectEstimateStatus(${q(name)}, '承認済み');`); g.approved[ph] = name; }
        if (/'承認する' disappears for this approver/.test(s)) lines.push(`await d.openEstimateMenu(${q(name)});`, "await expect(d.estimateAction('manager', '承認する'), \"'承認する' disappears for this approver\").toHaveCount(0);");
        return lines;
      }),
      exp: ['await d.closeEstimates();', ...badgeLines(r.exp)],
    };
  }

  if (/Approve type 04 \(稟議, sequential managers\)/.test(f)) {
    const name = namesIn(S[1])[0];
    g.approved[ph] = name;
    const approveAs = (lv) => [`await e.open(managerWho(RINGI[${lv}]), ${T});`, 'await d.openEstimates();', `await d.approveEstimate(${q(name)});`];
    return {
      timeout: 480_000,
      steps: [
        [`const total = totals.get(${q(name)});`, `test.skip(total == null, ${q(`Không biết tổng của '${name}' (TC tạo báo giá chưa chạy trong lần này)`)});`,
          'levels = ringiLevels(total!);', "test.info().annotations.push({ type: 'ringi', description: `${yen(total!)} → cần Lv1–Lv${levels}` });"],
        [...approveAs(0), `await d.expectEstimateStatus(${q(name)}, levels > 1 ? '稟議承認中' : '承認済み');`],
        [
          "if (levels === 1) test.info().annotations.push({ type: 'ringi', description: 'Chỉ cần Lv1 — không có Lv tiếp' });",
          'for (let lv = 1; lv < levels; lv++) {',
          `  await e.open(managerWho(RINGI[lv]), ${T});`, '  await d.openEstimates();', `  await d.approveEstimate(${q(name)});`,
          "  await expect(d.estimateAction('manager', '承認する'), `'承認する' disappears for Lv${lv + 1}`).toHaveCount(0, { timeout: 15_000 });",
          '}',
          `await d.expectEstimateStatus(${q(name)}, '承認済み');`,
        ],
      ],
      exp: ['await d.closeEstimates();', ...badgeLines(r.exp)],
    };
  }

  if (/Admin approves on behalf of each Lv/.test(f)) {
    const name = namesIn(S[0])[0];
    g.approved[ph] = name;
    return {
      steps: [
        [`const total = totals.get(${q(name)});`, `test.skip(total == null, ${q(`Không biết tổng của '${name}'`)});`,
          'levels = ringiLevels(total!);', "test.info().annotations.push({ type: 'ringi', description: `${yen(total!)} → cần Lv1–Lv${levels}` });",
          `await e.open('99', ${T});`, "await e.openEstimatesAs('99');", `await d.openEstimateMenu(${q(name)});`],
        [`await d.approveEstimate(${q(name)});`, `if (levels > 1) await d.expectEstimateStatus(${q(name)}, '稟議承認中');`],
        [`for (let lv = 1; lv < levels; lv++) await d.approveEstimate(${q(name)});   // R29: kiểm ở cuối`, `await d.expectEstimateStatus(${q(name)}, '承認済み');`],
      ],
      exp: ['await d.closeEstimates();', ...badgeLines(r.exp)],
    };
  }

  if (/≤ FIX → auto approve/.test(f)) {
    const name = namesIn(r.exp)[0];
    g.approved[ph] = name;
    return {
      steps: [[`await e.open('99', ${T});`, "await sc.page.reload(); await waitApisIdle(sc.page, 'F5');", `await d.expectOpened(${T}.id);`,
        'await d.openQuickAction(); await d.openEstimateFromStatus();']],
      exp: [`await d.expectEstimateStatus(${q(name)}, '承認済み');`, "await expect(d.estimateModal, \"no '稟議承認中'\").not.toContainText('稟議承認中');",
        'await d.closeEstimates();', ...badgeLines(r.exp)],
    };
  }

  if (/Other estimates? → 失効/.test(f)) return {
    steps: [[`await e.open('99', ${T});`, "await sc.page.reload(); await waitApisIdle(sc.page, 'F5');", `await d.expectOpened(${T}.id);`,
      'await d.openQuickAction(); await d.openEstimateFromStatus();']],
    exp: [...statusLines(r.exp), 'await d.closeEstimates();'],
  };

  if (/差し戻し → コピー → 新規提示/.test(f)) {
    const name = namesIn(S[0])[0];
    const copy = `${name}-copy`;
    const w = who1(S[0]);
    g.last[ph] = copy;
    return {
      steps: [
        [`await e.open(${w.code}, ${T});`, `await e.openEstimatesAs(${w.code});`, `await d.openEstimateMenu(${q(name)});`],
        [`await d.rejectEstimate(${q(name)}, data.text.reject);`, `await d.expectEstimateStatus(${q(name)}, '差し戻し');`],
        [`await e.open('99', ${T});`, "await e.openEstimatesAs('99');", `await d.openEstimateMenu(${q(name)});`,
          "await expect(d.estimateAction('worker', '編集'), \"only 'コピー' is available\").toHaveCount(0);",
          `await d.copyEstimate(${q(name)});`, `await d.fillEstimateName(${q(copy)});`, `await d.decideEstimate(${q(copy)});`,
          `totals.set(${q(copy)}, totals.get(${q(name)}) ?? 0);`, `await d.submitEstimates([${q(copy)}], '承認待ち');`],
      ],
      exp: [`await d.expectEstimateStatus(${q(name)}, '差し戻し');`, `await d.expectEstimateStatus(${q(copy)}, '承認待ち');`, 'await d.closeEstimates();'],
    };
  }

  if (/取り下げ申請 → /.test(f)) {
    const name = namesIn(S[0])[0];
    const ap = who1(S[1]);
    const approve = /承認 → 再提示/.test(f);
    const copy = `${name}-copy`;
    g.last[ph] = approve ? name : copy;
    return {
      steps: [
        [`await e.open('99', ${T});`, "await e.openEstimatesAs('99');", `await d.requestCancel(${q(name)}, data.text.cancel);`,
          `await d.expectEstimateStatus(${q(name)}, '取り下げ申請中');`],
        [`await e.open(${ap.code}, ${T});`, `await e.openEstimatesAs(${ap.code});`, `await d.openEstimateMenu(${q(name)});`,
          `await d.answerCancelRequest(${q(name)}, ${q(approve ? '取り下げ承認' : '取り下げ却下')}, ${q(approve ? 'Automation approve cancel' : 'Automation reject cancel')});`,
          ...(approve ? ["// R12-2: báo giá về 下書き → manager không còn nút '見積もり' → kiểm '見積書' = '未提出'.",
            "await d.expectInfo('見積書', '未提出');"]
            : ["// R12-2: 取り下げ却下 → '見積書: 未提出', manager không còn nút '見積もり'.",
              "await d.expectInfo('見積書', '未提出');"])],
        [`await e.open('99', ${T});`, "await e.openEstimatesAs('99');",
          ...(approve ? [
            `await d.expectEstimateStatus(${q(name)}, '下書き');`,
            `await d.editEstimate(${q(name)});`, `await d.decideEstimate(${q(name)});`, `await d.submitEstimates([${q(name)}], /^(再承認待ち|承認待ち)$/);`,
            `test.info().annotations.push({ type: 'observed-status', description: \`Q1 (lượt 9): sau 取り下げ承認 → 提示, '${name}' = '\${(await d.estimateRow(${q(name)}).locator('.badge').innerText()).trim()}'\` });`,
          ] : [
            `await d.expectEstimateStatus(${q(name)}, '失効');   // R12-1: sau 取り下げ却下 báo giá gốc = 失効`,
            `await d.openEstimateMenu(${q(name)});`, "await expect(d.estimateAction('manager', '承認する')).toHaveCount(0);",
            "await expect(d.estimateAction('worker', '取り下げ申請'), \"only 'コピー' is available\").toHaveCount(0);",
            `await d.copyEstimate(${q(name)});`, `await d.fillEstimateName(${q(copy)});`, `await d.decideEstimate(${q(copy)});`,
            `totals.set(${q(copy)}, totals.get(${q(name)}) ?? 0);`, `await d.submitEstimates([${q(copy)}], '承認待ち');`,
          ])],
      ],
      exp: [
        ...(approve ? [`await d.expectEstimateStatus(${q(name)}, /^(再承認待ち|承認待ち)$/);`]
          : [`await d.expectEstimateStatus(${q(name)}, '失効');`, `await d.expectEstimateStatus(${q(copy)}, '承認待ち');`]),
        'await d.closeEstimates();',
      ],
    };
  }

  if (/Urgent: Admin approves 1 estimate/.test(f)) {
    const name = namesIn(S[0])[0];
    g.approved[ph] = name;
    return {
      steps: [
        [`await e.open('99', ${T});`, "await e.openEstimatesAs('99');", `await d.approveEstimate(${q(name)});`],
        ["await waitApisIdle(sc.page, '承認');"],
      ],
      exp: [...statusLines(r.exp), 'await d.closeEstimates();', ...badgeLines(r.exp)],
    };
  }

  if (/Re-submit AFTER approved/.test(f)) {
    const nn = namesIn(S[0])[0];
    if (!/auto/.test(S[1])) throw new Error(`Chưa có khuôn cho re-submit cần người duyệt: ${S[1]}`);
    const tot = totalIn(S[0]);
    g.approved[ph] = nn;
    return {
      steps: [
        [...(tot.fix ? ['needFix();'] : []), `await e.open('99', ${T});`, "await e.openEstimatesAs('99');",
          `await e.newEstimate(${q(nn)}, ${tot.expr}); totals.set(${q(nn)}, ${tot.expr});`, `await d.submitEstimates([${q(nn)}]);`],
        [`await d.expectEstimateStatus(${q(nn)}, '承認済み');`],
      ],
      exp: [...statusLines(r.exp), 'await d.closeEstimates();'],
    };
  }

  if (/Read-key store views/.test(f)) {
    const name = namesIn(S[0])[0];
    const w = who1(S[0]);
    return {
      steps: [[`await e.open(${w.code}, ${T});`, 'await d.openEstimates();', `await d.openEstimateMenu(${q(name)});`,
        `const total = totals.get(${q(name)});`,
        `if (total != null) await expect(d.estimateRow(${q(name)}), 'amounts shown in clear').toContainText(yen(total));`,
        "for (const b of ['承認する', '差し戻し']) await expect(d.estimateAction('manager', b)).toHaveCount(0);"]],
      exp: [`await expect(d.estimateRow(${q(name)})).not.toContainText('***');`, 'await d.closeEstimates();'],
    };
  }

  if (/^NEW · 作業完了 → 報告済/.test(f)) {
    const late = S.find((s) => /At 02-08: .*'承認する'/.test(s));
    const lateName = late ? namesIn(late)[0] : undefined;
    if (lateName) g.approved.new = lateName;
    const pdf = S.some((s) => /attach PDF/.test(s));
    return {
      steps: [
        ["await e.open('99', t);", "await e.moveFlow('作業完了');"],
        ...(lateName ? [[`await e.lateApprove(${q(lateName)});`]] : []),
        ['await d.openQuickAction();', "await d.setFlow('報告済');", `await e.reportForm(${pdf ? 'data.files.pdf' : ''});`],
        ['await d.saveStatus();'],
      ],
      exp: [
        "await d.expectBadges('対応中', '報告済');",
        ...(lateName ? ['await d.openEstimates();', ...statusLines(r.exp), 'await d.closeEstimates();'] : []),
        ...(pdf ? ["await d.headerButton('報告書');", "await expect(modal(sc.page, '報告書')).toContainText(data.files.pdf);",
          "await closeModal(modal(sc.page, '報告書'));   // để mở thì che nút ログアウト của TC sau (E2E-39 16/10/2026)"] : []),
      ],
    };
  }

  if (/確認・決済 → 完了/.test(f)) {
    const w = who1(S[0]);
    const pay = g.approved[ph] ?? g.last[ph];
    return {
      steps: [
        [`await e.open(${w.code}, ${T});`, 'await minimizeChat(sc.page);'],
        pay ? [`const total = totals.get(${q(pay)});   // báo giá được duyệt: '${pay}' (chạy tiếp trên trouble có sẵn → không biết tổng, bỏ kiểm số tiền)`,
          "await e.paymentOpen(data.estimate.item, total != null ? yen(total) : '');"] : ['await e.paymentOpen(data.estimate.item);'],
        ['await e.paymentSubmit();'],
      ],
      exp: [
        "await d.expectBadges('完了', '報告済');",
        ...(ph === 'new' ? ["await expect(d.content.locator('button', { hasText: /^\\s*作業完了確認\\s*$/ })).toHaveCount(0);"]
          : ['await e.openTrouble(t);', "await d.expectBadges('完了');"]),
      ],
    };
  }

  if (/creates 継続依頼 '_2'/.test(f)) {
    const w = who1(S[0]);
    return {
      steps: [
        ["test.skip(!t.number, 'Chưa có 依頼番号 NEW');", `await e.switchTo(${w.code});`,
          "srcSmall = await e.smallItemOf(t);   // 作業項目（小） của trouble gốc — để kiểm 'filled from the original'",
          "await e.layout.menu('作業依頼登録');", "await c.start('継続依頼');"],
        ['await c.pickContinuationSource(t.number!);', 'await expect(c.content).toContainText(storeName(STORE));',
          'await expect(c.content).toContainText(`番号: ${t.number}`);', "await expect(c.content, '作業項目 filled from the original').toContainText(srcSmall);"],
        ['await c.submitContinuation();', 'await expect(sc.page).toHaveURL(/\\/admin\\/troubles\\/\\d+\\/detail/, { timeout: 30_000 });',
          't2.id = sc.page.url().match(/troubles\\/(\\d+)\\/detail/)?.[1];   // R14', 'await d.expectOpened(t2.id);', 't2.number = await d.number();'],
      ],
      exp: ['expect(t2.number).toBe(`${t.number}_2`);', "await d.expectBadges('対応中', '見積待ち');"],
    };
  }

  if (/CONTINUE · 作業スタッフ kept/.test(f)) {
    const w = who1(r.role);
    return { steps: [[`await e.open(${w.code}, t2);`]], exp: ["await d.expectInfo('業者', data.worker.companyName);"] };
  }

  if (/CONTINUE · 日程確定 → 移動中/.test(f)) {
    const lateName = S[2] ? namesIn(S[2])[0] : undefined;
    if (lateName) g.approved.cont = lateName;
    return {
      steps: [
        ["await e.open('99', t2);", "await e.moveFlow('日程確定', true);"],
        ["for (const l of ['移動中', '到着', '作業中', '作業完了']) await e.moveFlow(l, true);"],
        ...(lateName ? [[`await e.lateApprove(${q(lateName)});`]] : []),
      ],
      exp: ["await d.expectBadges('対応中', '作業完了');", ...(lateName ? ['await d.openEstimates();', ...statusLines(r.exp), 'await d.closeEstimates();'] : [])],
    };
  }

  if (/CONTINUE · 報告済/.test(f)) return {
    steps: [["await e.open('99', t2);", 'await e.report(true);']],
    exp: ["await d.expectBadges('対応中', '報告済');"],
  };

  throw new Error(`Chưa có khuôn cho loại TC: '${f}'`);
}

// ---------- ghi file ----------
const ind = (lines, n) => lines.map((l) => ' '.repeat(n) + l).join('\n');
function stepCode(label, lines) {
  return lines.length === 1 && !lines[0].startsWith('const ') && !lines[0].includes('//')
    ? `  await step(${nq(label)}, async () => { ${lines[0]} });`
    : `  await step(${nq(label)}, async () => {\n${ind(lines, 4)}\n  });`;
}

function generate(c) {
  const store = c.rows[0].func.match(/LINKSYS STORE(\d{5})/)?.[1];
  if (!store || !(store in data.stores)) throw new Error(`${c.file}: TC-001 không có store hợp lệ`);
  const g = makeState();
  const used = new Set();
  const blocks = c.rows.map((r) => {
    const h = handler(r, g);
    const numbered = r.steps.filter((s) => /^\d/.test(s));
    if (h.steps.length !== numbered.length) throw new Error(`${r.id}: khuôn có ${h.steps.length} bước ≠ TC ${numbered.length} bước`);
    const role = (whosIn(r.role)[0]?.who ?? '99').split(':')[0];
    const body = [];
    if (h.pre) body.push(stepCode(`Pre-condition: ${r.pre}`, h.pre));
    numbered.forEach((s, i) => body.push(stepCode(s, h.steps[i])));
    for (const n of r.steps.filter((s) => !/^\d/.test(s))) body.push(`  test.info().annotations.push({ type: 'tc-note', description: ${q(n)} });`);
    body.push(stepCode(`Expected: ${r.exp}`, h.exp));
    const code = body.join('\n');
    for (const k of ['srcSmall', 'closeModal', 'needFix', 'levels', 'totals', 'rowOf', 'minimizeChat', 'modal', 'waitApisIdle', 'storePriceFor', 'taxOf', 'ringiLevels', 'RINGI', 'yen', 'managerWho', 'storeWho', 'storeName', 'data\\.'])
      if (new RegExp(`\\b${k}`).test(code)) used.add(k.replace('\\.', ''));
    return `tc(${q(r.id)}, ${nq(r.func)}, ${q(role)}, async () => {\n${code}\n}${h.timeout ? `, ${String(h.timeout).replace(/(\d)(?=(\d{3})+$)/g, '$1_')}` : ''});`;
  });

  const suite = ['E2E', 'assertTcRevision', ...['managerWho', 'storeName', 'storePriceFor', 'storeWho', 'taxOf', 'ringiLevels', 'RINGI', 'yen'].filter((k) => used.has(k)), 'type Trouble'];
  const ui = ['closeModal', 'minimizeChat', 'modal', 'rowOf'].filter((k) => used.has(k));
  const head = [
    "import { expect, test } from '@playwright/test';",
    "import dataRaw from '../../../data/e2e-suite.json';",
    "import { serialScenario } from '../../../common/scenario';",
    `import { ${suite.join(', ')} } from '../../../common/e2e-suite';`,
    ...(ui.length ? [`import { ${ui.join(', ')} } from '../../../common/ui';`] : []),
    ...(used.has('waitApisIdle') ? ["import { waitApisIdle } from '../../../common/wait';"] : []),
    "import { N, envData } from '../../../common/env-names';",
    'const data = envData(dataRaw);',
    '',
    '/**',
    ` * ${c.title} — TC: ${c.file} (LOCKED rev ${c.rev}, ${c.rows.length} TC).`,
    ' * FILE SINH TỰ ĐỘNG từ TC — không sửa tay. TC đổi → node scripts/gen-e2e-specs.mjs; cần thao tác mới → sửa khuôn trong script hoặc screens/ / common/.',
    ' * 1 tc() = 1 TC, step = nguyên văn cột Steps. Chạy nối tiếp trên 1 trình duyệt; TC fail → TC sau không chạy.',
    ` * Chạy: ENV=toridoll-test npm run suite -- E2E-${c.nn}`,
    ' * Chạy tiếp trên trouble có sẵn: E2E_TROUBLE_ID=<id NEW> E2E_TROUBLE2_ID=<id _2> E2E_FIX=<限度額> … --grep "TC-00[6-9]|TC-01"',
    ' */',
    "test.describe.configure({ mode: 'serial' });",
    "// E2E_DRY=1 (kiểm / recon): không mở app (R36). Kiểm TC ↔ code: node scripts/gen-e2e-specs.mjs --check",
    "test.skip(!!process.env.E2E_DRY, 'E2E_DRY: không chạy app');",
    `const STORE = '${store}' as const;`,
    'const t: Trouble = { id: process.env.E2E_TROUBLE_ID || undefined };',
    'const t2: Trouble = { id: process.env.E2E_TROUBLE2_ID || undefined };',
    'let FIX: number | null | undefined = process.env.E2E_FIX ? Number(process.env.E2E_FIX) : undefined;',
    ...(used.has('totals') ? ['/** Tổng 税込 của từng báo giá tạo trong lần chạy. */', 'const totals = new Map<string, number>();'] : []),
    ...(used.has('levels') ? ['let levels = 1;   // số cấp 稟議 cần theo tổng'] : []),
    ...(used.has('srcSmall') ? ["let srcSmall = '';   // 作業項目（小） của trouble gốc (TC 継続依頼)"] : []),
    "const sc = serialScenario(() => [t.number ? `NEW ${t.number} (id ${t.id})` : '', t2.number ? `CONT ${t2.number} (id ${t2.id})` : '', FIX != null ? `FIX ${FIX}` : '']);",
    'let e: E2E;',
    `test.beforeAll(() => { assertTcRevision(${q(c.file)}, ${c.rev}); e = new E2E(sc.page, ${Number(c.nn)}); });`,
    'const step = test.step;',
    'const tc = (id: string, title: string, role: string, body: () => Promise<void>, timeout = 300_000) =>',
    '  test(`${id} ${title}`, { tag: [`@${id}`, `@role-${role}`] }, async () => { test.setTimeout(timeout); await body(); });',
    ...(used.has('needFix') ? ["const needFix = () => test.skip(!FIX, 'Chưa có FIX (TC-001 chưa chạy) — hoặc đặt E2E_FIX');"] : []),
  ];
  // d = e.detail, c = e.create: viết tắt trong từng TC (chỉ khai báo khi dùng)
  const withAbbr = (b) => b.replace(/^(tc\([^\n]*async \(\) => \{\n)([\s\S]*)$/, (_m, h, rest) =>
    h + [/\bd\./.test(rest) ? '  const d = e.detail;' : '', /\bc\./.test(rest) ? '  const c = e.create;' : ''].filter(Boolean).map((x) => x + '\n').join('') + rest);
  return head.join('\n') + '\n\n' + blocks.map(withAbbr).join('\n\n') + '\n';
}

// ---------- main ----------
const args = process.argv.slice(2);
const check = args.includes('--check');
const nums = args.filter((a) => /^\d+$/.test(a)).map(Number);
const list = nums.length ? nums : Array.from({ length: 38 }, (_, i) => i + 2);
let bad = 0;
for (const no of list) {
  const c = loadCase(no);
  if (!c) continue;
  const out = path.join(OUT_DIR, `E2E-${c.nn}.spec.ts`);
  let code;
  try { code = generate(c); } catch (err) { console.error(`✘ E2E-${c.nn}: ${err.message}`); bad++; continue; }
  if (check) {
    const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (cur !== code) { console.error(`✘ E2E-${c.nn}: spec lệch TC rev ${c.rev} → chạy node scripts/gen-e2e-specs.mjs ${no}`); bad++; }
    else console.log(`✓ E2E-${c.nn} (rev ${c.rev}, ${c.rows.length} TC)`);
  } else {
    fs.writeFileSync(out, code);
    console.log(`→ ${path.relative(WEB, out)} (rev ${c.rev}, ${c.rows.length} TC)`);
  }
}
process.exit(bad ? 1 : 0);
