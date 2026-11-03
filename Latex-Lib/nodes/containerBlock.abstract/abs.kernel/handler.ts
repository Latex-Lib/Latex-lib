/**
 * abs.kernel: the class's \begin{abstract} … \end{abstract}; \abstractname
 * renamed, the first-line indent dropped.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // At \begin{document}, after babel's or polyglossia's own hook, which sets \abstractname again from the language's captions there
    // (a template that loads one with a language); acmart and revtex print the stored abstract later, at \maketitle.
    preamble: () => (param(p, 'name') === '' ? {} : { declarations: [`\\AtBeginDocument{\\renewcommand{\\abstractname}{${param(p, 'name')}}}`] }),
    emit: (node, content) => `\\begin{abstract}\n${p['noindent'] === true ? `\\setlength{\\parindent}{0pt}\\noindent ${content.trim()}` : abstractBody(node, content)}\n\\end{abstract}\n\n`,
  };
};

export default realize;
