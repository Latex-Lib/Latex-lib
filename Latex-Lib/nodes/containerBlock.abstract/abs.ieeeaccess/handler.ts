/**
 * abs.ieeeaccess (containerBlock/abstract). IEEE Access's boxed abstract: the class's own \begin{abstract} … \end{abstract}, which
 * ieeeaccess.cls renews to fill box 99 (\global\setbox99=\hbox{bullet, minipage at \abstractwidth, the blue ABSTRACT heading},
 * l.615-625) and prints only from \@maketitle (\noindent\box99, l.763), under the authors and above the INDEX TERMS. The title way
 * front.ieeeaccess holds \maketitle until this environment has ended (its \AddToHook{env/abstract/after}{\LatexLibAccessTitle}),
 * so the box is full when \maketitle sets the title block; an abstract written before the title stays in its box until the
 * title's own trigger (the first \section, or \end{document}) runs \maketitle.
 * In a document with no title (no front.ieeeaccess, so no \LatexLibAccessTitle) nothing ever runs \maketitle and the box was
 * lost (GitHub run batch 4 round 1, ieeeaccess.A: 236 of 436 not-denied branches sentinel:missing, the
 * passes being branches whose leaves hold no sentinel, e.g. document dd6a404093575f749c15f, result 4a77176d33). There the box is printed where the node stands,
 * at the column's width (\abstractwidth, the class's \titlewidth less the bullet, set to the line less the bullet and its
 * 1.5mm in a group around the environment), so a two-column page takes it (measured on ZeroTeX-NG, 2026-11-09, ieeeaccess.A
 * with no title: both abstracts' sentinels in the left column, no overfull box; at the title width they were 194.6pt over).
 * CTAN: https://ctan.org/pkg/ieeetran (the class itself is IEEE's, not on CTAN)
 */
import type { Realization } from '../../../schema/realization.ts';
import { abstractBody } from '../node.ts';

/** With no title way (\LatexLibAccessTitle undefined), the class's box 99 at the line's width, printed in place. */
const ACCESS_ABSTRACT_HERE = String.raw`\providecommand\LatexLibAccessAbstractOpen{\ifdefined\LatexLibAccessTitle\else\begingroup\abstractwidth=\dimexpr\linewidth-0.5em-1.5mm\relax\fi}\providecommand\LatexLibAccessAbstractClose{\ifdefined\LatexLibAccessTitle\else\par\noindent\box99\par\endgroup\fi}`;

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // The class renews the environment itself, and front.ieeeaccess declares the hooks that run the held \maketitle
  // (\LatexLibAccessTitle, which this way requires); the preamble only gives the title-less print (ACCESS_ABSTRACT_HERE). No
  // STORED_ABSTRACT_RELEASE: ieeeaccess is not one of the classes it sets in place, and here the class's box is the point.
  preamble: () => ({ declarations: [ACCESS_ABSTRACT_HERE] }),
  // The body goes into the class's minipage, so a list or table first is started with \noindent as everywhere (abstractBody).
  // With a title way, nothing after \end{abstract}: its env/abstract/after hook runs \maketitle there, once.
  emit: (node, content) => `\\LatexLibAccessAbstractOpen\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}\\LatexLibAccessAbstractClose\n\n`,
});

export default realize;
