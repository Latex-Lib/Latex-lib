import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.natbib',
    node: 'containerBlock/refContainer',
    description:
      'natbib: \\usepackage[numbers]{natbib} (authoryear, super; round or square; sort, sort&compress; comma or semicolon) with an natbib style, \\bibliographystyle{plainnat} (unsrtnat, abbrvnat, apalike, IEEEtranN), \\bibliography{\\jobname}; \\bibsep and \\bibfont for the list, and \\renewcommand{\\bibsection}{…} for its heading level (AISTATS: \\subsubsection*{\\bibname}). 107 templates.',
    // The \LatexLib… once-guards around it (../node.ts) are the library's own, left out.
    writes: '\\nocite{*} \\bibliographystyle{plainnat} \\bibliography{\\jobname}',
    ctan: ['natbib'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'superscript', 'external-tool'],
    params: {
      citeStyle: { type: 'enum', values: ['numbers', 'authoryear', 'super'], default: 'numbers', compat: true, description: 'numbered, author-year, or superscript citations' },
      brackets: { type: 'enum', values: ['style', 'round', 'square'], default: 'style', description: 'round or square brackets' },
      sort: { type: 'enum', values: ['none', 'sort', 'sort&compress'], default: 'none', description: 'several citations sorted, and compressed to ranges' },
      separator: { type: 'enum', values: ['style', 'comma', 'semicolon'], default: 'style', description: 'between several citations' },
      // apalike (AISTATS's sample, Source/0794-aistats/sample_paper.tex l.32-33) and IEEEtranN (IEEEtran's natbib-compatible style,
      // Source/0823-latextemplates-ieee-enhanced/paper.tex l.1166-1167, which prints its DOI-extended copy) are on CTAN.
      bst: { type: 'enum', values: ['plainnat', 'unsrtnat', 'abbrvnat', 'apalike', 'IEEEtranN'], default: 'plainnat', description: 'the natbib-compatible BibTeX style' },
      bibsep: { type: 'dimen', default: '', description: "space between entries (\\bibsep); ''" },
      bibFont: { type: 'tex', default: '', description: "the list's font (\\bibfont); ''" },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname, \\bibname); ''" },
      // natbib's thebibliography opens with \bibsection (\section*{\refname}, or \chapter*{\bibname}), which replaces the class's own
      // heading: AISTATS's style heads its list \subsubsection*{\refname} (aistats2026.sty l.482-483) and so its sample renews
      // \bibsection to keep that level (sample_paper.tex l.27-30).
      bibsection: { type: 'tex', default: '', description: "the list's heading command (\\renewcommand{\\bibsection}{…}), e.g. \\subsubsection*{\\bibname}; ''" },
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
    // natbib redefines thebibliography as it loads (\renewenvironment{thebibliography}[1], natbib.sty 2010/09/13 8.31b l.1063: Latex
    // Related Research/Latex-lib-main/Source/0207-tandf-interact/natbib.sty), and the .bbl plainnat (unsrtnat, abbrvnat) writes opens
    // \begin{thebibliography}, so a class without the environment stops at the package line, as bib.thebibliography, bib.bibtex-bst,
    // bib.apacite and bib.cite-pkg do: { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/
    // class.minimal.log (2026-11-06), "! LaTeX Error: Environment thebibliography undefined." at natbib.sty l.1063' }, and the same at
    // natbib.sty under class.letter (class.letter.log, 2026-11-06). The final logs show the templates' biblatex lists, which took its place.
    requires: [
      'env:thebibliography',
    ],
    requiresWhen: [{ when: { bibsection: '\\subsubsection*{\\bibname}' }, requires: ['counter:subsubsection'] }],
    // The classes that set their own \bibliographystyle (CA11).
    deny: [
      // b3p (batch 3, G4): corl, bmvc and ecai load natbib with numbers (corl also square, bmvc also sort), so the presets that give
      // only those options load nothing new and fit; each class or style also sets its own \bibliographystyle, as plos's preamble does.
      {
        class: 'class.plos',
        reason: "the plos setting's preamble runs \\bibliographystyle{plos2025} right after \\documentclass (PLOS's template), so main.aux always opens with \\bibstyle{plos2025}; this way's own \\bibliographystyle{plainnat} (unsrtnat, abbrvnat) writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), so no .bbl is made",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json', line: 'preamble line 19 (\\bibliographystyle{plos2025})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.corl',
        reason: "corl_2026.sty loads natbib [square,numbers] and calls \\bibliographystyle{corlabbrvnat} while it loads (l.76-80), so main.aux opens with that \\bibstyle; a preset whose natbib options are among square and numbers loads nothing new and fits the preload, and this way's own \\bibliographystyle writes a second \\bibstyle, which BibTeX rejects ('Illegal, another \\bibstyle command')",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '76-80 (\\RequirePackage[square,numbers]{natbib} \\bibliographystyle{corlabbrvnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.bmvc',
        reason: "bmvc2k.cls loads its natbib copy with sort and numbers (l.714; the setting records natbib.sty as loaded with those options) and calls \\bibliographystyle{plainnat} (l.775), so main.aux opens with that \\bibstyle; a preset whose natbib options are among sort and numbers loads nothing and fits, and this way's own \\bibliographystyle writes a second \\bibstyle, which BibTeX rejects ('Illegal, another \\bibstyle command')",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/bmvc2k.cls (v0.22, 2026/04/02)', line: '714 (bmvc2k_natbib [sort,numbers]), 775 (\\bibliographystyle{plainnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      {
        class: 'class.ecai',
        reason: "ecai.cls loads natbib [numbers] and calls \\bibliographystyle{abbrvnat} at its end (l.1325-1327), so main.aux opens with that \\bibstyle; the default preset (numbers) loads nothing new and fits the preload, and this way's own \\bibliographystyle writes a second \\bibstyle, which BibTeX rejects ('Illegal, another \\bibstyle command')",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/ecai.cls (2023/12/10 v04)', line: '1325-1327 (natbib [numbers], \\bibliographystyle{abbrvnat})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
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
      {
        // b3p (batch 3, G3). jss's own natbib is [authoryear,round,longnamesfirst], so the presets that give only authoryear
        // or round raise no option clash and need this deny; Frontiers' bare natbib clashes with every preset already.
        class: 'class.jss',
        reason: "jss.cls calls \\bibliographystyle{jss} while it loads (l.64), so main.aux opens with that \\bibstyle; this way's own \\bibliographystyle{plainnat} (or unsrtnat) writes a second one, which BibTeX rejects ('Illegal, another \\bibstyle command'), as under ascelike",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/jss.cls (jss 2026/04/28 v3.6)', line: '60-62 (natbib), 64 (\\bibliographystyle{jss})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 206 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A de3331b8b9913b25e0c46 result
    // c6ba90ad47, branch bcfb2d538cb8c4971e281, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    // Every preset typeset ok on ZeroTeX-NG (unit 46, 2026-11-07, class-examples/typeset-dir.ts, scratchpad build/work/bib-ext/natbib-aistats, natbib-ieee and natbib-article-<preset> for the other five).
    targetEngine: 'yes',
  }),
);
