import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.gbt7714',
    node: 'containerBlock/refContainer',
    description:
      "A GB/T 7714 (Chinese national standard) reference list with BibTeX under ctexart, ctexrep or ctexbook: \\usepackage{gbt7714}, which loads natbib, \\bibliographystyle{gbt7714-numerical} (superscript numbers, or \\citestyle{numbers} for [1] on the line) or gbt7714-author-year, and \\bibliography{\\jobname}; \\bibsep and the list's heading; optionally the older \\usepackage[super]{gbt7714} load.",
    // The \LatexLib… once-guards around it (../node.ts) are the library's own, left out.
    writes: '\\usepackage{gbt7714} \\nocite{*} \\bibliographystyle{gbt7714-numerical} \\bibliography{\\jobname}',
    ctan: ['gbt7714', 'natbib'],
    features: ['numeric-citations', 'superscript', 'author-year', 'sorted-compressed', 'external-tool'],
    params: {
      citeStyle: { type: 'enum', values: ['super', 'numbers', 'authoryear'], default: 'super', compat: true, description: 'superscript numbers (gbt7714-numerical), numbers on the line (\\citestyle{numbers}), or author-year (gbt7714-author-year)' },
      legacyOption: { type: 'boolean', default: false, description: 'the mode also given as the package option, \\usepackage[super]{gbt7714}, as older templates load it' },
      bibsep: { type: 'dimen', default: '', description: "space between entries (\\bibsep); ''" },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'gbt7714', when: { legacyOption: false } },
      { pkg: 'gbt7714', options: ['super'], when: { legacyOption: true, citeStyle: 'super' } },
      { pkg: 'gbt7714', options: ['numbers'], when: { legacyOption: true, citeStyle: 'numbers' } },
      { pkg: 'gbt7714', options: ['authoryear'], when: { legacyOption: true, citeStyle: 'authoryear' } },
    ],
    claims: ['bibliography-engine'],
    // gbt7714 loads natbib, which redefines thebibliography as it loads (as bib.natbib requires it).
    requires: [
      'env:thebibliography',
    ],
    only: ['class.ctexart', 'class.ctexrep', 'class.ctexbook'],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints, as for every reference-list way. [OV3]
    gives: { footnotes: false },
    targetEngine: 'yes',
  }),
);
