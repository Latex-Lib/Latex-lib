/**
 * note.epigraph's presets, each from the templates that use it (`node seed.ts note --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  memoir: {
    description: "memoir's epigraph as the class sets it: the quotation in \\small, 0.4\\textwidth wide at the right of the text block, a 0.4pt rule under it, the note's title as its source flush right below. Nothing loaded.",
    features: ['flush-right', 'small-type'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.memoir/main.tex', line: '117 (\\epigraph{A short quotation that sets the tone of the chapter.}{--- An Author, \\textit{A Book}}, after \\chapter{Introduction})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '18822-18829 (\\epigraphwidth .4\\textwidth, \\epigraphrule .4\\p@), 18839 (\\epigraphsize \\small), 18849 (\\epigraphflush flushright), 18919-18923 (\\epigraph)' },
    ],
  },
  wide: {
    description: "A wider epigraph, \\epigraphwidth 0.6\\linewidth, otherwise memoir's: small type at the right, a rule, the source below.",
    writes: '\\epigraph{…}{…}; \\setlength{\\epigraphwidth}{…}',
    features: ['flush-right', 'small-type'],
    params: { width: '0.6\\linewidth' },
    evidence: [
      solution('0587-c-i-p-h-e-r-phinished', '46'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0587-c-i-p-h-e-r-phinished/thesisInParts/0_preamble/1-latexHacks.tex', line: '18 (\\setlength\\epigraphwidth{0.6\\linewidth}), 25 (\\epigraph{#1}{#2})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
