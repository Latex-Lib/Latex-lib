/**
 * front.titlepage-env's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  centered: {
    description: 'A title page laid out by hand in the titlepage environment: the title huge and bold, the authors and date under it, centred.',
    features: ['title-page', 'centered'],
    params: {},
    evidence: [solution('0076-utlis-llls-depp-thesis-template', '34'), solution('0062-sp5lma-ee-dyplom', '55')],
  },
  ruled: {
    description: 'The title between two rules the width of the line (\\rule{\\linewidth}{0.4pt} above and below).',
    features: ['title-page', 'centered', 'ruled'],
    params: { rules: true },
    evidence: [solution('0006-gsemthesis', '50'), solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '53')],
  },
  spread: {
    description: 'The title a third of the way down and the authors and date pushed to the foot of the page (\\vspace*{0.3\\textheight}, \\vfill).',
    features: ['title-page', 'centered'],
    params: { topSpace: '0.3\\textheight', spread: true },
    evidence: [solution('0037-hilbert', '62'), solution('0086-shakthi-kannan-tamil-english-xelatex-boo', '53')],
  },
  'left-sans': {
    description: 'A flush-left title page in bold sans-serif.',
    features: ['title-page', 'sans-serif', 'bold-head'],
    params: { align: 'left', titleFont: '\\Huge\\sffamily\\bfseries' },
    evidence: [solution('0053-zhanghai-zju-csse-undergraduate-design-l', '75')],
  },
} as const satisfies { readonly [name: string]: Preset };
