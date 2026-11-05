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
      // b27 (B2CITE-2 and B2PROF P7, one edit): colm and tmlr, the two author-year conference styles G4 left out (GitHub run
      // b12-5bdc624: 448 branches, every non-apalike bibtex-bst cell stops at natbib's author-year error); jmlr, which sets its
      // own \bibliographystyle, as acl and ascelike do (235 branches, none with a .bbl); achemso, which replaces every style
      // with its own (224 of 224 fail, no .bbl); and elegantpaper, which loads biblatex itself (209 of 214 fail; the 5 that
      // pass cite nothing).
      {
        class: 'class.colm',
        unless: { bst: 'apalike' },
        reason: "colm2026_conference.sty loads natbib with no option (l.42) and sets \\setcitestyle{authoryear,round,...} (l.45), so a numeric or alpha style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'; apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/colm2026_conference.sty', line: '42, 45' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624: colm.A, 0 of 224 not-denied non-apalike bibtex-bst citation branches pass, all at the natbib author-year error' },
        ],
      },
      {
        class: 'class.tmlr',
        unless: { bst: 'apalike' },
        reason: "tmlr.sty loads natbib with no option (l.15) and sets \\setcitestyle{authoryear,round,...} (l.21), so a numeric or alpha style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'; apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/tmlr.sty', line: '15, 21' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624: tmlr.A, 0 of 224 not-denied non-apalike bibtex-bst citation branches pass, all at the natbib author-year error' },
        ],
      },
      {
        class: 'class.jmlr-pmlr',
        reason: "jmlr.cls calls \\bibliographystyle{plainnat} while it loads (l.178), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'jmlr.cls (jmlr 2022/02/09 v1.30, MiKTeX snapshot 9766)', line: '150 (natbib), 178 (\\bibliographystyle{plainnat}), 179 (\\bibpunct author-year)' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624: jmlr-pmlr.A, none of the 235 not-denied bibtex-bst branches has a .bbl: 163 end at no-bbl (d5044f4e76b0ec7f40f15), and the 72 in cells whose LaTeX errors end the build first leave every citation undefined, 58 of them counted as passes (dabf8452191c896772e36)' },
        ],
      },
      {
        class: 'class.achemso',
        reason: "achemso replaces every \\bibliographystyle with its own achemso style (achemso.cls l.1427-1435) and writes its control entry for achemso.bst; with this way's style and \\bibliography BibTeX makes no .bbl ('No file main.bbl', every citation undefined)",
        evidence: [
          { kind: 'source', file: 'achemso.cls (achemso 2025-09-22 v3.14, MiKTeX snapshot 9766)', line: '1427-1435' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, achemso.A: 224 of 224 branches fail, no-bbl in every cell holding the way (document d5044f4e76b0ec7f40f15)' },
        ],
      },
      {
        class: 'class.elegantpaper',
        reason: "elegantpaper loads biblatex itself (elegantpaper.cls l.195-198), and biblatex makes \\bibliographystyle an error: \"Package biblatex Error: '\\bibliographystyle' invalid for 'biblatex'\"",
        evidence: [
          { kind: 'source', file: 'elegantpaper.cls (elegantpaper 2026/2/27 v0.12, MiKTeX snapshot 9766)', line: '195-198' },
          { kind: 'compile', cell: 'GitHub run b12-5bdc624, elegantpaper.A: 209 of 214 branches fail so' },
        ],
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
