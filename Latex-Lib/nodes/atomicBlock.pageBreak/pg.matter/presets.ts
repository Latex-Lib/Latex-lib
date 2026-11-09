/**
 * pg.matter's presets, each from the templates that use it. A break's data.matter always wins over the preset's division.
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/${file}`, line }) as const;

export const PRESETS = {
  main: {
    description: 'The break starts the main matter (\\mainmatter): a new right-hand page, arabic page numbers from 1, numbered chapters.',
    writes: '\\mainmatter',
    features: ['float-flush', 'odd-page'],
    params: {},
    evidence: [
      src('Latex-Template-Examples/class.ctexbook/main.tex', '101'),
      src('Latex-Template-Examples/class.tufte-book/main.tex', '121'),
      src('Latex-Template-Examples/class.ut-thesis/main.tex', '124'),
      src('Latex-lib-main/Source/0987-twtstudio-tjuthesislatextemplate/Thesis/tjumain.tex', '47'),
    ],
  },
  front: {
    description: 'The break starts the front matter (\\frontmatter): a new right-hand page, roman page numbers, unnumbered chapters.',
    writes: '\\frontmatter',
    features: ['float-flush', 'odd-page'],
    params: { matter: 'front' },
    evidence: [
      src('Latex-Template-Examples/class.ctexbook/main.tex', '66'),
      src('Latex-Template-Examples/class.ut-thesis/main.tex', '94'),
      src('Latex-lib-main/Source/0987-twtstudio-tjuthesislatextemplate/Thesis/tjumain.tex', '17'),
    ],
  },
  back: {
    description: 'The break starts the back matter (\\backmatter): a new page, chapters unnumbered again, the page numbers running on.',
    writes: '\\backmatter',
    features: ['float-flush', 'odd-page'],
    params: { matter: 'back' },
    evidence: [
      src('Latex-Template-Examples/class.ctexbook/main.tex', '244'),
      src('Latex-Template-Examples/class.tufte-book/main.tex', '257'),
      src('Latex-Template-Examples/class.ut-thesis/main.tex', '286'),
    ],
  },
  'in-order': {
    description:
      'The divisions in turn, as the memoir templates have them: \\frontmatter at \\begin{document}, \\mainmatter at the first page break, \\backmatter at the second, a plain \\clearpage at any later one.',
    writes: '\\AtBeginDocument{\\frontmatter} … \\mainmatter … \\backmatter',
    features: ['float-flush', 'odd-page'],
    params: { matter: 'order', front: true },
    evidence: [
      src('Latex-lib-main/Source/0185-memhfixc/memoir.dtx', '8938 (\\frontmatter), 8985 (\\mainmatter), 9069 (\\backmatter)'),
      src('Latex-Template-Examples/class.memoir/main.tex', '91, 112, 263'),
      src('Latex-lib-main/Source/0105-unswcover/thesis.tex', '39, 67, 81'),
      src('Latex-lib-main/Source/0901-makyo-building-a-book/main.tex', '20, 36, 66'),
      {
        kind: 'compile',
        reproducer:
          'book, scrbook, memoir, ctexbook, tufte-book[nols] and ut-thesis, each with this preamble and three page breaks around \\chapter{Preface}, \\chapter{Intro}, \\chapter{Notes}: ok, and \\thepage reads iii, 1, 3, 4 (memoir: secnumdepth -10, 1, -10; tufte-book keeps its arabic numbers and unnumbered chapters) (Flouest headless ZeroTeX-NG runner, 2026-11-07)',
      },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
