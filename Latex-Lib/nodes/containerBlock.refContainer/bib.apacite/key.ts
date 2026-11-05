import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.apacite',
    node: 'containerBlock/refContainer',
    description:
      "apacite: APA author-year citations and reference list, \\usepackage{apacite} ([natbibapa] for natbib's commands), \\bibliographystyle{apacite}, \\bibliography{\\jobname}. 18 templates.",
    ctan: ['apacite'],
    features: ['author-year', 'external-tool'],
    params: {
      natbib: { type: 'boolean', default: false, compat: true, description: "natbib's citation commands (natbibapa)" },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
    },
    presets: PRESETS,
    // apacite's package facts conflict with hyperref (packages/apacite.ts: \begin{document} overflows the input stack when
    // hyperref comes after it), so its branches are filed with documents that load no hyperref, General's included.
    loads: [
      { pkg: 'apacite', when: { natbib: false } },
      { pkg: 'apacite', options: ['natbibapa'], when: { natbib: true } },
    ],
    claims: ['bibliography-engine'],
    requires: [
      'env:thebibliography',
    ],
    deny: [
      {
        // b3p (batch 3, G4): apacite writes \bibliographystyle{apacite} beside the one plos's preamble sets. corl and bmvc (hyperref)
        // and ecai (natbib) are out through apacite's package facts.
        class: 'class.plos',
        reason: "the plos setting's preamble runs \\bibliographystyle{plos2025} right after \\documentclass (PLOS's template), so main.aux always opens with \\bibstyle{plos2025}; this way's \\bibliographystyle{apacite} writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json', line: 'preamble line 19 (\\bibliographystyle{plos2025})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        // b2p (batch 2, G4): apacite writes \bibliographystyle{apacite} beside ascelike's own.
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally, so main.aux opens with that \\bibstyle; this way's \\bibliographystyle{apacite} writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command')",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.book',
        reason: 'apacite under book stops in its bibliography at an undefined \\st@rtbibchapter',
        evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/d010676ebf88 (book.A, a title citing with bib.apacite@cite)' }],
      },
      {
        class: 'class.revtex4-2',
        reason: 'apacite.sty stops while it loads under revtex4-2 ("Too many }\'s", l.1616 of apacite.sty), and its bibliography at an undefined \\st@rtbibchapter',
        evidence: [{ kind: 'compile', cell: "ce966f20d9bb3018c181e (the copy's revtex4-2-aps.A run: all 5 documents with this error hold bib.apacite citations; document d195b5ece2c38cd8b11f1 for \\st@rtbibchapter)" }],
      },
      // aa and elsarticle, which load natbib in the class, are out through apacite's package facts (apacite after natbib stops while it
      // loads; b22, owner item O-APA), which reach every class whose profile lists natbib, instead of a deny per class.
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 92 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A d327eaeae611b43e18160 result
    // 1e852e632d, branch b85bf847cdc291b269aa7, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
