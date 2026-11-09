/**
 * doc.book-matter's presets, from the book templates that divide the book into its three matters.
 */
import type { Preset } from '../../../schema/params.ts';

const examples = 'Latex Related Research/Latex-Template-Examples';
const source = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  extbook: {
    description:
      "extbook's three matters, as the large-print book template places them: \\frontmatter before the title, roman-numbered front pages and unnumbered chapters, \\mainmatter before the first chapter, \\backmatter before the bibliography.",
    features: [],
    params: { frontmatter: true, mainmatter: true, backmatter: true },
    evidence: [
      { kind: 'source', file: `${examples}/class.extbook/main.tex`, line: '142-173, 314-317' },
      { kind: 'source', file: `${source}/0146-extsizes/extbook.cls`, line: '294-308' },
    ],
  },
  book: {
    description: "The standard book class's three matters: \\frontmatter at \\begin{document}, \\mainmatter before the first numbered chapter, \\backmatter before the bibliography.",
    features: [],
    params: { frontmatter: true, mainmatter: true, backmatter: true },
    evidence: [
      { kind: 'manual', of: 'latex-base', section: 'classes.dtx, the book class: \\frontmatter, \\mainmatter, \\backmatter', url: 'https://ctan.org/pkg/latex-base' },
      { kind: 'source', file: `${source}/0146-extsizes/extbook.cls`, line: '294-308 (book.cls\'s definitions, at extbook\'s sizes)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
