import { defineClass } from '../schema/class.ts';

const EAPJ = 'emulateapj.cls (MiKTeX package emulateapj, version February 19, 2025)';
const RTX4 = 'revtex4.cls (MiKTeX package revtex4, 2020/09/30 v4.0a)';

/**
 * emulateapj, the ApJ two-column look on REVTeX 4.0 (`[revtex4]`, the
 * emulateapj setting, batch 2), read from the class source and revtex4.cls,
 * which it loads (\LoadClass[twocolumn,...,10pt,aps,pra]{revtex4},
 * emulateapj.cls l.150-166); not yet measured by the class probe.
 *
 * It builds on class.aastex: aastex701 is revtex code too (its grid, front
 * matter and array copies are revtex's), and the key rules written for it hold
 * here for the same reasons, which a revtex4-2 base would miss. emulateapj
 * switches natbib to author-year with \@citestyle{aas} (l.194-195), as
 * aastex701 does, so a numeric \bibitem stops the second run (bib.bibtex-bst,
 * bib.thebibliography); revtex4 names its contents \tocname, not \contentsname
 * (revtex4.cls l.5938: toc.tocloft); it refuses multicol (etoc); it has no
 * \if@titlepage (abstract.sty, titling) and no \twocolumn (l.2862, 2913:
 * cols.twocolumn-cmd); sectsty refuses it. No key holds a class-native way
 * `only` for class.aastex, so the base brings no way of aastex701's own.
 *
 * Its setting has none of the lines aastex's and revtex4-2-aps's settings
 * carry for the same revtex code (fix-notes; README's aastex note), so this
 * profile refuses what those lines made fit: every package that loads array
 * (see array's rule) and the grid's own refusals. Lift them when the
 * setting takes the lines and a probe shows them working.
 */
