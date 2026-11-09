/**
 * list.agu-glossary: a list as one of AGU's back-matter lists, each an environment that prints its own \section* heading and
 * sets a description list with 12pt after it (agujournal2019.cls l.1055-1075):
 * - glossary: \begin{glossary} \term{<label>} <text> … \end{glossary}, under "Glossary";
 * - acronyms: \begin{acronyms} \acro{<label>} <text> … \end{acronyms}, under "Acronyms";
 * - notation: \begin{notation} \notation{<label>} <text> … \end{notation}, under "Notation", the label in bold maths
 *   (\item[\boldmath #1]).
 * A first-level item with a label (its description) is the class's \term, \acro or \notation; one with no label is a plain \item.
 * The levels below are kernel description lists inside the item, nested as list.kernel nests them (`nested`, node.ts), the
 * labels kept as \item[…]. In a measure under 2in a list indents at most a fifth of it (`NARROW_LISTS`, OVL-3).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { NARROW_LISTS, nested } from '../node.ts';
import key from './key.ts';

/** Each form's environment and the command that makes one of its entries. */
const FORMS: { readonly [form: string]: { readonly env: string; readonly entry: string } } = {
  glossary: { env: 'glossary', entry: 'term' },
  acronyms: { env: 'acronyms', entry: 'acro' },
  notation: { env: 'notation', entry: 'notation' },
};

/** Marks a first-level entry through `nested` (a private-use character no item text holds). */
const ENTRY = '\u{e0f1}';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = FORMS[typeof p['form'] === 'string' ? p['form'] : 'glossary'] ?? { env: 'glossary', entry: 'term' };
  return {
    preamble: () => ({ declarations: [NARROW_LISTS] }),
    emit: (_node, content) => {
      // The first level's items: `\1[{label}] text` becomes the class's entry command, before `nested` writes \item[{label}].
      const lines = content.split('\n').map((line) => {
        const m = /^\s*\\1(?:\[\{(.*)\}\]|\[([^\]]*)\])(?:\s+(.*))?$/u.exec(line);
        return m === null ? line : `\\1 ${ENTRY}{${(m[1] ?? m[2] ?? '').trim()}} ${(m[3] ?? '').trim()}`.trimEnd();
      });
      // `nested` writes `\item <mark>{…} text`; the class's \term is itself \item[…], so the \item and the mark become \term.
      return nested(lines.join('\n'), (level) => `\\begin{${level === 1 ? form.env : 'description'}}`, (level) => `\\end{${level === 1 ? form.env : 'description'}}`).replaceAll(
        `\\item ${ENTRY}`,
        `\\${form.entry}`,
      );
    },
  };
};

export default realize;
