/**
 * `compat.generated.json` (ARCHITECTURE.md 4.4): beside each handler, the
 * complete, explicit per-parent table. For every legal parent of the node and
 * every way that parent can use, the verdict and where it came from:
 *
 * - derived: the handler's needs (with each `needsWhen` its default params
 *   match) met by what that parent way's body gives (`contexts.ts`), from the
 *   document body down; a parent no library way covers yet gives what
 *   General's node gives;
 * - authored: the key's own rules for that parent, which win over the
 *   derived verdict in the order deny > adapt > allow. A denied handler with
 *   a fallback falls back.
 *
 * A row's status is `derived` or, for an authored rule, `untested`, until the
 * testing pipeline's matrix has compiled it. Its table for the way
 * (`matrix.generated.json`, written beside the handler by the pipeline's
 * `writeCompat`) says, per parent way and class setting, how many branches
 * holding the step passed: all of them make the row `verified-ok`; some
 * failing make it `failing`, naming the class settings, until the explainer's
 * candidate for it is accepted, which makes it `verified-fail`. A deny (or
 * fallback) none of whose branches passed is `verified-fail` at once: the
 * matrix confirms it. A row with a predicate over the parent's params keeps
 * its status: the matrix does not split on those params yet.
 *
 * `generatedFrom` holds the hashes of what the table was made from (the key,
 * the contexts, the matrix table), so `checkCompat` finds a stale one. The
 * file is never edited by hand.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { below, DOCUMENT, GENERAL_GIVES, needsOf, unmet, type ContextChange } from './contexts.ts';
import { canonical, hashJson } from './hash.ts';
import { BODY, parentsOf, type Nesting } from './nesting.ts';
import { nodeFolder, type Json, type NodeId, type WayId } from './schema/ids.ts';
import type { AdaptRule, HandlerKey, ParentEntry, ParentWayRule } from './schema/key.ts';
import { withDefaults, type ParamPredicate } from './schema/params.ts';

export const COMPAT_FILE = 'compat.generated.json';
export const MATRIX_FILE = 'matrix.generated.json';

/** The pipeline's table for one way (its `CompatTable`): verified entries per parent way and class setting, accepted rules, pending candidates. */
export type MatrixTable = {
  readonly way: WayId;
  readonly from: { readonly [input: string]: string };
  readonly entries: readonly (
    | { readonly kind: 'verified'; readonly parent: { readonly node: NodeId; readonly way: WayId } | null; readonly pair: string; readonly branches: number; readonly pass: number }
    | { readonly kind: 'rule'; readonly candidate: string; readonly rule: { readonly [name: string]: Json } }
    | { readonly kind: 'pending'; readonly candidates: readonly string[] }
  )[];
};

export type CompatRow = {
  readonly verdict: 'ok' | 'deny' | 'adapt' | 'fallback';
  readonly source: 'derived' | 'authored';
  readonly status: 'derived' | 'untested' | 'verified-ok' | 'failing' | 'verified-fail';
  /** From the matrix: branches holding the step, how many passed, and the class settings where some failed. */
  readonly matrix?: { readonly branches: number; readonly pass: number; readonly failing: readonly string[] };
  /** For a derived deny: what the context lacks. */
  readonly lacks?: readonly string[];
  /** For an adapt: the parameters set. */
  readonly set?: { readonly [name: string]: Json };
  /** For a fallback: the way emitted instead. */
  readonly to?: WayId;
  readonly reason?: string;
};

export type CompatTable = {
  readonly handler: WayId;
  readonly node: NodeId;
  readonly generatedFrom: { readonly key: string; readonly contexts: string; readonly matrix: string | null };
  /** Parent node, then the parent's way (with a predicate over its params, `way[name=value]`), then the row. */
  readonly parents: { readonly [parent: NodeId]: { readonly [parentWay: string]: CompatRow } };
  readonly packageCombos: {
    readonly deny: readonly { readonly with: string; readonly unless?: string; readonly when?: string; readonly reason: string; readonly status: CompatRow['status'] }[];
  };
};

/** How a predicate reads in a row's name: `name=value|value`, names in order. */
const predicateText = (when: ParamPredicate): string =>
  Object.keys(when)
    .sort()
    .map((name) => {
      const v = when[name];
      return `${name}=${(Array.isArray(v) ? v : [v]).map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join('|')}`;
    })
    .join(',');

