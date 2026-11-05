import { defineClass } from '../schema/class.ts';
import ieeetran from './ieeetran.ts';

/**
 * IEEE Access: ieeeaccess.cls (ACCESS_latex_template_20260513, kept private in the overlay) on IEEEtran V1.8b, as the CI
 * session ships it: renamed ieeeaccess-latexlib.cls and patched for XeTeX (l.1-2: accessblue without spotcolor under XeTeX,
 * nothing else changed), so the setting's \documentclass and this profile's name are "ieeeaccess-latexlib". It loads
 * \LoadClass{IEEEtran} before its own options (l.4), so IEEEtran runs as a journal with no option. Not measured by the class
 * probe (batch 3, b3p/b3q): every field is read from testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls.
 * - Built as class.ieeetran with its own facts: `base` keeps class.ieeetran's key rules (sectsty's deny: sectsty accepts only
 *   article, report, book and KOMA, sectsty.sty l.278-295; the class-native theorem way's `only`), and IEEEtran's \appendices
 *   (\def, IEEEtran.cls l.5755, redefined at l.348) still refuses appendix.sty.
 * - Preloads with no option given (the setting gives none): ifpdf, xkeyval (l.6-7) and color (l.277). Under XeTeX accessblue
 *   is \definecolor{accessblue}{cmyk}{1,0.3,0,0.2} and spotcolor is not loaded (l.282-292; under pdfTeX the class still loads
 *   it), so spotcolor is no preload. ltxutil and ltxgrid load only under the editorial option (l.50-54), and hyperref
 *   [hidelinks=true,bookmarks=false] only under jtehm (l.804-811): neither is a preload here, so a way may load hyperref
 *   (the setting's description lists all three as loaded; the class's conditions say otherwise).
 * - It does NOT load graphicx, yet its page heads (\headerlogo, l.562-566, on every page), its abstract and keywords bullets
 *   (l.627, 641, 651) and \EOD (\includegraphics and \rotatebox, l.1001) need it; and \@maketitle prints \@doi (l.747),
 *   which only \doi (l.612) sets. At \end{document} it stops with "You have not used the command \EOD" unless \EOD ran
 *   (l.1085-1093). None of these is a profile fact: the setting has to give \usepackage{graphicx}, a \doi{...} and
 *   \eoddefinedtrue (b3q notes.md). The setting gives all three (CI probe 41980106583: 0 errors), so graphicx is listed
 *   in `preloads`, and a way that gives graphicx an option is seen as an option clash.
 * - \year#1 (l.521, \gdef\theyear{#1}) replaces TeX's \year primitive. pgfmath (tikz, tcolorbox, mdframed's tikz frames)
 *   seeds its random numbers from \year while it loads (pgfmathfunctions.random.code.tex l.33), so the seed \gdef's \theyear
 *   to the next token, and every page foot ("VOLUME \thevol, \theyear", l.534-588) then stops with 'Missing number' and
 *   'Extra \else' (probe b3q-2: 23 and 20 errors); \today breaks the same way. The setting gives the primitive back after the
 *   class (\cs_gset_eq:NN \year \tex_year:D, the kernel's copy; probe b3q-3: 0 errors).
 * - \@makecaption (l.374-404) puts \vss (infinite shrink) in the current list: the table branch always, the figure branch for
 *   a caption longer than a line. In a float's natural-size box that is harmless, but a caption outside a float (listings'
 *   caption= on a lstlisting) lands on the main vertical list, where the page builder stops with 'Infinite glue shrinkage
 *   found on current page' (probe b3q-3, natbib case: 4 errors). The setting loads etoolbox and \patchcmd's the four \vss
 *   into \par (each stood in vertical mode or ended the caption's paragraph): probe b3q-4, 0 errors, and the floats case's
 *   sentinel positions equal b3q-3's, so float captions keep their layout. etoolbox is therefore a preload.
 * - \section to \paragraph are \@startsection with \uppercase in the heading style (l.305-312): a \label, \ref or \cite key
 *   written inside a heading's text is uppercased (as icassp's spconf).
 * - Names it \def's: \year#1 (l.521, above), \doi#1 (l.612), \vol, \pubid, \headname (l.520-523), \history, \artnum, \title,
 *   \authorrefmark, \corresp, \tfootnote, \author, \address (l.610-619); keywords and IEEEkeywords (l.637-651); biography,
 *   IEEEbiography, biographynophoto and IEEEbiographynophoto (l.840-982); \EOD (l.1001). A way that \newcommand's \doi stops
 *   at "already defined". \titlefont is \def'd (l.205), so scrextend, which defines it again, is refused.
 * - Page: two columns (ExecuteOptions l.47: a4paper, 10pt, twocolumn, twoside, lineno, journal; a4paper is 203.2mm x 276.2mm,
 *   l.24-26), \textwidth 177.53mm = 505.12pt (l.266), \columnsep 6.95mm (l.264), 10pt.
 * - The abstract environment is \global\setbox99=\hbox{…minipage…} under a fixed ABSTRACT heading (l.608, l.625-634), which
 *   only \maketitle prints: a float or note in it is 'Float(s) lost' and a title-less document never prints it (GitHub run
 *   b29-6a43925: every not-denied 'Float(s) lost' and 'Not in outer par mode' cell held one). So abs.kernel and the
 *   class-native abstract are denied under it (their keys, b30 IEA-1), as under ecai and imsart; General's abstract and
 *   abs.abstract-pkg print in place.
 * - Margins: 36.31pt left (\oddsidemargin 12.76mm, l.269-272) and 36.73pt right, IEEEtran's 20pt \marginparwidth and 10pt
 *   \marginparsep (IEEEtran.cls l.1689-1690), so a note column has 16.31pt of room and keeps the class's 20pt, narrower than a
 *   note's bold title; \ttdefault is pcr in T1 (l.256, l.1099), which never hyphenates ('courierNew' 48pt). The five
 *   margin-note ways are denied under it (their keys, b30 IEA-2), as under asmeconf and cas-sc; General's margin note stays a
 *   class failure (MC3).
 */
