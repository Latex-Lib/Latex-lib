/**
 * front.titlepage-env: a title page laid out by hand in the kernel's
 * titlepage environment: the title in its font, the authors and the date
 * under it; rules round the title, space above it, \vfill to push the rest
 * to the foot; centred or flush left.
 * CTAN: https://ctan.org/pkg/latex-base (titlepage)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { peopleOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const { authors, date } = peopleOf(node);
      const rule = p['rules'] === true ? ['\\rule{\\linewidth}{0.4pt}\\par'] : [];
      const lines = [
        '\\begin{titlepage}',
        param(p, 'align', 'center') === 'left' ? '\\raggedright' : '\\centering',
        ...(param(p, 'topSpace') === '' ? [] : [`\\vspace*{${param(p, 'topSpace')}}`]),
        ...rule,
        `{${param(p, 'titleFont', '\\Huge\\bfseries')} ${content.trim()}\\par}`,
        ...rule,
        ...(p['spread'] === true ? ['\\vfill'] : ['\\vspace{2em}']),
        ...(authors.length === 0 ? [] : [`{${param(p, 'authorFont', '\\Large')} ${authors.join(' \\\\ ')}\\par}`]),
        ...(date === '' ? [] : ['\\vspace{1em}', `{${param(p, 'dateFont', '\\large')} ${date}\\par}`]),
        '\\end{titlepage}',
      ];
      return `${lines.join('\n')}\n\n`;
    },
  };
};

export default realize;
