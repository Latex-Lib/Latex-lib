/**
 * front.asmejour's presets: where \maketitle runs (asmejour-template.tex l.138-179, CTAN asmejour;
 * Latex Related Research/Latex-Template-Examples/class.asmejour/main.tex l.16, 75-102).
 */
import type { Preset } from '../../../schema/params.ts';

const CLS = 'asmejour.cls (CTAN asmejour v1.28, 2026/11/05; title code as v1.27 in MiKTeX snapshot 9766)';
const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.asmejour/main.tex';

export const PRESETS = {
  'after-abstract': {
    description:
      "asmejour's title block as ASME journals print it: the author blocks flush right in condensed sans down the left, a coloured bar, the title and the italic abstract with its keywords beside them across both columns; \\maketitle runs right after the abstract, which the class must have stored first.",
    features: ['class-styled', 'sans-serif'],
    params: {},
    evidence: [
      { kind: 'source', file: EXAMPLE, line: '16, 75-102 (\\PaperNumber, \\title, \\SetAuthorBlock, \\keywords, \\date, the abstract, then \\maketitle)' },
      { kind: 'source', file: CLS, line: '1669-1706, 1732-1789 (the title, author and abstract coffins; abstract after \\maketitle is an error)' },
    ],
  },
  'in-place': {
    description: "asmejour's title block with \\maketitle where the title stands, for a document whose abstract (if any) comes before the title.",
    writes: '\\title{…} \\SetAuthorBlock{…\\CorrespondingAuthor}{… \\\\ … \\\\ email: …} \\keywords{…} \\PaperNumber{…} \\date{…} \\maketitle',
    features: ['class-styled', 'sans-serif'],
    params: { maketitle: 'in-place' },
    evidence: [{ kind: 'source', file: CLS, line: '1767, 1777-1789 (\\maketitle; the stored abstract)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
