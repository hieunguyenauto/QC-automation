"""Sinh file test case E2E (Revision 2) từ spec/e2e-suite (cases.json) + quyết định QUESTIONS.md lượt 1–5.
Chạy: python3 gen_e2e.py <out_dir>   (bỏ case 16 — G14, case 28 — G11)"""
import json, re, sys, os
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(__file__)
C = json.load(open(os.path.join(HERE, 'cases.json')))
BR = '<br>'
SKIP = {16, 28}
LOCK = '- State: LOCKED · Revision: 12 · Approved by / at: Hieu Nguyen / 16/10/2026'
TYPE_LABEL = {'01': '個人承認', '02': '階層承認（No順）', '03': '金額承認', '04': '金額と階層承認 (No順)'}   # T3: chữ trên app (recon toridoll-test 14/10)

def slug(s):
    s = re.sub(r'[^A-Za-z0-9]+', '-', s.split('/')[0]).strip('-').lower()
    return s[:40] or 'case'

# ---------- store / tài khoản (R1, R2, R3, N7–N9, N14, N16–N18) ----------
TYPE_STORE = {'01': '00006', '02': '00007', '03': '00008', '04': '00004'}
LAST_MGR = {'00006': '00005', '00007': '00002', '00008': '00005', '00004': '00004'}   # R3

def store_of(no, typ, role=''):
    """Store của trouble. Case key 29–34: chỉ dùng STORE00001 (confirm 14/10)."""
    if no in (5, 9, 10, 27): return '00005'
    if no == 8: return '00002'           # T4 (rev 3): store không có 限度額, 決済承認 許可する
    if no == 7: return '00009'
    if 29 <= no <= 34: return '00001'
    return TYPE_STORE[typ]

def store_acc(st): return f"ChainStore (02) 'linksysstore{st}'"
def mgr(n): return f"ChainStore Manager 'LINKSYS MANAGER{n}'"
def store_mgr(st): return mgr('00005' if st == '00006' else '00001')   # N9, N14, N18
def cs_admin(st): return mgr(LAST_MGR.get(st, '00001'))               # R3

def person(role, st):
    """Người làm 作業完了確認 / thanh toán."""
    r = role.strip().lower()
    if r in ('admin', 'sub admin') or r.startswith('sub admin'): return store_acc(st)   # G8 / R4
    if r.startswith('chain store') or r == 'chainstore': return store_acc(st)
    if r.startswith('store manager'): return store_mgr(st)
    if r.startswith('cs admin'): return cs_admin(st)
    return store_acc(st)

# ---------- số tiền (R11) ----------
def amount(cat, fix, st):
    c = cat.strip().lower()
    if fix == 'no' or 'no limit' in c:
        if st == '00002': return ('total = ¥10,000 (store has no 限度額)', False)
        return ('total = FIX + 1 (cột gốc "no limit"; STORE00005 vẫn có FIX — N17)', False)
    if c.startswith('<='): return ('total = FIX − 1', True)
    if 'equal' in c: return ('total = FIX (boundary)', True)
    if '49,999' in c: return ('total = ¥49,999', False)
    if '5,000' in c: return ('total = ¥4,999 (≤ FIX ¥20,000)', True)
    if 'within range' in c: return ('total within ¥10,000–¥20,000 (range of MANAGER00004) and > FIX', False)
    if 'high' in c: return ('total = ¥9,999,999', False)
    if c.startswith('>'): return ('total = FIX + 1', False)
    return (cat, False)

def approvers(no, typ, st, role, amt):
    """Danh sách người duyệt tuần tự (R9, R10, N16)."""
    r = role.lower()
    if r.startswith('admin'): return ['CMS Admin (99)']
    if r.startswith('sub admin'): return ['CMS SubAdmin (98)']
    if st == '00005':
        return [store_acc('00005')] if r.startswith('chain store') else [mgr('00001')]
    if st in ('00001', '00002'): return [store_acc(st)]            # không có approve type → chính store duyệt
    if st == '00009': return [mgr('00001') + ' (Lv0)']
    if typ == '01': return [mgr('00005')]
    if typ == '02': return [mgr('00001'), mgr('00002')]
    if typ == '03':
        return [mgr('00004')] if '10,000' in amt else [mgr('00005')]
    if typ == '04':
        if '49,999' in amt: return [mgr('00001'), mgr('00002'), mgr('00003')]
        return ['DYN']                                                # số Lv phụ thuộc giá trị FIX → quyết định khi chạy (N1)
    return [mgr('00001')]

def tc_row(t):
    return '| ' + ' | '.join([t['id'], '', 'System (E2E)', t['screen'], t['func'], t['pre'],
                               BR.join(t['steps']), t['exp'], t['role'], 'Web', t.get('prio', 'High'), '', t.get('elig', 'UI-AUTO')]) + ' |'

