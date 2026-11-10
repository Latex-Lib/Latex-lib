/**
 * abs.front-held (containerBlock/abstract). The class's abstract environment where the class keeps it for the title block:
 * between the title's declarations and the first heading, with no \maketitle before it. aastex701 and emulateapj (revtex4)
 * hold it in \absbox and print it from the \maketitle their first \section runs; revtex4-2 holds it the same way and the way
 * writes the \maketitle after it (front.revtex's maketitle 'after-abstract'); ecai holds it in \abstract@box for its
 * frontmatter environment's \maketitle, so there it is set at \begin{document}, before any \end{frontmatter}.
 * CTAN: https://ctan.org/pkg/aastex, https://ctan.org/pkg/emulateapj, https://ctan.org/pkg/revtex (ecai.cls: ECAI's template).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { abstractBody } from '../node.ts';
import key from './key.ts';

/**
 * What a held abstract after the title block's \maketitle prints: revtex4-2 undefines its abstract environment once \maketitle
 * has read the first (revtex4-2.cls l.2685), so the first abs.front-held abstract's \maketitle runs this once, and an
 * environment still undefined gets a plain one, its text set in place as a paragraph between small skips. Measured on
 * ZeroTeX-NG (2026-11-09, this machine's Flouest, compat cases): three such abstracts under revtex4-2-aip.A and revtex4-2-aps.A
 * gave 0 errors and shipped all three bodies (a \write-1 in each), against 2 "Environment abstract undefined" without it; one
 * abstract alone gave the same output as before (1,544 and 1,552 bytes of xdv).
 */
const HELD_ABSTRACT_LATER = String.raw`\makeatletter\def\LatexLibHeldAbstractLater{\@ifundefined{abstract}{\gdef\abstract{\par\medskip\noindent\ignorespaces}\gdef\endabstract{\par\medskip}}{}}\makeatother`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const atBegin = param(p, 'place', 'here') === 'begin-document';
  // revtex4-2's \maketitle reads the abstract it holds (revtex4-2.cls l.2629-2654) and undefines the environment after it
  // (l.2685), so the \maketitle comes after; it is written even for an empty abstract, since the paired title way writes none.
  // It runs once per document: a second abstract of this way (a document may hold several abstract nodes) found the environment
  // gone and stopped at "Environment abstract undefined" (batch 4 round 1, revtex4-2-aip.A and revtex4-2-aps.A: 1,562 failing
  // branches in 55 documents, 1,544 of them at their own abstract, each after another abs.front-held abstract in its document;
  // e.g. revtex4-2-aip.A ddd5e7797b4fc87781827, result 47025da7f4, l.69). So the first one prints the title block and leaves a
  // plain environment for any later abstract, whose text then prints where it stands (HELD_ABSTRACT_LATER).
  const after = param(p, 'maketitle', 'none') === 'after';
  const maketitle = after ? `\\ifdefined\\LatexLibHeldTitlePrinted\\else\\global\\let\\LatexLibHeldTitlePrinted\\empty\\maketitle\\LatexLibHeldAbstractLater\\fi\n` : '';
  const environment = (node: Parameters<typeof abstractBody>[0], content: string): string =>
    content.trim() === '' ? '' : `\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}`;
  return {
    // ecai (place 'begin-document'): \begin{abstract} fills \abstract@box globally (\global\setbox, ecai.cls l.766-772), which
    // only \maketitle prints (l.849), and the title's frontmatter environment runs that \maketitle at its end (l.776-810). Set
    // at \begin{document}, the box is filled before the title wherever the abstract node stands (the title usually comes first,
    // and an abstract after \end{frontmatter} is on no page). The body is then an argument: no verbatim in it.
    preamble: (_params, _parentType, node, content) => {
      const later = after ? [HELD_ABSTRACT_LATER] : [];
      if (!atBegin || node === undefined || content === undefined) return later.length === 0 ? {} : { declarations: later };
      const env = environment(node, content);
      return env === '' && later.length === 0 ? {} : { declarations: [...later, ...(env === '' ? [] : [`\\AtBeginDocument{${env}}`])] };
    },
    emit: (node, content) => {
      if (atBegin) return maketitle === '' ? '' : `${maketitle}\n`;
      const env = environment(node, content);
      return env === '' && maketitle === '' ? '' : `${env === '' ? '' : `${env}\n`}${maketitle}\n`;
    },
  };
};

export default realize;
