import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.kernel',
    node: 'containerBlock/abstract',
    description:
      "The class's abstract environment: \\begin{abstract} … \\end{abstract} (article, report and most journal classes; not book); \\abstractname renamed, the first-line indent dropped. Where the class keeps the abstract for \\maketitle (amsart, elsarticle, acmart, cas), the class's own code prints it where it stands. 155 templates.",
    ctan: ['latex-base'],
    features: ['small-type', 'indented', 'centered'],
    params: {
      name: { type: 'string', default: '', description: "the heading (\\renewcommand{\\abstractname}{…}); ''" },
      noindent: { type: 'boolean', default: false, description: 'no first-line indent (\\noindent, \\parindent 0pt)' },
    },
    presets: PRESETS,
    requires: [
      'env:abstract',
    ],
    deny: [
      {
        // b22 (owner items R3, R3/O3 under aastex): an interim deny until Flouest prints one \maketitle after all front matter (revtex O3).
        class: 'class.revtex4-2',
        reason:
          "revtex4-2 keeps the abstract in \\absbox for \\maketitle (revtex4-2.cls l.2548-2574, printed by \\frontmatter@abstract@produce, l.2629-2654), and its \\maketitle undefines the environment after it (l.2685); Flouest prints \\maketitle only where a title node stands, usually first, so a title-first abstract stops at \"Environment abstract undefined\" and a title-less one never prints. Printing the box where it stands is no interim here: it is set at \\textwidth with aps's 400pt measure centred by \\leftskip (aps4-2.rtx l.148-160), so a two-column page needs revtex's page-grid switch around it, untested",
        evidence: [
          { kind: 'source', file: 'revtex4-2.cls (MiKTeX package revtex)', line: '2548-2574, 2629-2654, 2685' },
          { kind: 'compile', cell: 'GitHub run 41584963423, revtex4-2-aps.A: 774 not-denied abs.kernel branches, 54 passing; 376 in no-page documents (b21 FC F5), 586 with their documents shipping no page' },
        ],
      },
      {
        class: 'class.aastex',
        reason:
          "aastex701 keeps the abstract in \\absbox for \\maketitle (aastex701.cls l.2342-2373), its first \\section calls \\maketitle itself (l.7583-7593), and that \\maketitle undefines the environment (l.13248): an abstract after a heading or a title stops at \"Environment abstract undefined\", and one in a document with neither never prints. The box is 478pt wide unless modern (l.2347-2352), wider than a column under twocolumn, and its footnotes are minipage notes that stop at General's footnote body",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '2342-2373, 7583-7593, 13248' },
          { kind: 'compile', cell: 'GitHub run 41584963423, aastex.A/aastex.B: 846/842 not-denied abs.kernel branches, 25/49 passing; 299/298 in documents stopped by a fatal error, 198/198 in no-page documents' },
        ],
      },
      {
        // b22 (owner item JR1-3): the renamed heading where the class prints a fixed one. elsarticle takes the name through its \abstracttitle (handler.ts).
        class: 'class.mnras',
        unless: { name: '' },
        reason: "mnras prints its abstract under a fixed {\\bf ABSTRACT} (mnras.cls l.1112-1118) and has no \\abstractname, so a renamed heading never shows; without its setting's \\providecommand the preset's \\renewcommand stopped at \"Command \\abstractname undefined\"",
        evidence: [
          { kind: 'source', file: 'mnras.cls (MiKTeX package mnras, v3.2 2023/07/20)', line: '1102-1118' },
          { kind: 'compile', cell: "GitHub run 41584963423, mnras.A document d6b528a5ef09ff716bb6b, result ed7d109fee7c: LaTeX Error: Command \\abstractname undefined at the preset's \\AtBeginDocument{\\renewcommand{\\abstractname}{Executive Summary}} (12 branches of the document)" },
        ],
      },
      {
        class: 'class.iopjournal',
        unless: { name: '' },
        reason: 'iopjournal prints its abstract under a fixed {\\bfseries Abstract} (iopjournal.cls l.120-124), so a renamed heading never shows: the branch passed without its heading (GitHub run 41584963423)',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '120-124' }],
      },
    ],
    zerotex: 'untested',
  }),
);
