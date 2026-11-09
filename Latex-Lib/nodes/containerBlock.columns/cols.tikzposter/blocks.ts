/**
 * The content's blocks for the columns, as cols.paracol splits them (its `blocksOf`, copied so this way stands on its own): split
 * at blank lines that stand outside every environment, brace group and verbatim environment, so a child's own blank line (an
 * empty statement's body, a list's paragraph break, a block's body) never ends a column inside it.
 */
export const blocksOf = (content: string): string[] => {
  const blocks: string[] = [];
  let lines: string[] = [];
  let depth = 0;
  let verbatim: string | undefined;
  for (const line of content.trim().split('\n')) {
    if (verbatim === undefined && depth === 0 && line.trim() === '') {
      if (lines.length > 0) blocks.push(lines.join('\n'));
      lines = [];
      continue;
    }
    lines.push(line);
    if (verbatim !== undefined) {
      if (line.includes(`\\end{${verbatim}}`)) verbatim = undefined;
      continue;
    }
    const opened = /\\begin\{(lstlisting|verbatim\*?|Verbatim|minted|tcblisting)\}/u.exec(line);
    if (opened?.[1] !== undefined && !line.includes(`\\end{${opened[1]}}`)) {
      verbatim = opened[1];
      continue;
    }
    const bare = line.replace(/\\[\\{}%]/gu, '').replace(/%.*$/u, '');
    depth += (bare.match(/\\begin\{/gu) ?? []).length - (bare.match(/\\end\{/gu) ?? []).length;
    depth += (bare.match(/\{/gu) ?? []).length - (bare.match(/\}/gu) ?? []).length;
  }
  if (lines.length > 0) blocks.push(lines.join('\n'));
  return blocks;
};

/**
 * `blocks` shared out in order over `n` columns, as evenly as they go: the first columns take one more where they do not divide
 * (four blocks in three columns: 2, 1, 1, where cols.paracol's split gives 2, 2 and an empty third column).
 */
export const shareOut = (blocks: readonly string[], n: number): string[][] => {
  const base = Math.floor(blocks.length / n);
  const extra = blocks.length % n;
  const out: string[][] = [];
  let at = 0;
  for (let i = 0; i < n; i++) {
    const take = base + (i < extra ? 1 : 0);
    out.push(blocks.slice(at, at + take));
    at += take;
  }
  return out;
};
