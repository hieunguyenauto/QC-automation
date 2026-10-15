import { test } from '@playwright/test';
import { credentials, account } from '../../data/roles';
test('chk', () => { for (const r of ['99','01','02'] as const) { const c = credentials(r); console.log(r, c?.loginId ?? 'NONE', c ? 'pw:yes' : '', account(r)?.displayName ?? ''); } });
