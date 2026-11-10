import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.bibtex-bst',
    node: 'containerBlock/refContainer',
    description:
      'BibTeX with a .bst style: \\bibliographystyle{plain} (unsrt, alpha, abbrv, ieeetr, acm, siam, apalike; the published amsplain, amsalpha, IEEEtran, IEEEtranS, plainurl, splncs04) and \\bibliography{\\jobname}, the entries in \\jobname.bib; the heading through \\refname or \\bibname; \\backmatter before the list in a book, IEEEtran\'s \\bstctlcite control entry. 190 templates.',
    // The same LaTeX as bib.cite-pkg's: the cite package is in its loads. The \LatexLib… once-guards (../node.ts) are the library's own, left out.
    writes: '\\nocite{*} \\bibliographystyle{plain} \\bibliography{\\jobname}',
    ctan: ['bibtex'],
    features: ['numeric-citations', 'author-year', 'external-tool'],
    params: {
      bst: {
        type: 'enum',
        // b45: the published styles a class's guide asks for: amsplain and amsalpha (AMS, amscls), IEEEtran and IEEEtranS (IEEE),
        // plainurl (LIPIcs), splncs04 (Springer LNCS, ECCV). Each is on CTAN, so none is tied to its class.
        values: ['plain', 'unsrt', 'alpha', 'abbrv', 'ieeetr', 'acm', 'siam', 'apalike', 'amsplain', 'amsalpha', 'IEEEtran', 'IEEEtranS', 'plainurl', 'splncs04'],
        default: 'plain',
        description: 'the BibTeX style',
      },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
      backmatter: { type: 'boolean', default: false, description: "\\backmatter before the list (book, scrbook, amsbook: chapters unnumbered from there)" },
      bstControl: {
        type: 'boolean',
        default: false,
        description: "IEEEtran.bst's control entry: an @IEEEtranBSTCTL entry in \\jobname.bib (et al. after six names) cited by \\bstctlcite at \\begin{document}, before any \\cite",
      },
    },
    presets: PRESETS,
    claims: ['bibliography-engine'],
    requires: [
      'env:thebibliography',
    ],
    requiresWhen: [
      // \backmatter is the book classes' (book.cls, scrbook, amsbook); article has none.
      { when: { backmatter: true }, requires: ['cmd:\\backmatter'] },
      // \bstctlcite is IEEEtran.cls's (l.4438) and ieeeconf.cls's; IEEEtran.bst only documents it.
      { when: { bstControl: true }, requires: ['cmd:\\bstctlcite'] },
    ],
    // The classes that have \backmatter, as their profiles list it (and the classes built on them: ut-thesis, tufte-book, ctexbook
    // on book): the matrix files by `onlyWhen`, not by `requiresWhen`, so the backmatter presets went under every class.
    onlyWhen: [
      {
        when: { backmatter: true },
        classes: ['class.book', 'class.amsbook', 'class.extbook', 'class.memoir', 'class.scrbook', 'class.frontiers', 'class.oup-authoring-template', 'class.sn-jnl'],
        reason: "\\backmatter is a book class's command (book.cls, amsbook, memoir, scrbook; Frontiers, OUP and sn-jnl define it too); article, report, scrreprt and the conference classes have none: 'Undefined control sequence' at \\backmatter, and the list's BibTeX run never comes",
        evidence: [
          { kind: 'source', file: 'Latex-Lib/classes (book, amsbook, extbook, memoir, scrbook, frontiers, oup-authoring-template, sn-jnl)', line: 'defines: cmd:\\backmatter' },
          { kind: 'compile', cell: 'batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1): 112 cells in 56 pairs whose first error is \\backmatter, the book-backmatter and amsbook-backmatter presets\' solo branches (acmart-acmsmall.A document db983f84a425c15d4991a, result efbca41127)' },
        ],
      },
      // The same for IEEEtran.bst's control entry: the matrix files by `onlyWhen`, not by `requiresWhen`. ieeetran-compsoc and
      // ieeeaccess are built on class.ieeetran.
      {
        when: { bstControl: true },
        classes: ['class.ieeetran', 'class.ieeeconf-ras'],
        reason: "\\bstctlcite is IEEEtran.cls's (l.4438) and ieeeconf.cls's (and so ieeetran-compsoc's and ieeeaccess's, built on IEEEtran); under any other class the \\AtBeginDocument{\\bstctlcite{IEEEexample:BSTcontrol}} line stops at 'Undefined control sequence' at \\begin{document}",
        evidence: [
          { kind: 'source', file: 'Latex-Lib/classes (ieeetran, ieeeconf-ras)', line: 'defines: cmd:\\bstctlcite' },
          { kind: 'compile', cell: "batch 4 round 2 (testing-pipeline/out/fetched/batch4-round2): the ieeetran preset's solo branch, document da0746f959e282fb4d926, fails at \\bstctlcite in 62 pairs (aaai.A cell cd840cae3047ce29e7ee2, result 02c7825f5c51358cc12c1ac1971d11cbfea3bed31021373c651ca72ac84d8110) and passes in the 5 IEEE pairs (ieeetran-journal.A, ieeetran-conference.A, ieeetran-compsoc.A, ieeeaccess.A, ieeeconf-ras.A)" },
        ],
      },
    ],
    // The classes that load natbib in author-year mode (CA2), and those that set their own \bibliographystyle (CA11).
    deny: [
      // b3p (batch 3, G4): the classes and styles that set their own \bibliographystyle (CA11), as ascelike, acl and jmlr do.
      {
        class: 'class.plos',
        reason: "the plos setting's preamble runs \\bibliographystyle{plos2025} right after \\documentclass (PLOS's template), so main.aux always opens with \\bibstyle{plos2025}; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json', line: 'preamble line 19 (\\bibliographystyle{plos2025})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.corl',
        reason: "corl_2026.sty calls \\bibliographystyle{corlabbrvnat} while it loads, unless given nonatbib, which the setting does not give (l.76-80), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '76-80 (\\RequirePackage[square,numbers]{natbib} \\bibliographystyle{corlabbrvnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.bmvc',
        reason: "bmvc2k.cls calls \\bibliographystyle{plainnat} while it loads (l.775), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '714 (bmvc2k_natbib [sort,numbers]), 775 (\\bibliographystyle{plainnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.ecai',
        reason: "ecai.cls calls \\bibliographystyle{abbrvnat} at its end (l.1327), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '1325-1327 (natbib [numbers], \\bibliographystyle{abbrvnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      // b2p (batch 2, G4): the conference styles whose natbib is author-year (loaded with no option, natbib's default; ICML and
      // ICLR also \setcitestyle{authoryear,...}), as for aa below; and ascelike, which sets its own \bibliographystyle.
      // b3p verify-V1 (batch 3, G2): agu loads apacite, whose thebibliography has no list counter (every bst, apalike untested).
      {
        class: 'class.agu',
        reason: "agujournal2025 loads apacite (l.1970), whose thebibliography has no list counter (apacite.sty l.1199-1235): a numeric style's \\bibitem{key} stops at 'Undefined control sequence' (\\@listctr), as bib.thebibliography's does (b3p probe G2-agu-thebib), and apacite's \\cite (=\\shortcite, l.1972) reads apacite.bst's author-year labels; the class's bibliography is bib.apacite",
        evidence: [{ kind: 'source', file: 'apacite.sty (MiKTeX package apacite, 2013/07/21 v6.03)', line: '1199-1235' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '1939-1957, 1970-1972' }],
      },
      // b3p G2-D1, b3q: copernicus loads natbib [authoryear,round] itself (copernicus.cls l.2043-2045, the XeTeX-patched copy) and
      // sets no \bibliographystyle, so a numeric or alpha style's \bibitem stops natbib as under aa (CA2).
      {
        class: 'class.copernicus',
        unless: { bst: 'apalike' },
        reason: "copernicus.cls loads natbib with authoryear,round (l.2044, \\bibpunct{(}{)}{;}{a}{,}{,~} l.2045) and gives no \\bibliographystyle, so a numeric or alpha style's \\bibitem has no Author(Year) label and natbib stops at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/copernicus.cls', line: '2043-2045' }],
      },
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
      // b3p (batch 3, G3): jss calls \bibliographystyle{jss} while it loads, as jmlr and acl do; Frontiers loads natbib with no
      // option (author-year) and sets no style, as neurips.
      {
        class: 'class.jss',
        reason: "jss.cls calls \\bibliographystyle{jss} while it loads (l.64), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/jss.cls (jss 2026/04/28 v3.6)', line: '60-62 (natbib), 64 (\\bibliographystyle{jss})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.frontiers',
        unless: { bst: 'apalike' },
        reason: "FrontiersinHarvard.cls loads natbib with no option (l.863), so natbib is author-year; a numeric or alpha style's \\bibitem has no Author(Year) label and natbib stops at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/FrontiersinHarvard.cls (v2.6 2016/11/10)', line: '863' }],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 88 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. aa.A dd15148ea15e0fab70516 result
    // d2f7f7f1c5, branch bdccf5c475b3bf300411a, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    targetEngine: 'untested',
  }),
);
