/**
 * fig.margin: Tufte's margin figure, \begin{marginfigure}[offset] \includegraphics[width=\linewidth]{…} \caption{…}
 * \label{…} \end{marginfigure}. The classes' environment (tufte-common.def; xtufte-common.def l.1027-1050, the same code)
 * sets its body in a \marginparwidth minipage that \marginpar puts in the margin, the caption a figure's (\@captype figure)
 * in the class's caption font; its optional argument moves the box (default -1.2ex). The image fills the margin column
 * (\linewidth there), as the samples print it (0825-tufte-essay main.tex l.46-58, xtufte sample-book.tex l.605-610).
 * The offset is closed with `%`: the environment starts \noindent in the minipage, so the line end after an explicit
 * `[offset]` (which LaTeX's optional-argument scan does not skip, as it does with no argument) was set as a space before the
 * \linewidth image: "Overfull \hbox (2.832pt too wide)" under tufte-handout and tufte-book, with [-1.2ex] as with
 * [1\baselineskip], and none with `%` (ZeroTeX-NG, this builder's cases, 2026-11-07).
 * CTAN: https://ctan.org/pkg/tufte-latex
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { captionLines, pathOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const offset = param(p, 'offset');
  return {
    // marginfigure is a \marginpar (above), which runs the output routine without shipping a page: the limit is raised as
    // note.marginpar and note.class-margin raise it (batch 4 round 2: tufte-handout.A's margin notes stopped at "Output
    // loop---100 consecutive dead cycles"; the same mechanism, no failing cell of this way's own). Only raised, never lowered.
    preamble: () => ({ packages: ['\\usepackage{graphicx}'], declarations: ['\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi'] }),
    emit: (node, _content, context) => {
      if (pathOf(node) === '') return '';
      return `\\begin{marginfigure}${offset === '' ? '' : `[${offset}]%`}\n\\includegraphics[width=\\linewidth]{${pathOf(node)}}${captionLines(node, context)}\n\\end{marginfigure}\n\n`;
    },
  };
};

export default realize;
