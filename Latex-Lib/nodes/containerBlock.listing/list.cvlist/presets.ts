/**
 * list.cvlist's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

/** A template's own source, at its lines. */
const source = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;

export const PRESETS = {
  single: {
    description: "moderncv's list lines, one item a line in the main column with the style's list symbol (\\cvlistitem); a described item a \\cvitem with its term in the hints column.",
    features: ['class-styled'],
    params: {},
    evidence: [
      source('0196-moderncv/template.tex', '241-244 (\\cvlistitem{Item 1} …; \\cvitem{hobby 1}{Description} at 235-238)'),
      source('0410-moderncv-cv-and-cover-letter/main.tex', '57-59 (\\cvitem{Languages}{Python, SQL, Scala, Go} …)'),
      solution('0791-geekplux-cv-r-sum', '23, 39'),
    ],
  },
  double: {
    description: 'Two list items side by side on each line, the main column halved (\\cvlistdoubleitem{…}{…}).',
    writes: '\\cvlistdoubleitem{…}{…} \\cvitem{…}{…}',
    features: ['class-styled'],
    params: { double: true },
    evidence: [source('0196-moderncv/template.tex', '246-249 (\\cvlistdoubleitem{Item 1}{Item 4} …)')],
  },
} as const satisfies { readonly [name: string]: Preset };
