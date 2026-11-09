import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.tfapastyle',
    node: 'containerBlock/refContainer',
    description:
      "Taylor & Francis Interact's APA-7 reference list with BibTeX (class interact): \\usepackage[natbibapa]{tfapastyle}, T&F's modified apacite with natbib's \\citep and \\citet, entries hanging \\setlength\\bibhang{12pt}, a 10pt list (\\renewcommand\\bibliographytypesize{…}), \\bibliographystyle{tfapacite} and \\bibliography{\\jobname}. tfapastyle.sty and tfapacite.bst ship with the template.",
    // The \LatexLib… once-guards around it (../node.ts) are the library's own, left out.
    writes: '\\usepackage[natbibapa]{tfapastyle} \\setlength\\bibhang{12pt} \\renewcommand\\bibliographytypesize{…} \\nocite{*} \\bibliographystyle{tfapacite} \\bibliography{\\jobname}',
    ctan: ['apacite', 'natbib'],
    features: ['author-year', 'small-type', 'hanging', 'external-tool'],
    params: {
      bibhang: { type: 'dimen', default: '12pt', description: "the entries' hang (\\setlength\\bibhang{…}); ''" },
      typeSize: { type: 'tex', default: '\\fontsize{10}{12}\\selectfont', description: "the list's size (\\renewcommand\\bibliographytypesize{…}); ''" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'tfapastyle', options: ['natbibapa'] }],
    claims: ['bibliography-engine'],
    // tfapastyle defines its own thebibliography (tfapastyle.sty l.1200-1240) over the class's, which interact defines.
    requires: [
      'env:thebibliography',
    ],
    only: ['class.interact'],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints, as for every reference-list way. [OV3]
    gives: { footnotes: false },
    // Untested as a whole, because the bundle's tfapacite.bst (2026-08-01) never builds on the engine. Measured 2026-11-07 on
    // ZeroTeX-NG (class-examples typeset-dir, interact.cls, tfapastyle.sty and tfapacite.bst from Source/0207-tandf-interact
    // beside main.tex): this way's output, with or without hyperref after it, ends at BibTeX (status 12, one XeTeX pass,
    // "No file main.bbl.", every citation undefined). The same document with the CTAN apacite.bst builds (status 0, 3 passes),
    // and so does tfapacite.bst under article with apacite.sty, but only on an empty database. The .bst has one fault you can
    // see in the file: format.editors.as.authors.no.postfix (l.2708-2710, never called) calls format.author.names, which is
    // only defined at l.3023, so BibTeX reports an unknown function. With those three lines deleted, any entry (@book, @article,
    // @misc) still gives BibTeX's error status, so a runtime error remains as well. The engine treats a BibTeX error as a failed build.
    targetEngine: 'untested',
  }),
);
