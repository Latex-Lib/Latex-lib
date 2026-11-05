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
      {
        // b29 (B3B-9): as revtex4-2, the same interim deny until Flouest prints one \maketitle after all front matter (revtex O3).
        class: 'class.ecai',
        reason:
          "ecai keeps the abstract in \\abstract@box (\\global\\setbox\\abstract@box=\\vbox, ecai.cls l.766-772) for \\maketitle (l.849): a figure, table or margin note in it is 'Float(s) lost' at \\end{document} ('Not in outer par mode' for a float that needs one), and a title-less document never prints it (no page, or its sentinels missing). General's abstract and abs.abstract-pkg print where they stand and pass.",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '766-772, 849' },
          { kind: 'compile', cell: 'GitHub run b28-e9f730a, ecai.A: 1,172 not-denied abs.kernel branches, 527 passing; of the 645 failing, 431 Float(s) lost, 148 in no-page documents, 48 sentinel missing, 14 Not in outer par mode (e.g. document d2ee191977cdb836a1e80, tables and figures inside the abstract)' },
        ],
      },
      {
        // b27 (B2SCAT SC-UT1): as mnras and iopjournal, a class with a fixed abstract heading and no \abstractname.
        class: 'class.ut-thesis',
        unless: { name: '' },
        reason: "ut-thesis prints its abstract under a literal \\section*{Abstract} (ut-thesis.cls l.138-152) on book, which never defines \\abstractname, so a renamed heading never shows, and the preset's \\AtBeginDocument{\\renewcommand{\\abstractname}{…}} stops at \"Command \\abstractname undefined\" in \\begin{document}, which ends every branch of the document.",
        evidence: [
          { kind: 'source', file: 'ut-thesis.cls (ut-thesis 2024/07/26 v3.1.8, MiKTeX snapshot 9766)', line: '138-152' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, ut-thesis.A document d1be4c65fa7e8580de05d, result a2b0fee0f6: LaTeX Error: Command \\abstractname undefined at l.192 \\begin{document} (abs.kernel@renamed); all 59 branches of the document fail' },
        ],
      },
      {
        // b29 (B3A-6): as revtex4-2 and aastex, a class that keeps the abstract in a box for its front matter; an interim deny until
        // Flouest prints one \maketitle after all front matter (revtex O3), and the box still loses a float or note inside it.
        class: 'class.imsart',
        reason:
          "imsart.sty sets every abstract into \\abstract@box, a \\vbox (l.2218-2242), printed only by \\abstract@fmt in the front matter (l.2246-2252, \\local@maketitle, l.2423-2452): an abstract after it never ships (sentinel:missing, a document of only abstracts ships no page), and a figure, \\marginpar or \\marginnote inside the \\vbox stops the cell at \"Float(s) lost\" at \\end{document}",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/imsart.sty', line: '2218-2252, 2423-2452' },
          { kind: 'compile', cell: 'GitHub run b28-e9f730a, imsart.A: 1,619 not-denied abs.kernel@unindented branches, 367 passing; of the 1,070 not failing on \\c@author, remark or \\singlespacing, 389 at "Float(s) lost", 120 in no-page documents, 28 sentinel:missing (document d791c6d19dde34f9284e9, result 150a34ddff4d)' },
        ],
      },
    ],
    zerotex: 'untested',
  }),
);
