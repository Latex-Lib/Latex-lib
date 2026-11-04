/**
 * head.fncychap: \usepackage[<style>]{fncychap}, then the manual's
 * customisation commands (\ChNameVar, \ChNumVar, \ChTitleVar, \ChRuleWidth,
 * \ChNameUpperCase … \ChTitleAsIs) when a preset sets them. Only chapters
 * change; every heading prints with the kernel command. A style's own fonts in
 * NFSS (`STYLE_FONTS`). Bjornstrup's starred head across both columns under
 * two columns (`SCHAPTER_ACROSS`), and as wide as its line (`DOTIS_LINE`).
 * CTAN: https://ctan.org/pkg/fncychap (section 2.1)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { headingCommand, levelOf, numberingLines } from '../node.ts';
import key from './key.ts';

const CASE: { readonly [c: string]: string } = { upper: 'UpperCase', lower: 'LowerCase', asis: 'AsIs' };

/**
 * Bjornstrup's chapter head is boxes \textwidth wide (\DOTIS, fncychap.sty 2007/07/30 v1.34 l.411-418). fncychap's \@schapter
 * sets a \chapter* head in the column under two columns (l.690-696, "To avoid problem with scrbook.cls"; the kernel's form,
 * with \@topnewpage, is commented out at l.682-686), so every starred head there, biblatex's and thebibliography's included,
 * came out \textwidth-\columnwidth too wide: 239.5pt in memoir.B, book.B and report.B (37 documents, 489 fit branches in
 * index5; memoir.B d94dc095301da01f8d350 result 79b96d6050 l.1167, at \printbibliography; book.B de570e92e1c6ce59c7b36 at the
 * .bbl's line 1). Under two columns the head goes across the page with \@topnewpage, as the kernel's form and memoir's
 * (memoir.dtx l.10061-10074) do, calling the definition in force; one column calls it as before. Not under KOMA-Script,
 * which fncychap's own form is for.
 */
const SCHAPTER_ACROSS = String.raw`\makeatletter\ifdefined\KOMAClassName\else\ifdefined\LatexLibSchapter\else\let\LatexLibSchapter\@schapter\def\@schapter#1{\if@twocolumn\@topnewpage[\LatexLibSchapter{#1}]\else\LatexLibSchapter{#1}\fi}\fi\fi\makeatother`;

/**
 * Bjornstrup's starred head (\DOTIS, fncychap.sty v1.34 l.428-435) as wide as the line it is set in: its grey bar \parbox[b]{\linewidth}
 * and its title box \linewidth less twice \myhi, where the package gives \textwidth and \mylen (\textwidth less twice \myhi,
 * fixed at load, l.408-409). Under KOMA-Script (b23), which `SCHAPTER_ACROSS` leaves alone, a starred head still came out in the
 * column: GitHub run r2-461ed0e, 40 scrbook.B and scrreprt.B cells, each with two "Overfull \hbox (214.12778pt too wide)" boxes
 * on one line of the host's \printbibliography (scrbook.B d9adfc6a5d685cc316db5 result 9c1cda9c9b l.117, `[][][][][][][]`),
 * which names no branch's line, so all 466 not-denied branches of those cells failed. Across the page (\@topnewpage, \twocolumn)
 * and in one column \linewidth is \textwidth there, so those heads print as before; numbered heads (\DOCH, \DOTI) are untouched.
 */
const DOTIS_LINE = String.raw`\makeatletter\renewcommand{\DOTIS}[1]{\fboxsep=0pt \colorbox[gray]{.85}{\rule{0pt}{40pt}\parbox[b]{\linewidth}{\hfill}}\\\nointerlineskip\raggedright\fboxsep=\myhi \setlength{\mylen}{\linewidth}\addtolength{\mylen}{-2\myhi}\colorbox[gray]{.85}{\parbox[t]{\mylen}{\CTV\FmTi{#1}}}\par\nobreak\vskip 40\p@}\makeatother`;

/**
 * Each style's own \ChNameVar and \ChTitleVar written in NFSS. fncychap.sty v1.34 gives them as LaTeX 2.09 font commands (Sonny
 * l.173/175 \Large\sf; Lenny l.203 and PetersLenny l.274 \Huge\bfseries\rm; Glenn l.425/427; Conny l.486/488
 * \centering\Huge\rm\bfseries and \centering\Huge\rm; Rejne l.545/547; Bjarne l.587/589; ConnyRevised l.516/518, not offered),
 * which KOMA-Script refuses ("Class scrreprt Error: undefined old font command `\rm'", copy scrreprt.A run 853911b226 l.80 and
 * l.92, Conny; 19 documents, 100 fit branches in index5) as memoir does. The kernel's \rm is \normalfont\rmfamily and \sf
 * \normalfont\sffamily in text, so these are the same fonts (\bfseries\rm sets no bold: \normalfont resets the series).
 * Bjornstrup's are NFSS already.
 */
const STYLE_FONTS: { readonly [style: string]: { readonly name?: string; readonly title?: string } } = {
  Sonny: { name: '\\Large\\normalfont\\sffamily', title: '\\Large\\normalfont\\sffamily' },
  Lenny: { title: '\\Huge\\normalfont\\rmfamily' },
  PetersLenny: { title: '\\Huge\\normalfont\\rmfamily' },
  Glenn: { name: '\\Large\\normalfont\\sffamily', title: '\\Large\\normalfont\\rmfamily' },
  Conny: { name: '\\centering\\Huge\\normalfont\\rmfamily\\bfseries', title: '\\centering\\Huge\\normalfont\\rmfamily' },
  Rejne: { name: '\\centering\\Large\\normalfont\\rmfamily', title: '\\centering\\Huge\\normalfont\\rmfamily' },
  Bjarne: { name: '\\raggedleft\\normalsize\\normalfont\\rmfamily', title: '\\raggedleft\\Large\\normalfont\\rmfamily' },
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const style = param(p, 'style', 'Sonny');
  const fonts = STYLE_FONTS[style] ?? {};
  const packages = [`\\usepackage[${style}]{fncychap}`];
  const custom = [
    ...(param(p, 'nameFont') !== '' ? [`\\ChNameVar{${param(p, 'nameFont')}}`] : fonts.name === undefined ? [] : [`\\ChNameVar{${fonts.name}}`]),
    ...(param(p, 'numberFont') === '' ? [] : [`\\ChNumVar{${param(p, 'numberFont')}}`]),
    ...(param(p, 'titleFont') !== '' ? [`\\ChTitleVar{${param(p, 'titleFont')}}`] : fonts.title === undefined ? [] : [`\\ChTitleVar{${fonts.title}}`]),
    ...(param(p, 'ruleWidth') === '' ? [] : [`\\ChRuleWidth{${param(p, 'ruleWidth')}}`]),
    ...(CASE[param(p, 'nameCase', 'style')] === undefined ? [] : [`\\ChName${CASE[param(p, 'nameCase')]}`]),
    // The manual names \ChNameAsIs for the title's default case too; \ChTitleAsIs is what the package defines.
    ...(CASE[param(p, 'titleCase', 'style')] === undefined ? [] : [`\\ChTitle${CASE[param(p, 'titleCase')]}`]),
    ...(style === 'Bjornstrup' ? [SCHAPTER_ACROSS, DOTIS_LINE] : []),
  ];
  return {
    preamble: (_params, _parentType, node) => {
      const declarations = node === undefined ? custom : [...numberingLines(p, levelOf(node)), ...custom];
      return declarations.length === 0 ? { packages } : { packages, declarations };
    },
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
