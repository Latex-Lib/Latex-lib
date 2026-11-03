/**
 * The library's checks and generated files, from the library's folder:
 *
 *   npm run verify                       every key, class and package valid and resolving; every compat table current; the Flouest pin holding
 *   npm run generate                     writes every handler's compat.generated.json
 *   node cli.ts pin [<flouest checkout>] pins the Flouest files the library reads (flouest.lock.json)
 *   node cli.ts solutions                for every Solution file using a theorem way, what the resolver picks under its class (M1's exit check)
 *   node cli.ts ways [--markdown]        every node, how many ways it can be emitted, and each way's packages and command
 */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { checkCompat, writeCompat } from './compat.ts';
import { checkPin, flouestRoot, pinFlouest, readLock } from './flouest.ts';
import { pick } from './engine/resolve.ts';
import { loadLibrary } from './library.ts';
import { ELEMENTS } from './nodes/containerBlock.mathElement/statement.ts';
import { solutionClass, solutionRows } from './seed.ts';
import { readNesting } from './nesting.ts';
import { validateLibrary } from './schema/validate.ts';

const lib = dirname(fileURLToPath(import.meta.url));
const [command, argument] = process.argv.slice(2);

if (command === 'pin') {
  const lock = pinFlouest(lib, argument ?? readLock(lib).root);
  console.log(`pinned ${Object.keys(lock.files).length} Flouest files at ${lock.root}`);
} else if (command === 'verify' || command === 'generate') {
  const { library, misplaced } = await loadLibrary(lib);
  const nesting = readNesting(flouestRoot(lib));
  if (command === 'generate') {
    const written = writeCompat(lib, library.keys, nesting);
    console.log(`wrote ${written.length} compat tables`);
  } else {
    const problems = [...misplaced, ...checkPin(lib), ...validateLibrary(library, nesting), ...checkCompat(lib, library.keys, nesting)];
    console.log(`library: ${library.keys.length} handlers, ${library.classes.length} class profiles, ${library.packages.length} package facts`);
    for (const p of problems) console.log(`  ${p}`);
    console.log(problems.length === 0 ? 'verify: ok' : `verify: ${problems.length} problem(s)`);
    if (problems.length > 0) process.exitCode = 1;
  }
} else if (command === 'solutions') {
  const { library } = await loadLibrary(lib);
  const profiled = new Set(library.classes.map((c) => c.id));
  // Each template's theorem ways, under the class its row names or else the template's own.
  const byFile = new Map<string, Map<string, string | undefined>>();
  for (const row of solutionRows('thm')) {
    const ways = byFile.get(row.file) ?? new Map<string, string | undefined>();
    for (const w of row.ways) ways.set(`${w} ${row.classes[0] ?? ''}`, row.classes[0]);
    byFile.set(row.file, ways);
  }
  const tally = new Map<string, number>();
  const count = (k: string): void => void tally.set(k, (tally.get(k) ?? 0) + 1);
  const failures: string[] = [];
  for (const [file, ways] of byFile) {
    for (const [entry, rowClass] of ways) {
      const way = entry.split(' ')[0] ?? '';
      const cls = rowClass === undefined ? solutionClass(file) : { id: rowClass, options: [] };
      if (cls === undefined || !profiled.has(cls.id)) {
        count('class not profiled');
        continue;
      }
      if (library.classes.find((c) => c.id === cls.id)?.zerotex === 'no') {
        count('class does not run in ZeroTeX-NG');
        continue;
      }
      const key = library.keys.find((k) => k.id === way);
      // The preset that cites this template, else the first.
      const preset = Object.entries(key?.presets ?? {}).find(([, p]) => p.evidence.some((e) => e.kind === 'solution' && e.file === file))?.[0];
      const picked = pick(library, { node: 'containerBlock/mathElement', way, ...(preset === undefined ? {} : { preset }), classId: cls.id, kinds: ELEMENTS, nativeWay: 'thm.class-native' });
      if ('violations' in picked) {
        count('no handler goes');
        failures.push(`  ${file} (${cls.id}, ${way}): ${picked.violations[0]}`);
      } else count(picked.how === 'as-is' ? 'picked as it is' : `picked ${picked.how}`);
    }
  }
  console.log(`solutions: ${byFile.size} Solution files use a theorem way; ${[...tally.values()].reduce((n, k) => n + k, 0)} checks, one per template and theorem way it uses`);
  for (const [k, n] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(4)}  ${k}`);
  for (const f of failures) console.log(f);
  if (failures.length > 0) process.exitCode = 1;
} else if (command === 'ways') {
  const { library } = await loadLibrary(lib);
  const byNode = new Map<string, typeof library.keys>();
  for (const k of library.keys) byNode.set(k.node, [...(byNode.get(k.node) ?? []), k]);
  const nodes = [...byNode].sort(([a], [b]) => a.localeCompare(b));
  const packagesOf = (k: (typeof library.keys)[number]): string => [...new Set(k.loads.map((l) => l.pkg))].join(', ') || 'kernel';
  if (process.argv.includes('--markdown')) {
    console.log('| Node | Ways | Each way (its packages) |\n|---|---|---|');
    for (const [node, keys] of nodes) console.log(`| \`${node}\` | ${keys.length} | ${keys.map((k) => `\`${k.id}\` (${packagesOf(k)})`).join(', ')} |`);
  } else {
    console.log(`ways: ${library.keys.length} handlers over ${byNode.size} nodes`);
    for (const [node, keys] of nodes) {
      console.log(`${node}: ${keys.length} way${keys.length === 1 ? '' : 's'}`);
      for (const k of keys) console.log(`  ${k.id.padEnd(22)} ${packagesOf(k).padEnd(28)} ${k.description.split(/(?<=\.)\s/u)[0]}`);
    }
  }
} else {
  console.error('Usage: node cli.ts verify | generate | pin [<flouest checkout>] | solutions | ways [--markdown]');
  process.exitCode = 1;
}