def build(d):
    n = d['id']; no = int(n.split('-')[1]); P = f'E2E{no:02d}'
    NOTE = f'Automation E2E {no:02d}'   # rev 6: note khi tạo case (chi tiết, 原因と発生起因, comment thanh toán)
    v = d['14'].replace(' /  ', ' / ')
    typ = (d['35'] or '1').zfill(2)
    st = store_of(no, typ)
    sname = f'LINKSYS STORE{st}'
    fix_new = 'yes' if d['32'].startswith('あり') else 'no'
    fix_cont = 'yes' if d['60'].startswith('あり') else 'no'
    if no == 8: fix_new = fix_cont = 'no'
    urgent_new = d['12'] == '✅'; urgent_cont = d['13'] == '✅' or d['53'] == '✅'
    navi_csv = d['28'] == 'ON'; asset_navi = d['29'] == 'ON'
    creator = d['19'] if d['19'] != 'CMS Web' else 'chainstore'    # G12
    payer = d['23']
    est_n = d['31']; est_c = d['59']
    reqc = d['36'].startswith('✅'); reqc_res = d['37']
    reedit = d['39']
    expire = d['43'] if d['43'] != '🚫' else ''
    after_appr = d['44'] if d['44'] not in ('🚫', '') else ''
    approver_n = d['41']; approver_c = d['65']
    new_stop = d['49'] == '🚫'                                      # G9: case 24
    amt_n, auto_n = amount(d['33'], fix_new, st)
    if typ == '04' and st == '00004' and 'FIX + 1' in amt_n and not est_n.startswith('3') and no not in (12, 29, 33):
        # rev 9 (lượt 11 R9-1): type 04 tự duyệt nếu 税抜 < min_amount Lv1 (¥20,000) hoặc 税込 < FIX → FIX + 1 税込 (税抜 ¥18,183) vẫn tự duyệt.
        amt_n = 'total = ¥22,001 (税抜 ¥20,001 ≥ Lv1 min_amount ¥20,000)'
    amt_c, auto_c = amount(d['61'].split('/')[0], fix_cont, st)
    est_creator = d['20']
    cont_creator = d['52']
    dec = set(['G1', 'G2', 'G3', 'C6', 'N11', 'C4', 'C2', 'N15', 'G24', 'G27'])
    notes = []
    T = []
    def add(screen, func, pre, steps, exp, role, elig='UI-AUTO', q=()):
        T.append(dict(screen=screen, func=func, pre=pre, steps=steps, exp=exp, role=role, elig=elig)); dec.update(q)

    # ---- SETUP (R5): cấu hình chain ở E2E-00 common; TC-001 chỉ đọc store ----
    s = ["1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'"]
    if st in ('00001', '00002'):
        s.append(f"2. Scroll to store list → open '{sname}' (store has no 承認タイプ — N16)")
    elif st == '00005':
        s.append(f"2. Scroll to store list → open '{sname}' → Verify: auto approve is set (N16)")
    else:
        s.append(f"2. Scroll to store list → open '{sname}' → Verify: 承認タイプ = '{TYPE_LABEL['04' if st == '00009' else typ]}'" + (' (Lv0 setting)' if st == '00009' else ''))
    if fix_new == 'no':
        s.append("3. Verify: '限度額' is empty (store has no 限度額 — N17)")
        expx = 'store has no 限度額'
    else:
        s.append("3. Record '限度額' (税込) as FIX (do not edit — N11)")
        expx = 'FIX recorded'
    common = 'E2E00-TC-002 passed (シサンNAVI ON)' if asset_navi else 'E2E00-TC-001 passed (シサンNAVI OFF)'
    add('チェーンシステム情報', f"SETUP · {sname}; 限度額 {'read' if fix_new == 'yes' else 'none'}",
        common, s, f"{sname} opened; {expx}", 'CMS Admin (99)',
        q=(['N16'] if st in ('00001', '00002', '00005') else []) + (['N17'] if fix_new == 'no' else []) + (['G29'] if asset_navi and not navi_csv else []))

    # ---- NEW: tạo trouble (R6) ----
    q = ['G6', 'C4']
    if creator in ('chainstore', 'chainstore manager'):
        who = store_acc(st) if creator == 'chainstore' else store_mgr(st)
        q += ['N8'] if creator == 'chainstore manager' else []
        if st == '00006' and creator == 'chainstore manager': q.append('N18')
        step1 = ([f"2. Menu '作業依頼登録' → Step 1 店舗 shows '{sname}' → '担当者選択' → first row → '選択' → '次へ'"] if creator == 'chainstore' else
                 [f"2. Menu '作業依頼登録' → Step 1 'チェーン店舗選択' → search 店名 '{sname}' → '選択' → '担当者選択' → first row → '選択' → '次へ'"])
        if navi_csv:   # T2: thẻ '水' → webview トラブルNAVI (iframe)
            s = [f'1. Login {who} → Verify: Dashboard'] + step1 + [
                 "3. Step 2 作業項目選択: card 故障内容 '選択' → click '水' → Verify: webview 'トラブル相談内容' opens, 大項目 = '水'",
                 "4. Select '中項目', '小項目', '症状'" + (", '資産' (field shown because シサンNAVI ON) → select asset 'TEST AUTOMATION'" if asset_navi else " (no field '資産' because シサンNAVI OFF)") + " → '次へ'",
                 "5. Click 'このまま依頼する' → click 'このまま依頼する' again",
                 f"6. Upload 'hieu6.jpg', input text '{NOTE}' → click next (icon button)",
                 "7. Select radio '至急' → click '依頼する'",
                 "8. Click 'トップ画面に戻る' → Verify: Dashboard; record 依頼番号"]
            scr = '作業依頼登録 (トラブルナビ)'
        else:          # T1: '操作テスト' → luồng CMS thường, không webview
            s = [f'1. Login {who} → Verify: Dashboard'] + step1 + [
                 "3. Step 2 作業項目選択: card 故障内容 '選択' → '操作テスト' → 故障個所 'トイレ（テスト）' → 故障症状 'つまり：大便器（テスト）' (cột gốc トラブルNAVI OFF → category '操作テスト', no webview — C4)"]
            if asset_navi:
                s.append("4. Tick '対象資産がある場合はチェックを入れてください' → '修理対象資産選択' → '新しい機器を登録する' → 名称 'Automation Asset', 型式 'TVB005', 製造番号 '100014914', photo 'hieu5.jpg' → '保存' → '決定' → 'OK' → '選択' row 'Automation Asset' → '決定する'")
            s += [f"{len(s)+1}. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 '{NOTE}'",
                  f"{len(s)+2}. '決定して問合わせ' → '決定' (if date error: '明日以降', 開始 4:00, 終了 5:00) → 'OK' → minimize chat; record 依頼番号"]
            scr = '作業依頼登録'
    else:
        who = 'CMS Admin (99)'
        s = ['1. Login Admin (99)', "2. Menu '作業依頼登録' → '新規依頼' → '次へ'",
             f"3. 'チェーン店舗選択' → search 社名 'Linksys', 店名 '{sname}' → '選択' → '担当者選択' → first row → '次へ'",
             "4. Select 作業項目 '操作テスト' > 'トイレ（テスト）' > 'つまり：大便器（テスト）'"]
        if asset_navi:
            s.append("5. Tick '対象資産がある場合はチェックを入れてください' → '修理対象資産選択' → '新しい機器を登録する' → 名称 'Automation Asset', 型式 'TVB005', 製造番号 '100014914', photo 'hieu5.jpg' → '保存' → '決定' → 'OK' → '選択' row 'Automation Asset' → '決定する'")
        s += [f"{len(s)+1}. '次へ' → Step 3 故障詳細: upload 'hieu6.jpg', 故障詳細記入欄 '{NOTE}'",
              f"{len(s)+2}. '決定して問合わせ' → '決定' (if date error: '明日以降', 開始 4:00, 終了 5:00) → 'OK' → minimize chat; record 依頼番号"]
        scr = '作業依頼登録'
    exp = f"Trouble is created for '{sname}': '問い合わせ中' / '受注待ち', 業者 '未確定', 見積書 '未提出'" + (", asset attached" if asset_navi else '')
    add(scr, f"NEW · {creator} creates trouble ({'トラブルナビ' if scr.endswith('(トラブルナビ)') else 'web form'}{', シサンNAVI' if asset_navi else ''})",
        'TC-001 passed', s, exp, who, q=q)

    # ---- NEW: urgent (R7 / G5) ----
    def urgent_tc(phase):
        tgt = "the trouble" if phase == 'NEW' else "'_2'"
        add('Trouble Detail › 編集', f'{phase} · Set urgent: 案件区分 営業停止案件', '-',
            [f"1. Login Admin (99) → open {tgt} → '編集'", "2. 案件区分 = '営業停止案件' → '保存' → '決定' → 'OK'"],
            "案件区分 = '営業停止案件' (urgent); estimate approval will be skipped", 'CMS Admin (99)', q=['G5'])
    if urgent_new: urgent_tc('NEW')

    # ---- NEW: 対応中 + worker, 到着 ----
    add('Trouble Detail › 状態変更', 'NEW · Admin: 対応中 + assign worker', '-',
        ['1. Login Admin (99) → open trouble (依頼番号)', "2. 'クイック操作' → 状態 '対応中'",
         "3. Edit icon '作業者' → search 社名 'linksys' → '選択' row 'linksysworker' → Verify: 作業者 'LINKSYS WORKER'", "4. '保存' → '決定' → 'OK'"],
        "Badge '対応中' / '受注待ち', 業者 'LINKSYS WORKER'", 'CMS Admin (99)', q=['C2'])
    add('Trouble Detail › 状態変更', 'NEW · 受注 → 移動中 → 到着 (02-04)', '-',
        ["1. 'クイック操作' → 対応中の状態（新規） '受注' → '保存' → '決定' → 'OK' → Verify: badge '受注'",
         "2. Same with '移動中' → Verify: badge '移動中'", "3. Same with '到着'"],
        "Badge '対応中' / '到着' (02-04)", 'CMS Admin (99)')

    # ---- NEW: báo giá ----
    ec = 'CMS Admin (99) (tạo thay worker)'; eq = []
    if est_creator == 'Worker Company': ec = "Worker Company (05) 'linksysworkercompany'"; eq.append('G10')
    if est_creator == 'subadmin': ec = 'CMS SubAdmin (98)'
    multi3 = est_n.startswith('3')
    auto1_new = auto_n is True and not est_n.startswith('3') and no not in (12, 29, 33) and not new_stop   # rev 4; rev 9 R9-2: urgent cũng tự duyệt ≤ FIX
    bulk = 'bulk' in est_n
    two = no in (12, 29, 33)                                          # R13 / G14
    if multi3 and not bulk:
        names = [f'{P}-New{i}' for i in (1, 2, 3)]; draft = f'{P}-New4'; eq.append('G15')    # R14
    elif multi3:
        names = [f'{P}-New{i}' for i in (1, 2, 3)]; draft = ''; eq.append('G16')
    elif two:
        names = [f'{P}-New1', f'{P}-New2']; draft = ''; eq.append('G14')
    else:
        names = [f'{P}-New']; draft = ''
    allnames = names + ([draft] if draft else [])
    s = [f"1. Login {ec} → open trouble → 'クイック操作' → select '見積承認待ち' → Verify: card 見積もり '{'任意' if urgent_new else '必須'}'",
         f"2. Edit icon '見積もり' → for each of {', '.join(repr(x) for x in allnames)}: '登録' → 見積名 → '追加' → '作業', 作業項目 'Autotest', 単価 so that {amt_n} → '決定' → '決定' (top right) → Verify: row '下書き'"]
    if bulk:
        s.append(f"3. Tick all 3 rows → '提示する' once → Verify: confirmation lists 3 names ('以下3件の見積を店舗へ提出しますか') → '決定' → Verify: all 3 '承認待ち' (push notification not checked — G16)")
    elif len(names) == 1:
        st_after = "'承認済み' (≤ FIX → tự duyệt ngay khi 提示 — rev 4)" if auto1_new else "'承認待ち'"
        s.append(f"3. Tick '{names[0]}' → '提示する' → Verify: '以下1件の見積を店舗へ提出しますか' → '決定' → Verify: {st_after}")
    else:
        s.append(f"3. Tick {', '.join(repr(x) for x in names)} → '提示する' → '決定' → Verify: {len(names)} rows '承認待ち'" + (f"; '{draft}' stays '下書き'" if draft else ''))
    s.append("4. '閉じる' → '保存' → '決定' → 'OK'")
    if urgent_new: s[-1] = "4. '閉じる' → select '作業中' (urgent: skip estimate approval) → '保存' → '決定' → 'OK'"
    if new_stop:
        exp = f"Badge '対応中' / '見積承認待ち' (02-05), estimate '承認待ち'. NEW flow stops here; no CONTINUE (G9)"
    elif urgent_new:
        exp = ("Badge '対応中' / '作業中' (urgent, 02-07); estimate '" + names[0] + "' = '承認済み' (≤ FIX, tự duyệt khi 提示 — R9-2)") if auto1_new \
            else "Badge '対応中' / '作業中' (urgent: skip approval, 02-07); submitted estimates stay '承認待ち'"
    elif auto1_new:
        exp = f"見積書 = 税抜 amount of the approved estimate (e.g. '¥18,181' when FIX ¥20,000 — rev 5), estimate '{names[0]}' = '承認済み' (≤ FIX, tự duyệt khi 提示)"
    else:
        exp = "Badge '対応中' / '見積承認待ち' (02-05), 見積書 'あり', submitted estimate(s) '承認待ち'"
    add('Trouble Detail › 見積もり', (f"NEW · Create {len(allnames)} estimates ({amt_n}), 提示 {len(names)}, keep 1 下書き" if draft else f"NEW · Create {len(names)} estimate(s) ({amt_n}) and 提示"), 'Previous TC passed', s, exp, ec, q=eq)
    if new_stop:
        notes.append('NEW dừng ở 到着 02-04 → 見積承認待ち 02-05; bỏ phần duyệt, báo cáo, thanh toán NEW và toàn bộ CONTINUE (G9).')
        dec.add('G9')
        return finish(d, n, no, P, v, st, sname, typ, T, dec, notes, amt_n, amt_c, names)

    # ---- duyệt ----
    def approve_seq(phase, nm, apps, ringi_lbl, after_status, admin_branch=False):
        tag = 'NEW' if phase == 'new' else 'CONTINUE'
        s = []
        if apps == ['DYN'] and not admin_branch:
            s = [f"1. Determine levels from total (N1: total ≥ Lv threshold → that Lv is needed; Lv1 ¥20,000 · Lv2 ¥30,000 · Lv3 ¥40,000 · Lv4 ¥50,000)",
                 f"2. Login {mgr('00001')} (Lv1) → open trouble → '見積もり' → expand '{nm}' → '承認する' → '決定' → Verify: '稟議承認中' if a higher Lv is needed, else '承認済み'",
                 f"3. While '稟議承認中': logout → login next Lv ({mgr('00002')} → {mgr('00003')} → {mgr('00004')}) → '承認する' → '決定'; Verify: '承認する' disappears for the manager who already approved"]
            role = f"{mgr('00001')} → … (Lv theo N1)"
            exp = f"Estimate '{nm}' = '承認済み' after the last needed Lv; badge '対応中' / '{after_status}'"
            add('Trouble Detail › 見積もり' + (' (継続)' if phase == 'cont' else ''), f'{tag} · Approve type 04 (稟議, sequential managers)', '-', s, exp, role, q=['N1', 'C5', 'N13'])
            return
        if admin_branch:
            s = [f"1. Login Admin (99) → open trouble → '見積もり' → expand '{nm}'",
                 "2. '承認する' (on behalf of Lv1) → '決定' → Verify: '稟議承認中' if a higher Lv is needed (N1)",
                 "3. Repeat '承認する' for each next needed Lv → Verify: '承認済み' after the last needed Lv"]
            role = 'CMS Admin (99) (duyệt thay từng cấp — N13)'
        else:
            for i, a in enumerate(apps):
                k = len(s) + 1
                first = f"{k}. {'Logout → ' if i else ''}Login {a} → open trouble → '見積もり' → expand '{nm}' → Verify: card 店舗 has '承認する', '差し戻し'"
                s.append(first)
                last = i == len(apps) - 1
                if last:
                    s.append(f"{k+1}. '承認する' → '決定' → Verify: '承認済み'")
                elif ringi_lbl:
                    s.append(f"{k+1}. '承認する' → '決定' → Verify: '稟議承認中' (not yet '承認済み'); '承認する' disappears for this approver")
                else:
                    s.append(f"{k+1}. '承認する' → '決定' → Verify: not yet '承認済み' (next level must approve)")
            role = ' → '.join(apps)
        exp = f"Estimate '{nm}' = '承認済み'; badge '対応中' / '{after_status}'"
        add('Trouble Detail › 見積もり' + (' (継続)' if phase == 'cont' else ''), f'{tag} · Approve ({len(apps)} level(s)): {role}' if not admin_branch else f'{tag} · Approve type 04 (稟議): Admin approves on behalf of each Lv', '-', s, exp, role,
            q=['N1', 'C5', 'N13'] if ringi_lbl else ['N16'] if st in ('00001', '00002', '00005') else [])

    def auto_tc(phase, nm, after_status, approver_txt):
        tag = 'NEW' if phase == 'new' else 'CONTINUE'
        st_ = ["1. Reload trouble → '見積もり' → Verify: no approver action was done"]
        if not any(k in approver_txt.lower() for k in ('auto', 'skip')):
            st_.append(f"Note: cột gốc ghi người duyệt '{approver_txt}' nhưng số tiền ≤ FIX → tự duyệt (G27)")
        add('Trouble Detail › 見積もり' + (' (継続)' if phase == 'cont' else ''), f'{tag} · ≤ FIX → auto approve (no approver)', '-', st_,
            f"Estimate '{nm}' = '承認済み' automatically; badge '対応中' / '{after_status}'; no '稟議承認中'", 'CMS Admin (99)')

    def key_view(phase, nm):
        """R18: ≤ FIX → kiểm màn chi tiết sau khi tự duyệt (chỉ STORE00001 — confirm 14/10)."""
        add('Trouble Detail › 見積もり', f"{'NEW' if phase == 'new' else 'CONTINUE'} · Read-key store views auto-approved estimate", '-',
            [f"1. Login {store_acc('00001')} (read key) → open trouble → '見積もり' → expand '{nm}' → Verify: amounts / 見積名 shown in clear; no '承認する' / '差し戻し' (already approved)"],
            "Read-key store sees real values of the approved estimate", store_acc('00001'), q=['N12', 'C3'])

    ringi_new = typ == '04' and st == '00004'
    admin_branch_new = no == 26                                      # N13: case 26 Admin duyệt thay
    target = names[0]
    after_new = '作業中'
    if reqc:
        ap = approvers(no, typ, st, approver_n, amt_n)[0] if not approver_n.lower().startswith('store manager') else store_mgr(st)
        s = [f"1. Login Admin (99) (on behalf of worker) → open trouble → 'クイック操作' → edit '見積もり' → expand '{target}' → '取り下げ申請' → reason 'Request cancel' → '申請を送信' → Verify: '以下の理由で取り下げ申請を行いますか' → '決定' → Verify: '取り下げ申請中'"]
        if reqc_res.startswith('✅'):
            s += [f"2. Logout → login {ap} → expand '{target}' → '取り下げ承認' → reason 'Automation approve cancel' (if a reason box opens) → '取り下げ承認' → '決定' → Verify: 見積書 '未提出' (manager no longer has '見積もり' — R12-2)",
                  f"3. Logout → login Admin (99) → 'クイック操作' → edit '見積もり' → Verify: '{target}' = '下書き' → re-edit '{target}' → tick → '提示する' → '決定' → Verify: '再承認待ち' / '承認待ち'"]
            exp = "Estimate goes 取り下げ申請中 → 下書き → 承認待ち again (approve type unchanged — C6)"
        else:
            s += [f"2. Logout → login {ap} → expand '{target}' → '取り下げ却下' → '取り下げを却下する': reason 'Automation reject cancel' → '取り下げ却下' → '決定' → Verify: 見積書 '未提出' (manager no longer has '見積もり' — R12-2)",
                  f"3. Logout → login Admin (99) → 'クイック操作' → edit '見積もり' → Verify: '{target}' = '失効', only 'コピー' is available → 'コピー' → new draft '{target}-copy' → tick → '提示する' → '決定' → Verify: '承認待ち'"]
            exp = "Original = '失効' after 取り下げ却下 (copy only — R12-1); copy is submitted '承認待ち'"
        add('Trouble Detail › 見積もり', f"NEW · 取り下げ申請 → {'承認 → 再提示' if reqc_res.startswith('✅') else '却下 → コピー → 新規提示'}", '-', s, exp, f'CMS Admin (99) + {ap}', q=['C6'] if reqc_res.startswith('✅') else [])
        if not reqc_res.startswith('✅'): target = f'{target}-copy'
    if reedit.startswith('✅') and not reqc and not auto_n:
        nokey = 'no-key' in approver_n.lower()
        rej = store_acc('00001') if nokey else approvers(no, typ, st, approver_n, amt_n)[0]
        s = [f"1. Login {rej} → open trouble → '見積もり' → expand '{target}'" + (" (cột gốc: no-key store — chỉ dùng STORE00001, confirm 14/10)" if nokey else ''),
             "2. '差し戻し' → reason 'Automation reject' → '決定' → Verify: '差し戻し'",
             f"3. Logout → login Admin (99) → '見積もり' → expand '{target}' → Verify: only 'コピー' is available → 'コピー' → new draft '{target}-copy' → '決定' → tick '{target}-copy' → '提示する' → '決定' → Verify: '{target}-copy' = '承認待ち'"]
        add('Trouble Detail › 見積もり', 'NEW · 差し戻し → コピー → 新規提示', '-', s,
            f"Original '{target}' = '差し戻し' (copy only); copy '{target}-copy' submitted '承認待ち' (lượt 10 R8-1)", f'{rej} + CMS Admin (99)', q=['C6'])
        target = f'{target}-copy'
    if urgent_new:
        if len(names) > 1:
            add('Trouble Detail › 見積もり', 'NEW · Urgent: Admin approves 1 estimate → others 失効', '-',
                [f"1. Login Admin (99) → open trouble → '見積もり' → expand '{names[0]}' → '承認する' → '決定'", "2. Check the other estimates"],
                f"'{names[0]}' = '承認済み'; {', '.join(repr(x) for x in names[1:])} = '失効'" + (f"; '{draft}' stays '下書き'" if draft else '') + f"; badge stays '対応中' / '{after_new}'",
                'CMS Admin (99)', q=['G17', 'G15'])
    elif auto_n:
        auto_tc('new', target, after_new, approver_n)
    else:
        apps = approvers(no, typ, st, approver_n, amt_n)
        approve_seq('new', target, apps, ringi_new, after_new, admin_branch_new)
    if after_appr:
        nn = f'{P}-New-R1'
        add('Trouble Detail › 見積もり', 'NEW · Re-submit AFTER approved', '-',
            [f"1. Login Admin (99) → '見積もり' → '登録' '{nn}' ({amt_n}) → '提示する' → '決定'",
             f"2. '{nn}' is approved ({'auto, ≤ FIX' if auto_n else 'same approver(s) as above'})"],
            f"Previous approved estimate '{target}' = '失効'; '{nn}' = '承認済み'", 'CMS Admin (99)', q=['G14'])
    if len(names) > 1 and not urgent_new:
        won = target if target.startswith(names[0]) else names[0]       # rev 10 (R10-1): sau 差し戻し → コピー, bản '-copy' là báo giá được duyệt
        others = [x for x in names if x != won]
        add('Trouble Detail › 見積もり', 'NEW · Other estimates → 失効 after approval', '-',
            ["1. Reload → '見積もり' → check every estimate"],
            f"'{won}' = '承認済み'; {', '.join(repr(x) for x in others)} = '失効'" + (f"; '{draft}' stays '下書き'" if draft else ''),
            'CMS Admin (99)', q=['G14'] if two else ['G15'] if draft else ['G16'])
    if auto_n and no in (31, 34):
        key_view('new', target)

    # ---- NEW: báo cáo + thanh toán ----
    late_new = urgent_new and len(names) == 1 and not auto1_new      # rev 7 (lượt 9 Q5): urgent > FIX → duyệt lại ở 02-08; rev 9 R9-2: ≤ FIX đã tự duyệt
    s = ["1. Login Admin (99) → 'クイック操作' → '作業完了' → '保存' → '決定' → 'OK' → Verify: badge '作業完了'"]
    if late_new:
        s.append(f"2. At 02-08: 'クイック操作' → edit icon '見積もり' → expand '{target}' → '承認する' → '決定' → Verify: '承認済み' (urgent: approval done after work — 02-05 was skipped)")
    k = len(s) + 1
    s += [f"{k}. 'クイック操作' → '報告済' → edit icon '報告書' → '編集' → 開始 day 1, 終了 day 2, 原因と発生起因 '{NOTE}', 作業前 'hieu4.jpg', 作業後 'hieu3.jpg'"
          + (", attach PDF 'automation.pdf'" if no == 39 else '') + " → '完了'", f"{k+1}. '保存' → '決定' → 'OK'"]
    add('Trouble Detail › 状態変更 / 報告書', 'NEW · 作業完了 → 報告済 (02-08 → 02-09)' + (' + PDF attachment' if no == 39 else ''), '-', s,
        "Badge '対応中' / '報告済' (02-09)" + ("; 報告書 shows PDF 'automation.pdf'" if no == 39 else '') + (f"; estimate '{target}' = '承認済み'" if late_new else ''),
        'CMS Admin (99)', q=(['G26'] if no == 39 else []) + (['Q5'] if late_new else []))
    pw = person(payer, st)
    pq = ['N7', 'R3'] + (['G8'] if payer in ('Admin', 'Sub Admin') else []) + (['N18'] if st == '00006' and payer.lower().startswith('store manager') else [])
    add('Trouble Detail › 作業完了確認', f'NEW · {payer} 確認・決済 → 完了', '-',
        [f"1. Logout → login {pw} → open trouble → minimize chat", "2. '作業完了確認' → Verify: '支払情報' with 作業項目 and total of the approved estimate",
         f"3. Star '感動' → comment '{NOTE}' → '作業完了確認' → '決定' → Verify: '作業依頼の決済状態の保存が完了しました。' → 'OK'"],
        "Badge '完了' / '報告済', '作業完了確認' disappears; NEW trouble = 完了", pw, q=pq)

    # ---- CONTINUE ----
    cw = 'CMS SubAdmin (98)' if cont_creator == 'subadmin' else 'CMS Admin (99)'
    s = [f"1. Logout → login {cw} → menu '作業依頼登録' → radio '継続依頼' → '次へ'",
         "2. '作業依頼選択' → select the NEW trouble → Verify: store and 作業項目 filled from the original",
         "3. '決定して問合わせ' → '決定' → 'OK'"]
    add('作業依頼登録 (継続)', f"CONTINUE · {cont_creator} creates 継続依頼 '_2'", '-', s,
        f"Continue trouble '<依頼番号>_2' is created for '{sname}': '対応中' / '見積待ち' (02-10), version New", cw, q=['N4'] if st == '00005' else [])
    if urgent_cont and urgent_new:                                     # rev 11 (R11-1): '_2' kế thừa 案件区分 từ NEW urgent → chỉ kiểm, không 保存
        add('Trouble Detail', 'CONTINUE · Urgent inherited: 案件区分 営業停止案件', '-',
            ["1. Login Admin (99) → open '_2' → Verify: 案件区分 = '営業停止案件' (inherited from NEW)"],
            "'_2' 案件区分 = '営業停止案件' (urgent inherited — no edit / 保存 needed)", 'CMS Admin (99)', q=['G5'])
    elif urgent_cont: urgent_tc('CONTINUE')
    note = ' (cột gốc 変更あり — giữ nguyên worker theo N15)' if d['57'] == '変更あり' else ''
    add('Trouble Detail › 状態変更 (継続)', 'CONTINUE · 作業スタッフ kept (linksysworker)', '-',
        [f"1. Open '_2' → Verify: 業者 = 'LINKSYS WORKER' (inherited){note}"], "Worker 'LINKSYS WORKER' is kept from the original trouble", cw, q=['N15'])
    cnames = [f'{P}-Cont'] if est_c in ('1', '') else [f'{P}-Cont{i}' for i in (1, 2)]
    if len(cnames) > 1: auto_c = False                               # confirm 14/10: nhiều báo giá ≤ FIX → không cái nào tự duyệt
    auto1_c = auto_c is True                                           # rev 4; rev 9 R9-2: urgent cũng tự duyệt ≤ FIX
    s = [f"1. Login Admin (99) → open '_2' → 'クイック操作' → edit icon '見積もり' → for each of {', '.join(repr(x) for x in cnames)}: '登録', item '作業' 'Autotest', {amt_c} → '決定'",
         ("2. Tick → '提示する' → '決定' → Verify: '承認済み' (≤ FIX → tự duyệt ngay khi 提示 — rev 4)" if auto1_c else "2. Tick → '提示する' → '決定' → Verify: '承認待ち'"),
         ("3. '閉じる' → (urgent: skip approval) → '保存' → '決定' → 'OK'" if urgent_cont else "3. '閉じる' → select '見積承認待ち' → '保存' → '決定' → 'OK'")]
    add('Trouble Detail › 見積もり (継続)', f'CONTINUE · Create {len(cnames)} estimate(s) ({amt_c}) and 提示', '-', s,
        (("Badge '対応中' / '見積承認済' (02-40, urgent skip)" + ("; estimate '承認済み' (≤ FIX, tự duyệt khi 提示 — R9-2)" if auto1_c else '')) if urgent_cont else ("Badge '対応中', estimate '承認済み' (≤ FIX, tự duyệt khi 提示)" if auto1_c else "Badge '対応中' / '見積承認待ち' (02-20)") + (f"; {len(cnames)} estimates '承認待ち' — none auto-approved even if ≤ FIX" if len(cnames) > 1 else '')), 'CMS Admin (99)', q=['G24'])
    if not urgent_cont:
        if auto_c:
            auto_tc('cont', cnames[0], '見積承認済', approver_c)
        else:
            apps = approvers(no, typ, st, approver_c, amt_c)
            lv1_only = len(cnames) > 1 and apps == ['DYN']   # case 17: ≤ FIX dưới ngưỡng Lv1 → MANAGER00001 (Lv1) duyệt (rev 3)
            if lv1_only: apps = [mgr('00001') + ' (Lv1)']
            approve_seq('cont', cnames[0], apps, ringi_new and not lv1_only, '見積承認済', admin_branch_new)
        if len(cnames) > 1:
            add('Trouble Detail › 見積もり (継続)', 'CONTINUE · Other estimate → 失効', '-', ["1. Reload → '見積もり'"],
                f"'{cnames[0]}' = '承認済み', '{cnames[1]}' = '失効'", 'CMS Admin (99)')
    s = ["1. Login Admin (99) → 'クイック操作' → '日程確定' → '保存' → '決定' → 'OK'",
         "2. Same with '移動中', '到着', '作業中', '作業完了' → Verify: badge after each step"]
    late_cont = urgent_cont and not auto1_c                            # rev 7 (lượt 9 Q6): urgent > FIX → duyệt lại ở 02-80; rev 9 R9-2
    if late_cont:
        s.append(f"3. At 02-80: 'クイック操作' → edit icon '見積もり' → expand '{cnames[0]}' → '承認する' → '決定' → Verify: '承認済み'")
    add('Trouble Detail › 状態変更 (継続)', 'CONTINUE · 日程確定 → 移動中 → 到着 → 作業中 → 作業完了 (02-50 → 02-80)', '-', s,
        "Badge '対応中' / '作業完了' (02-80)" + (f"; estimate '{cnames[0]}' = '承認済み'" if late_cont else ''), 'CMS Admin (99)', q=(['Q6'] if late_cont else []))
    add('Trouble Detail › 報告書 (継続)', 'CONTINUE · 報告済 (02-90)', '-',
        [f"1. 'クイック操作' → '報告済' → edit '報告書' → '編集' → 開始 / 終了, 原因と発生起因 '{NOTE}', photos → '完了' → '保存' → '決定' → 'OK'"],
        "Badge '対応中' / '報告済' (02-90)", 'CMS Admin (99)')
    add('Trouble Detail › 作業完了確認 (継続)', f'CONTINUE · {payer} 確認・決済 → 完了', '-',
        [f"1. Logout → login {pw} → open '_2'", "2. '作業完了確認' → Verify: '支払情報' total of the CONTINUE estimate",
         f"3. '感動' → '{NOTE}' → '作業完了確認' → '決定' → 'OK'"],
        "'_2' badge '完了' / '報告済'; both troubles 完了", pw, q=pq)
    if no in (9, 27):
        notes.append('Cột gốc CONTINUE "no limit": STORE00005 dùng chung FIX cho New / Continue (N17) → Continue dùng total = FIX + 1 để có bước duyệt.')
    if 29 <= no <= 34:
        notes.append('Chỉ dùng STORE00001 (confirm 14/10): bỏ thao tác của store no-key 00002 và phần kiểm hiển thị no-key (\'0\' / \'***\', \'承認する\' disabled).')
    if len(cnames) > 1:
        notes.append('CONTINUE có 2 báo giá ≤ FIX: không cái nào tự duyệt (confirm 14/10) → người duyệt duyệt 1, cái còn lại 失効.')
    return finish(d, n, no, P, v, st, sname, typ, T, dec, notes, amt_n, amt_c, names)

