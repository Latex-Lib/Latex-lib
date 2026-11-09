/**
 * pg.matter (atomicBlock/pageBreak): the book division commands at a page break, \frontmatter, \mainmatter or \backmatter, in
 * place of the break. Each starts its own page (\cleardoublepage, or \clearpage when the book opens on any page) and switches
 * the page numbers (roman in the front matter, arabic from the main matter) and the chapter numbering (book.cls l.284-295,
 * memoir.dtx l.8938-9069, xtufte-book.cls l.40-77, where \frontmatter keeps arabic numbers and \mainmatter swaps the running heads).
 * A template uses all three, and the pipeline gives one way and preset per node type, so the division comes from the node
 * (data.matter: front, main or back) and the `matter` param is only its fallback; `order` gives the divisions in turn, as the
 * memoir templates have them: \frontmatter at \begin{document} (`front`), then \mainmatter at the first break, \backmatter at
 * the second, and the `after` break at any later one.
 * The classes each define all three commands; their profiles do not list them yet (reported to the profiles' owner).
 */
import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'pg.matter',
    node: 'atomicBlock/pageBreak',
    description:
      "A book's division command at a page break, \\frontmatter, \\mainmatter or \\backmatter, in place of the break: roman page numbers and unnumbered chapters in the front matter, arabic numbers and numbered chapters from the main matter, unnumbered chapters again in the back matter. For book, scrbook, memoir, ctexbook, tufte-book and ut-thesis; the division comes from the break's data, or from the order of the breaks.",
    writes: '\\frontmatter | \\mainmatter | \\backmatter',
    ctan: ['latex-base', 'memoir'],
    features: ['float-flush', 'odd-page'],
    params: {
      matter: {
        type: 'enum',
        values: ['front', 'main', 'back', 'order'],
        default: 'main',
        description: "the division a break without data.matter prints; order: the next division in turn (\\mainmatter, then \\backmatter, then the `after` break)",
      },
      front: { type: 'boolean', default: false, description: '\\frontmatter at \\begin{document} (\\AtBeginDocument), so the title, preface and contents are front matter' },
      after: { type: 'enum', values: ['clearpage', 'cleardoublepage'], default: 'clearpage', description: 'with matter order, the break a third or later page break prints' },
    },
    presets: PRESETS,
    requires: ['cmd:\\frontmatter', 'cmd:\\mainmatter', 'cmd:\\backmatter'],
    only: ['class.book', 'class.scrbook', 'class.memoir', 'class.ctexbook', 'class.tufte-book', 'class.ut-thesis'],
    targetEngine: 'yes',
  }),
);