export default defineClass({
  ...ieeetran,
  id: 'class.ieeeaccess',
  name: "ieeeaccess-latexlib",
  base: 'class.ieeetran',
  zerotex: "untested",
  preloads: [{"pkg": "ifpdf"}, {"pkg": "xkeyval"}, {"pkg": "color"}, {"pkg": "graphicx"}, {"pkg": "etoolbox"}],
  defines: [...ieeetran.defines, "env:keywords", "env:IEEEkeywords", "env:biography", "env:IEEEbiography", "env:biographynophoto", "env:IEEEbiographynophoto", "cmd:\\appendices", "cmd:\\year", "cmd:\\doi", "cmd:\\address", "cmd:\\corresp", "cmd:\\tfootnote", "cmd:\\history", "cmd:\\artnum", "cmd:\\authorrefmark", "cmd:\\vol", "cmd:\\pubid", "cmd:\\headname", "cmd:\\EOD"],
  forbids: {
    ...ieeetran.forbids,
    technical: [
      ...ieeetran.forbids.technical,
      { pkg: "scrextend", reason: "ieeeaccess-latexlib.cls defines \\titlefont (\\def, l.205), and scrextend's KOMA kernel defines it again while it loads: \"LaTeX Error: Command \\titlefont already defined\" (as achemso and spie)", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '205 (\\def\\titlefont)' }, { kind: 'compile', cell: 'b3p-1 probe G3-ieeeaccess-thebib main.log l.642 (unpatched ieeeaccess.cls, same \\titlefont line)' }] },
    ],
  },
  layout: { columns: 2, textwidth: "505.12pt", fontsize: "10pt" },
  vocabulary: {"\\address": "an affiliation, \\address[mark]{text}", "\\corresp": "the corresponding author line", "\\tfootnote": "the title footnote (funding)", "\\history": "the received/accepted dates", "\\doi": "the article's DOI (title page; \\maketitle needs it)", "\\authorrefmark": "an author's affiliation mark", "\\EOD": "the end-of-document mark (the class stops at \\end{document} without it)"},
  evidence: [
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls (ACCESS_latex_template_20260513, renamed and patched for XeTeX)', line: '1-2 (latexlib patch), 3 (\\ProvidesClass{ieeeaccess-latexlib}), 4 (\\LoadClass{IEEEtran}), 6-7 (ifpdf, xkeyval), 24-26 (a4paper), 47 (ExecuteOptions), 50-54 (ltxutil, ltxgrid only under editorial)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '205 (\\titlefont), 264-266 (\\columnsep 6.95mm, \\textwidth 177.53mm), 277-292 (color; spotcolor only when not XeTeX)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '305-312 (\\section... with \\uppercase), 324-370 (\\appendix, \\appendices)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '515-523 (\\headName, \\vol, \\year, \\pubid, \\headname), 562-566 (\\headerlogo: \\includegraphics in every page head), 610-619 (\\history, \\artnum, \\doi, \\title, \\author, \\address...), 625-660 (abstract, keywords, IEEEkeywords), 747 (\\@doi in \\@maketitle)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '804-811 (hyperref only under jtehm), 840-982 (biographies), 1001 (\\EOD), 1085-1093 (\\EOD check at \\end{document})' },
    { kind: 'compile', cell: 'CI probe b3fix/ieeeaccess-plain main.log l.317 (\\EOD error) and l.331 (\\includegraphics undefined in the page head); b3fix3/ieeeaccess-title-full: 0 errors, graphicx loaded (main.log l.198)' },
    { kind: 'source', file: 'testing-pipeline/settings/classes/files/ieeeaccess-latexlib.cls', line: '519-521 (\\theyear, \\year#1), 534-588 (\\theyear in every page foot), 374-404 (\\@makecaption with \\vss)' },
    { kind: 'compile', cell: 'probe b3q-2 b3q2-ieeeaccess-natbib main.log l.720 (Missing number, pgfmathfunctions.random.code.tex l.33); b3q-3 (\\year given back): floats 0 errors, natbib 4 (Infinite glue shrinkage, l.421 and l.425 \\end{lstlisting}); b3q-4 (\\@makecaption mended): both 0 errors' },
    ...ieeetran.evidence,
  ],
});