def finish(d, n, no, P, v, st, sname, typ, T, dec, notes, amt_n, amt_c, names):
    for i, t in enumerate(T):
        t['id'] = f'{P}-TC-{i+1:03d}'
        if t['pre'] in ('-', 'Previous TC passed') and i > 0: t['pre'] = f'{P}-TC-{i:03d} passed'
        if t['pre'] == 'TC-001 passed': t['pre'] = f'{P}-TC-001 passed'
    if no in (24, 25, 27):
        notes.append('Chỉ chạy web; phần thiết bị (iOS / Android / cross-device) không test (G25).'); dec.add('G25')
    typ_lbl = 'không có (N16)' if st in ('00001', '00002') else 'auto approve (N16)' if st == '00005' else ('04 + Lv0' if st == '00009' else typ)
    params = [('Biến thể', v), ('Store', f"{sname} · approve type {typ_lbl} (cột gốc: type {typ})"),
              ('Tạo trouble', f"{d['19']} · {'urgent (営業停止案件)' if d['12'] == '✅' else '通常依頼'} · トラブルナビ ON (cột gốc {d['28']}) · シサンNAVI {d['29']}"),
              ('Worker', 'linksysworker suốt luồng (C2, N15)'),
              ('Báo giá NEW', f"{len(names)} 提示 · {amt_n} · người duyệt (cột gốc) {d['41']}"),
              ('Báo cáo / thanh toán', f"payer (cột gốc) {d['23']}"),
              ('Báo giá CONTINUE', f"{d['59']} · {amt_c} · người duyệt (cột gốc) {d['65']}"),
              ('Kết luận gốc', d['78'])]
    head = [f"# Test case — {n} · {v}",
            f"- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: {P}",
            f"- Source: projects/qnavi/spec/e2e-suite.md › {n} (gốc: raw/Test suite for automation_E2E.xlsx, \"Expanded v2\"). Luồng thao tác: raw/Automation Test AI - Format Main Case.csv, TC LOCKED phase007. Quyết định: QUESTIONS.md lượt 1–9 + quy tắc R1–R20, T1–T5, rev 4–7 (15/10/2026). Môi trường tham chiếu: toridoll-test.",
            LOCK,
            "- Môi trường: tuỳ biến khi chạy (Q9).",
            "- Ngoại lệ D05: 1 file = 1 kịch bản nối tiếp NEW → CONTINUE → 完了; mỗi TC = 1 giai đoạn. 'Verify:' = điểm kiểm giữa chừng.",
            "- Quy ước chung: báo giá do Admin (99) tạo thay worker trên CMS; worker = linksysworker; FIX = 限度額 (税込) đọc ở TC-001, không sửa; ≤ FIX → tự duyệt cả New và Continue; 承認タイプ theo cấu hình store; báo cáo = đổi trạng thái trên CMS; bỏ 日程承認."]
    for x in notes: head.append(f'- Lưu ý: {x}')
    head += ['', '## Tham số kịch bản', '| Tham số | Giá trị |', '|---|---|'] + [f'| {a} | {b.replace("|", "/")} |' for a, b in params]
    head += ['', '## Test case', '| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |',
             '|---|---|---|---|---|---|---|---|---|---|---|---|---|'] + [tc_row(t) for t in T]
    order = lambda x: (x[0], int(re.sub(r'\D', '', x) or 0))
    head += ['', '## Quyết định áp dụng (QUESTIONS.md)', ', '.join(sorted(dec, key=order))]
    fn = f'{n}-{slug(v)}-test-cases.md'
    open(os.path.join(OUT, fn), 'w').write('\n'.join(head) + '\n')
    return n, v, fn, len(T), sname

