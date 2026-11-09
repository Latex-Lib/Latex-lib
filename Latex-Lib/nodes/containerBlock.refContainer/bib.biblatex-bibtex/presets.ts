/**
 * bib.biblatex-bibtex's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  'node-style': {
    description: 'biblatex in the style the node asks for (data.referenceStyling, numeric by default), \addbibresource, \printbibliography.',
    features: ['numeric-citations', 'external-tool'],
    params: {},
    evidence: [solution('0642-elegantnote', '41')],
  },
  'author-year': {
    description: 'Author and year citations sorted by year, then name (style=authoryear, sorting=ynt).',
    features: ['author-year', 'external-tool'],
    params: { style: 'authoryear', sorting: 'ynt' },
    evidence: [solution('0700-lectures', '73')],
  },
  alphabetic: {
    description: 'Alphabetic labels, given names as initials, at most six names in the list, back references to the citing pages (style=alphabetic, giveninits, maxbibnames=6, backref).',
    features: ['external-tool'],
    params: { style: 'alphabetic', giveninits: true, maxnames: 6, backref: true },
    evidence: [solution('0547-dfgproposal', '73')],
  },
  'ieee-newest': {
    description: 'IEEE style (biblatex-ieee), newest first (style=ieee, sorting=ydnt), the list under its own heading.',
    writes: '\\nocite{*} \\printbibliography[title={…}]; \\addbibresource{\\jobname.bib}',
    features: ['numeric-citations', 'external-tool'],
    params: { style: 'ieee', sorting: 'ydnt', heading: 'Publications' },
    evidence: [solution('0153-komacv', '57')],
  },
  'citation-order': {
    description: 'Numbered in citation order, compressed ranges (style=numeric-comp, sorting=none).',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { style: 'numeric-comp', sorting: 'none' },
    evidence: [solution('0064-korogodin-nslreport', '77')],
  },
  // The letter, minimal and scrlttr2 templates (no \section in the class): the list under a plain bold heading of their own,
  // \defbibheading after biblatex loads (class.letter/main.tex l.69-72, 206-207; class.minimal/main.tex l.100-104, 253;
  // class.scrlttr2/main.tex l.74, 227, which names its heading letter; the same bold line).
  'plain-heading': {
    description: 'For a class with no \\section (letter, minimal, scrlttr2): the list under a plain bold heading, \\defbibheading{bibliography}[\\refname]{\\par\\noindent\\textbf{#1}\\par\\medskip}, then \\printbibliography.',
    writes: '\\nocite{*} \\printbibliography; \\addbibresource{\\jobname.bib} \\defbibheading{bibliography}[\\refname]{\\par\\noindent\\textbf{#1}\\par\\medskip}',
    features: ['numeric-citations', 'external-tool'],
    params: { headingForm: 'plain' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.letter/main.tex', line: '69-72, 206-207' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.minimal/main.tex', line: '100-104, 253' },
      { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.scrlttr2/main.tex', line: '74, 227' },
      { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/biblatex-letter/main.tex under letter, ok, the .bbl read, References in bold; biblatex-minimal (minimal) and biblatex-scrlttr2 (scrlttr2) the same' },
    ],
  },
  // ElegantLaTeX's elegantpaper: the class loads biblatex itself (elegantpaper.cls l.195-198), so the sample loads nothing, adds its
  // database and prints the list in the table of contents under \ebibname (elegantpaper-en.tex l.149; \ebibname: elegantpaper.cls l.257).
  elegantpaper: {
    description: 'elegantpaper: biblatex loaded by the class (no \\usepackage here), \\addbibresource, and \\printbibliography[heading=bibintoc, title=\\ebibname].',
    writes: '\\nocite{*} \\printbibliography[heading=bibintoc,title={\\ebibname}]; \\addbibresource{\\jobname.bib}',
    features: ['numeric-citations', 'external-tool'],
    params: { load: false, headingForm: 'bibintoc', heading: '\\ebibname' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0188-elegantpaper/elegantpaper.cls', line: '23-28, 195-198, 257' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0188-elegantpaper/elegantpaper-en.tex', line: '149' },
      { kind: 'compile', reproducer: 'unit 46 (2026-11-07), ZeroTeX-NG through class-examples/typeset-dir.ts: scratchpad build/work/bib-ext/biblatex-elegantpaper/main.tex under elegantpaper [lang=en,bibend=bibtex] (MiKTeX), ok, no option clash, the .bbl read, Bibliography as a section' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
