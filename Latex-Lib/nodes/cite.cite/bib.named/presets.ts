/**
 * bib.named's (cite/cite) presets: the IJCAI kit's citation commands (ijcai26.sty l.286-291), as its sample uses them
 * (ijcai26.tex l.258-259, 386-393) and as the style's comments describe the two it leaves unused (l.270-282).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const TEX = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex';
const STY = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty';

export const PRESETS = {
  cite: {
    description: "IJCAI's \\cite{key}: the authors and year in raised square brackets, [Knuth, 1984], several joined by semicolons.",
    features: ['author-year'],
    params: {},
    evidence: [solution('0319-ijcai', '23, 73'), { kind: 'source', file: TEX, line: '259, 386-393' }, { kind: 'source', file: STY, line: '286-287, 295-313' }],
  },
  shortcite: {
    description: "IJCAI's \\shortcite{key} after the authors named in the sentence, tied to them: Knuth~[1984].",
    writes: '~\\shortcite{…}',
    features: ['author-year'],
    params: { command: 'shortcite', tie: true },
    evidence: [{ kind: 'source', file: TEX, line: '258 (Gottlob~\\shortcite{gottlob:nonmon}), 392 (Nebel~\\shortcite{nebel:jair-2000})' }, { kind: 'source', file: STY, line: '288' }],
  },
  citeauthor: {
    description: "IJCAI's \\citeauthor{key}: the authors alone, no brackets.",
    writes: '\\citeauthor{…}',
    features: ['author-year'],
    params: { command: 'citeauthor' },
    evidence: [solution('0319-ijcai', '23'), { kind: 'source', file: STY, line: '290, 300-303' }],
  },
  citeyear: {
    description: "IJCAI's \\citeyear{key}: the year alone, no brackets.",
    writes: '\\citeyear{…}',
    features: ['author-year'],
    params: { command: 'citeyear' },
    evidence: [solution('0319-ijcai', '23'), { kind: 'source', file: STY, line: '291, 300-303' }],
  },
} as const satisfies { readonly [name: string]: Preset };