def common_setup():
    """E2E-00: cấu hình chain Linksys dùng chung (トラブルナビ luôn ON — C4; シサンNAVI là cấu hình chung của chain)."""
    def tc(i, val):
        return dict(id=f'E2E00-TC-{i:03d}', screen='チェーンシステム情報', func=f'COMMON · Linksys: トラブルナビ ON, シサンNAVI {val}', pre='-',
                    steps=["1. Login Admin (99) → Dashboard → menu 'チェーンシステム情報' → search 'Linksys' → open 'Linksys Chain System'",
                           "2. Verify: 'トラブルナビ' = ON",
                           f"3. Verify: 'シサンNAVI' = {val}; if not → '編集' → set 'シサンNAVI' = {val} → '保存' → '決定' → 'OK'"],
                    exp=f"'Linksys Chain System' shows トラブルナビ ON / シサンNAVI {val}", role='CMS Admin (99)')
    T = [tc(1, 'OFF'), tc(2, 'ON')]
    head = ['# Test case — E2E-00 · Common setup (cấu hình chain Linksys)',
            '- Project: qnavi · Scope Key: e2e-suite · Sheet prefix: E2E00',
            '- Source: QUESTIONS.md (C4: トラブルナビ luôn ON · N11: chỉ bật/tắt シサンNAVI · G29) — tiền đề chung của mọi case E2E.',
            f'{LOCK}',
            '- Dùng: TC-001 (シサンNAVI OFF) là tiền đề của 35 case; TC-002 (シサンNAVI ON) là tiền đề của E2E-37, E2E-38. Chạy lẻ 1 case → chạy TC common tương ứng trước.',
            '- シサンNAVI là cấu hình chung của chain → không chạy song song case nhóm OFF với nhóm ON.',
            '', '## Test case', '| TC ID | Viewpoint ID | Test Level | Main Screen | Function | Pre-condition | Steps | Expected Results | Role | OS | Priority | Status | Automation Eligibility |',
            '|---|---|---|---|---|---|---|---|---|---|---|---|---|'] + [tc_row(t) for t in T]
    head += ['', '## Quyết định áp dụng (QUESTIONS.md)', 'C4, G29, N11']
    fn = 'E2E-00-common-setup-test-cases.md'
    open(os.path.join(OUT, fn), 'w').write('\n'.join(head) + '\n')
    return 'E2E-00', 'Common setup (トラブルナビ ON · シサンNAVI OFF / ON)', fn, len(T), 'Linksys Chain System'

