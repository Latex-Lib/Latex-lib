/**
 * pg.break's presets, each from the templates that use it (`node seed.ts pg --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  clearpage: {
    description: 'A new page after every pending float is placed (\\clearpage).',
    features: ['float-flush'],
    params: {},
    evidence: [solution('0003-ucsmonograph', '39')],
  },
  newpage: {
    description: 'A new page at once, floats left to come later (\\newpage).',
    features: [],
    params: { command: 'newpage' },
    evidence: [solution('0006-gsemthesis', '36'), solution('0076-utlis-llls-depp-thesis-template', '34')],
  },
  'odd-page': {
    description: 'A new right-hand page in two-sided documents, a blank page before it if needed (\\cleardoublepage).',
    features: ['float-flush', 'odd-page'],
    params: { command: 'cleardoublepage' },
    evidence: [solution('0002-ulth-se-universit-laval-thesis', '42'), solution('0020-koma-script', '76')],
  },
  'soft-break': {
    description: 'A page break the line-breaker may stretch the page for, the page filled out (\\pagebreak).',
    features: [],
    params: { command: 'pagebreak' },
    evidence: [solution('0003-ucsmonograph', '39')],
  },
} as const satisfies { readonly [name: string]: Preset };
