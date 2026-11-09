/**
 * The columns' blocks for cols.cvcolumns: `content` split at blank lines that stand outside every environment and brace group,
 * as cols.paracol splits its own (cols.paracol/handler.ts, `blocksOf`, kept private there), so a child's own blank line (an
 * empty statement's body, a list's paragraph break) never ends a column inside it. Verbatim is not tracked: a \cvcolumn's
 * content is a macro argument, where verbatim cannot run (the key gives verbatim: false).
 */
export const blocksOf = (content: string): string[] => {
  const blocks: string[] = [];
  let lines: string[] = [];
  let depth = 0;
  for (const line of content.trim().split('\n')) {
    if (depth === 0 && line.trim() === '') {
      if (lines.length > 0) blocks.push(lines.join('\n'));
      lines = [];
      continue;
    }
    lines.push(line);
    const bare = line.replace(/\\[\\{}%]/gu, '').replace(/%.*$/u, '');
    depth += (bare.match(/\\begin\{/gu) ?? []).length - (bare.match(/\\end\{/gu) ?? []).length;
    depth += (bare.match(/\{/gu) ?? []).length - (bare.match(/\}/gu) ?? []).length;
  }
  if (lines.length > 0) blocks.push(lines.join('\n'));
  return blocks;
};

/**
 * A column's text with every paragraph break written as \endgraf: \cvcolumn is \newcommand* (moderncv.cls l.728), a short
 * macro, so a blank line (a \par token) in its argument stops at "Paragraph ended before \cvcolumn was complete". \endgraf is
 * the kernel's \let copy of \par, which a short argument accepts and which still ends the paragraph in the cell's \vtop
 * (moderncv.cls l.745-750). A child's own \par is replaced the same way.
 */
export const shortArgument = (text: string): string =>
  text.replace(/\n[ \t]*(?:\n[ \t]*)+/gu, '\n\\endgraf\n').replace(/(?<!\\)\\par(?![A-Za-z@])/gu, '\\endgraf');