export default defineClass({
  id: 'class.emulateapj',
  name: "emulateapj",
  base: 'class.aastex',
  targetEngine: "untested",
  preloads: [
    // revtex4.cls l.4254 (url), l.5480 (natbib with sort&compress; emulateapj then resets \NAT@sort and \NAT@cmprs, l.184-187, and
    // switches to author-year, l.194-195), l.6050 (revsymb); emulateapj.cls l.189-192 and l.206 (latexsym, graphicx, amssymb,
    // longtable, epsf). No amsmath (the class options name no amsmath), no hyperref, geometry, fontenc or textcase.
    { pkg: "url" }, { pkg: "natbib", options: ["sort&compress"] }, { pkg: "revsymb" },
    { pkg: "latexsym" }, { pkg: "graphicx" }, { pkg: "amssymb" }, { pkg: "longtable" }, { pkg: "epsf" },
  ],
  // revtex4.cls l.5154-5159 (part to subparagraph; no chapter), l.4621 (abstract, kept for \maketitle), l.4704 (\maketitle),
  // l.5335/5366 (figure, table); emulateapj.cls l.749 (appendix, renewed), revtex4's \appendix and \tableofcontents.
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "env:appendix", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "cmd:\\affil", "cmd:\\altaffilmark", "cmd:\\altaffiltext", "cmd:\\shorttitle", "cmd:\\shortauthors", "cmd:\\keywords", "cmd:\\slugcomment"],
  options: {},
  forbids: {
    technical: [
      { pkg: "cite", reason: "revtex4 stops at \\begin{document} when cite is loaded: \\incompatible@package{cite} (revtex4.cls l.4256; l.73-80: \"Class revtex4 Error: The cite package cannot be used with revtex4\", then \\stop)", evidence: [{ kind: 'source', file: RTX4, line: '73-80, 4256' }] },
      { pkg: "multicol", reason: "revtex4 stops at \\begin{document} when multicol is loaded: \\incompatible@package{multicol} (revtex4.cls l.4257; l.73-80), as revtex4-2 and aastex701 do", evidence: [{ kind: 'source', file: RTX4, line: '73-80, 4257' }] },
      { pkg: "biblatex", reason: "revtex4 loads natbib itself (revtex4.cls l.5480), and biblatex stops at Incompatible package 'natbib', as under revtex4-2, aastex701 and acmart", evidence: [{ kind: 'source', file: RTX4, line: '5480' }] },
      { pkg: "paracol", reason: "revtex4's page grid undefines \\col@number (revtex4.cls l.3002-3003), which paracol sets when a paracol environment opens; under aastex701, whose grid is the same code, every cols.paracol branch stopped at 'Undefined control sequence' in \\pcol@zparacol (class.aastex, class.revtex4-2)", evidence: [{ kind: 'source', file: RTX4, line: '3002-3003' }] },
      // The array family. revtex4 swaps in its own copies of array's internals at \begin{document} whenever array is loaded
      // (\switch@array, revtex4.cls l.738, 861-937), and its builder \@mkpream@array@new (l.1422-1427) calls \@mkpream@relax
      // (l.1387-1394), which relaxes \@startpbox but not \@endpbox, \do@row@strut or \ar@align@mcell: the revtex4-2 and aastex701
      // fault (array's \xdef expands \@endpbox, and a p-column table begun in vertical mode stops at 'Extra \or' or hangs). revtex4
      // also does not know array 2.6+ (it reports 'Unrecognized array package' and installs its copies anyway, l.916-918), which put one
      // interword space per source line before every tabular in a block under aastex701 (b24 OVFA-AASARRAY). aastex's setting fixes
      // both (\g@addto@macro\@mkpream@relax{...}, \let\switch@array\relax); emulateapj's does not, so every package that loads array
      // is refused here. Without array the class uses the kernel's tabular (\switch@tabular, l.747), whose \@mkpream relaxes both.
      { pkg: "array", reason: "with array loaded, revtex4 installs its own copies of array's internals at \\begin{document} (\\switch@array, revtex4.cls l.738, 861-937), whose preamble builder (\\@mkpream@array@new, l.1422-1427) calls \\@mkpream@relax (l.1387-1394), which leaves \\@endpbox unrelaxed: array's \\xdef expands it, and every p-column table begun in vertical mode stops at 'Extra \\or' or hangs, as under revtex4-2 and aastex701 before their settings relaxed it (README's aastex and revtex4-2-aps notes). revtex4 also does not recognise array 2.6+ (l.916-918), which under aastex701 put stray interword spaces before every tabular in a block. The emulateapj setting carries neither fix", evidence: [{ kind: 'source', file: RTX4, line: '738, 861-937, 1387-1394, 1422-1427' }, { kind: 'source', file: 'testing-pipeline/settings/classes/aastex.json', line: 'preamble[2], preamble[3]' }] },
      { pkg: "tabularx", reason: "tabularx loads array, and its X columns are p-columns: under revtex4's array copies (see array) every tabularx begun in vertical mode stops at 'Extra \\or', as aastex701's 317 failing cells of GitHub run 41584963423 did before its setting's \\@mkpream@relax line", evidence: [{ kind: 'source', file: RTX4, line: '1387-1394, 1422-1427' }] },
      { pkg: "colortbl", reason: "colortbl loads array (see array), and revtex4's array copies empty \\everycr (revtex4.cls l.1113, 1176) and replace the \\endarray colortbl patched, so its row colours are not reset or painted, as class.revtex4-2 records for the same code", evidence: [{ kind: 'source', file: RTX4, line: '1113, 1176, 861-937' }] },
      { pkg: "arydshln", reason: "arydshln wraps \\@array, \\@mkpream, \\endarray and \\endtabular when it loads, and at \\begin{document} revtex4 lets them to its own copies (\\switch@array or \\switch@tabular, revtex4.cls l.738, 747, 861-937), so its wrappers never run and \\hline stops in \\adl@hline, as under revtex4-2 and aastex701 (0 of 137 branches)", evidence: [{ kind: 'source', file: RTX4, line: '738, 747, 861-937' }] },
      { pkg: "nicematrix", reason: "nicematrix loads array (see array) and refuses REVTeX ('nicematrix is incompatible with REVTeX', class.revtex4-2)", evidence: [{ kind: 'source', file: RTX4, line: '738, 861-937' }] },
      { pkg: "awesomebox", reason: "awesomebox loads array, which makes revtex4 install its array copies at \\begin{document} (see array): under revtex4-2 the same made p-column tables in its documents stop at 'Extra \\or' or hang (19 of the 20 revtex no-log documents, README's revtex4-2-aps note)", evidence: [{ kind: 'source', file: RTX4, line: '738, 861-937' }] },
      // caption itself belongs here too (any way that loads caption or ltcaption), but packages/ has no facts for it yet and no
      // way loads it directly: sidenotes is the one way that brings it in.
      { pkg: "sidenotes", reason: "sidenotes loads caption, and with the class's longtable loaded caption loads ltcaption (v1.4c), which defines the environment longtable*; at \\begin{document} revtex4 patches longtable ('Patching unrecognized longtable package') with its own \\newenvironment{longtable*}, which stops at \"LaTeX Error: Command \\longtable* already defined\" (l.101 \\begin{document}): the whole document fails", evidence: [{ kind: 'compile', cell: "class-examples: Latex Related Research/Latex-Template-Examples/_results/class.emulateapj.log (2026-11-06), note.sidenotes: ltcaption v1.4c loaded at log l.279-280, then \"! LaTeX Error: Command \\longtable* already defined.\" at l.101 \\begin{document}" }, { kind: 'source', file: EAPJ, line: '189-192, 206 (latexsym, graphicx, amssymb, longtable, epsf)' }] },
      { pkg: "endnotes", reason: "\\theendnotes sets its heading with \\enoteheading, \\section*{\\notesname\\@mkboth{\\MakeUppercase{\\notesname}}{...}}, and revtex4's \\@sect, as emulateapj sets it ({\\centering\\scshape\\apjsecfont}), uppercases the title through textcase: the \\@mkboth inside it stops at \"Use of \\@citex doesn't match its definition\" (in \\@uclcnotmath), then \"Argument of \\@sect has an extra }\" and \"Paragraph ended before \\@sect was complete\", at \\end{document}, where fn.endnotes prints them (\\AtEndDocument{\\theendnotes})", evidence: [{ kind: 'compile', cell: "class-examples: Latex Related Research/Latex-Template-Examples/_results/class.emulateapj.log (2026-11-06), fn.endnotes: \"! Use of \\@citex doesn't match its definition.\" in \\@uclcnotmath, then \"! Argument of \\@sect has an extra }.\" and \"! Paragraph ended before \\@sect was complete.\", all at l.288 \\end{document}" }, { kind: 'source', file: 'Latex-Lib/nodes/footnoteAnchor.footnoteAnchor/fn.endnotes/handler.ts', line: '18' }] },
    ],
    policy: [],
    // Not env:abstract (2026-11-07): revtex4 keeps the abstract in \\absbox for \\maketitle, which the first \\section runs
    // (l.655-662), so an abstract written before it, as abs.front-held writes it, typesets (ZeroTeX-NG, with \\affil and
    // \\altaffiltext); the abstract ways that write it after \\maketitle stay refused by their own denies of class.aastex.
    names: [],
  },
  // emulateapj.cls l.334-335: \textwidth 7.1in (513.11743pt, as aastex701), \columnsep 0.3125in; two columns, 10pt (l.165).
  layout: { columns: 2, textwidth: "513.11743pt", fontsize: "10pt" },
  vocabulary: {
    "\\affiliation": "an author's affiliation (renewed, emulateapj.cls l.455; \\affil is the same, l.460)",
    "\\altaffilmark": "an affiliation mark (l.465)",
    "\\shorttitle": "the running title (l.370)",
    "\\shortauthors": "the running authors (l.371)",
  },
  evidence: [
    { kind: 'source', file: EAPJ, line: '150-166' },
    { kind: 'source', file: EAPJ, line: '184-195' },
    { kind: 'source', file: EAPJ, line: '189-192, 206' },
    { kind: 'source', file: EAPJ, line: '334-335' },
    { kind: 'source', file: RTX4, line: '4254, 5480, 6050' },
    { kind: 'source', file: RTX4, line: '5154-5159' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/emulateapj.json', line: '1' },
  ],
});
