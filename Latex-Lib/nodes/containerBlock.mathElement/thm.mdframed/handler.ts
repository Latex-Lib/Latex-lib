/**
 * thm.mdframed: `\newmdtheoremenv[options]{env}[shared]{Name}[within]` per kind,
 * the same arguments as `\newtheorem` after mdframed's options.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { declarations, displayName, elementOf, environmentOf, numberingOf, statementIn, text, withinArgument } from '../statement.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const numbering = numberingOf(params);
  const extra = text(params, 'extra', '');
  const options = [
    `linecolor=${text(params, 'linecolor', 'black')}`,
    `backgroundcolor=${text(params, 'backgroundcolor', 'white')}`,
    `linewidth=${text(params, 'linewidth', '0.4pt')}`,
    ...(params['leftLineOnly'] === true ? ['topline=false', 'rightline=false', 'bottomline=false'] : []),
    // One-side frames. Under a twoside class mdframed writes a zref label before every frame to learn its page's parity and
    // swap the inner and outer margins on even pages (mdframed.sty l.877-914, `usetwoside` true by default, l.297); this
    // way's margins are 0pt on both sides (l.195-196, l.203-204; no preset sets innermargin, outermargin, leftmargin or
    // rightmargin), so the swap moves nothing. In memoir.B and scrbook.B that label was undefined on the settled build in 21
    // not-denied @framed branches of GitHub run 41584963423 ("Reference `mdf@pagelabel-1' on page 3 undefined"; book.B passes
    // the same documents): in 19 the frame and its sentinel never shipped either, a loss this does not touch (memoir.B
    // d0e00c1c7382c4790e3d5 result 83f8019526), and in 2 the frame shipped and only the label was lost (memoir.B
    // d948efa5e8fb1cc136c95 result eb5ddb31a3 l.98, page 3). With `usetwoside=false` mdframed writes and reads no label
    // (l.912-914) and draws the frame as before. [b22 F47]
    'usetwoside=false',
    ...(extra === '' ? [] : [extra]),
  ].join(',');
  return {
    preamble: (_p, _parent, node) => {
      // Its colours are xcolor expressions (blue!60!black), which mdframed alone does not read.
      const packages = ['\\usepackage{xcolor}', '\\usepackage{mdframed}'];
      if (node === undefined) return { packages };
      return {
        packages,
        declarations: declarations(elementOf(node), numbering, (env, element, counter) =>
          'shared' in counter
            ? `\\newmdtheoremenv[${options}]{${env}}[${counter.shared}]{${displayName(element)}}`
            : `\\newmdtheoremenv[${options}]{${env}}{${displayName(element)}}${withinArgument(counter.within)}`,
        ),
      };
    },
    // Not list-based for a listed box: the frame passes General's enumitem list opening with a boxed statement (28 of 28, index5).
    emit: (node, content, note) => statementIn(environmentOf(elementOf(node), numbering.rename === 'yes'), node, content, note, false),
  };
};

export default realize;
