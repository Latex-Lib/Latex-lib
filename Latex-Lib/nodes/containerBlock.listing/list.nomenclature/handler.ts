/**
 * list.nomenclature: a list as ASME's nomenclature, \begin{nomenclature} … \end{nomenclature}, the environment asmeconf and
 * asmejour define over a list with a hanging symbol column, under its own \section*{\nomname} (asmeconf.cls l.1650-1680;
 * asmejour.cls v1.28 l.1459-1525). From the items (list.item's `\<level>[label] text`):
 * - an item with a label (its description) and text is \entry{<label>}{<text>}, the symbol and its meaning;
 * - a first-level item with items nested below it is an \EntryHeading{<label, or its text>}, the class's subheading (italic in
 *   asmeconf, bold in asmejour), and the items below it are its entries, at whatever depth;
 * - an item with a label and no text is an \EntryHeading{<label>};
 * - an item with text and no label is \entry{}{<text>}: asmejour's \entry stops at a class error when its second argument is
 *   blank (l.1460-1461), so the text is always the meaning, never the symbol.
 * \entry and \EntryHeading are xparse commands with short arguments (no `+`), so an item's further lines are joined to its text
 * with no blank line. A list with no item writes nothing: the environment's list would stop at "missing \item".
 * `labelWidth` is the environment's first optional argument (asmeconf's default 2em, asmejour's the widest label from the last
 * run); `title` renames the heading through \nomname, as asmeconf-template.tex l.554 shows (\renewcommand*{\nomname}{List of
 * Symbols}), since asmeconf's first optional argument cannot be left empty to reach the second (\setlength{\nomenwidth}{}).
 * In a measure under 2in a list indents at most a fifth of it (`NARROW_LISTS`, OVL-3), as every list way declares.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { NARROW_LISTS } from '../node.ts';
import key from './key.ts';

/** An item line as list.item writes it: `\<level>[{label}] text` or `\<level>[label] text`. */
const ITEM = /^\s*\\(\d{1,2})(?:\[\{(.*)\}\]|\[([^\]]*)\])?(?:\s+(.*))?$/u;

type Item = { readonly level: number; readonly label: string; text: string };

const itemsOf = (content: string): { readonly lead: string[]; readonly items: Item[] } => {
  const lead: string[] = [];
  const items: Item[] = [];
  for (const line of content.trim().split('\n')) {
    if (line.trim() === '') continue;
    const m = ITEM.exec(line);
    const current = items[items.length - 1];
    if (m !== null && Number(m[1]) >= 1) items.push({ level: Number(m[1]), label: (m[2] ?? m[3] ?? '').trim(), text: (m[4] ?? '').trim() });
    else if (current !== undefined) current.text = `${current.text} ${line.trim()}`.trim();
    else lead.push(line);
  }
  return { lead, items };
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const text = (name: string): string => (typeof p[name] === 'string' ? (p[name] as string).trim() : '');
  return {
    preamble: () => ({ declarations: [...(text('title') === '' ? [] : [`\\renewcommand*{\\nomname}{${text('title')}}`]), NARROW_LISTS] }),
    emit: (_node, content) => {
      const { lead, items } = itemsOf(content);
      const out: string[] = [];
      items.forEach((item, i) => {
        const parent = item.level === 1 && (items[i + 1]?.level ?? 1) > 1;
        if (parent || (item.text === '' && item.label !== '')) out.push(`\\EntryHeading{${item.label || item.text}}`);
        else if (item.text !== '') out.push(`\\entry{${item.label}}{${item.text}}`);
      });
      const width = text('labelWidth');
      const list = out.length === 0 ? '' : `\\begin{nomenclature}${width === '' ? '' : `[${width}]`}\n${out.join('\n')}\n\\end{nomenclature}\n\n`;
      return `${lead.length === 0 ? '' : `${lead.join('\n')}\n`}${list}`;
    },
  };
};

export default realize;
