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
    // Typeset ok on ZeroTeX-NG (2026-11-07): \section* twice under article (PLOS's class), \chapter* with \addcontentsline under
    // report, \chapter* under book, extbook, tufte-book and ctexbook (摘要, fontset=fandol), \addchap under scrbook, \addsec* and
    // \addchap* under scrreprt, and the run-in paragraph under minimal with \small provided.
    targetEngine: 'yes',
  }),
);
