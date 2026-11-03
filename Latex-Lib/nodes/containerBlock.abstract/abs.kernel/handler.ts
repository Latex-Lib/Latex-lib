/**
 * abs.kernel: the class's \begin{abstract} … \end{abstract}; \abstractname
 * renamed, the first-line indent dropped.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody, STORED_ABSTRACT_RELEASE } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // At \begin{document}, after babel's or polyglossia's own hook, which sets \abstractname again from the language's captions there
    // (a template that loads one with a language). elsarticle prints its own heading, \@elsarticleabstitle, which its
    // \abstracttitle sets (elsarticle.cls l.671-676), so there the name goes through that too (b22, JR1-3). Under amsart,
    // elsarticle, acmart and cas the abstract the class keeps for \maketitle is printed where it stands (STORED_ABSTRACT_RELEASE).
    preamble: () => ({
      declarations: [
        ...(param(p, 'name') === '' ? [] : [`\\AtBeginDocument{\\renewcommand{\\abstractname}{${param(p, 'name')}}}`, `\\makeatletter\\@ifclassloaded{elsarticle}{\\abstracttitle{${param(p, 'name')}}}{}\\makeatother`]),
        STORED_ABSTRACT_RELEASE,
      ],
    }),
    emit: (node, content) => `\\begin{abstract}\n${p['noindent'] === true ? `\\setlength{\\parindent}{0pt}\\noindent ${content.trim()}` : abstractBody(node, content)}\n\\end{abstract}\n\n`,
  };
};

export default realize;
