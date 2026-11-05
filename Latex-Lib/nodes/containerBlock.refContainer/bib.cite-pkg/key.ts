import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.cite-pkg',
    node: 'containerBlock/refContainer',
    description:
      'The cite package: numbered citations sorted and compressed ([1-3]), nosort to keep their order, super for superscript numbers, with a numbered BibTeX style. 27 templates.',
    ctan: ['cite'],
    features: ['numeric-citations', 'sorted-compressed', 'superscript', 'external-tool'],
    params: {
      sort: { type: 'boolean', default: true, description: 'several citations sorted (nosort when false)' },
      superscript: { type: 'boolean', default: false, description: 'superscript numbers (super)' },
      bst: { type: 'enum', values: ['plain', 'unsrt', 'abbrv', 'ieeetr'], default: 'plain', description: 'the BibTeX style' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'cite' },
      { pkg: 'cite', options: ['nosort'], when: { sort: false } },
      { pkg: 'cite', options: ['super'], when: { superscript: true } },
    ],
    claims: ['bibliography-engine'],
    requires: [
      'env:thebibliography',
    ],
    // aa's author-year natbib (CA2), and the classes that set their own \bibliographystyle (CA11). Under aastex cite is a technical refusal already.
    deny: [
      // b3p (batch 3, G4): plos's preamble sets \bibliographystyle{plos2025}. corl, bmvc and ecai, which load natbib, refuse cite in
      // their profiles' forbids.technical, as cvpr does.
      {
        class: 'class.plos',
        reason: "the plos setting's preamble runs \\bibliographystyle{plos2025} right after \\documentclass (PLOS's template), so main.aux always opens with \\bibstyle{plos2025}; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json', line: 'preamble line 19 (\\bibliographystyle{plos2025})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      // b30 (B3E-AGU-CITE): agujournal2025 loads apacite and sets its style itself, as plos's preamble does.
      {
        class: 'class.agu',
        reason: "agujournal2025.cls loads apacite and calls \\bibliographystyle{apacite} while it loads (l.140, l.146), so main.aux always opens with \\bibstyle{apacite}; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '140 (\\RequirePackage{apacite}), 146 (\\bibliographystyle{apacite})' },
          { kind: 'compile', cell: 'GitHub run b29-6a43925, agu.A: every branch holding bib.cite-pkg fails with doc no-bbl (187 rows in 14 documents, 0 passing; e.g. df61a865ebb3c2520c804, \\bibliographystyle{plain} at l.385)' },
        ],
      },
      // b2p (batch 2, G4): author-year natbib from the conference style, as for aa below; ascelike's own \bibliographystyle.
      {
        class: 'class.asmeconf',
        reason: "asmeconf.cls loads natbib [sort&compress,numbers]; cite.sty loaded after it replaces natbib's \@citex and every \cite stops at 'Paragraph ended before \org@@citex was complete' (b2p probe G4-asmeconf-citepkg: 43 errors, no PDF; verify-V2)",
        evidence: [{ kind: 'source', file: 'probe b2p-1 G4-asmeconf-citepkg/main.log', line: '! Paragraph ended before \org@@citex was complete (43x)' }],
      },
      {
        class: 'class.neurips',
        reason: "neurips_2026.sty loads natbib with no option (l.119-121), so natbib is author-year; this way's numbered style's \\bibitem has no Author(Year) label and natbib stops at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/neurips_2026.sty', line: '119-121' }],
      },
      {
        class: 'class.icml',
        reason: "icml2026.sty loads natbib with no option (l.123) and sets \\setcitestyle{authoryear,round,...} (l.553); this way's numbered style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/icml2026.sty', line: '123, 553' }],
      },
      {
        class: 'class.iclr',
        reason: "iclr2027_conference.sty loads natbib with no option (l.20) and sets \\setcitestyle{authoryear,round,...} (l.23); this way's numbered style's \\bibitem stops natbib at 'Bibliography not compatible with author-year citations'",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iclr2027_conference.sty', line: '20, 23' }],
      },
      {
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally; this way's own \\bibliographystyle writes a second \\bibstyle to main.aux, which BibTeX rejects ('Illegal, another \\bibstyle command'), as under mdpi and sn-jnl",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.aa',
        reason: "aa loads natbib in author-year mode (its default bibauthoryear: \\RequirePackage[nonamebreak]{natbib}, \\bibpunct{(}{)}{;}{a}{}{,}); a numbered style's \\bibitem has no Author(Year) label, so natbib writes \\NAT@force@numbers to the .aux and the next run stops at \\begin{document}: \"Package natbib Error: Bibliography not compatible with author-year citations\". apalike's labels are author-year",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '140-146, 154, 232' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty', line: "292-299, 862, 966-981, 1002-1009 (8.31b, the engine's version: elsarticle-preprint.A result d0be2dd3397d logs natbib 2010/09/13 8.31b)" },
        ],
      },
      {
        class: 'class.sn-jnl',
        reason: "sn-jnl's sn-mathphys-num option (its setting's) calls \\bibliographystyle{sn-mathphys-num} while the class loads, so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command') and fails, ending the build with every citation undefined; and sn-mathphys-num.bst is not among the setting's files. cite.sty after natbib also breaks \\@citex (AC8, b15)",
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
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 76 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A dc21e6d1977acabed46d2 result
    // 69f6f3a0be, branch b4f3c93be9c03c2ebddbc, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
