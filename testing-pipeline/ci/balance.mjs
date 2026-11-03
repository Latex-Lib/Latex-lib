// Decides which runner repository runs each pair (testing-pipeline/ARCHITECTURE.md section 7, `ci/`; README step 5a).
//
//   node ci/balance.mjs [--times <owner/name:run,...> | --times <minutes.json>] [--write] [PAIRS]
//
// The two runner repositories in settings/runners.json run at once, each on its own account's job slots
// (`slots`), so a run lasts as long as the slower of the two: each repository's pairs packed onto its slots,
// longest first. Starting from the current split (a pair that moves starts without its store in the other
// repository's cache, so moves are few), it moves or swaps pairs from the slower repository while that shortens
// the run by at least MIN_GAIN minutes, and prints both splits. With --write it writes the new split into
// settings/runners.json: a class whose every pair lands in one repository is named whole, otherwise its pairs
// are named one by one; classes outside PAIRS keep their entries.
//
// Minutes per pair come from settings/job-minutes.json; --times first adds the pair jobs of those runs (their
// started and completed times, read through the GitHub API; token from GITHUB_TOKEN or git's credentials) or
// a { pair: minutes } file. A pair with no minutes counts as the median. PAIRS is run-pairs.sh's (all,
// batch:<id>, batch:current, classes, class.setup; batch:current by default). Plain Node; compiles nothing.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appliesTo, loadClassSettings, loadSetups } from '../core/src/config.ts';

const MIN_GAIN = 5;
const tp = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const write = args.includes('--write');
const timesAt = args.indexOf('--times');
const times = timesAt >= 0 ? args[timesAt + 1] : undefined;
const asked = args.filter((a, i) => a !== '--write' && (timesAt < 0 || (i !== timesAt && i !== timesAt + 1))).join(',') || 'batch:current';

// The pairs asked for.
const settings = loadClassSettings(join(tp, 'settings/classes'));
const setups = loadSetups(join(tp, 'settings/setups.json'));
const allPairs = settings.flatMap((c) => setups.filter((s) => appliesTo(s, c)).map((s) => `${c.id}.${s.id}`));
const batches = JSON.parse(readFileSync(join(tp, 'settings/batches.json'), 'utf8')).batches;
const classOf = (p) => p.slice(0, p.lastIndexOf('.'));
const expand = (name) => {
  if (name === 'all') return allPairs;
  if (name.startsWith('batch:')) {
    const id = name.slice(6);
    const batch = id === 'current' ? batches.filter((b) => b.status === 'running').at(-1) : batches.find((b) => String(b.id) === id);
    if (batch === undefined) throw new Error(`no batch ${name}`);
    return batch.classes.flatMap(expand);
  }
  const of = allPairs.filter((p) => p === name || classOf(p) === name);
  if (of.length === 0) throw new Error(`no such pair or class: ${name}`);
  return of;
};
const pairs = [...new Set(asked.split(/[\s,]+/).filter(Boolean).flatMap(expand))].sort();

// Minutes per pair.
const minutesFile = join(tp, 'settings/job-minutes.json');
const known = existsSync(minutesFile) ? JSON.parse(readFileSync(minutesFile, 'utf8')) : { about: '', runs: [], minutes: {} };
if (times !== undefined) {
  if (times.endsWith('.json')) Object.assign(known.minutes, JSON.parse(readFileSync(times, 'utf8')));
  else {
    const token = process.env.GITHUB_TOKEN ?? spawnSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8' }).stdout.match(/^password=(.*)$/m)?.[1];
    if (!token) throw new Error('no token: set GITHUB_TOKEN');
    for (const spec of times.split(',')) {
      const [repo, run] = [spec.slice(0, spec.lastIndexOf(':')), spec.slice(spec.lastIndexOf(':') + 1)];
      for (let page = 1; ; page++) {
        const res = await fetch(`https://api.github.com/repos/${repo}/actions/runs/${run}/jobs?per_page=100&page=${page}`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } });
        if (!res.ok) throw new Error(`${repo} run ${run}: ${res.status}`);
        const { jobs } = await res.json();
        for (const j of jobs) {
          if (allPairs.includes(j.name) && j.conclusion !== 'cancelled' && j.started_at && j.completed_at) known.minutes[j.name] = Math.round((Date.parse(j.completed_at) - Date.parse(j.started_at)) / 60000);
        }
        if (jobs.length < 100) break;
      }
      known.runs = [...known.runs.filter((r) => r !== spec), spec].slice(-6);
    }
  }
}
const sortedMinutes = Object.values(known.minutes).sort((a, b) => a - b);
const median = sortedMinutes.length > 0 ? sortedMinutes[Math.floor(sortedMinutes.length / 2)] : 60;
const minutes = (p) => known.minutes[p] ?? median;

