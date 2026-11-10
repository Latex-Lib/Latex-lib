import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'abs.heading',
    node: 'containerBlock/abstract',
    description:
      "The abstract as an unnumbered heading followed by its text, with no abstract environment: the kernel's \\section*{Abstract} (PLOS) or \\chapter*{Abstract} (book, report and ctex theses, optionally listed in the contents with \\addcontentsline), KOMA-Script's \\addchap{Abstract} or \\addsec{Abstract} (scrbook, scrreprt), or a small-type paragraph with a bold run-in label, {\\small\\noindent\\textbf{Abstract.} …\\par} (the minimal class). The heading is the node's own when it has one, so a second abstract node can be PLOS's Author summary.",
    writes: '\\chapter*{Abstract} \\addcontentsline{toc}{chapter}{Abstract} … | \\section*{Abstract} … | \\addchap{Abstract} … | {\\small\\noindent\\textbf{Abstract.} …\\par}',
    ctan: ['latex-base', 'koma-script'],
    features: ['unnumbered', 'bold-head', 'block-head', 'run-in-head', 'small-type', 'chapter-opening', 'page-break-before', 'in-contents', 'class-styled'],
    params: {
      form: {
        type: 'enum',
        values: ['kernel', 'koma', 'runin'],
        default: 'kernel',
        compat: true,
        description: "the kernel's starred heading (\\section*, \\chapter*), KOMA-Script's \\addchap or \\addsec, or a run-in bold label in a small-type paragraph",
      },
      level: { type: 'enum', values: ['chapter', 'section'], default: 'section', compat: true, description: 'the heading level: a chapter (\\chapter*, \\addchap) or a section (\\section*, \\addsec); not read by the run-in form' },
      name: { type: 'string', default: 'Abstract', description: "the heading's text when the node has none of its own (data.titling)" },
      inContents: { type: 'boolean', default: false, description: 'listed in the table of contents: \\addcontentsline{toc}{level}{…} after the kernel heading; \\addchap rather than \\addchap* for KOMA' },
      punctuation: { type: 'string', default: '.', description: "what follows the run-in label inside its bold ('.' as in 'Abstract.'); run-in form only" },
    },
    presets: PRESETS,
    // What each form prints into: the class's sectioning level (a counter the profiles list for each level they define), or KOMA's
    // \addchap and \addsec (scrbook, scrreprt; scrguide, "Free headings"). The run-in form needs nothing: \textbf, \noindent and \par are
    // the kernel's, and \small is provided where the class lacks it (handler.ts).
    requiresWhen: [
      { when: { form: 'kernel', level: 'chapter' }, requires: ['counter:chapter'] },
      { when: { form: 'kernel', level: 'section' }, requires: ['counter:section'] },
      { when: { form: 'koma', level: 'chapter' }, requires: ['cmd:\\addchap'] },
      { when: { form: 'koma', level: 'section' }, requires: ['cmd:\\addsec'] },
    ],
    only: ['class.plos', 'class.book', 'class.report', 'class.ctexrep', 'class.ctexbook', 'class.scrbook', 'class.scrreprt', 'class.minimal', 'class.extbook', 'class.tufte-book'],
    // The forms only some of those classes give: the matrix files a way by its `only` and `onlyWhen`, not by `requiresWhen`, so
    // without these the koma preset went under book, report and their kin, and the chapter forms under plos.
    onlyWhen: [
      {
        when: { form: 'koma' },
        classes: ['class.scrbook', 'class.scrreprt'],
        reason: "\\addchap and \\addsec are KOMA-Script's own (scrguide, \"Free headings\"): under book, report and the classes built on them (ut-thesis, tufte-book, ctexbook, ctexrep), extbook and plos they are undefined, and the abstract stops at 'Undefined control sequence' at \\addchap",
        evidence: [
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): 664 cells under book.A, book.B, report.A, report.B, ut-thesis.A and plos.A whose first error is \\addchap (10,082 failing branches); abs.heading@koma passed 0 of its 9,931 not-denied branches there (book.A document dac85a421d8f372792b59, result c2b85873ce)' },
          { kind: 'manual', of: 'koma-script', section: 'scrguide, Free headings (\\addchap, \\addsec)' },
        ],
      },
      {
        when: { form: 'kernel', level: 'chapter' },
        classes: ['class.book', 'class.report', 'class.scrbook', 'class.scrreprt', 'class.extbook'],
        reason: "\\chapter* needs a chapter level, which book, report, KOMA's scrbook and scrreprt, extbook and the classes built on them (ctexbook, ctexrep, tufte-book) have and plos (article) and minimal do not: 'Undefined control sequence' at \\chapter",
        evidence: [
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): plos.A, 66 cells whose first error is \\chapter (1,003 failing branches), every one holding abs.heading@chapter (document d7f7c0a584267387c9c54, result 8e882935c2)' },
        ],
      },
      // The chapter-zh preset's heading 摘要 needs ctex's CJK fonts, as num.unnumbered@tju's 附录 (batch 4 round 1: that preset's
      // glyphs were missing under every Latin class it ran under).
      {
        when: { name: '摘要' },
        classes: ['class.ctexrep', 'class.ctexbook'],
        reason: "the Chinese heading 摘要 needs CJK glyphs, which only ctex's fonts give; under book, report or the KOMA classes Latin Modern has none (\"Missing character\") and the heading prints empty",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0578-monetjoe-latex-paper-templates/finalversion.tex', line: '3 (ctexbook), 115-129' }],
      },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07): \section* twice under article (PLOS's class), \chapter* with \addcontentsline under
    // report, \chapter* under book, extbook, tufte-book and ctexbook (摘要, fontset=fandol), \addchap under scrbook, \addsec* and
    // \addchap* under scrreprt, and the run-in paragraph under minimal with \small provided.
    targetEngine: 'yes',
  }),
);
