/**
 * bib.gbt7714's presets, from the Chinese thesis classes that use it.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  // The national standard's numbered form, superscript in the text (gbt7714-numerical's own mode): cqjtuthesis.cls l.654,
  // with its \bibsep 0pt (l.656) left to the bibsep param.
  super: {
    description: 'GB/T 7714 numbered references, superscript in the text: \\usepackage{gbt7714}, \\bibliographystyle{gbt7714-numerical}.',
    features: ['numeric-citations', 'superscript', 'sorted-compressed', 'external-tool'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0677-cqjtuthesis/tex/cqjtuthesis.cls', line: '654-656' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0384-dgut-paper/config.cls', line: '1013-1016' },
    ],
  },
  numbers: {
    description: 'GB/T 7714 numbered references, [1] on the line: \\usepackage{gbt7714}, \\citestyle{numbers}, \\bibliographystyle{gbt7714-numerical}.',
    writes: '\\usepackage{gbt7714} \\citestyle{numbers} \\nocite{*} \\bibliographystyle{gbt7714-numerical} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { citeStyle: 'numbers' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0923-cao-wuhui-szu-latex-master-template/gbt7714.sty', line: '66-73 (\\bibstyle@numbers, \\bibstyle@gbt7714-numerical)' }],
  },
  authoryear: {
    description: 'GB/T 7714 author-year references: \\usepackage{gbt7714}, \\bibliographystyle{gbt7714-author-year}.',
    writes: '\\usepackage{gbt7714} \\nocite{*} \\bibliographystyle{gbt7714-author-year} \\bibliography{\\jobname}',
    features: ['author-year', 'external-tool'],
    params: { citeStyle: 'authoryear' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0923-cao-wuhui-szu-latex-master-template/gbt7714.sty', line: '68-73 (\\bibstyle@authoryear, \\bibstyle@gbt7714-author-year)' }],
  },
  // BUPT's thesis class loads the package with its mode as an option (its bundled v1.1.1 then named the style itself).
  'legacy-super': {
    description: 'GB/T 7714 loaded the older way, \\usepackage[super]{gbt7714}, with \\bibliographystyle{gbt7714-numerical}: superscript numbers.',
    writes: '\\usepackage[super]{gbt7714} \\nocite{*} \\bibliographystyle{gbt7714-numerical} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'superscript', 'sorted-compressed', 'external-tool'],
    params: { legacyOption: true },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0624-houluy-buptemplate/buptthesis.cls', line: '175' }],
  },
} as const satisfies { readonly [name: string]: Preset };