rows = [common_setup()] + [build(d) for d in C if int(d['id'].split('-')[1]) not in SKIP]
json.dump(rows, open(os.path.join(HERE, '_index.json'), 'w'), ensure_ascii=False)
total = sum(r[3] for r in rows)
readme = ['# E2E suite — 37 kịch bản + common setup (LOCKED · Revision 12, 16/10/2026)', '',
          'Nguồn: projects/qnavi/spec/e2e-suite.md. Quyết định: QUESTIONS.md (lượt 1–9) + quy tắc R1–R20 + T1–T5 + rev 4–7. Sinh bằng _tools/gen_e2e.py.',
          'Bỏ case 16 (G14) và case 28 (G11).', '',
          '## Thứ tự chạy', '- Chạy lẻ từng case: chạy E2E00-TC-001 (シサンNAVI OFF) trước, riêng E2E-37 / E2E-38 chạy E2E00-TC-002 (シサンNAVI ON) trước.',
          '- Không chạy song song case nhóm OFF với E2E-37 / E2E-38 (シサンNAVI là cấu hình chung của chain).', '',
          f'Tổng: {len(rows)} file · {total} TC.', '',
          '| Case | Biến thể | Store | Số TC | File |', '|---|---|---|---|---|']
readme += [f'| {r[0]} | {r[1].replace("|", "/")} | {r[4]} | {r[3]} | [{r[2]}]({r[2]}) |' for r in rows]
open(os.path.join(OUT, 'README.md'), 'w').write('\n'.join(readme) + '\n')
for r in rows: print(r[0], r[3], r[4], r[2])
print('TOTAL', len(rows), total)
