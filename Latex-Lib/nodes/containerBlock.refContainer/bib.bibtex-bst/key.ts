import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.bibtex-bst',
    node: 'containerBlock/refContainer',
    description:
      'BibTeX with a .bst style: \\bibliographystyle{plain} (unsrt, alpha, abbrv, ieeetr, acm, siam, apalike) and \\bibliography{\\jobname}, the entries in \\jobname.bib; the heading through \\refname or \\bibname. 190 templates.',
    ctan: ['bibtex'],
    features: ['numeric-citations', 'author-year', 'external-tool'],
    params: {
      bst: { type: 'enum', values: ['plain', 'unsrt', 'alpha', 'abbrv', 'ieeetr', 'acm', 'siam', 'apalike'], default: 'plain', description: 'the BibTeX style' },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
    },
    presets: PRESETS,
    claims: ['bibliography-engine'],
    requires: [
      'env:thebibliography',
    ],
    // The classes that load natbib in author-year mode (CA2), and those that set their own \bibliographystyle (CA11).
    deny: [
      // b2p (batch 2, G4): the conference styles whose natbib is author-year (loaded with no option, natbib's default; ICML and
      // ICLR also \setcitestyle{authoryear,...}), as for aa below; and ascelike, which sets its own \bibliographystyle.
      {
        class: 'class.neurips',
        unless: { bst: 'apalike' },
        reason: "neurips_2026.sty loads natbib with no option (l.119-121), so natbib is author-year; a numeric or alpha style's \\bibitem has no Author(Year) label and natbib stops at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '119-121' }],
      },
      {
        class: 'class.icml',
        unless: { bst: 'apalike' },
        reason: "icml2026.sty loads natbib with no option (l.123) and sets \\setcitestyle{authoryear,round,...} (l.553), so a numeric or alpha style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '123, 553' }],
      },
      {
        class: 'class.iclr',
        unless: { bst: 'apalike' },
        reason: "iclr2027_conference.sty loads natbib with no option (l.20) and sets \\setcitestyle{authoryear,round,...} (l.23), so a numeric or alpha style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '20, 23' }],
      },
      {
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally, so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), as under mdpi and sn-jnl",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.aa',
        unless: { bst: 'apalike' },
        reason: "aa loads natbib in author-year mode (its default bibauthoryear: \\RequirePackage[nonamebreak]{natbib}, \\bibpunct{(}{)}{;}{a}{}{,}); a numeric or alpha style's \\bibitem has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: \"Package natbib Error: Bibliography not compatible with author-year citations\". apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '140-146, 154, 232' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty', line: "292-299, 862, 966-981, 1002-1009 (8.31b, the engine's version: elsarticle-preprint.A result d0be2dd3397d logs natbib 2010/09/13 8.31b)" },
        ],
      },
      {
        class: 'class.aastex',
        unless: { bst: 'apalike' },
        reason: "aastex701 loads natbib and switches it to author-year (\\@citestyle{aas}, after its numeric \\setup@hook); a numeric or alpha style's \\bibitem has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: \"Package natbib Error: Bibliography not compatible with author-year citations\". apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '5928, 6421, 6893-6894, 6914-6915' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty', line: '292-299, 862, 966-981, 1002-1009' },
        ],
      },
      {
        class: 'class.sn-jnl',
        reason: "sn-jnl's sn-mathphys-num option (its setting's) calls \\bibliographystyle{sn-mathphys-num} while the class loads, so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command') and fails, ending the build with every citation undefined; and sn-mathphys-num.bst is not among the setting's files",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/sn-jnl.cls', line: '1661-1664 (CR line ends)' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems, revtex4-2-aps.A and elsarticle-preprint.A)' },
        ],
      },
      {
        class: 'class.mdpi',
        reason: "mdpi calls \\bibliographystyle{Definitions/mdpi} while the class loads, so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), and without one BibTeX cannot open Definitions/mdpi.bst, which is not among the setting's files; either way the build ends with no .bbl",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '373-382' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.acl',
        reason: "acl.sty calls \\bibliographystyle{acl_natbib} while it loads (l.195), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), ending the build with every citation undefined; and acl.sty's natbib is author-year (l.186), where a numeric style's \\bibitem stops natbib ('Bibliography not compatible with author-year citations')",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/acl.sty (acl-style-files commit 2427282)', line: '186 (natbib), 195 (\\bibliographystyle{acl_natbib})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 88 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. aa.A dd15148ea15e0fab70516 result
    // d2f7f7f1c5, branch bdccf5c475b3bf300411a, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
