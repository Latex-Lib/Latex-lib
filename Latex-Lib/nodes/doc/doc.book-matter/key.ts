import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'doc.book-matter',
    node: 'doc',
    description:
      "A book's front, main and back matter (book, extbook, memoir, scrbook, amsbook), placed by hooks from the preamble: \\frontmatter at \\begin{document} (roman page numbers, unnumbered chapters), " +
      '\\mainmatter once, before the first numbered \\chapter (arabic numbers from 1, numbered chapters), and \\backmatter once, before the bibliography.',
    writes:
      '\\AtBeginDocument{\\frontmatter} \\AtBeginDocument{\\NewCommandCopy\\LatexLibBookChapter\\@chapter \\def\\@chapter{\\ifdefined\\LatexLibMainmatter\\else\\mainmatter…\\fi\\LatexLibBookChapter}} \\AddToHook{env/thebibliography/before}{\\ifdefined\\LatexLibBackmatter\\else\\backmatter…\\fi}',
    ctan: ['latex-base'],
    features: [],
    params: {
      frontmatter: { type: 'boolean', default: false, description: '\\frontmatter at \\begin{document}' },
      mainmatter: { type: 'boolean', default: false, description: '\\mainmatter once, before the first unstarred \\chapter' },
      backmatter: { type: 'boolean', default: false, description: "\\backmatter once, before the bibliography's thebibliography environment" },
    },
    presets: PRESETS,
    // The commands each part runs, from the class: book.cls and extbook.cls l.294-308, memoir, scrbook and amsbook define all three.
    requiresWhen: [
      { when: { frontmatter: true }, requires: ['cmd:\\frontmatter'] },
      { when: { mainmatter: true }, requires: ['cmd:\\mainmatter'] },
      { when: { backmatter: true }, requires: ['cmd:\\backmatter'] },
    ],
    only: ['class.extbook', 'class.book', 'class.memoir', 'class.scrbook', 'class.amsbook'],
    // Typeset ok under book, extbook, memoir, scrbook and amsbook, and under book and memoir with hyperref (ZeroTeX-NG, 2026-11-07):
    // a \chapter* preface, contents and list of figures on roman pages, chapter 1 on arabic page 1, an appendix chapter lettered,
    // and the bibliography after \backmatter (book's \if@mainmatter false there; amsbook's guard set).
    targetEngine: 'yes',
  }),
);
