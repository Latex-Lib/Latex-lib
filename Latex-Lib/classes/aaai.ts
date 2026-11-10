import { defineClass } from '../schema/class.ts';

/**
 * AAAI-27's style (class setting aaai): article with letterpaper and `\usepackage{aaai2027}` ('2027/10/21 AAAI 2027 Submission
 * format', AuthorKit27.zip), after the setting's line that makes iftex's \RequirePDFTeX do nothing (the style stops under XeTeX
 * by design, l.58-59). Not measured by the class probe: every field is read from the pinned aaai2027.sty (b2p, batch 2).
 * Preloads (l.58-75, 411): iftex, fontenc with T1, newtxtext (under XeTeX it loads fontspec and TeX Gyre Termes X), helvet,
 * courier, placeins and xcolor (no option: tbl.colortbl's xcolor[table] meets "Option clash").
 * At \begin{document} it raises a PackageError for each of 17 packages it forbids (l.434-501). Those with package facts are
 * refused here: hyperref (so are General's references and links, which load it: `refuses`), geometry, setspace, titlesec,
 * wrapfig and authblk (its facts came with front.authblk, 2026-11-07; refused after batch 4 round 2). The other eleven (bbm,
 * balance, CJK, flushend, fullpage, navigator, savetrees, stfloats, tabu, tocbibind, ulem) have no facts and no library way
 * loads them; but Flouest's General loads ulem for underline and strike marks, which the profile cannot refuse (notes for the
 * CI session, b2p G5).
 * With natbib loaded it calls \bibliographystyle{aaai2027} at \begin{document} (l.425-433): a way that loads natbib and writes
 * its own \bibliographystyle (bib.natbib) gives main.aux a second \bibstyle, which BibTeX rejects, so bib.natbib's key denies
 * class.aaai (CA11). Without natbib (bib.bibtex-bst, bib.cite-pkg) the style writes none.
 * Two columns by \twocolumn (l.85), not a class option; text block 7.0in by 9.0in (l.80-81); no heading numbers (secnumdepth 0,
 * l.238); \subsubsection steps the subparagraph counter (l.236). \addcontentsline does nothing (l.92).
 */
export default defineClass({
  id: 'class.aaai',
  name: "article",
  base: 'class.article',
  targetEngine: "untested",
  preloads: [{"pkg": "iftex"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "newtxtext"}, {"pkg": "helvet"}, {"pkg": "courier"}, {"pkg": "placeins"}, {"pkg": "xcolor"}],
  defines: ["counter:part", "counter:section", "counter:subsection", "counter:subsubsection", "counter:paragraph", "counter:subparagraph", "env:abstract", "env:figure", "env:table", "env:thebibliography", "cmd:\\maketitle", "cmd:\\tableofcontents", "cmd:\\appendix", "env:links", "cmd:\\affiliations", "cmd:\\copyrighttext", "cmd:\\copyrightyear"],
  options: {},
  forbids: {
    technical: [
      { pkg: "hyperref", reason: "aaai2027.sty raises 'You must not use hyperref in AAAI papers' (a PackageError) at \\begin{document} when hyperref is loaded", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '434-437' }] },
      { pkg: "geometry", reason: "aaai2027.sty raises 'Package geometry is forbidden' (a PackageError) at \\begin{document} when geometry is loaded", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '462-465' }] },
      { pkg: "setspace", reason: "aaai2027.sty raises 'Package setspace is forbidden' (a PackageError) at \\begin{document} when setspace is loaded", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '474-477' }] },
      { pkg: "titlesec", reason: "aaai2027.sty raises 'Package titlesec is forbidden' (a PackageError) at \\begin{document} when titlesec is loaded", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '486-489' }] },
      { pkg: "wrapfig", reason: "aaai2027.sty raises 'Package wrapfig is forbidden' (a PackageError) at \\begin{document} when wrapfig is loaded", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '498-501' }] },
      { pkg: "authblk", reason: "aaai2027.sty raises 'Package authblk is forbidden' (a PackageError) at \\begin{document} when authblk is loaded (front.authblk, the only way that loads it, takes `only` article and so fitted aaai)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '442-445' }, { kind: 'compile', cell: 'batch 4 round 2, aaai.A: front.authblk 0 of 17 branches pass, each at "Package aaai Error: Package authblk is forbidden." (document da9844b051d0c34de6c5a, result 67ffe595e9, l.40 \\begin{document})' }] },
    ],
    policy: [],
  },
  layout: { columns: 2, textwidth: "505.88998pt", fontsize: "10pt" },
  vocabulary: {"\\affiliations": "affiliations"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '58-59 (\\RequirePDFTeX), 64 (fontenc T1), 69 (newtxtext), 71 (helvet), 73 (courier), 75 (placeins), 411 (xcolor)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '80-81 (\\textheight 9.0in, \\textwidth 7.0in, \\columnsep 0.375in), 85 (\\twocolumn), 92 (\\addcontentsline does nothing), 132 (\\affiliations), 212 (abstract), 223 (links), 234-238 (headings, secnumdepth 0)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/aaai2027.sty (2027/10/21)', line: '425-433 (with natbib: \\cite as \\citep, \\bibliographystyle{aaai2027}), 434-501 (17 forbidden packages)' },
  ],
});
