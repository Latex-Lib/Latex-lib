/**
 * pg.afterpage's presets, each from the templates that use it (`node seed.ts pg --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'flush-after': {
    description: 'The break waits until the current page is full, then flushes the floats (\\afterpage{\\clearpage}), so the page is not left short.',
    features: ['deferred', 'float-flush'],
    params: {},
    evidence: [solution('0020-koma-script', '76'), solution('0030-seu-ml-assign', '67')],
  },
  'odd-after': {
    description: 'After the current page is full, a new right-hand page (\\afterpage{\\cleardoublepage}).',
    features: ['deferred', 'float-flush', 'odd-page'],
    params: { command: 'cleardoublepage' },
    evidence: [solution('0020-koma-script', '76')],
  },
} as const satisfies { readonly [name: string]: Preset };
