/**
 * code.algorithmic: pseudo-code in the algorithms bundle's float, as the ICML and IJCAI templates write it:
 * \begin{algorithm}[tb] \caption{…} \label{…} \begin{algorithmic}[1] \STATE … \end{algorithmic} \end{algorithm}
 * (Source/0461-icml/example_paper.tex l.429-444, algorithmic without [1]; Source/0319-ijcai/ijcai26.tex l.568-586, with [1]).
 * Each line of the code is one \STATE, its text escaped as LaTeX text; a line given wholly as escaped LaTeX (code escapes)
 * prints as written, without \STATE, so algorithmic's structure commands (\FOR{…}, \ENDFOR, \IF{…}, \ELSE, \ENDIF, \WHILE{…},
 * \ENDWHILE, \REPEAT, \UNTIL{…}) pass through. The language is ignored: algorithmic has none.
 * The ICML template's \newcommand{\theHalgorithm}{\arabic{algorithm}} (example_paper.tex l.19) is not printed: hyperref
 * defines \theH<counter> as \arabic{<counter>} itself for a counter that has none, and algorithm is not reset within anything.
 * CTAN: https://ctan.org/pkg/algorithms
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { ESCAPE_AT, ESCAPE_CLOSE, ESCAPE_OPEN, escapeText, param } from '../../protocol.ts';
import { labelOf } from '../node.ts';
import key from './key.ts';

type Segment = { readonly escape: boolean; readonly text: string };

/** The code's lines, each a run of text and escapes; an escape holding a line break stays on the line it opens. */
const linesOf = (content: string): Segment[][] => {
  const lines: Segment[][] = [[]];
  const push = (s: Segment): void => {
    lines[lines.length - 1]?.push(s);
  };
  const text = (t: string): void => {
    t.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part !== '') push({ escape: false, text: part.replaceAll(ESCAPE_AT, '@') });
    });
  };
  let at = 0;
  for (;;) {
    const open = content.indexOf(ESCAPE_OPEN, at);
    if (open < 0) break;
    const close = content.indexOf(ESCAPE_CLOSE, open);
    if (close < 0) break;
    text(content.slice(at, open));
    push({ escape: true, text: content.slice(open + ESCAPE_OPEN.length, close).replaceAll(ESCAPE_AT, '@') });
    at = close + ESCAPE_CLOSE.length;
  }
  text(content.slice(at));
  return lines;
};

/** One code line: as written when it is only escaped LaTeX (and blanks), else \STATE and its text, escapes kept as LaTeX. */
const lineOf = (line: readonly Segment[]): string => {
  const own = line.filter((s) => s.escape || s.text.trim() !== '');
  if (own.length === 0) return '';
  if (own.every((s) => s.escape)) return own.map((s) => s.text.trim()).join(' ');
  return `\\STATE ${line.map((s) => (s.escape ? s.text : escapeText(s.text))).join('').trim()}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const placement = param(p, 'placement', 'tb');
  return {
    // icml2026.sty loads algorithm and algorithmic itself (l.121-122): loadPackages false relies on the class's.
    preamble: () => (p['loadPackages'] === false ? {} : { packages: ['\\usepackage{algorithm}', '\\usepackage{algorithmic}'] }),
    emit: (node, content, context) => {
      const caption = context !== undefined && context.trim() !== '' ? context.trim() : '';
      // The label only after a caption: without one, \label would take the counter of the section around the float.
      const label = labelOf(node);
      const head = caption === '' ? '' : `\n\\caption{${caption}}${label === '' ? '' : `\n\\label{${label}}`}`;
      const lines = linesOf(content).map(lineOf).filter((l) => l !== '');
      // algorithmic is a list: with no line at all it stops at "Something's wrong--perhaps a missing \item"; an empty \STATE is one.
      const body = lines.length === 0 ? ['\\STATE'] : lines;
      return `\\begin{algorithm}${placement === '' ? '' : `[${placement}]`}${head}\n\\begin{algorithmic}${p['lineNumbers'] === true ? '[1]' : ''}\n${body.join('\n')}\n\\end{algorithmic}\n\\end{algorithm}\n\n`;
    },
  };
};

export default realize;
