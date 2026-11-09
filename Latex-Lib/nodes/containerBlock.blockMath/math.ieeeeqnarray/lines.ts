/**
 * math.ieeeeqnarray's reading of a row: its lines (split at the row breaks \\ outside braces) and each line's top-level
 * alignment tabs (& outside braces, not \&), skipping %-comments.
 */

/** Where a line ends (`\\` with its optional [skip]) and the alignment tabs, at brace depth 0. */
const scan = (text: string): { readonly breaks: readonly { at: number; end: number }[]; readonly tabs: readonly number[] } => {
  const breaks: { at: number; end: number }[] = [];
  const tabs: number[] = [];
  let depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '%') {
      const nl = text.indexOf('\n', i);
      if (nl < 0) break;
      i = nl;
    } else if (c === '\\') {
      if (text[i + 1] === '\\' && depth === 0) {
        const skip = /^\s*\[[^\]\n]*\]/u.exec(text.slice(i + 2));
        const end = i + 2 + (skip?.[0].length ?? 0);
        breaks.push({ at: i, end });
        i = end - 1;
      } else i++;
    } else if (c === '{') depth++;
    else if (c === '}') depth = Math.max(0, depth - 1);
    else if (c === '&' && depth === 0) tabs.push(i);
  }
  return { breaks, tabs };
};

/** A row's lines, each with the break that ended it (`\\`, `\\[2pt]`), the last with none. */
export const linesOf = (row: string): { readonly line: string; readonly brk: string }[] => {
  const out: { line: string; brk: string }[] = [];
  let from = 0;
  for (const b of scan(row).breaks) {
    out.push({ line: row.slice(from, b.at).trim(), brk: row.slice(b.at, b.end).replace(/\s+/gu, '') });
    from = b.end;
  }
  const last = row.slice(from).trim();
  if (last !== '' || out.length === 0) out.push({ line: last, brk: '' });
  return out;
};

/** The positions of a line's top-level alignment tabs. */
export const tabsOf = (line: string): readonly number[] => scan(line).tabs;

/** A relation at the start of a right side: it goes in the C column (relation spacing), the rest in the l column. */
const RELATION =
  /^(?:<=|>=|:=|=|<|>|\\(?:leq?|geq?|neq?|leqslant|geqslant|approx|approxeq|equiv|sim|simeq|cong|propto|ll|gg|subset|subseteq|supset|supseteq|in|ni|notin|to|mapsto|rightarrow|Rightarrow|longrightarrow|Longrightarrow|leftarrow|Leftarrow|leftrightarrow|Leftrightarrow|iff|implies|coloneqq|eqqcolon|triangleq|doteq|prec|preceq|succ|succeq|perp|parallel|mid|vdash|models|stackrel\{[^{}]*\}\{[^{}]*\}|overset\{[^{}]*\}\{[^{}]*\})(?![A-Za-z]))/u;

/** One line in rCl's three columns: as written with two tabs, split at its one tab (left & relation & right), or spanning all three with none. */
export const rclLine = (line: string): string => {
  const tabs = tabsOf(line);
  if (tabs.length === 0) return line === '' ? '' : `\\IEEEeqnarraymulticol{3}{c}{${line}}`;
  if (tabs.length === 2) return line;
  const at = tabs[0] ?? 0;
  const left = line.slice(0, at).trim();
  const rest = line.slice(at + 1).trim();
  const rel = RELATION.exec(rest)?.[0] ?? '';
  return `${left} & ${rel} & ${rest.slice(rel.length).trim()}`.replace(/ {2,}/gu, ' ').trim();
};
