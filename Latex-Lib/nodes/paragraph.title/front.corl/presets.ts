/**
 * front.corl's presets, from CoRL's example paper (Latex-Template-Examples/class.corl/main.tex) and the class profile
 * (classes/corl.ts, which reads corl_2026.sty).
 */
import type { Preset } from '../../../schema/params.ts';

const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.corl/main.tex';
const PROFILE = 'Latex-Lib/classes/corl.ts';

export const PRESETS = {
  corl: {
    description:
      "CoRL's title block: \\title, \\author with each name marked $^{n}$ by its affiliations, joined by \\quad, a numbered line per affiliation and a line of e-mails in \\texttt; the style's \\maketitle; \\keywords{…} right after the abstract.",
    features: ['class-styled', 'centered', 'superscript'],
    params: {},
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '68-78 (\\title; \\author{First Author$^{1}$ \\quad Second Author$^{2}$ … \\\\ $^{1}$Department …, University …, City, Country \\\\ … \\\\ \\texttt{…}, \\texttt{…}})' },
      { kind: 'source', file: EXAMPLE, line: '80-91 (\\maketitle, the abstract, then \\keywords{Robot Learning, Manipulation, Imitation Learning})' },
      { kind: 'source', file: PROFILE, line: '19-21, 34 (\\maketitle redefined at corl_2026.sty l.342-362; \\keywords \\def\'d at l.378), 47, 51 (vocabulary: \\keywords printed under the abstract)' },
    ],
  },
  'keywords-after-title': {
    description: "CoRL's title block with the keywords right after \\maketitle, for a document with no abstract environment to follow.",
    writes: '\\title{…} \\author{…$^{1}$ \\quad … \\\\ $^{1}$… \\\\ \\texttt{…}} \\maketitle \\keywords{…}',
    features: ['class-styled', 'centered', 'superscript'],
    params: { keywordsPlace: 'after-title' },
    evidence: [{ kind: 'source', file: PROFILE, line: '34 (\\keywords is \\def\'d at corl_2026.sty l.378: it prints where it is written, the example writes it after the abstract)' }],
  },
  blocks: {
    description:
      'The authors as blocks joined by \\And (name, department, institution, address and e-mail on lines of their own), as NeurIPS-derived styles write them; only where the CoRL style defines \\And (unconfirmed, so refused until the profile lists it).',
    writes: '\\title{…} \\author{…\\\\…\\\\\\texttt{…} \\And …} \\maketitle … \\keywords{…}',
    features: ['class-styled', 'centered'],
    params: { authorForm: 'blocks' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0506-neurips/neurips_2026.sty', line: '344-348 (\\And and \\AND defined in \\@maketitle; whether corl_2026.sty copies them is not confirmed)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
