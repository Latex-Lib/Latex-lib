/**
 * tbl.inline's presets: a letter's table and a poster's.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  tikzposter: {
    description: "A poster's table inside a block: centred, booktabs rules above, under the header row and below, no float and no caption, as tikzposter templates set it.",
    features: ['booktabs-rules', 'centered', 'box-safe'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0436-jacobs-landscape-poster/main.tex', line: '62-71 (\\block{Results}{\\begin{center}\\begin{tabular}{lcc}\\toprule … \\bottomrule\\end{tabular}\\end{center} …})' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0429-ndpvt-web-latex-document-skill/assets/templates/poster.tex', line: '177-189' },
      solution('0436-jacobs-landscape-poster', 'class'),
    ],
  },
  letter: {
    description: "A letter's table: the kernel's tabular in the text, flush left, \\hline rules above, under the header row and below; letter has no table float, counter or caption.",
    writes: '{\\par\\noindent \\begin{tabular}{p{…}p{…}} \\hline … & … \\\\ \\hline … \\\\ \\hline \\end{tabular}\\par}',
    features: ['horizontal-rules', 'box-safe'],
    params: { rules: 'hline', align: 'left' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '118-122' }],
  },
} as const satisfies { readonly [name: string]: Preset };
