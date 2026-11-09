/**
 * tbl.cell-plain (table_cell): the cell as plain LaTeX writes it, its text (blank lines as \par, an empty cell a \strut) then
 * Flouest's cell separator, with no \cellcolor and no \multirow, so it loads nothing. A cell's background is dropped, and a row
 * span's text sits in its first row with the rows below left empty (the table's grid already leaves the covered fields '').
 * A column span is the table way's: `gridOf` writes it as \multicolumn{n}{…}{…} from the cell's colspan.
 * For the classes that refuse colortbl or multirow's array-based pieces (class.emulateapj: revtex4's array copies, revtex4.cls
 * l.1113, 1176, 861-937), where tbl.multirow is refused (Latex-Template-Examples/_briefs/class.emulateapj.md, table_cell).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import type { Realization, Subject } from '../../../schema/realization.ts';
import { cell } from '../node.ts';

/** The cell without what needs a package: its background (colortbl) and its row span (multirow). */
const plain = (node: Subject): Subject => ({ ...node, attrs: { ...(node.attrs ?? {}), background: '', rowspan: 1 } });

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({}),
  emit: (node, content) => cell(plain(node), content, false),
});

export default realize;
