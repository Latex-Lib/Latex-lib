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
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 76 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A dc21e6d1977acabed46d2 result
    // 69f6f3a0be, branch b4f3c93be9c03c2ebddbc, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
