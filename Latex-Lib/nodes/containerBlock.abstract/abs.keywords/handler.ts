/**
 * abs.keywords (containerBlock/abstract). The class's abstract environment ending with a keywords line: the class's own
 * \keywords{…} (elegantpaper, whose \keywords prints \vskip 2ex\par\noindent{\bfseries Keywords: } and the list,
 * elegantpaper.cls l.254; elegantpaper-en.tex l.19-22), or a bold run-in label on a line of its own,
 * \par\noindent\textbf{Keywords:} … (report and ctexrep theses: Latex-Template-Examples/class.ctexrep/main.tex l.158-164), or the
 * whole line in italics, \par\noindent\emph{Keywords: …} (a report thesis: 0134-maehr-uzh-ma-thesis, ma-thesis.tex l.212).
 * CTAN: https://ctan.org/pkg/latex-base, https://ctan.org/pkg/elegantpaper
 *
 * The keywords are the paper's, not the abstract's: they live in the title's templateSpecific.keywords, which an abstract way
 * cannot read (its handler is given the abstract node only). The title way hands them over in a macro, \LatexLibKeywords, which
 * it sets with \gdef (in the preamble, or in the body before the abstract), its items separated by \LatexLibKeywordSep; this way
 * provides both (\providecommand*: empty, and ', '), sets the separator from its `separator` parameter, and prints the line only
 * when \LatexLibKeywords is not empty, so a paper with no keywords prints no label. A title way that prints the keywords itself
 * (front.elegantpaper's env/abstract/end hook) leaves \LatexLibKeywords empty, so they are not printed twice.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody } from '../node.ts';
import key from './key.ts';

/**
 * Non-empty test with no @-name and no package: \detokenize of the macro's one-step expansion is empty only when it holds nothing
 * (a \gdef'd macro and a \providecommand* one alike; \ifx against \empty would fail on a \long one).
 */
const ifKeywords = (line: string): string => `\\if\\relax\\detokenize\\expandafter{\\LatexLibKeywords}\\relax\\else${line}\\fi`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'line');
  // The class's \keywords starts its own paragraph (\vskip 2ex\par\noindent, elegantpaper.cls l.254); the line form ends the text's.
  // The italic form sets the label and the list in one \emph, as 0134-maehr-uzh-ma-thesis writes it (ma-thesis.tex l.212).
  const label = param(p, 'label', 'Keywords:');
  const line =
    form === 'command'
      ? '\\keywords{\\LatexLibKeywords}'
      : form === 'italic'
        ? `\\par\\noindent\\emph{${label} \\LatexLibKeywords}`
        : `\\par\\noindent\\textbf{${label}} \\LatexLibKeywords`;
  return {
    preamble: () => ({
      declarations: ['\\providecommand*{\\LatexLibKeywords}{}', '\\providecommand*{\\LatexLibKeywordSep}{, }', `\\renewcommand*{\\LatexLibKeywordSep}{${param(p, 'separator', ', ')}}`],
    }),
    emit: (node, content) => `\\begin{abstract}\n${abstractBody(node, content)}\n${ifKeywords(line)}\n\\end{abstract}\n\n`,
  };
};

export default realize;
