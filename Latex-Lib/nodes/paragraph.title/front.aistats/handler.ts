/**
 * front.aistats (paragraph/title). AISTATS's own title block (aistats2027.sty on article): \runningtitle and
 * \runningauthor for the page heads, then \twocolumn[ \aistatstitle{…} \aistatsauthor{A \And B \And C}
 * \aistatsaddress{… \And … \And …} ], a full-width block at the top of page one, with no \maketitle. A long author list
 * goes in rows, one \aistatsauthor and \aistatsaddress pair per row.
 * Not on CTAN: AISTATS's author kit (sample_paper.tex l.37-57; aistats2026.sty l.163-391).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField } from '../node.ts';
import key from './key.ts';

type Cell = { readonly names: string[]; readonly address: string; readonly emails: string[]; readonly group: string };

const front = (node: Subject, content: string, p: { readonly [name: string]: unknown }): string => {
  const title = content.trim();
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const perRow = typeof p['perRow'] === 'number' && p['perRow'] >= 1 ? Math.floor(p['perRow']) : 3;
  const emails = p['emails'] === true;
  const shared = param(p, 'group', 'none') === 'shared';
  // One cell per author: the author's affiliations, each as department \\ name \\ address with the empty parts dropped (the
  // address tabular is a centred column, aistats2026.sty l.384, so \\ starts a line in it).
  const cells: Cell[] = [];
  for (const a of authors) {
    const own = affiliationsOfAuthor(a, affiliations);
    const address = own.map((f) => [f.department, f.name, f.address].filter(Boolean).join(' \\\\ ')).join(' \\\\ ');
    const group = own.map((f) => f.id).join('|');
    const last = cells[cells.length - 1];
    // group=shared: consecutive authors with the same affiliations share one cell, their names joined by \and, which the style
    // prints as "and" (l.326, 372).
    if (shared && last !== undefined && group !== '' && last.group === group) {
      last.names.push(a.name);
      if (a.email !== '') last.emails.push(a.email);
    } else cells.push({ names: [a.name], address, emails: a.email === '' ? [] : [a.email], group });
  }
  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += perRow) rows.push(cells.slice(i, i + perRow));
  // Each row a pair, as the kit writes one (sample_paper.tex l.55-57): \And between the blocks of a row.
  const pairs = rows.flatMap((row) => [
    `\\aistatsauthor{ ${row.map((c) => c.names.join(' \\and ')).join(' \\And ')} }`,
    `\\aistatsaddress{ ${row.map((c) => [c.address, ...(emails && c.emails.length > 0 ? [`\\texttt{${c.emails.join(', ')}}`] : [])].filter(Boolean).join(' \\\\ ')).join(' \\And ')} }`,
  ]);
  // The running heads, only when the paper gives them; else the style takes the title and the first row's authors for the
  // heads (l.182-188, 255-262), and stops at a \PackageError when either is wider than the text (l.192-221, 266-295), which
  // these fields avoid.
  const shortTitle = templateField(node, 'shortTitle');
  const runningAuthor = templateField(node, 'runningAuthor');
  const block = [`\\aistatstitle{${title}}`, ...pairs];
  const onecolumn = param(p, 'wrapper', 'twocolumn') === 'onecolumn';
  return [
    ...(shortTitle === '' ? [] : [`\\runningtitle{${shortTitle}}`]),
    ...(runningAuthor === '' ? [] : [`\\runningauthor{${runningAuthor}}`]),
    // The title kept for a later supplement title (num.appendix-onecolumn's \aistatstitle{\LibPaperTitle \\ Supplementary
    // Materials}); outside \twocolumn[…], whose argument is typeset in a group.
    `\\gdef\\LibPaperTitle{${title}}`,
    // \twocolumn[…] spans both columns (sample_paper.tex l.51-57); \onecolumn, the supplement's one-column page (supplement.tex
    // l.43-45), takes the block as it is.
    ...(onecolumn ? ['\\onecolumn', ...block] : ['\\twocolumn[', ...block, ']']),
  ].join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // Everything in the body at the title's place, the first thing after \begin{document}: \runningtitle and \runningauthor
    // must come before \aistatstitle and \aistatsauthor, which read them (aistats2026.sty l.163-164, 182-188, 255-261). The
    // style does not use \maketitle; in its review mode it prints "Anonymous Author" and "Anonymous Institution" itself.
    preamble: () => ({}),
    emit: (node, content) => `${front(node, content, p)}\n\n`,
  };
};

export default realize;
