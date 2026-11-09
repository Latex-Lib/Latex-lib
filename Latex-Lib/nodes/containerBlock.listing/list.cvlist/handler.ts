/**
 * list.cvlist: a list as moderncv's CV lines, set in the CV's main column beside the hints column (moderncvbodyi.sty l.91-123):
 * - an item of an itemize is \cvlistitem{<text>}, or with `double` two items side by side, \cvlistdoubleitem{<one>}{<next>} (an
 *   odd last item beside nothing: the style prints no second symbol for an empty one, `\ifthenelse{\equal{#3}{}}`);
 * - an item with a description (a description list's term, list.item's `\<level>[{term}]`) is \cvitem{<term>}{<text>}, the term
 *   in the hints column as the templates write \cvitem{Languages}{Python, SQL}; a description list's item with no term
 *   is \cvitem{}{<text>};
 * - an enumerate keeps its numbers as a kernel enumerate in one \cvitem{}{…}, and the items nested below a first-level item stay a
 *   kernel list inside that item's line (in the minipage \cvlistitem sets), so nothing is lost.
 * The CV commands are short (`\newcommand*`, moderncv.cls l.568-584): an argument holds no blank line, so an item's lines are
 * joined without one. A verbatim block cannot stand in a command's argument at all; a list holding one would fail as any
 * \cvitem holding one does. In a measure under 2in a nested list indents at most a fifth of it (`NARROW_LISTS`, OVL-3).
 * CTAN: https://ctan.org/pkg/moderncv
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { NARROW_LISTS, nested, styleOf } from '../node.ts';
import key from './key.ts';

/** The item line list.item writes: `\<level>[{label}] text` or `\<level>[label] text`. */
const ITEM = /^\s*\\(\d{1,2})(?:\[\{(.*)\}\]|\[([^\]]*)\])?(?:\s+(.*))?$/u;

type Item = { readonly label: string; readonly text: string; readonly below: string[] };

/** The first-level items, each with the lines below it (deeper items one level up, and any other line as it is). */
const itemsOf = (content: string): { readonly lead: string[]; readonly items: Item[] } => {
  const lead: string[] = [];
  const items: Item[] = [];
  for (const line of content.trim().split('\n')) {
    const m = ITEM.exec(line);
    const current = items[items.length - 1];
    if (m !== null && Number(m[1]) === 1) {
      items.push({ label: (m[2] ?? m[3] ?? '').trim(), text: (m[4] ?? '').trim(), below: [] });
    } else if (m !== null && Number(m[1]) > 1 && current !== undefined) {
      current.below.push(line.replace(/^\s*\\(\d{1,2})/u, (_all, n: string) => `\\${Number(n) - 1}`));
    } else if (current !== undefined) current.below.push(line);
    else lead.push(line);
  }
  return { lead, items };
};

/** No blank line: the CV commands' arguments are short. */
const short = (latex: string): string =>
  latex
    .split('\n')
    .filter((l) => l.trim() !== '')
    .join('\n');

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const double = p['double'] === true;
  return {
    preamble: () => ({ declarations: [NARROW_LISTS] }),
    emit: (node, content) => {
      const style = styleOf(node);
      const kernel = (lines: string, env: string): string => short(nested(lines, () => `\\begin{${env}}`, () => `\\end{${env}}`));
      if (style === 'enumerate') return `\\cvitem{}{${kernel(content, 'enumerate')}}\n\n`;
      const { lead, items } = itemsOf(content);
      const below = (item: Item): string => {
        const sub = item.below.join('\n').trim();
        const body = item.text === '' && sub === '' ? '\\strut' : item.text;
        return sub === '' ? body : short(`${body}\n${/^\s*\\\d/u.test(sub) ? kernel(sub, style === 'description' ? 'itemize' : style) : sub}`);
      };
      const out: string[] = lead.filter((l) => l.trim() !== '');
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item === undefined) continue;
        if (item.label !== '' || style === 'description') {
          out.push(`\\cvitem{${item.label}}{${below(item)}}`);
          continue;
        }
        const next = items[i + 1];
        if (double && next !== undefined && next.label === '') {
          out.push(`\\cvlistdoubleitem{${below(item)}}{${below(next)}}`);
          i++;
        } else if (double) out.push(`\\cvlistdoubleitem{${below(item)}}{}`);
        else out.push(`\\cvlistitem{${below(item)}}`);
      }
      return `${out.join('\n')}\n\n`;
    },
  };
};

export default realize;
