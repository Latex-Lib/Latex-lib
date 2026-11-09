/**
 * bib.named's presets: the IJCAI kit's one reference list (FormattingGuidelines-IJCAI kit, ijcai26.tex with named.bst).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const TEX = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex';
const STY = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty';
const BST = 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/named.bst';

export const PRESETS = {
  ijcai: {
    description:
      "IJCAI's references: BibTeX with the kit's named.bst (\\bibliographystyle{named}), sorted by author, year and title, each entry labelled [Author, Year] through \\citeauthoryear, the list under the kernel's References heading.",
    features: ['author-year', 'external-tool'],
    params: {},
    evidence: [
      solution('0319-ijcai', '74'),
      { kind: 'source', file: TEX, line: '595-600 (named.bst and the .bib are the kit\'s BibTeX files), 630-632 (\\bibliographystyle{named}, \\bibliography{ijcai26})' },
      { kind: 'source', file: STY, line: '286-317 (\\cite, \\shortcite, \\citeauthor, \\citeyear; \\@biblabel reads \\citeauthoryear as [Author, Year])' },
      { kind: 'source', file: BST, line: '1067-1069 (the \\protect\\citeauthoryear{…}{…} label)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