// The current split.
const runnersFile = join(tp, 'settings/runners.json');
const runners = JSON.parse(readFileSync(runnersFile, 'utf8'));
const active = runners.runners.filter((r) => r.active);
const repos = [runners.default, ...active.map((r) => r.repository)];
const slots = (repo) => runners.slots?.[repo] ?? 20;
const entryOwner = new Map(active.flatMap((r) => r.classes.map((c) => [c, r.repository])));
const ownerNow = (p) => entryOwner.get(p) ?? entryOwner.get(classOf(p)) ?? runners.default;

// A repository's run: its pairs packed onto its slots, longest first, each on the slot that frees first.
const makespan = (list) => {
  const free = Array(Math.max(1, slots(list.repo))).fill(0);
  for (const m of list.items.map(minutes).sort((a, b) => b - a)) {
    let i = 0;
    for (let k = 1; k < free.length; k++) if (free[k] < free[i]) i = k;
    free[i] += m;
  }
  return Math.max(...free);
};
const spans = (assign) => repos.map((repo) => makespan({ repo, items: pairs.filter((p) => assign.get(p) === repo) }));
// The order of two splits: the run's length, then the busiest repository's minutes per slot (a step that does
// not shorten the run yet can still be on the way to one that does).
const score = (assign) => {
  const s = spans(assign);
  const load = repos.map((repo) => pairs.filter((p) => assign.get(p) === repo).reduce((t, p) => t + minutes(p), 0) / slots(repo));
  return [Math.max(...s), Math.max(...load)];
};
const better = (a, b) => a[0] < b[0] || (a[0] === b[0] && a[1] < b[1] - 1e-9);
const before = new Map(pairs.map((p) => [p, ownerNow(p)]));
let assign = new Map(before);
for (let step = 0; step < 500; step++) {
  const now = score(assign);
  const s = spans(assign);
  const worst = repos[s.indexOf(Math.max(...s))];
  let best = null;
  const tryIt = (change) => {
    const next = new Map(assign);
    for (const [p, r] of change) next.set(p, r);
    const sc = score(next);
    if (better(sc, best?.score ?? now)) best = { score: sc, next };
  };
  for (const p of pairs.filter((x) => assign.get(x) === worst)) {
    for (const r of repos.filter((x) => x !== worst)) {
      tryIt([[p, r]]);
      for (const q of pairs.filter((x) => assign.get(x) === r)) tryIt([[p, r], [q, worst]]);
    }
  }
  if (best === null) break;
  assign = best.next;
}
// Worth it only when the run is MIN_GAIN minutes shorter; then every move that does not help is undone.
if (score(before)[0] - score(assign)[0] < MIN_GAIN) assign = new Map(before);
else {
  for (const p of pairs.filter((x) => assign.get(x) !== before.get(x))) {
    const back = new Map(assign);
    back.set(p, before.get(p));
    if (score(back)[0] <= score(assign)[0]) assign = back;
  }
}

const show = (label, a) => {
  const s = spans(a);
  console.log(`${label}: the run takes about ${Math.max(...s)} min (longest pair ${Math.max(...pairs.map(minutes))} min)`);
  repos.forEach((repo, i) => {
    const mine = pairs.filter((p) => a.get(p) === repo);
    console.log(`  ${repo} (${slots(repo)} slots): ${mine.length} pairs, ${mine.reduce((t, p) => t + minutes(p), 0)} job-min, ${s[i]} min`);
  });
};
console.log(`balance: ${pairs.length} pairs (${asked}); minutes from ${known.runs.join(', ') || 'no run'}, ${pairs.filter((p) => known.minutes[p] === undefined).length} estimated at ${median}`);
show('now', before);
const moved = pairs.filter((p) => assign.get(p) !== before.get(p));
if (moved.length === 0) console.log('balance: the current split is already the best; nothing to move');
else {
  show('balanced', assign);
  console.log(`balance: moves ${moved.map((p) => `${p} -> ${assign.get(p)}`).join(', ')}`);
}

if (write) {
  writeFileSync(minutesFile, `${JSON.stringify({ about: 'Minutes of each pair job in the last runs (ci/balance.mjs --times), for the split between the runner repositories.', runs: known.runs, minutes: Object.fromEntries(Object.entries(known.minutes).sort()) }, null, 2)}\n`);
  if (moved.length > 0) {
    const balancedClasses = new Set(pairs.map(classOf));
    for (const r of active) {
      const keep = r.classes.filter((c) => !balancedClasses.has(classOf(c.includes('.') ? c : `${c}.x`)));
      const mine = [...balancedClasses].sort().flatMap((c) => {
        const of = pairs.filter((p) => classOf(p) === c);
        const here = of.filter((p) => assign.get(p) === r.repository);
        return here.length === of.length ? [c] : here;
      });
      r.classes = [...keep, ...mine];
    }
    writeFileSync(runnersFile, `${JSON.stringify(runners, null, 2)}\n`);
    console.log('balance: wrote settings/runners.json');
  }
}
