/**
 * thm.ntheorem: the style settings, then `\newtheorem`, as one preamble entry
 * per kind, since ntheorem applies the settings in force to each
 * `\newtheorem` that follows.
 *
 * The plain style is printed as `LatexLibPlain` (b25 MB-1), declared once with
 * ntheorem's own `\newtheoremstyle`: its head without a note is ntheorem's
 * plain head token for token; with a note, the head is `##1\ ##2` in the
 * `\item` label and the note, `(##3)` and the separator follow in the head
 * font as text of the paragraph, with the same spaces (`\ ` before the note,
 * `\labelsep` after the separator). ntheorem's plain puts the note inside the
 * label, one box TeX cannot break (ntheorem.sty l.523-534), so a long note ran
 * past the line: 907 not-denied verdicts of run r4-d5cf4a6, 400pt to 1,830pt.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, text, withinArgument } from '../statement.ts';
import key from './key.ts';

/** ntheorem's plain style with a note that wraps (MB-1): the head without a note is plain's own; idempotent. */
export const PLAIN_WRAPPING_NOTE = String.raw`\makeatletter\@ifundefined{th@LatexLibPlain}{\newtheoremstyle{LatexLibPlain}{\item[\hskip\labelsep \theorem@headerfont ##1\ ##2\theorem@separator]}{\item[\hskip\labelsep \theorem@headerfont ##1\ ##2]\hskip-\labelsep\ {\theorem@headerfont(##3)\theorem@separator}\hskip\labelsep}}{}\makeatother`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const numbering = numberingOf(params);
  const style = text(params, 'style', 'plain');
  const wraps = style === 'plain';
  const settings = [
    `\\theoremstyle{${wraps ? 'LatexLibPlain' : style}}`,
    `\\theoremheaderfont{${text(params, 'headFont', '\\normalfont\\bfseries')}}`,
    `\\theorembodyfont{${text(params, 'bodyFont', '\\itshape')}}`,
    `\\theoremseparator{${text(params, 'separator', '')}}`,
    `\\theoremsymbol{${text(params, 'symbol', '')}}`,
  ].join('');
  return {
    preamble: (_p, _parent, node) => {
      const packages = ['\\usepackage[amsmath,thmmarks]{ntheorem}'];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: [
          ...(wraps ? [PLAIN_WRAPPING_NOTE] : []),
          ...declarations(elementOf(node), numbering, (env, element, counter) =>
            [settings, 'shared' in counter ? `\\newtheorem{${env}}[${counter.shared}]{${displayName(element)}}` : `\\newtheorem{${env}}{${displayName(element)}}${withinArgument(counter.within)}`].join('\n'),
          ),
        ],
      };
    },
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note),
  };
};

export default realize;
