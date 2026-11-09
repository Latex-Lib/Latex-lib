/**
 * doc.minimal-provide (doc). What the kernel's minimal class leaves out, supplied in the preamble: the type sizes, \today, a
 * titlepage environment, list spacing and footnote spacing. minimal.cls sets \normalsize, a 6.5in by 8in text block, arabic
 * page numbers and the empty page style, and nothing else (Source/0577-latex-base-dev/minimal.cls l.33-42).
 * CTAN: https://ctan.org/pkg/latex-base
 *
 * The lines are the class.minimal example's (Latex-Template-Examples/class.minimal/main.tex l.40-68), one declaration per
 * group, each in its own \makeatletter group where it names an @ command. \LARGE and \huge are added at article's 10pt sizes
 * (size10.clo), which the example lacks: a title or heading way that sets \LARGE or \huge would otherwise stop at an undefined
 * control sequence. Every size is a \providecommand, so nothing the class or a package defines is replaced.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import key from './key.ts';

const SIZES = [
  '\\providecommand{\\tiny}{\\fontsize{5}{6}\\selectfont}',
  '\\providecommand{\\scriptsize}{\\fontsize{7}{8}\\selectfont}',
  '\\providecommand{\\footnotesize}{\\fontsize{8}{9.5}\\selectfont}',
  '\\providecommand{\\small}{\\fontsize{9}{11}\\selectfont}',
  '\\providecommand{\\large}{\\fontsize{12}{14}\\selectfont}',
  '\\providecommand{\\Large}{\\fontsize{14.4}{18}\\selectfont}',
  '\\providecommand{\\LARGE}{\\fontsize{17.28}{22}\\selectfont}',
  '\\providecommand{\\huge}{\\fontsize{20.74}{25}\\selectfont}',
  '\\providecommand{\\Huge}{\\fontsize{24.88}{30}\\selectfont}',
].join('\n');

// The kernel defines \today already (latex.ltx); the example provides it all the same, so a \providecommand changes nothing.
const TODAY =
  '\\providecommand{\\today}{\\ifcase\\month\\or January\\or February\\or March\\or April\\or May\\or June\\or July\\or August\\or September\\or October\\or November\\or December\\fi\\space\\number\\day, \\number\\year}';

const TITLEPAGE = '\\makeatletter\n\\@ifundefined{titlepage}{\\newenvironment{titlepage}{\\clearpage\\thispagestyle{empty}}{\\clearpage}}{}\n\\makeatother';

const LISTS = [
  '\\makeatletter',
  '\\setlength{\\leftmargini}{2.5em}',
  '\\setlength{\\leftmarginii}{2.2em}',
  '\\setlength{\\labelsep}{0.5em}',
  '\\setlength{\\labelwidth}{\\leftmargini}\\addtolength{\\labelwidth}{-\\labelsep}',
  '\\def\\@listi{\\leftmargin\\leftmargini \\topsep 6pt \\parsep 3pt \\itemsep 3pt}',
  '\\let\\@listI\\@listi',
  '\\def\\@listii{\\leftmargin\\leftmarginii \\topsep 3pt \\parsep 2pt \\itemsep 2pt}',
  '\\providecommand{\\labelitemi}{\\textbullet}',
  '\\providecommand{\\labelitemii}{\\normalfont\\bfseries --}',
  '\\providecommand{\\labelenumi}{\\theenumi.}',
  '\\makeatother',
].join('\n');

// The footnote spacing is the example's; the footnote text's layout, \@makefntext, is article's (article.cls), given only where
// nothing defined it: the kernel leaves it to the class, minimal defines none, and the example gets one from footmisc (main.tex
// l.85). Without it every \footnote stops at "Undefined control sequence" in \@footnotetext (probe under minimal, ZeroTeX-NG,
// 2026-11-07). A footnote package loaded after it (footmisc) redefines it as before.
const FOOTNOTES = [
  '\\setlength{\\footnotesep}{6.65pt}',
  '\\setlength{\\skip\\footins}{9pt plus 4pt minus 2pt}',
  '\\makeatletter',
  '\\@ifundefined{@makefntext}{\\long\\def\\@makefntext#1{\\parindent 1em\\noindent\\hb@xt@1.8em{\\hss\\@makefnmark}#1}}{}',
  '\\makeatother',
].join('\n');

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = [
    ...(p['sizes'] === true ? [SIZES] : []),
    ...(p['today'] === true ? [TODAY] : []),
    ...(p['titlepage'] === true ? [TITLEPAGE] : []),
    ...(p['lists'] === true ? [LISTS] : []),
    ...(p['footnotes'] === true ? [FOOTNOTES] : []),
  ];
  return {
    preamble: () => (declarations.length > 0 ? { declarations } : {}),
    // A document-level way prints nothing in the body.
    emit: () => '',
  };
};

export default realize;
