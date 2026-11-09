/**
 * ack.kernel: the acknowledgements as a heading, \section*, \chapter*,
 * \subsection*, \subsubsection* or \paragraph(*) with its title, entered in
 * the contents by \addcontentsline when asked (a starred heading only: an
 * unstarred one enters it itself, by secnumdepth and tocdepth), then the text.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field, labelLine, param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const level = param(p, 'level', 'section');
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      // The node's own title is plain text (escaped, as General's is); the preset's is LaTeX.
      const title = field(node, 'title') === '' ? param(p, 'title', 'Acknowledgements') : escapeText(field(node, 'title'));
      const starred = p['starred'] !== false;
      const toc = p['inContents'] === true && starred ? `\n\\addcontentsline{toc}{${level}}{${title}}` : '';
      return `\\${level}${starred ? '*' : ''}{${title}}${toc}${labelLine(field(node, 'label'))}\n${content.trim()}\n\n`;
    },
  };
};

export default realize;
