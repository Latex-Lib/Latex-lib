import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.natbib',
    node: 'containerBlock/refContainer',
    description:
      'natbib: \\usepackage[numbers]{natbib} (authoryear, super; round or square; sort, sort&compress; comma or semicolon) with an natbib style, \\bibliographystyle{plainnat} (unsrtnat, abbrvnat), \\bibliography{\\jobname}; \\bibsep and \\bibfont for the list. 107 templates.',
    ctan: ['natbib'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'superscript', 'external-tool'],
    params: {
      citeStyle: { type: 'enum', values: ['numbers', 'authoryear', 'super'], default: 'numbers', compat: true, description: 'numbered, author-year, or superscript citations' },
      brackets: { type: 'enum', values: ['style', 'round', 'square'], default: 'style', description: 'round or square brackets' },
      sort: { type: 'enum', values: ['none', 'sort', 'sort&compress'], default: 'none', description: 'several citations sorted, and compressed to ranges' },
      separator: { type: 'enum', values: ['style', 'comma', 'semicolon'], default: 'style', description: 'between several citations' },
      bst: { type: 'enum', values: ['plainnat', 'unsrtnat', 'abbrvnat'], default: 'plainnat', description: 'the natbib BibTeX style' },
      bibsep: { type: 'dimen', default: '', description: "space between entries (\\bibsep); ''" },
      bibFont: { type: 'tex', default: '', description: "the list's font (\\bibfont); ''" },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'natbib', options: ['numbers'], when: { citeStyle: 'numbers' } },
      { pkg: 'natbib', options: ['authoryear'], when: { citeStyle: 'authoryear' } },
      { pkg: 'natbib', options: ['super'], when: { citeStyle: 'super' } },
      { pkg: 'natbib', options: ['round'], when: { brackets: 'round' } },
      { pkg: 'natbib', options: ['square'], when: { brackets: 'square' } },
      { pkg: 'natbib', options: ['sort'], when: { sort: 'sort' } },
      { pkg: 'natbib', options: ['sort&compress'], when: { sort: 'sort&compress' } },
      { pkg: 'natbib', options: ['comma'], when: { separator: 'comma' } },
      { pkg: 'natbib', options: ['semicolon'], when: { separator: 'semicolon' } },
    ],
    claims: ['bibliography-engine'],
    // The classes that set their own \bibliographystyle (CA11).
    deny: [
      {
        // b2p (batch 2, G4). The conference styles that load natbib themselves (neurips, icml, iclr, asmeconf) need no deny here:
        // every preset loads natbib with an option, an "Option clash" their profiles' preloads already keep out.
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally, so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle{plainnat} (or unsrtnat) writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), as under mdpi and sn-jnl",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
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
        class: 'class.aaai',
        reason: "aaai2027.sty, when natbib is loaded, calls \\bibliographystyle{aaai2027} at \\begin{document} (l.425-433), so main.aux opens with that \\bibstyle; this way loads natbib and writes its own \\bibliographystyle, a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), ending the build with every citation undefined",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '425-433' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 206 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A de3331b8b9913b25e0c46 result
    // c6ba90ad47, branch bcfb2d538cb8c4971e281, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    zerotex: 'untested',
  }),
);
