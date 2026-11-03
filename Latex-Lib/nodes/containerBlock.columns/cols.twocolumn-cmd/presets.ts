/**
 * cols.twocolumn-cmd's presets, each from the templates that use it (`node seed.ts cols --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'page-columns': {
    description: "The kernel's \\twocolumn: the block starts a new page in two columns and \\onecolumn returns the next page to one.",
    features: ['page-columns', 'page-break-before'],
    params: {},
    evidence: [solution('0031-nhatkhangcs-overleaf-comments', '43'), solution('0033-platex', '38')],
  },
  ruled: {
    description: 'Two-column pages with a rule between the columns (\\columnseprule 0.4pt).',
    features: ['page-columns', 'page-break-before', 'column-rule'],
    params: { rule: '0.4pt' },
    evidence: [solution('0031-nhatkhangcs-overleaf-comments', '80')],
  },
  'stay-two': {
    description: 'Two columns from the block on, without returning to one (no \\onecolumn after it).',
    features: ['page-columns', 'page-break-before'],
    params: { returnToOne: false },
    evidence: [solution('0031-nhatkhangcs-overleaf-comments', '43')],
  },
} as const satisfies { readonly [name: string]: Preset };
