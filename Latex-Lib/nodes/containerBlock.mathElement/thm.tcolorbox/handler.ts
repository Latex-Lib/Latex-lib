/**
 * thm.tcolorbox: `\newtcbtheorem` per kind (Flouest's `tcolorboxEnvironment`
 * and `tcolorboxLibraries` print the plain box, `Packages/tcolorbox.ts`).
 * The header note is the box's title. A label goes in the body, where it
 * takes the statement's number. Breaking is asked for where the box opens
 * (`\begin{theorem}[breakable]`), not in the declaration, so a statement in a
 * footnote (adapted unbreakable) and one in the body share one environment.
 * The box is as wide as the line it starts on: \linewidth less a paragraph \leftskip
 * (`add to width=-\leftskip`, last, so an `extra` width is narrowed too). [W1]
 * A box that holds a list-based statement first ends a list or statement label still pending where it opens
 * (`\LatexLibFlushLabel`), so the label stands on its own line above the box. [LP1]
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { bodyOf, declarations, displayName, elementOf, environmentOf, holdsStatement, labelLine, numberingOf, text } from '../statement.ts';
import key from './key.ts';

/**
 * tcolorbox collects its body before it leaves vertical mode: `before` (`\noindent`) runs when the box is drawn, after the body
 * (tcolorbox.sty 6.10.0 l.2154, 2171), and the body only clears \@newlist (l.1185; tcbbreakable.code.tex l.84). A box that opens
 * where a list item's or a statement's label is pending (first in an amsthm statement, whose head waits for the body's first
 * paragraph, amsthm.sty l.195-208) so collects its body with \if@inlabel still true and a minipage's \everypar, which never clears
 * it. A list-based statement inside then ends that label with \indent\par (amsthm.sty l.196), but its own trivlist has just set
 * \@newlist, so its \par does nothing (latex.ltx 2026-06-01 l.16109-16117) and every \par that \addvspace adds (l.9481-9482)
 * comes back until \par@deathcycles passes 1000: "Something's wrong--perhaps a missing \item" (run 41584963423: 894 of the 898
 * not-denied branches statement > thm.tcolorbox > statement, in 35 pairs; amsart.A dcd3ebe3e6eb6c7f890ce result edc8a2511a
 * l.441, a \begin{remark} in a \begin{corollary} first in a General definition). Under a list, an appendix, a footnote or at the
 * top, where no label is pending, the same box and statement pass. So a box that holds a statement ends the pending label
 * first, as General's statement does with \leavevmode before its own \begin{tcolorbox}: the label stands on its own line and
 * the box starts below it. \if@inlabel is false everywhere else, so nothing else moves; a box with no statement inside keeps
 * the label beside it (the unconditional guard is the owner's L-d1).
 */
const FLUSH_LABEL = String.raw`\makeatletter\providecommand*\LatexLibFlushLabel{\if@inlabel\leavevmode\fi}\makeatother`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const numbering = numberingOf(params);
  const breakable = params['breakable'] === true;
  const titleBack = text(params, 'colbacktitle', '');
  const extra = text(params, 'extra', '');
  const options = [
    `colback=${text(params, 'colback', 'blue!5')}`,
    `colframe=${text(params, 'colframe', 'blue!55!black')}`,
    `coltitle=${text(params, 'coltitle', 'white')}`,
    ...(titleBack === '' ? [] : [`colbacktitle=${titleBack}`]),
    `fonttitle=${text(params, 'fonttitle', '\\bfseries')}`,
    `boxrule=${text(params, 'boxrule', '0.8pt')}`,
    `arc=${text(params, 'arc', '4pt')}`,
    ...(params['sharp'] === true ? ['sharp corners'] : []),
    'enhanced',
    ...(extra === '' ? [] : [extra]),
    // KOMA-Script (3.22 on) indents a footnote's text with \leftskip 1.5em (scrkernel-footnotes.dtx l.335-349), so a box
    // \linewidth wide on such a line ran 13.5pt past it: 1,685 fit branches in scrartcl.A, scrreprt.A and scrartcl.B, each
    // below a footnote (scrartcl.A d01da35462b7f58c0fb58 result d24700ae2d75 l.1644, display ' [] ' after the glue).
    // tcolorbox freezes the width when the box opens (tcolorbox.sty 6.10.0 l.307), before it resets \leftskip inside. The
    // natural \leftskip is 0pt elsewhere (\centering adds only stretch, \@trivlist resets it), so nothing else moves. [W1]
    'add to width=-\\leftskip',
  ].join(',');
  return {
    preamble: (_p, _parent, node) => {
      const packages = ['\\usepackage{tcolorbox}'];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: [
          `\\tcbuselibrary{theorems,skins${breakable ? ',breakable' : ''}}`,
          FLUSH_LABEL,
          ...declarations(elementOf(node), numbering, (env, element, counter) => {
            const counting = 'shared' in counter ? `use counter from=${counter.shared}` : counter.within === 'none' ? 'auto counter' : `auto counter,number within=${counter.within}`;
            return `\\newtcbtheorem[${counting}]{${env}}{${displayName(element)}}{${options}}{${env}}`;
          }),
        ],
      };
    },
    emit: (node, content, note) => {
      const env = environmentOf(elementOf(node), numbering.rename === 'yes');
      return `${holdsStatement(content) ? '\\LatexLibFlushLabel\n' : ''}\\begin{${env}}${breakable ? '[breakable]' : ''}{${note ?? ''}}{}\n${labelLine(node)}${bodyOf(content)}\n\\end{${env}}\n\n`;
    },
  };
};

export default realize;
