/**
 * toc.titletoc's presets, each from the templates that use it (`node seed.ts toc --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { manual, solution } from '../../evidence.ts';

export const PRESETS = {
  dotted: {
    description: 'Section entries bold with a little space above, the number in a 1.5em box, dot leaders to the page (\\titlecontents{section}…{\\titlerule*[0.6pc]{.}\\contentspage}).',
    features: ['dot-leaders', 'bold-head'],
    params: {},
    evidence: [solution('0108-lix', '48'), solution('0104-sjtutex', '86'), manual('titlesec', '6.1 A ten-minute guide to titletoc')],
  },
  'no-leaders': {
    description: 'Entries in small bold sans-serif, the page number pushed right with no leaders (\\hfill\\contentspage), no right margin (\\contentsmargin{0cm}).',
    features: ['bold-head', 'sans-serif'],
    params: { leaders: false, sectionFont: '\\sffamily\\small\\bfseries', margin: '0cm' },
    evidence: [solution('0012-basic-academic-journal-article', '56')],
  },
  'sans-entries': {
    description: 'Section entries in sans-serif with dot leaders, the number followed by a quad (\\contentspush).',
    features: ['dot-leaders', 'sans-serif'],
    params: { sectionFont: '\\sffamily', push: true },
    evidence: [solution('0250-ustc-thesis', '65'), solution('0384-dgut-paper', '46')],
  },
} as const satisfies { readonly [name: string]: Preset };
