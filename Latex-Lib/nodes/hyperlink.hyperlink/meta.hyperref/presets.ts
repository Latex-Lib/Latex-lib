/**
 * meta.hyperref's presets, each from the templates that use it (`node seed.ts meta --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  boxed: {
    description: "hyperref's own look: \\href{url}{text}, links framed by thin coloured boxes on screen, not printed.",
    features: ['linked', 'boxed-links'],
    params: {},
    evidence: [solution('0001-digital-minimal', '68')],
  },
  colored: {
    description: 'Links in colour instead of boxes, every kind blue (colorlinks, linkcolor, citecolor, urlcolor=blue).',
    features: ['linked', 'colored-links'],
    params: { look: 'colored', linkColor: 'blue', citeColor: 'blue', urlColor: 'blue' },
    evidence: [solution('0017-hit-report', '33'), solution('0016-rho-class-research-article', '51')],
  },
  'black-internal': {
    description: 'Internal links black, web and citation links in an accent colour (colorlinks, linkcolor=black, urlcolor and citecolor coloured).',
    features: ['linked', 'colored-links'],
    params: { look: 'colored', linkColor: 'black', citeColor: 'blue!60!black', urlColor: 'blue!60!black' },
    evidence: [solution('0006-gsemthesis', '44'), solution('0003-ucsmonograph', '53')],
  },
  hidden: {
    description: 'Links that work but show nothing, no boxes and no colour (hidelinks).',
    features: ['linked'],
    params: { look: 'hidden' },
    evidence: [solution('0014-daniel-wambua-cv', '46')],
  },
} as const satisfies { readonly [name: string]: Preset };
