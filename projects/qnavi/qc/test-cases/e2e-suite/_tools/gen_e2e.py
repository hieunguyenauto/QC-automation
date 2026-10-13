"""Sinh 39 file test case E2E từ spec/e2e-suite (cases.json). Chạy: python3 gen_e2e.py <out_dir>"""
import json, re, sys, os
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
C = json.load(open(os.path.join(os.path.dirname(__file__), 'cases.json')))
BR = '<br>'

def slug(s):
    s = re.sub(r'[^A-Za-z0-9]+', '-', s.split('/')[0]).strip('-').lower()
    return s[:40] or 'case'

# ---------- vai trò → nhãn tài khoản (chờ G1) ----------
def acc(role, typ):
    r = role.strip().lower()
    if r in ('admin', 'admin (cms)'): return 'CMS Admin (99)'
    if r.startswith('sub admin') or r == 'subadmin': return 'CMS SubAdmin (98)'
    if r == 'chainstore' or r == 'chain store': return f'ChainStore — store type {typ} [G1]'
    if r == 'chainstore manager': return 'ChainStore Manager (01) [G1]'
    if r.startswith('store manager'): return 'Store Manager [G1]'
    if 'level 0' in r: return 'CS Admin Level 0 (substitute) [G1, G21]'
    if r.startswith('cs admin'): return f'CS Admin ({role.split("(")[1].rstrip(")") if "(" in role else "approver"}) [G1]'
    if 'read-key store' in r or 'store (read key)' in r: return 'Store read-key [G1, G18]'
    if 'no key' in r or 'no-key' in r: return 'Store no-key [G1, G18]'
    return f'{role} [G1]'

# ---------- số tiền ----------
def amount(cat, fix):
    c = cat.strip().lower()
    if fix == 'no' or 'no limit' in c: return ('any amount (e.g. ¥10,000) — store has no 限度額', False)
    if c.startswith('<=') or c.startswith('<= fix'): return ('total = FIX − 1', True)
    if 'equal' in c: return ('total = FIX (boundary)', True)
    if '49,999' in c: return ('total = ¥49,999 (> FIX) [G4]', False)
    if '5,000' in c: return ('total = ¥4,999 (< type04 minimum) [G4]', 'min')
    if 'within range' in c: return ("total inside the approver's range [G4]", False)
    if 'high' in c: return ('total = high amount, e.g. ¥9,999,999 [G4]', False)
    if c.startswith('>'): return ('total = FIX + 1', False)
    return (f'{cat} [G4]', False)

def tc_row(t):
    return '| ' + ' | '.join([t['id'], '', 'System (E2E)', t['screen'], t['func'], t['pre'],
                               BR.join(t['steps']), t['exp'], t['role'], 'Web', t.get('prio', 'High'), '', t.get('elig', 'UI-AUTO')]) + ' |'

