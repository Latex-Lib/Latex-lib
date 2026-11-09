import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.biblatex-bibtex',
    node: 'containerBlock/refContainer',
    description:
      'biblatex with the BibTeX backend: \\usepackage[style=…, backend=bibtex, sorting=…, maxbibnames=…, giveninits, backref]{biblatex}, the entries in \\jobname.bib (filecontents*), \\addbibresource, \\printbibliography[title=…]. Its heading can be a plain bold line for a class with no \\section (\\defbibheading{bibliography}[\\refname]{\\par\\noindent\\textbf{#1}\\par\\medskip}: letter, minimal, scrlttr2), none, or bibintoc; under a class that loads biblatex itself it loads nothing and only adds the database and prints the list (elegantpaper: \\printbibliography[heading=bibintoc, title=\\ebibname]). 18 templates.',
    // The same LaTeX as bib.biblatex-biber's, its \nocite{*} in the library's once-guard (citedOnce, ../node.ts): the backend is a package option (loads).
    writes: '\\nocite{*} \\printbibliography; \\addbibresource{\\jobname.bib}',
    ctan: ['biblatex'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'external-tool'],
    params: {
      style: { type: 'enum', values: ['node', 'numeric', 'numeric-comp', 'authoryear', 'authortitle', 'alphabetic', 'ieee'], default: 'node', description: "the citation and list style; node takes the node's data.referenceStyling when backend=bibtex has it, else numeric (apa needs Biber: bib.biblatex-biber)" },
      sorting: { type: 'enum', values: ['style', 'nty', 'nyt', 'ynt', 'ydnt', 'none'], default: 'style', description: "the list's order (sorting=); style keeps the style's" },
      maxnames: { type: 'number', default: 0, description: "names listed before et al. (maxbibnames=); 0 keeps the style's" },
      giveninits: { type: 'boolean', default: false, description: 'given names as initials (giveninits=true)' },
      backref: { type: 'boolean', default: false, description: 'pages that cite each entry, after it (backref=true)' },
      heading: { type: 'string', default: '', description: "the list's heading (\\printbibliography[title=…]); ''" },
      // The extension (unit 46). biblatex's default 'bibliography' heading is \section* where the class has no \chapter (biblatex.def
      // l.2212), which letter, minimal and scrlttr2 lack: their templates give the list a plain bold heading of their own
      // (Latex-Template-Examples/class.letter/main.tex l.69-72, class.minimal/main.tex l.100-104, class.scrlttr2/main.tex l.74, 227).
      headingForm: { type: 'enum', values: ['default', 'plain', 'none', 'bibintoc'], default: 'default', description: "default: biblatex's own heading (\\section* or \\chapter*); plain: a bold line, \\defbibheading{bibliography}[\\refname]{\\par\\noindent\\textbf{#1}\\par\\medskip}, for a class with no \\section; none: heading=none; bibintoc: heading=bibintoc, the heading in the table of contents" },
      // elegantpaper loads biblatex itself (elegantpaper.cls l.195-198, backend from its bibend option), so another \usepackage{biblatex}
      // with any option clashes; its sample only adds the database and prints the list (elegantpaper-en.tex l.149).
      load: { type: 'boolean', default: true, description: "load biblatex (false: the class loads it, with its own backend and style, and this way only adds \\jobname.bib and prints the list)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'biblatex', options: ['backend=bibtex'], when: { load: true } },
    ],
    claims: ['bibliography-engine'],
    requiresWhen: [
      // load: false prints only \addbibresource and \printbibliography, which need biblatex loaded by the class (elegantpaper's preload).
      { when: { load: false }, requires: ['pkg:biblatex'] },
      // elegantpaper's sample heads its list \ebibname, which the class defines under lang=en (elegantpaper.cls l.257).
      { when: { heading: '\\ebibname' }, requires: ['cmd:\\ebibname'] },
    ],
    // b2p (batch 2, G4): with backend=bibtex, biblatex writes \bibstyle{biblatex} to main.aux and BibTeX makes the .bbl.
    deny: [
      {
        // b3p (batch 3, G4): with no unless, this also refuses biblatex for General's bibliography under plos (latexLibClasses).
        class: 'class.plos',
        reason: "the plos setting's preamble runs \\bibliographystyle{plos2025} right after \\documentclass and before biblatex loads (PLOS's template), so main.aux opens with \\bibstyle{plos2025}; biblatex's backend=bibtex writes \\bibstyle{biblatex} after it, which BibTeX rejects ('Illegal, another \\bibstyle command'), as under ascelike",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/plos.json', line: 'preamble line 19 (\\bibliographystyle{plos2025})' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems); ascelike, whose class sets its style before biblatex loads: 236 of 299 cells in GitHub run b12-5bdc624' },
        ],
      },
      {
        class: 'class.ascelike',
        reason: "ascelike.cls calls \\bibliographystyle{ascelike} in its \\AtEndOfClass block, unconditionally, so main.aux opens with \\bibstyle{ascelike}; biblatex's backend=bibtex writes \\bibstyle{biblatex} after it, which BibTeX rejects ('Illegal, another \\bibstyle command'), and the .bbl BibTeX makes with ascelike.bst is not biblatex's (biber, ascelike's default and General's, writes no \\bibstyle and is not affected)",
        evidence: [
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN macros/latex/contrib/ascelike)', line: '\\AtEndOfClass{... \\bibliographystyle{ascelike} ...}' },
          { kind: 'compile', cell: 'b10 reference-list investigation: a repeated \\bibstyle in main.aux makes BibTeX fail and the build end (index4 no-bbl problems)' },
        ],
      },
      // class-examples (2026-11-06): biblatex's default heading needs \section. A requires on counter:section would say it once, but
      // class.tikzposter's profile lists no counter:section though tikzposter.cls builds on extarticle (class.tikzposter.log l.525), so
      // it would refuse a class that has \section; these three are the classes with neither \chapter nor \section.
      {
        class: 'class.letter',
        reason: "letter.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading, so the rule holds unless headingForm is plain (the templates' own \\defbibheading) or none",
        unless: { headingForm: ['plain', 'none'] },
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.letter.log (2026-11-06), "Undefined control sequence \\section" at \\printbibliography, in the local TinyTeX build before the template gave its own heading (library-findings.md, class.letter (3))' },
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.letter/main.tex', line: '72 (the template\'s own \\defbibheading{bibliography}, "letter has no \\section*")' },
        ],
      },
      {
        class: 'class.minimal',
        reason: "minimal.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading, so the rule holds unless headingForm is plain (the templates' own \\defbibheading) or none",
        unless: { headingForm: ['plain', 'none'] },
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.minimal.log (2026-11-06), the build passes only with the template\'s own heading; biblatex\'s default needs \\section* (library-findings.md, class.minimal)' },
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '104 (the template\'s own \\defbibheading{bibliography})' },
        ],
      },
      {
        class: 'class.scrlttr2',
        reason: "scrlttr2.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading, so the rule holds unless headingForm is plain (the templates' own \\defbibheading) or none",
        unless: { headingForm: ['plain', 'none'] },
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.scrlttr2/main.tex', line: '74 (\\defbibheading{letter}, "A letter has no sections"), 227 (\\printbibliography[heading=letter])' },
        ],
      },
    ],
    conflicts: [
      { pkg: 'natbib', reason: 'biblatex refuses natbib ("Incompatible package natbib"), which acmart, elsarticle and revtex4-2 load', evidence: [{ kind: 'compile', candidate: 'r2fcdef7f012217adaebc' }] },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 66 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A d4dad8eac29ded704ea88 result
    // 4b4626dc99, branch b7001b17db10b98e493fc, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    targetEngine: 'yes',
  }),
);
