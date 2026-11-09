import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.biblatex-biber',
    node: 'containerBlock/refContainer',
    description:
      'biblatex with Biber: \\usepackage[style=…, backend=biber, sorting=…, maxbibnames=…, giveninits, backref]{biblatex}, the entries in \\jobname.bib (filecontents*), \\addbibresource, \\printbibliography[title=…]; Biber runs outside TeX. 110 templates.',
    // The same LaTeX as bib.biblatex-bibtex's (whose \nocite{*} sits in a once-guard): the backend is a package option (loads).
    writes: '\\nocite{*} \\printbibliography; \\addbibresource{\\jobname.bib}',
    ctan: ['biblatex', 'biber'],
    features: ['numeric-citations', 'author-year', 'sorted-compressed', 'external-tool'],
    params: {
      style: { type: 'enum', values: ['node', 'numeric', 'numeric-comp', 'authoryear', 'authortitle', 'alphabetic', 'ieee', 'apa'], default: 'node', description: "the citation and list style; node takes the node's data.referenceStyling (numeric by default)" },
      sorting: { type: 'enum', values: ['style', 'nty', 'nyt', 'ynt', 'ydnt', 'none'], default: 'style', description: "the list's order (sorting=); style keeps the style's" },
      maxnames: { type: 'number', default: 0, description: "names listed before et al. (maxbibnames=); 0 keeps the style's" },
      giveninits: { type: 'boolean', default: false, description: 'given names as initials (giveninits=true)' },
      backref: { type: 'boolean', default: false, description: 'pages that cite each entry, after it (backref=true)' },
      heading: { type: 'string', default: '', description: "the list's heading (\\printbibliography[title=…]); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'biblatex', options: ['backend=biber'] },
    ],
    claims: ['bibliography-engine'],
    deny: [
      // class-examples (2026-11-06): biblatex's default heading needs \section. A requires on counter:section would say it once, but
      // class.tikzposter's profile lists no counter:section though tikzposter.cls builds on extarticle (class.tikzposter.log l.525), so
      // it would refuse a class that has \section; these three are the classes with neither \chapter nor \section.
      {
        class: 'class.letter',
        reason: "letter.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.letter.log (2026-11-06), "Undefined control sequence \\section" at \\printbibliography, in the local TinyTeX build before the template gave its own heading (library-findings.md, class.letter (3))' },
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.letter/main.tex', line: '72 (the template\'s own \\defbibheading{bibliography}, "letter has no \\section*")' },
        ],
      },
      {
        class: 'class.minimal',
        reason: "minimal.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.minimal.log (2026-11-06), the build passes only with the template\'s own heading; biblatex\'s default needs \\section* (library-findings.md, class.minimal)' },
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '104 (the template\'s own \\defbibheading{bibliography})' },
        ],
      },
      {
        class: 'class.scrlttr2',
        reason: "scrlttr2.cls defines neither \\chapter nor \\section, and this way's \\printbibliography takes biblatex's default 'bibliography' heading, \\section* where the class has no \\chapter (biblatex.def l.2212), so the list stops at 'Undefined control sequence' (\\section); the heading param sets only title=, not the heading",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.scrlttr2/main.tex', line: '74 (\\defbibheading{letter}, "A letter has no sections"), 227 (\\printbibliography[heading=letter])' },
        ],
      },
    ],
    conflicts: [
      { pkg: 'natbib', reason: 'biblatex refuses natbib', evidence: [] },
    ],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints: General's footnote container below it never ships its text (GitHub run 41584963423: 0 of 68 not-denied
    // branches pass, 0 of 750 over the seven reference-list ways and General's; e.g. amsart.A d68b4bdb613b8653572cc result
    // 7e22cdac05, branch bd08800e1e260e9c24ae4, '.0 never shipped'). Flouest's own fix is O4. [OV3]
    gives: { footnotes: false },
    targetEngine: 'untested',
  }),
);