/** One way the parent can be: a way and, maybe, a predicate over its params, with what its body gives. */
type ParentRow = { readonly name: string; readonly way: WayId | null; readonly when?: ParamPredicate; readonly gives: ContextChange };

const merge = (a: ContextChange, b: ContextChange): ContextChange => ({ ...a, ...b, boxDepth: (a.boxDepth ?? 0) + (b.boxDepth ?? 0) });

/** The rows of one parent: each of its library ways (and each predicate a `givesWhen` or a rule names), or General's node when none. */
const parentRows = (parent: NodeId, ways: readonly HandlerKey[], entry: ParentEntry | undefined): ParentRow[] => {
  if (parent === BODY) return [{ name: '(document body)', way: null, gives: {} }];
  if (ways.length === 0) return [{ name: '(General)', way: null, gives: GENERAL_GIVES[parent]?.gives ?? {} }];
  return ways.flatMap((w) => {
    const rows: ParentRow[] = [{ name: w.id, way: w.id, gives: w.context.gives }];
    for (const g of w.context.givesWhen ?? []) rows.push({ name: `${w.id}[${predicateText(g.when)}]`, way: w.id, when: g.when, gives: merge(w.context.gives, g.gives) });
    const rules: readonly (ParentWayRule | AdaptRule)[] = [...(entry?.allow ?? []), ...(entry?.deny ?? []), ...(entry?.adapt ?? [])];
    for (const r of rules) {
      if (r.when === undefined || r.way !== w.id) continue;
      const name = `${w.id}[${predicateText(r.when)}]`;
      if (!rows.some((row) => row.name === name)) rows.push({ name, way: w.id, when: r.when, gives: w.context.gives });
    }
    return rows;
  });
};

/** A rule applies to a row when it names the row's way (or every way) and, if it has a predicate, the row's. */
const applies = (rule: ParentWayRule | AdaptRule, row: ParentRow): boolean =>
  (rule.way === '*' || rule.way === row.way) && (rule.when === undefined || (row.when !== undefined && canonical(rule.when) === canonical(row.when)));

/** What the matrix says about one row: the verified entries for its parent node and way, summed. */
const verifiedFor = (matrix: MatrixTable | undefined, parent: NodeId, row: ParentRow): CompatRow['matrix'] | undefined => {
  if (matrix === undefined || row.when !== undefined) return undefined;
  const entries = matrix.entries.flatMap((e) => (e.kind !== 'verified' ? [] : [e])).filter((e) =>
    parent === BODY ? e.parent === null : e.parent !== null && e.parent.node === parent && (row.way === null ? e.parent.way.startsWith('general:') : e.parent.way === row.way),
  );
  if (entries.length === 0) return undefined;
  const failing = [...new Set(entries.filter((e) => e.pass < e.branches).map((e) => e.pair))].sort();
  return { branches: entries.reduce((n, e) => n + e.branches, 0), pass: entries.reduce((n, e) => n + e.pass, 0), failing };
};

/** A row with what the matrix found: verified-ok, failing, or verified-fail once an accepted rule names the way or every branch of a deny failed. */
const withMatrix = (row: CompatRow, found: CompatRow['matrix'] | undefined, accepted: boolean): CompatRow => {
  if (found === undefined) return row;
  // A deny (or fallback) none of whose branches passed is what the matrix confirms: verified-fail, as an accepted rule makes it.
  const confirmed = (row.verdict === 'deny' || row.verdict === 'fallback') && found.pass === 0;
  const status: CompatRow['status'] = found.failing.length === 0 ? 'verified-ok' : accepted || confirmed ? 'verified-fail' : 'failing';
  return { ...row, status, matrix: found };
};

