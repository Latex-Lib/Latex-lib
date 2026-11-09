import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.kernel',
    node: 'containerBlock/listing',
    description:
      "The kernel's lists: itemize, enumerate, description (data.latexStyle), nested by the items' indent, \\item[label] per item; the bullets (\\labelitemi, \\labelitemii) and numbers (\\labelenumi, \\labelenumii) redefined when asked. 520 templates.",
    writes: '\\begin{itemize|enumerate|description} \\item … \\item[…] … \\end{itemize|enumerate|description}',
    ctan: ['latex-base'],
    features: ['numbered', 'custom-labels', 'lettered'],
    params: {
      bullet: { type: 'tex', default: '', description: "the first-level bullet (\\labelitemi); ''" },
      bullet2: { type: 'tex', default: '', description: "the second-level bullet (\\labelitemii); ''" },
      numbering: { type: 'enum', values: ['class', 'arabic-dot', 'arabic-paren', 'paren-arabic', 'alph-paren', 'paren-alph', 'roman-dot', 'Roman-dot', 'Alph-dot'], default: 'class', description: 'the first-level number (\\labelenumi): 1. 1) (1) a) (a) i. I. A.' },
      numbering2: { type: 'enum', values: ['class', 'arabic-dot', 'arabic-paren', 'paren-arabic', 'alph-paren', 'paren-alph', 'roman-dot', 'Roman-dot', 'Alph-dot'], default: 'class', description: 'the second-level number (\\labelenumii)' },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.beamer',
        reason: 'beamer draws its bullets and numbers from templates (\\setbeamertemplate{itemize items}) and defines no \\labelitemi or \\labelenumi to renew: "Command \\labelitemi undefined"',
        evidence: [{ kind: 'compile', cell: "c4d7ac59682f2a3fefeb7, cfd581c8e09c3051ad44d (the copy's beamer.A run: all 292 documents with these errors hold list.kernel)" }],
        unless: { bullet: '', bullet2: '', numbering: 'class', numbering2: 'class' },
      },
    ],
    // A list sets its own \parshape at the full \linewidth: below cols.vwcol, which fits only paragraph lines to its columns, it came
    // out a column too wide (vwcol > list > item: 26 of 222 branches passed, 180 overfull, 172.7pt in article), as D1 found for the
    // library's statements.
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
