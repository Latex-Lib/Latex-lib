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

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const atBegin = param(p, 'place', 'here') === 'begin-document';
  // revtex4-2's \maketitle reads the abstract it holds (revtex4-2.cls l.2629-2654) and undefines the environment after it
  // (l.2685), so the \maketitle comes after; it is written even for an empty abstract, since the paired title way writes none.
  const maketitle = param(p, 'maketitle', 'none') === 'after' ? '\\maketitle\n' : '';
  const environment = (node: Parameters<typeof abstractBody>[0], content: string): string =>
    content.trim() === '' ? '' : `\\begin{abstract}\n${abstractBody(node, content)}\n\\end{abstract}`;
  return {
    // ecai (place 'begin-document'): \begin{abstract} fills \abstract@box globally (\global\setbox, ecai.cls l.766-772), which
    // only \maketitle prints (l.849), and the title's frontmatter environment runs that \maketitle at its end (l.776-810). Set
    // at \begin{document}, the box is filled before the title wherever the abstract node stands (the title usually comes first,
    // and an abstract after \end{frontmatter} is on no page). The body is then an argument: no verbatim in it.
    preamble: (_params, _parentType, node, content) => {
      if (!atBegin || node === undefined || content === undefined) return {};
      const env = environment(node, content);
      return env === '' ? {} : { declarations: [`\\AtBeginDocument{${env}}`] };
    },
    emit: (node, content) => {
      if (atBegin) return maketitle === '' ? '' : `${maketitle}\n`;
      const env = environment(node, content);
      return env === '' && maketitle === '' ? '' : `${env === '' ? '' : `${env}\n`}${maketitle}\n`;
    },
  };
};

export default realize;
