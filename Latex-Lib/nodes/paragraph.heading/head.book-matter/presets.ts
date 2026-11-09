/**
 * head.book-matter's presets, each from the templates that use it (the research's Solution files and their sources).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  amsbook: {
    description:
      "amsbook's main matter: unnumbered chapters first (a preface, acknowledgments), then \\mainmatter before the first numbered chapter, which turns the page numbers arabic (amsbook-template.tex: \\tableofcontents, the unnumbered chapters, \\mainmatter, the main chapters).",
    features: ['class-styled', 'numbered'],
    params: { mainmatter: true },
    evidence: [
      solution('0260-amsproc', '59'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/doc/amsbook-template.tex', line: '110-117' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/amsclass.dtx', line: '2817 (\\def\\mainmatter{\\cleardoublepage\\pagenumbering{arabic}})' },
    ],
  },
  book: {
    description:
      "The standard book's main matter: \\chapter*{…} heads first, then \\mainmatter before the first numbered chapter (\\cleardoublepage, arabic page numbers, chapters numbered from there), as a research diary sets it.",
    features: ['class-styled', 'numbered'],
    params: { mainmatter: true },
    evidence: [
      solution('0828-mooerslab-research-diary-2023', '36'),
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0828-mooerslab-research-diary-2023/main.tex', line: '17, 29 (\\chapter*{Working rules}, \\mainmatter, \\chapter{January})' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
