/**
 * tbl.cventry: a table printed as moderncv's own CV entries, one entry command per body row, its cells as the command's
 * arguments in order (Solution 0196-moderncv row "CV entry rows", template.tex:137-247; argument counts moderncv.cls:566-588).
 * No float, tabular or caption: moderncv has no table float (class profile), and the entries are its look. With `entry: auto`
 * the table's column count picks the command; a fixed `entry` fits every row to that command's arguments, padding with empty
 * arguments and joining extra cells into the last one with \newline{}.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { gridOf, noPar, withoutCellColour } from '../node.ts';
import key from './key.ts';

/** Joins a spanning cell's text to the empty arguments of the columns it covers, split again after `gridOf`. */
const SPAN = '\u{e010}';

/** Each command's argument count (after the optional spacing). */
const ARITY: { readonly [command: string]: number } = { cvlistitem: 1, cvitem: 2, cvitemwithcomment: 3, cvdoubleitem: 4, cventry: 6, cvtripleitem: 6, cvskillentry: 5 };

/** The command `auto` picks for a table of `columns` columns (template.tex: \cvlistitem 240, \cvitem 141, \cvitemwithcomment 170, \cvdoubleitem 176, \cventry 137). */
const byColumns = (columns: number): string => (columns <= 1 ? 'cvlistitem' : columns === 2 ? 'cvitem' : columns === 3 ? 'cvitemwithcomment' : columns === 4 ? 'cvdoubleitem' : 'cventry');

/**
 * A cell as an argument of an entry command. Every entry command is \newcommand* (moderncv.cls:568-592), not \long, so a
 * paragraph break in a cell would stop at "Paragraph ended before \cventry was complete": a blank line and a \par token become
 * \endgraf, the same primitive, which a non-long argument takes (the cell is a p-column or minipage, where it starts a new
 * paragraph). A \cellcolor has no colortbl cell to paint here (`withoutCellColour`).
 */
const argument = (cell: string): string => noPar(withoutCellColour(cell.trim())).replace(/\n[ \t]*\n\s*/gu, '\\endgraf ');

/**
 * The cells fitted to `command`'s `n` arguments: padded with empty ones, the extras joined into the last with \newline{}
 * (template.tex:165). Under \cventry the last cell is always the description, its seventh argument, and the cells before it fill
 * years, title, institution, city and grade in order, the rest left empty ("arguments 3 to 6 can be left empty", template.tex:137;
 * five cells leave the grade empty, as every entry of Solution 0410 does, main.tex:37-54). The description is the one argument
 * every body sets as a paragraph (a minipage); banking's body sets the title, institution, city and grade in tabular* l and r
 * cells (moderncvbodyiii.sty:182-198), where a list or a paragraph break stops at "Not allowed in LR mode" (compile of this way,
 * banking style, a list in a three-column row's last cell before this rule).
 */
const fit = (cells: readonly string[], n: number, command = ''): string[] => {
  const given = command === 'cventry' && cells.length > 0 && cells.length < n ? [...cells.slice(0, -1), ...Array.from({ length: n - cells.length }, () => ''), cells[cells.length - 1] ?? ''] : cells;
  const kept = given.slice(0, n);
  const extra = given.slice(n).filter((c) => c !== '');
  while (kept.length < n) kept.push('');
  if (extra.length > 0) kept[n - 1] = [kept[n - 1], ...extra].filter((c) => c !== '').join('\\newline{}');
  return kept;
};

/**
 * An argument as the entry commands can test it. moderncv's bodies test most arguments for emptiness with \ifthenelse{\equal{#n}{}}
 * (moderncvbodyi.sty:129-131 \cventry's institution, city and grade; moderncvbodyiv.sty \cvitem's and \cvdoubleitem's hints), and
 * \equal expands its argument fully (\protected@edef): a list in a cell stopped at "Incomplete \iffalse" (\item is not robust;
 * compile of this way's five-column case, classic style). \unexpanded keeps the cell's commands from that expansion and hands
 * them over unchanged where the argument is typeset; a cell without a command is left bare.
 */
const guarded = (cell: string): string => (cell.includes('\\') ? `\\unexpanded{${cell}}` : cell);

/** A skill level as \cvskill reads it: an integer 0-5 (moderncvskillmatrix.sty:251, \cvskillentry's second argument); '0' when the cell has no number. */
const level = (cell: string): string => {
  const m = /\d+(?:\.\d+)?/u.exec(cell);
  return m === null ? '0' : String(Math.min(5, Math.max(0, Math.round(Number(m[0])))));
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // The caption and the label are not printed: moderncv has no table float or table counter, and an entry list takes no caption.
    emit: (node, content) => {
      const spacing = param(p, 'spacing');
      const opt = spacing === '' ? '' : `[${spacing}]`;
      const g = gridOf(node, content, (n, cell) => [cell, ...Array.from({ length: n - 1 }, () => '')].join(SPAN));
      const rows = g.rows.map((fields) => fields.flatMap((f) => f.split(SPAN)).map(argument));
      // A row with no text (every cell under a row span from above, or empty) prints no entry.
      const blank = (r: number): boolean => (rows[r] ?? []).every((c) => c === '' || c === '\\strut');
      const header = (r: number): boolean => {
        const cells = node.content?.[r]?.content ?? [];
        return cells.length > 0 && cells.every((c) => c.type === 'table_header');
      };
      const entry = param(p, 'entry', 'auto');
      const command = entry === 'auto' ? byColumns(g.columns) : entry;
      const n = ARITY[command] ?? 2;
      const braced = (cells: readonly string[]): string => cells.map((c) => `{${guarded(c)}}`).join('');
      const lines: string[] = [];
      if (command === 'cvskillentry') {
        // The legend first when asked (template.tex:206), then the header row as \cvskillhead: its Level, Skill, Years and Comment
        // labels are the header's second to fifth cells (moderncvskillmatrix.sty, \cvskillhead's usage), the default ones when any
        // is empty. A body row that opens a category (its first cell not empty) is starred, the rule above it (template.tex:226-230).
        if (p['skillLegend'] === true) lines.push('\\cvskilllegend*[1em]{}');
        rows.forEach((cells, r) => {
          const f = fit(cells, n);
          if (blank(r)) return;
          if (header(r)) {
            // A header cell's own bold (Flouest's header emitter, `{\bfseries …}`) is taken off: the head sets its labels itself.
            const labels = f.slice(1, 5).map((l) => l.replace(/^\{\\bfseries ([^{}]*)\}$/u, '$1'));
            const pad = spacing === '' ? '0.25em' : spacing;
            lines.push(labels.every((l) => l !== '') ? `\\cvskillhead[${pad}]${labels.map((l) => `[{${guarded(l)}}]`).join('')}` : `\\cvskillhead${opt}`);
            return;
          }
          lines.push(`\\cvskillentry${f[0] === '' ? '' : '*'}${opt}${braced([f[0] ?? '', level(f[1] ?? ''), f[2] ?? '', f[3] ?? '', f[4] ?? ''])}`);
        });
      } else {
        // A header row names the columns, which the entries do not print: it is dropped.
        rows.forEach((cells, r) => {
          if (!header(r) && !blank(r)) lines.push(`\\${command}${opt}${braced(fit(cells, n, command))}`);
        });
      }
      return lines.length === 0 ? '' : `${lines.join('\n')}\n\n`;
    },
  };
};

export default realize;