def build(d):
    n = d['id']; no = int(n.split('-')[1]); P = f'E2E{no:02d}'
    v = d['14'].replace(' /  ', ' / ')
    typ_new = (d['35'] or '1').zfill(2); typ_cont = (d['63'] or '1').zfill(2)
    fix_new = 'yes' if d['32'].startswith('あり') else 'no'
    fix_cont = 'yes' if d['60'].startswith('あり') else 'no'
    urgent_new = d['12'] == '✅'; urgent_cont = d['13'] == '✅' or d['53'] == '✅'
    navi = d['28'] == 'ON'; asset_navi = d['29'] == 'ON'
    creator = d['19']; payer = d['23']; payer_c = d['23']
    est_n = d['31']; est_c = d['59']
    ringi_n = d['38'] not in ('❌', '🚫', ''); ringi_c = d['64'] == '✅'
    reqc = d['36'].startswith('✅'); reqc_res = d['37']
    reedit = d['39']; type_change = d['40'] if d['40'] not in ('🚫', '-', '') else ''
    expire = d['43'] if d['43'] != '🚫' else ''
    after_appr = d['44'] if d['44'] != '🚫' else ''
    approver_n = d['41']; approver_c = d['65']
    new_skip = d['49'] == '🚫'
    keyw, keya = d['10'], d['11']
    amt_n, auto_n = amount(d['33'], fix_new)
    amt_c, auto_c = amount(d['61'].split('/')[0], fix_cont)
    est_creator = d['20']
    cont_creator = d['52']; selector = d['56']; staff_change = d['57'] == '変更あり'
    version = d['54']
    notes, qs = [], set()
    T = []
    def add(screen, func, pre, steps, exp, role, elig='UI-AUTO', q=()):
        T.append(dict(screen=screen, func=func, pre=pre, steps=steps, exp=exp, role=role, elig=elig)); qs.update(q)

    store = f'store type {typ_new}'
    # ---- SETUP ----
    s = ["1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System' → '編集'",
         f"2. Set toggle 'トラブルナビ' = {'ON' if navi else 'OFF'}, 'シサンNAVI' = {'ON' if asset_navi else 'OFF'} → save (保存 → 決定 → OK)",
         f"3. Scroll to store list → open the {store} store [G1] → Verify: 承認タイプ = {typ_new} [G2]"]
    if fix_new == 'yes': s.append("4. Verify: field '限度額' has a value → record it as FIX")
    else: s.append("4. '編集' → clear '限度額' → save → Verify: 限度額 empty [G23]")
    if auto_n == 'min': s.append('5. Record the type04 minimum amount [G4]')
    add('チェーンシステム情報', f'SETUP · Linksys: トラブルナビ {"ON" if navi else "OFF"}, シサンNAVI {"ON" if asset_navi else "OFF"}; store {typ_new}; 限度額 {"read" if fix_new=="yes" else "cleared"}',
        '-', s, f"Linksys shows トラブルナビ {'ON' if navi else 'OFF'} / シサンNAVI {'ON' if asset_navi else 'OFF'}; store approve type {typ_new}; " + ("FIX recorded" if fix_new == 'yes' else "store has no 限度額"),
        'CMS Admin (99)', q=['G1', 'G2'] + (['G23'] if fix_new == 'no' else []) + (['G4'] if auto_n == 'min' else []))

    # ---- NEW: tạo trouble ----
    who = acc(creator if creator != 'CMS Web' else 'chainstore', typ_new)
    q = []
    if creator == 'CMS Web': q.append('G12'); who = 'ChainStore [G12]'
    if navi and creator in ('chainstore', 'chainstore manager'):
        s = [f'1. Login {who} → Verify: Dashboard',
             "2. Menu '作業依頼登録' → select category '水' → Verify: webview トラブルナビ opens",
             "3. Select '中項目', '小項目', '症状'" + (", '資産' (field shown because シサンNAVI ON) → select asset 'TEST AUTOMATION'" if asset_navi else " (no field '資産' because シサンNAVI OFF)") + " → '次へ'",
             "4. Click 'このまま依頼する' → click 'このまま依頼する' again",
             "5. Upload 'hieu6.jpg', input text 'AUTOMATION' → click next (icon button)",
             ("6. Select radio '至急' → click '依頼する' [G5: urgent]" if urgent_new else "6. Select radio '至急' → click '依頼する' [G5]"),
             "7. Click 'トップ画面に戻る' → Verify: Dashboard; record 依頼番号"]
        q.append('G5'); scr = '作業依頼登録 (トラブルナビ)'
    else:
        first = (f"1. Login {who}" if creator != 'admin' else '1. Login Admin (99)')
        s = [first, "2. Menu '作業依頼登録'" + (" → '新規依頼' → '次へ'" if creator == 'admin' else '') + (" [G6: tạo trouble khi トラブルナビ ON bằng admin]" if navi else " [G6]"),
             f"3. 'チェーン店舗選択' → search 社名 'Linksys', 店名 = {store} store → '選択' (admin / manager only) → '担当者選択' → first row → '次へ'",
             "4. Select 作業項目 '操作テスト' > 'トイレ（テスト）' > 'つまり：大便器（テスト）'"]
        if asset_navi:
            s.append("5. Tick '対象資産がある場合はチェックを入れてください' → '修理対象資産選択' → '新しい機器を登録する' → 名称 'Automation Asset', 型式 'TVB005', 製造番号 '100014914', photo 'hieu5.jpg' → '保存' → '決定' → 'OK' → '選択' row 'Automation Asset' → '決定する' [G29]")
            q.append('G29')
        s += [f"{len(s)+1}. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 'AUTOMATION'" + (" , set 緊急依頼 [G5]" if urgent_new else ''),
              f"{len(s)+2}. '決定して問合わせ' → '決定' ('この新規依頼を保存します。よろしいですか？'; if date error: '明日以降', 開始 4:00) → 'OK' → minimize chat; record 依頼番号"]
        q.append('G6'); scr = '作業依頼登録'
        if urgent_new: q.append('G5')
    exp = "Trouble is created for the store: '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出'" + (", 案件区分 = urgent (緊急)" if urgent_new else '') + (", asset 'TEST AUTOMATION' / 'Automation Asset' attached" if asset_navi else '')
    add(scr, f"NEW · {creator if creator!='CMS Web' else 'chainstore [G12]'} creates {'urgent' if urgent_new else 'normal'} trouble ({'トラブルナビ' if scr.endswith('(トラブルナビ)') else 'web form'}{', シサンNAVI' if asset_navi else ''})",
        'TC-001 passed', s, exp, who, q=q)

    # ---- NEW: 対応中 + worker, 到着 ----
    add('Trouble Detail › 状態変更', 'NEW · Admin: 対応中 + assign worker', '-',
        ['1. Login Admin (99) → open trouble (依頼番号)', "2. 'クイック操作' → 状態 '対応中'",
         "3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'", "4. '保存' → '決定' → 'OK'"],
        "Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER'", 'CMS Admin (99)')
    add('Trouble Detail › 状態変更', 'NEW · 受注 → 移動中 → 到着 (02-04)', '-',
        ["1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'",
         "2. Same with '移動中' → Verify: badge '移動中'", "3. Same with '到着'"],
        "Badge '対応中' / '到着' (02-04)", 'CMS Admin (99)')

    # ---- NEW: báo giá ----
    ec = 'CMS Admin (99) (tạo thay worker)'
    eq = []
    if est_creator == 'Worker Company': ec = 'Worker Company (05) [G10]'; eq.append('G10')
    if est_creator == 'subadmin': ec = 'CMS SubAdmin (98)'
    names = [f'{P}-New'] if est_n in ('1', '') else [f'{P}-New{i}' for i in (1, 2, 3)]
    bulk = 'bulk' in est_n
    s = [f"1. Login {ec} → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '{'任意' if urgent_new else '必須'}'",
         f"2. Edit icon '見積もり' → for each of {', '.join(repr(x) for x in names)}: '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that {amt_n} → '決定' → '決定' (top right) → Verify: row '下書き'"]
    if len(names) == 1:
        s.append(f"3. Tick '{names[0]}' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: '承認待ち'")
    elif bulk:
        s.append("3. Tick all 3 rows → '提示する' once → Verify: '以下3件の見積を店舗へ提出しますか' lists 3 names → '決定' → Verify: all 3 '承認待ち' [G16: 1 notification]"); eq.append('G16')
    else:
        s.append("3. Tick and '提示する' → '決定' for each estimate [G15: số báo giá 提示 / giữ 下書き] → Verify: '承認待ち'"); eq.append('G15')
    s.append("4. '閉じる' → '保存' → '決定' → 'OK'")
    if urgent_new:
        s[-1] = "4. '閉じる' → select '作業中' (urgent: skip estimate approval) → '保存' → '決定' → 'OK'"
    keynote = ''
    if keyw.startswith('No key'):
        keynote = f' · Worker key: {keyw} [G19]'; eq.append('G19')
    add('Trouble Detail › 見積もり', f"NEW · Create {len(names)} estimate(s) ({amt_n}) and 提示{keynote}", 'Previous TC passed', s,
        ("Badge '対応中' / '作業中' (urgent: skip approval, 02-07); estimates stay '承認待ち'" if urgent_new else
         "Badge '対応中' / '見積承認待ち' (02-05), 見積書 'あり', estimate(s) '承認待ち'") , ec, q=eq + (['G4'] if '[G4]' in amt_n else []))

    # ---- NEW: duyệt ----
    def approve_block(phase, names, typ, approver, auto, ringi, urgent, amt, after_status):
        tag = 'NEW' if phase == 'new' else 'CONTINUE'
        if urgent:
            if len(names) > 1:
                add('Trouble Detail › 見積もり', f'{tag} · Urgent: approve 1 estimate → others 失効', '-',
                    [f"1. Login approver [G17] → open trouble → '見積もり' → expand '{names[0]}' → '承認する' → '決定'", "2. Check the other estimates"],
                    f"'{names[0]}' = '承認済み'; other submitted estimates = '失効'; badge stays '対応中' / '{after_status}'", '[G17]', q=['G17'])
            return
        if auto is True:
            conflict = not any(k in approver.lower() for k in ('auto', 'skip'))
            add('Trouble Detail › 見積もり', f'{tag} · ≤ FIX → auto approve (no approver)', '-',
                ["1. Reload trouble → '見積もり' → Verify: no approver action was done"] + ([f"Note: cột gốc ghi người duyệt '{approver}' nhưng số tiền ≤ FIX → theo Q5 là tự duyệt [G27]"] if conflict else []),
                f"Estimate '{names[0]}' = '承認済み' automatically; badge '対応中' / '{after_status}'; no '稟議承認中'", 'CMS Admin (99)', q=(['G27'] if conflict else []))
            return
        if auto == 'min':
            add('Trouble Detail › 見積もり', f'{tag} · Type04 below minimum → auto approve', '-',
                ["1. Reload trouble → '見積もり'"], f"Estimate = '承認済み' automatically (below type04 minimum); badge '対応中' / '{after_status}'", 'CMS Admin (99)', q=['G4'])
            return
        who = acc(approver.split('/')[0].strip(), typ)
        s = [f"1. Logout → login {who} → open trouble → '見積もり' → expand '{names[0]}' → Verify: card 店舗 has '承認する', '差し戻し'; amounts visible"]
        q = ['G1']
        if ringi:
            s.append("2. '承認する' → '決定' → Verify: '稟議承認中' (not yet 承認済み)")
            s.append("3. Repeat with next level approver (Lv1 → Lv2 → Lv3) until '承認済み' [G20]")
            q.append('G20')
        else:
            s.append("2. '承認する' → Verify: 'この見積を承認しますか', '承認後は取り消すことができません' → '決定'")
        if 'highest' in approver:
            s.insert(1, "1b. Login a lower-level CS Admin → '承認する' → Verify: still '承認待ち' (highest level must approve) [G22]"); q.append('G22')
        if 'range' in approver or '0→∞' in approver:
            s.insert(1, f"1b. Verify: approver's range covers the amount ({amt}) [G4]"); q.append('G4')
        if 'Level 0' in approver: q.append('G21')
        exp = f"Estimate '{names[0]}' = '承認済み', card 店舗 'この見積は承認済みです。現在実行できるアクションはありません。'; badge '対応中' / '{after_status}'"
        add('Trouble Detail › 見積もり', f'{tag} · Approve type {typ}: {approver}' + (' (稟議)' if ringi else ''), '-', s, exp, who, q=q)

    after_new = '作業中'
    if reqc:
        ap = acc(approver_n, typ_new)
        s = [f"1. Login Admin (99) (on behalf of worker) → open trouble → 'クイック操作' → edit '見積もり' → expand '{names[0]}' → '取り下げ申請' → reason 'Request cancel' → '申請を送信' → Verify: '以下の理由で取り下げ申請を行いますか' → '決定' → Verify: '取り下げ申請中'"]
        if reqc_res.startswith('✅'):
            s += [f"2. Login {ap} → expand → '取り下げ承認' → '決定' → Verify: '下書き'",
                  f"3. {('Change store 承認タイプ ' + type_change + ' [G2] → ') if type_change else ''}Login Admin (99) → re-edit '{names[0]}' → tick → '提示する' → '決定' → Verify: '再承認待ち' / '承認待ち'"]
            exp = f"Estimate goes 取り下げ申請中 → 下書き → 承認待ち again" + (f"; approve type now {type_change.split('→')[-1].strip()}" if type_change else '')
        else:
            s += [f"2. Login {ap} → expand → '取り下げ却下' → '決定' → Verify: '取り下げ却下', only 'コピー' is available",
                  f"3. Login Admin (99) → 'コピー' → new draft '{names[0]}-copy' → tick → '提示する' → '決定' → Verify: '承認待ち'"]
            exp = "Original = '取り下げ却下' (copy only); copy is submitted '承認待ち'"
        add('Trouble Detail › 見積もり', f"NEW · 取り下げ申請 → {'承認 → 再提示' if reqc_res.startswith('✅') else '却下 → コピー → 新規提示'}", '-', s, exp, f'CMS Admin (99) + {ap}', q=['G1'] + (['G2'] if type_change else []))
        if not reqc_res.startswith('✅'): names = [f'{names[0]}-copy']
    if reedit.startswith('✅') and not reqc and 'disabled' not in approver_n:
        rej = acc(approver_n.split(':')[0].replace('No-key store', 'no key').replace('reject only →', '').strip(), typ_new)
        if 'no-key' in approver_n.lower() or 'No-key' in approver_n: rej = 'Store no-key [G1, G18]'
        s = [f"1. Login {rej} → open trouble → '見積もり' → expand '{names[0]}'" + (" → Verify: amounts masked (0 / ***) [G18]" if 'no-key' in rej.lower() else ''),
             "2. '差し戻し' → reason 'Automation reject' → '決定' → Verify: '差し戻し'",
             f"3. {('Change store 承認タイプ ' + type_change + ' [G2] → ') if type_change else ''}Login Admin (99) → re-edit '{names[0]}' (change 単価 +1) → '提示する' → '決定' → Verify: '再承認待ち'"]
        if expire: s.append(f"4. Verify: {expire} [G14]")
        add('Trouble Detail › 見積もり', f"NEW · 差し戻し → 再編集 → 再提示{(' · type ' + type_change) if type_change else ''}", '-', s,
            "Estimate goes 承認待ち → 差し戻し → 再承認待ち" + (f"; approve type {type_change}" if type_change else ''), f'{rej} + CMS Admin (99)',
            q=['G1'] + (['G2'] if type_change else []) + (['G14'] if expire else []) + (['G18'] if 'no-key' in rej.lower() else []))
    if 'disabled' in approver_n:
        add('Trouble Detail › 見積もり', 'NEW · No-key approver: 承認する disabled, reject only', '-',
            ["1. Login Store no-key [G1, G18] → open trouble → '見積もり' → expand estimate → Verify: amounts masked (0 / ***)",
             "2. Verify: '承認する' disabled, '差し戻し' enabled [G18: nhãn 承認しない]", "3. '差し戻し' → reason → '決定'",
             "4. Login Admin (99) → re-edit → '提示する' → '決定' → Verify: '再承認待ち'"],
            "No-key store cannot approve (button disabled) but can reject; estimate re-submitted '再承認待ち'", 'Store no-key [G1, G18]', q=['G1', 'G18'])
    if not new_skip:
        appr = approver_n
        if 'Read-key store: approve' in appr or 'read-key' in appr.lower() and 'reject' in appr.lower() or 'disabled' in appr:
            appr = 'Read-key store'
        ftyp = typ_new if not type_change else type_change.split('→')[-1].strip().split(' ')[0]
        ringi_final = d['38'] == '✅' or (d['38'].startswith('OK') and ftyp == '04')
        approve_block('new', names, ftyp, appr, auto_n, ringi_final, urgent_new, amt_n, after_new)
    else:
        notes.append('Cột gốc ghi 🚫 cho kết quả duyệt / báo cáo / kết quả NEW → các TC NEW sau báo giá chờ G9.')
    if after_appr:
        times = 2 if '×2' in after_appr else 1
        for i in range(times):
            nn = f'{P}-New-R{i+1}'
            s = [f"1. {('Change store 承認タイプ ' + type_change + ' [G2] → ') if (type_change and i == times-1) else ''}Login Admin (99) → '見積もり' → '登録' '{nn}' ({amt_n}) → '提示する' → '決定'",
                 f"2. Approve '{nn}' ({'auto' if auto_n is True else approver_n})"]
            add('Trouble Detail › 見積もり', f'NEW · Re-submit AFTER approved #{i+1}', '-', s,
                f"Previous approved estimate = '失効'; '{nn}' = '承認済み'", 'CMS Admin (99)', q=(['G2'] if type_change else []))
    if expire and not reedit.startswith('✅') and len(names) > 1 and not urgent_new:
        add('Trouble Detail › 見積もり', 'NEW · Other estimates → 失効 after approval', '-',
            ["1. Reload → '見積もり' → check every estimate"], f"{expire}: approved estimate '承認済み', other submitted estimates '失効'" + (", draft kept '下書き' [G15]" if '下書き' in expire else ''), 'CMS Admin (99)', q=(['G15'] if '下書き' in expire else []))
    if keya.startswith('Write') and 'encrypt' in keya:
        add('Trouble Detail › 見積もり', 'NEW · Encryption: write-key creates, read-key views', '-',
            ["1. Login Store read-key → '見積もり' → Verify: amounts / 見積名 shown in clear", "2. Login Store no-key → Verify: amounts '0', text '***'"],
            'Read key sees real values; no key sees masked values', 'Store read-key / no-key [G1, G18]', q=['G1', 'G18'])

    # ---- NEW: báo cáo + thanh toán ----
    if not new_skip:
        s = ["1. Login Admin (99) → 'クイック操作' → '作業完了' → '保存' → '決定' → 'OK' → Verify: badge '作業完了'",
             "2. 'クイック操作' → '報告済' → edit icon '報告書' → '編集' → 開始 day 1, 終了 day 2, 原因と発生起因 'automation', 作業前 'hieu4.jpg', 作業後 'hieu3.jpg'"
             + (", attach PDF 'test1.pdf' [G26]" if no == 39 else '') + " → '完了'", "3. '保存' → '決定' → 'OK'"]
        add('Trouble Detail › 状態変更 / 報告書', 'NEW · 作業完了 → 報告済 (02-08 → 02-09)' + (' + PDF attachment' if no == 39 else ''), '-', s,
            "Badge '対応中' / '報告済' (02-09)" + ("; 報告書 shows PDF 'test1.pdf'" if no == 39 else ''), 'CMS Admin (99)', q=(['G26'] if no == 39 else []))
        pw = acc(payer, typ_new)
        add('Trouble Detail › 作業完了確認', f'NEW · {payer} 確認・決済 → 完了', '-',
            [f"1. Logout → login {pw} → open trouble → minimize chat", "2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate",
             "3. Star '感動' → comment 'Automation test' → '作業完了確認' → '決定' → Verify: '作業依頼の決済状態の保存が完了しました。' → 'OK'"],
            "Badge '完了' / '報告済', '作業完了確認' disappears; NEW trouble = 完了", pw, q=['G1'] + (['G8'] if payer in ('Admin', 'Sub Admin') else []))

    # ---- CONTINUE ----
    if fix_cont != fix_new or typ_cont != typ_new:
        s = ['1. Login Admin (99) → チェーンシステム情報 → Linksys → store']
        if fix_cont != fix_new: s.append("2. '編集' → " + ("clear '限度額'" if fix_cont == 'no' else "set '限度額' back to FIX") + ' → save [G23]')
        if typ_cont != typ_new: s.append(f'3. Change 承認タイプ {typ_new} → {typ_cont} [G2]')
        add('チェーンシステム情報', 'SETUP CONTINUE · change store config before 継続', '-', s,
            'Store config matches the CONTINUE column', 'CMS Admin (99)', q=['G23'] + (['G2'] if typ_cont != typ_new else []))
    cw = 'CMS SubAdmin (98)' if cont_creator == 'subadmin' else 'CMS Admin (99)'
    s = [f"1. Logout → login {cw} → menu '作業依頼登録' → radio '継続依頼' → '次へ'",
         "2. '作業依頼選択' → select the trouble of TC-002 → Verify: store and 作業項目 filled from the original"]
    if urgent_cont: s.append('3. Set urgent (緊急) [G5]')
    if version.startswith('OLD'): s.insert(0, '0. Original trouble must be OLD version [G11]')
    s.append(f"{len(s)+1}. '決定して問合わせ' → '決定' → 'OK'")
    add('作業依頼登録 (継続)', f"CONTINUE · {cont_creator} creates 継続依頼 '_2'" + (' (urgent)' if urgent_cont else '') + (' · version OLD' if version.startswith('OLD') else ''), '-', s,
        f"Continue trouble '<依頼番号>_2' is created: '対応中' / '見積待ち' (02-10), version {('OLD (kept)' if version.startswith('OLD') else 'New')}" + (', urgent' if urgent_cont else ''),
        cw, q=(['G5'] if urgent_cont else []) + (['G11'] if version.startswith('OLD') else []))
    sw = 'CMS SubAdmin (98)' if selector == 'subadmin' else 'CMS Admin (99)'
    if staff_change:
        add('Trouble Detail › 状態変更 (継続)', f'CONTINUE · {selector} changes 作業スタッフ (変更あり)', '-',
            ["1. Open '_2' → 'クイック操作' → edit icon '作業者' → select worker 2 [G7] → '保存' → '決定' → 'OK'"],
            "業者 shows worker 2; status unchanged", sw, q=['G7'])
    else:
        add('Trouble Detail › 状態変更 (継続)', f'CONTINUE · 作業スタッフ unchanged (変更なし)', '-',
            ["1. Open '_2' → Verify: 業者 = 'LINKSYS WORKER' (inherited)"], "Worker inherited from the original trouble", sw)
    cnames = [f'{P}-Cont'] if est_c in ('1', '') else [f'{P}-Cont{i}' for i in (1, 2)]
    s = [f"1. Login Admin (99) → open '_2' → 'クイック操作' → edit icon '見積もり' → for each of {', '.join(repr(x) for x in cnames)}: '登録', item '作業' 'Autotest', {amt_c} → '決定'",
         "2. Tick → '提示する' → '決定' → Verify: '承認待ち'",
         ("3. '閉じる' → (urgent: skip approval) → '保存' → '決定' → 'OK'" if urgent_cont else "3. '閉じる' → select '見積承認待ち' → '保存' → '決定' → 'OK'")]
    add('Trouble Detail › 見積もり (継続)', f'CONTINUE · Create {len(cnames)} estimate(s) ({amt_c}) and 提示', '-', s,
        ("Badge '対応中' / '見積承認済' (02-40, urgent skip)" if urgent_cont else "Badge '対応中' / '見積承認待ち' (02-20)"), 'CMS Admin (99)', q=(['G4'] if '[G4]' in amt_c else []))
    if not urgent_cont:
        approve_block('cont', cnames, typ_cont, approver_c, auto_c, ringi_c, False, amt_c, '見積承認済')
        if len(cnames) > 1:
            add('Trouble Detail › 見積もり (継続)', 'CONTINUE · Other estimate → 失効', '-', ["1. Reload → '見積もり'"],
                f"'{cnames[0]}' = '承認済み', '{cnames[1]}' = '失効'", 'CMS Admin (99)')
    add('Trouble Detail › 状態変更 (継続)', 'CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80)', '-',
        ["1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK'" + (' (urgent: schedule auto)' if urgent_cont else ''),
         "2. Same with '移動中', '到着', '作業中', '作業完了' → Verify: badge after each step"],
        "Badge '対応中' / '作業完了' (02-80)", 'CMS Admin (99)')
    add('Trouble Detail › 報告書 (継続)', 'CONTINUE · 報告済 (02-90)', '-',
        ["1. 'クイック操作' → '報告済' → edit '報告書' → '編集' → 開始 / 終了, 原因と発生起因 'automation', photos → '完了' → '保存' → '決定' → 'OK'"],
        "Badge '対応中' / '報告済' (02-90)", 'CMS Admin (99)')
    pw = acc(payer_c, typ_cont)
    add('Trouble Detail › 作業完了確認 (継続)', f'CONTINUE · {payer_c} 確認・決済 → 完了', '-',
        [f"1. Logout → login {pw} → open '_2'", "2. '作業完了確認' → Verify: '支払情報' total of the CONTINUE estimate",
         "3. '感動' → 'Automation test' → '作業完了確認' → '決定' → 'OK'"],
        "'_2' badge '完了' / '報告済'" + ('' if new_skip else '; both troubles 完了'), pw, q=['G1'] + (['G8'] if payer_c in ('Admin', 'Sub Admin') else []))

    # ---- số hoá ----
    for i, t in enumerate(T):
        t['id'] = f'{P}-TC-{i+1:03d}'
        if t['pre'] == '-' and i > 0: t['pre'] = f'{P}-TC-{i:03d} passed'
        if t['pre'] == 'Previous TC passed': t['pre'] = f'{P}-TC-{i:03d} passed'
        if t['pre'] == 'TC-001 passed': t['pre'] = f'{P}-TC-001 passed'
    dev = ''
    if no in (24, 25, 27): dev = 'Biến thể thiết bị (iOS / Android / cross-device) KHÔNG được test: báo giá do Admin tạo thay trên CMS (trả lời 13/10). Phần thiết bị cần chạy manual / Appium sau [G25].'; qs.add('G25')
    if no == 26: dev = 'Worker Company tạo báo giá [G10].'
    params = [('Biến thể', v), ('Tạo trouble', f"{creator} · {'緊急依頼' if urgent_new else '通常依頼'} · トラブルナビ {d['28']} · シサンNAVI {d['29']}"),
              ('Key', f'Worker: {keyw} · Approver: {keya}'),
              ('Báo giá NEW', f"{est_n} · fix {d['32']} · {d['33']} → {amt_n} · type {typ_new} · 稟議 {d['38']} · người duyệt {approver_n}"),
              ('Ngoại lệ NEW', ' · '.join(x for x in [f'取下げ {d["36"]} / {d["37"]}' if reqc else '', f'再提示 {reedit}' if reedit not in ('🚫', '') else '', f'đổi type {type_change}' if type_change else '', f'失効 {expire}' if expire else '', f'sau duyệt {after_appr}' if after_appr else ''] if x) or '-'),
              ('Báo cáo / thanh toán NEW', f'report: {d["22"]} · payer: {payer}'),
              ('Continue', f"{cont_creator} · urgent {d['53']} · version {version} · đổi worker {d['57']} ({selector})"),
              ('Báo giá CONTINUE', f"{est_c} · fix {d['60']} · {d['61']} → {amt_c} · type {typ_cont} · 稟議 {d['64']} · người duyệt {approver_c}"),
              ('Kết luận gốc', d['78'])]
    head = [f"# Test case — {n} · {v}",
            f"- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: {P}",
            f"- Source: projects/qnavi/spec/e2e-suite.md › {n} (gốc: raw/Test suite for automation_E2E.xlsx, \"Expanded v2\"). Luồng thao tác: raw/Automation Test AI - Format Main Case.csv, TC LOCKED phase007, trả lời Q2–Q9 ngày 13/10.",
            "- State: DRAFT · Revision: 1 · Approved by / at: —",
            "- Môi trường: tuỳ biến khi chạy (Q9).",
            "- Ngoại lệ D05: 1 file = 1 kịch bản nối tiếp NEW → CONTINUE → 完了; mỗi TC = 1 giai đoạn. 'Verify:' = điểm kiểm giữa chừng.",
            "- Quy ước chung: báo giá do Admin (99) tạo thay worker trên CMS; số tiền theo FIX (限度額 đọc ở TC-001); ≤ FIX → tự duyệt (Q5); báo cáo = đổi trạng thái trên CMS (Q7); bỏ 日程承認 (Q8).",
            "- Câu hỏi [Gx]: xem projects/qnavi/qc/test-cases/e2e-suite/QUESTIONS.md."]
    if dev: head.append(f'- Lưu ý: {dev}')
    for x in notes: head.append(f'- Lưu ý: {x}')
    if new_skip: qs.add('G9')
    head += ['', '## Tham số kịch bản', '| Tham số | Giá trị |', '|---|---|'] + [f'| {a} | {b.replace("|", "/")} |' for a, b in params]
    head += ['', '## Test case', '| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |',
             '|---|---|---|---|---|---|---|---|---|---|---|---|---|'] + [tc_row(t) for t in T]
    head += ['', f"## Câu hỏi ảnh hưởng file này", ', '.join(sorted(qs, key=lambda x: int(x[1:])))]
    fn = f'{n}-{slug(v)}-test-cases.md'
    open(os.path.join(OUT, fn), 'w').write('\n'.join(head) + '\n')
    return n, v, fn, len(T), sorted(qs, key=lambda x: int(x[1:]))

rows = [build(d) for d in C]
json.dump(rows, open(os.path.join(OUT, '_index.json'), 'w'), ensure_ascii=False)
for r in rows: print(r[0], r[3], r[2], ','.join(r[4]))
