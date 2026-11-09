/**
 * abs.ieeeaccess (containerBlock/abstract). IEEE Access's boxed abstract: the class's own \begin{abstract} … \end{abstract}, which
 * ieeeaccess.cls renews to fill box 99 (\global\setbox99=\hbox{bullet, minipage at \abstractwidth, the blue ABSTRACT heading},
 * l.615-625) and prints only from \@maketitle (\noindent\box99, l.763), under the authors and above the INDEX TERMS. The title way
 * front.ieeeaccess holds \maketitle until this environment has ended (its \AddToHook{env/abstract/after}{\LatexLibAccessTitle}),
 * so the box is full when \maketitle sets the title block; an abstract written before the title stays in its box until the
 * title's own trigger (the first \section, or \end{document}) runs \maketitle.
 * CTAN: https://ctan.org/pkg/ieeetran (the class itself is IEEE's, not on CTAN)
 */
import type { Realization } from '../../../schema/realization.ts';
import { abstractBody } from '../node.ts';

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // Nothing in the preamble: the class renews the environment itself, and front.ieeeaccess declares the hooks that run the held
  // \maketitle (\LatexLibAccessTitle, which this way requires). No STORED_ABSTRACT_RELEASE: ieeeaccess is not one of the classes
  // it sets in place, and here the class's box is the point.
  preamble: () => ({}),
  // The body goes into the class's minipage, so a list or table first is started with \noindent as everywhere (abstractBody).
  // Nothing after \end{abstract}: the title way's env/abstract/after hook runs \maketitle there, once.
  emit: (node, content) => `\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}\n\n`,
});

export default realize;