export const compatTable = (key: HandlerKey, ways: readonly HandlerKey[], nesting: Nesting, matrix?: MatrixTable): CompatTable => {
  const accepted = (matrix?.entries ?? []).some((e) => e.kind === 'rule');
  // One table per handler, not per preset: its needs at its default params (fig.graphicx's `float` defaults to true).
  const needs = needsOf(key.context, withDefaults(key.params));
  const parents: { [parent: NodeId]: { [parentWay: string]: CompatRow } } = {};
  const contexts: { [parent: NodeId]: Json } = {};
  for (const parent of parentsOf(nesting, key.node)) {
    const entry = key.parents[parent] ?? key.parents['*'];
    const parentWays = ways.filter((w) => w.node === parent);
    const rows = parentRows(parent, parentWays, entry);
    contexts[parent] = rows.map((r) => ({ name: r.name, gives: r.gives })) as unknown as Json;
    const fallback = entry?.fallback ?? key.fallback;
    const table: { [parentWay: string]: CompatRow } = {};
    for (const row of rows) {
      const found = verifiedFor(matrix, parent, row);
      const deny = (entry?.deny ?? []).find((r) => applies(r, row));
      const adapt = (entry?.adapt ?? []).find((r) => applies(r, row));
      const allow = (entry?.allow ?? []).find((r) => applies(r, row));
      const lacks = unmet(needs, below(DOCUMENT, row.gives));
      const fallbackRow = (reason: string, source: CompatRow['source']): CompatRow =>
        fallback === undefined
          ? { verdict: 'deny', source, status: source === 'derived' ? 'derived' : 'untested', reason, ...(source === 'derived' ? { lacks } : {}) }
          : { verdict: 'fallback', source, status: source === 'derived' ? 'derived' : 'untested', to: fallback.way, reason, ...(source === 'derived' ? { lacks } : {}) };
      const made: CompatRow =
        deny !== undefined
          ? fallbackRow(deny.reason, 'authored')
          : adapt !== undefined
            ? { verdict: 'adapt', source: 'authored', status: 'untested', set: adapt.set, reason: adapt.reason }
            : allow !== undefined
              ? { verdict: 'ok', source: 'authored', status: 'untested', reason: allow.reason }
              : lacks.length > 0
                ? fallbackRow(lacks.join('; '), 'derived')
                : { verdict: 'ok', source: 'derived', status: 'derived' };
      table[row.name] = withMatrix(made, found, accepted);
    }
    parents[parent] = table;
  }
  return {
    handler: key.id,
    node: key.node,
    generatedFrom: { key: hashJson(key), contexts: hashJson(contexts), matrix: matrix === undefined ? null : hashJson(matrix) },
    parents,
    packageCombos: {
      deny: key.packages.conflicts.map((c) => ({
        with: c.way ?? c.pkg ?? (c.general === undefined ? '' : `general:${c.general}`),
        ...(c.unless === undefined ? {} : { unless: `${c.pkg}[${c.unless.option}]` }),
        ...(c.when === undefined ? {} : { when: predicateText(c.when) }),
        reason: c.reason,
        status: 'untested' as const,
      })),
    },
  };
};

/** Where a handler's table goes: `nodes/<node>/<way>/compat.generated.json`. */
export const compatPath = (root: string, key: HandlerKey): string => join(root, 'nodes', nodeFolder(key.node), key.id, COMPAT_FILE);

const printed = (table: CompatTable): string => `${JSON.stringify(table, null, 2)}\n`;

/** The matrix table the pipeline wrote beside the handler, if it has. */
export const readMatrix = (root: string, key: HandlerKey): MatrixTable | undefined => {
  const path = join(root, 'nodes', nodeFolder(key.node), key.id, MATRIX_FILE);
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as MatrixTable) : undefined;
};

/** Writes every key's table; returns the paths written. */
export const writeCompat = (root: string, keys: readonly HandlerKey[], nesting: Nesting): string[] =>
  keys.map((key) => {
    const path = compatPath(root, key);
    writeFileSync(path, printed(compatTable(key, keys, nesting, readMatrix(root, key))));
    return path;
  });

/** Each table missing or not what its key, the contexts and the nesting list give now. */
export const checkCompat = (root: string, keys: readonly HandlerKey[], nesting: Nesting): string[] =>
  keys.flatMap((key) => {
    const path = compatPath(root, key);
    if (!existsSync(path)) return [`way ${key.id}: no ${COMPAT_FILE} (npm run generate)`];
    return readFileSync(path, 'utf8') === printed(compatTable(key, keys, nesting, readMatrix(root, key))) ? [] : [`way ${key.id}: ${COMPAT_FILE} is stale (npm run generate)`];
  });
