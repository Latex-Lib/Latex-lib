/**
 * cols.vwcol's presets, each from the templates that use it (`node seed.ts cols --rows`).
 * The two templates that use vwcol: 0112-sizuhe's APA title block
 * (apa-sizuhe.cls:189, \begin{vwcol}[widths={0.3, 0.7}, sep=1.5cm, rule=0pt, indent=0pt]) and 0718-astropah, which only loads
 * it. 0091-hcbundle, cited here before, never uses vwcol (its line 63 is multicol).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  equal: {
    description: 'Columns of equal width that the text flows through, \\begin{vwcol}[widths={0.5,0.5}, sep=…, rule=0pt].',
    features: ['balanced-columns'],
    params: {},
    evidence: [solution('0112-sizuhe-latex-templates-library', '61'), solution('0718-astropah-newsletter', '71')],
  },
  'wide-first': {
    description: 'A wide first column and narrower ones after it (two columns: 0.6 and 0.4; three: 0.5, 0.25, 0.25).',
    features: ['balanced-columns', 'unequal-widths'],
    params: { widths: 'wide-first' },
    evidence: [solution('0112-sizuhe-latex-templates-library', '61')],
  },
} as const satisfies { readonly [name: string]: Preset };
