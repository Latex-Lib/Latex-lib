/**
 * toc.tocloft's presets, each from the templates that use it (`node seed.ts toc --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'dotted-sections': {
    description: 'Dot leaders from section entries to their page numbers too (\\renewcommand{\\cftsecleader}{\\cftdotfill{\\cftdotsep}}).',
    features: ['dot-leaders'],
    params: {},
    evidence: [solution('0074-tlc-article', '62')],
  },
  'centered-title': {
    description: 'The contents title centred, large and bold (\\cfttoctitlefont{\\hfill\\Large\\bfseries}, \\cftaftertoctitle{\\hfill}), dot leaders for sections.',
    features: ['dot-leaders', 'centered'],
    params: { titleFont: '\\hfill\\Large\\bfseries', titleAfter: '\\hfill' },
    evidence: [solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '59')],
  },
  'number-gap': {
    description: 'Half an em after each entry number (\\cftsecaftersnumb), section entries bold, no leaders.',
    features: ['bold-head'],
    params: { leaders: 'none', sectionFont: '\\bfseries', afterNumber: '\\hspace{0.5em}' },
    evidence: [solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '59'), solution('0003-ucsmonograph', '63')],
  },
} as const satisfies { readonly [name: string]: Preset };
