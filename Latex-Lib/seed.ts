/**
 * Seeding from the research (ARCHITECTURE.md section 10): how often each way
 * of a component is used, and the Solution rows that use it, with their
 * evidence and parameters. Keys and presets are written by hand from this,
 * each preset citing the rows it stands for.
 *
 *   node seed.ts <component> [--rows]     e.g. node seed.ts thm --rows
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export const RESEARCH = join(import.meta.dirname, '..', 'Latex Related Research', 'Latex-lib-main');

/** One component-map row of a Solution file that names a way. */
export type SolutionRow = {
  readonly file: string;
  readonly line: number;
  readonly component: string;
  readonly evidence: string;
  readonly ways: readonly string[];
  /** A class the row itself names beside its ways (slides kept in the same zip as a book: `class.beamer`). */
  readonly classes: readonly string[];
  readonly parameters: string;
  /** The Solution's verdict line: `yes` (rebuildable from the lib) or not. */
  readonly verdict: string;
};

/** Every component-map row naming a way of `component` (`thm`), across the Solution files. */
export const solutionRows = (component: string): SolutionRow[] => {
  const dir = join(RESEARCH, 'Solution');
  const rows: SolutionRow[] = [];
  const way = new RegExp(`\`(${component}\\.[a-z0-9-]+)\``, 'g');
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md')).sort()) {
    const lines = readFileSync(join(dir, file), 'utf8').split('\n');
    const verdict = (lines[0] ?? '').trim();
    lines.forEach((text, i) => {
      if (!text.startsWith('|')) return;
      const cells = text.split(/(?<!\\)\|/).slice(1, -1).map((c) => c.trim());
      if (cells.length < 4) return;
      const ways = [...(cells[2] ?? '').matchAll(way)].map((m) => m[1] ?? '');
      if (ways.length === 0) return;
      const classes = [...(cells[2] ?? '').matchAll(/`(class\.[a-z0-9-]+)`/g)].map((m) => m[1] ?? '');
      rows.push({ file: `Solution/${file}`, line: i + 1, component: cells[0] ?? '', evidence: cells[1] ?? '', ways, classes, parameters: cells.slice(3).join(' | '), verdict });
    });
  }
  return rows;
};

/** The class a Solution file names (`- Class: \`class.llncs\``), with the options it passes, or nothing. */
export const solutionClass = (file: string): { readonly id: string; readonly options: readonly string[] } | undefined => {
  const text = readFileSync(join(RESEARCH, file), 'utf8');
  const m = /^- Class: `(class\.[a-z0-9-]+)`(?: options: `([^`]*)`)?/m.exec(text);
  return m === null ? undefined : { id: m[1] ?? '', options: (m[2] ?? '').split(',').map((o) => o.trim()).filter(Boolean) };
};

if (process.argv[1] === import.meta.filename) {
  const component = process.argv[2] ?? 'thm';
  const rows = solutionRows(component);
  const templates = new Map<string, Set<string>>();
  for (const r of rows) for (const w of r.ways) templates.set(w, (templates.get(w) ?? new Set()).add(r.file));
  console.log(`${component}: ${rows.length} rows in ${new Set(rows.map((r) => r.file)).size} Solution files`);
  for (const [w, files] of [...templates].sort((a, b) => b[1].size - a[1].size)) console.log(`  ${String(files.size).padStart(4)} templates  ${w}`);
  if (process.argv.includes('--rows')) for (const r of rows) console.log(`${r.ways.join(',')}\t${r.file}:${r.line}\t${r.component}\t${r.parameters.slice(0, 220)}`);
}
