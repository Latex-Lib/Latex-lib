/**
 * The library's checks (ARCHITECTURE.md sections 3 and 9.1), as Flouest's
 * `templateLooks.check.ts` and `registry.check.ts` check theirs:
 *
 * - every id has its shape and every id a rule names resolves: a way, a
 *   class, a package, a package option or library, a parent the nesting list
 *   gives the node, a node whose General ways a conflict names, a parameter a
 *   predicate or a preset names;
 * - every word comes from its closed vocabulary (features, claims);
 * - every preset's parameters fit the handler's schema;
 * - every rule carries a reason and evidence, or the key stays a draft.
 *
 * Each problem is one sentence naming where it is.
 */
import { EVIDENCE_KINDS, type Evidence } from './evidence.ts';
import { EXCLUSIVES, FEATURES } from './features.ts';
import { CLASS_ID, DOC_NODE, PACKAGE_ID, WAY_ID, type Json, type NodeId } from './ids.ts';
import type { ClassProfile, PackageFacts } from './class.ts';
import type { HandlerKey, PackageLoad, ParentEntry, Requirement, Resource } from './key.ts';
import { paramProblem, type ParamPredicate, type ParamSchema } from './params.ts';
import { parentsOf, type Nesting } from '../nesting.ts';

export type Library = {
  readonly keys: readonly HandlerKey[];
  readonly classes: readonly ClassProfile[];
  readonly packages: readonly PackageFacts[];
};

const RESOURCE = /^(env|counter|cmd|length|color|style):\S+$/;
const SUPPORT = new Set(['yes', 'no', 'untested']);

const duplicates = (ids: readonly string[]): string[] => [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];

/** The parameters `{name}` in a resource names; `{kind}` stands for the node's kinds, not a parameter. */
const placeholders = (resource: string): string[] => [...resource.matchAll(/\{([A-Za-z][A-Za-z0-9]*)\}/g)].map((m) => m[1] ?? '').filter((p) => p !== 'kind');

export const validateLibrary = (library: Library, nesting: Nesting): string[] => {
  const problems: string[] = [];
  // A way may serve several nodes (bib.natbib prints the reference list and the citations), so a handler is its node and its way.
  const ids = new Set(library.keys.map((k) => k.id));
  const keyAt = (node: NodeId, way: string): HandlerKey | undefined => library.keys.find((k) => k.node === node && k.id === way);
  const classes = new Set(library.classes.map((c) => c.id));
  const packages = new Map(library.packages.map((p) => [p.id, p]));

  for (const at of duplicates(library.keys.map((k) => `${k.node} ${k.id}`))) problems.push(`way ${at.split(' ')[1]}: two keys of ${at.split(' ')[0]} have this id`);
  for (const id of duplicates(library.classes.map((c) => c.id))) problems.push(`class ${id}: two profiles have this id`);
  for (const id of duplicates(library.packages.map((p) => p.id))) problems.push(`package ${id}: two facts have this id`);

  const evidenceProblems = (where: string, evidence: readonly Evidence[]): void => {
    for (const e of evidence) if (!(EVIDENCE_KINDS as readonly string[]).includes(e.kind)) problems.push(`${where}: evidence of unknown kind ${e.kind}`);
  };
  const pkgResolves = (where: string, pkg: string): boolean => {
    if (packages.has(pkg)) return true;
    problems.push(`${where}: package ${pkg} has no facts in packages/`);
    return false;
  };
  const predicateProblems = (where: string, when: ParamPredicate | undefined, params: ParamSchema | undefined): void => {
    if (when === undefined || params === undefined) return;
    for (const name of Object.keys(when)) if (!(name in params)) problems.push(`${where}: names parameter ${name}, which is not in the schema`);
  };
  const loadProblems = (where: string, load: PackageLoad, params: ParamSchema): void => {
    if (!pkgResolves(where, load.pkg)) return;
    const facts = packages.get(load.pkg);
    for (const option of load.options ?? []) {
      if (!(option in (facts?.options ?? {}))) problems.push(`${where}: ${load.pkg} has no option ${option} in its facts`);
    }
    for (const library of load.libraries ?? []) {
      if (!(facts?.libraries ?? []).includes(library)) problems.push(`${where}: ${load.pkg} has no library ${library} in its facts`);
    }
    for (const group of facts?.exclusive ?? []) {
      const given = group.filter((o) => (load.options ?? []).includes(o));
      if (given.length > 1) problems.push(`${where}: ${load.pkg} options ${given.join(' and ')} exclude each other`);
    }
    predicateProblems(where, load.when, params);
  };

  for (const key of library.keys) {
    const at = `way ${key.id}`;
    if (!WAY_ID.test(key.id)) problems.push(`${at}: the id is not <component>.<way>`);
    if (key.node !== DOC_NODE && nesting.nodes[key.node] === undefined) problems.push(`${at}: node ${key.node} is not in Flouest's nesting list`);
    if (key.description.trim() === '') problems.push(`${at}: no description`);
    for (const f of key.features) if (!(FEATURES as readonly string[]).includes(f)) problems.push(`${at}: feature ${f} is not in the vocabulary`);
    if (!SUPPORT.has(key.zerotex)) problems.push(`${at}: ZeroTeX support ${key.zerotex} is not yes, no or untested`);

    // Parameters and presets.
    for (const [name, spec] of Object.entries(key.params)) {
      if (spec.type === 'enum' && (spec.values ?? []).length === 0) problems.push(`${at}: parameter ${name} is an enum with no values`);
      if (spec.default !== undefined) {
        const why = paramProblem(spec, spec.default);
        if (why !== undefined) problems.push(`${at}: parameter ${name}'s default ${JSON.stringify(spec.default)} ${why}`);
      }
    }
    if (Object.keys(key.presets).length === 0) problems.push(`${at}: no preset`);
    for (const [name, preset] of Object.entries(key.presets)) {
      const where = `${at} preset ${name}`;
      if (preset.description.trim() === '') problems.push(`${where}: no description`);
      for (const f of preset.features) if (!(FEATURES as readonly string[]).includes(f)) problems.push(`${where}: feature ${f} is not in the vocabulary`);
      for (const [param, value] of Object.entries(preset.params)) {
        const spec = key.params[param];
        if (spec === undefined) problems.push(`${where}: parameter ${param} is not in the schema`);
        else {
          const why = paramProblem(spec, value as Json);
          if (why !== undefined) problems.push(`${where}: ${param} = ${JSON.stringify(value)} ${why}`);
        }
      }
      evidenceProblems(where, preset.evidence);
    }

    // What it puts in the document.
    key.loads.forEach((load, i) => loadProblems(`${at} load ${i + 1}`, load, key.params));
    const defined = key.defines.map((d) => (typeof d === 'string' ? d : d.name));
    for (const d of key.defines) if (typeof d !== 'string') predicateProblems(`${at} defines ${d.name}`, d.when, key.params);
    const resources: readonly (Resource | Requirement)[] = [...defined, ...key.requires];
    for (const r of defined) if (!RESOURCE.test(r)) problems.push(`${at}: defines ${r}, which is not kind:name`);
    for (const r of resources) {
      for (const p of placeholders(r)) if (!(p in key.params)) problems.push(`${at}: ${r} names parameter ${p}, which is not in the schema`);
    }
    for (const c of key.claims) if (!(EXCLUSIVES as readonly string[]).includes(c)) problems.push(`${at}: claim ${c} is not in the vocabulary`);
    for (const r of key.requires) {
      if (r.startsWith('claim:') && !(EXCLUSIVES as readonly string[]).includes(r.slice(6))) problems.push(`${at}: requires ${r}, a claim not in the vocabulary`);
      else if (r.startsWith('pkg:')) pkgResolves(`${at} requires`, r.slice(4));
      else if (!r.startsWith('claim:') && !RESOURCE.test(r)) problems.push(`${at}: requires ${r}, which is not kind:name, claim: or pkg:`);
    }

    // Document class.
    for (const rule of key.classes.deny) {
      if (!classes.has(rule.class)) problems.push(`${at}: denies class ${rule.class}, which has no profile in classes/`);
      predicateProblems(`${at} class ${rule.class}`, rule.unless, key.params);
      evidenceProblems(`${at} class ${rule.class}`, rule.evidence);
    }
    for (const c of key.classes.only ?? []) if (!classes.has(c)) problems.push(`${at}: only for class ${c}, which has no profile in classes/`);
    for (const rule of key.classes.onlyWhen ?? []) {
      const where = `${at} only when ${JSON.stringify(rule.when)}`;
      for (const c of rule.classes) if (!classes.has(c)) problems.push(`${where}: only for class ${c}, which has no profile in classes/`);
      if (rule.classes.length === 0) problems.push(`${where}: names no class`);
      predicateProblems(where, rule.when, key.params);
      evidenceProblems(where, rule.evidence);
    }
    if (key.classes.oneColumn !== undefined) evidenceProblems(`${at} one column`, key.classes.oneColumn.evidence);

    // Packages across the document.
    for (const rule of key.packages.conflicts) {
      if ([rule.way, rule.pkg, rule.general].filter((x) => x !== undefined).length !== 1) problems.push(`${at}: a conflict names none, or more than one, of a way, a package and General's node`);
      if (rule.general !== undefined && nesting.nodes[rule.general] === undefined) problems.push(`${at}: conflicts with General's ${rule.general}, which is not in Flouest's nesting list`);
      if (rule.way !== undefined && !ids.has(rule.way)) problems.push(`${at}: conflicts with way ${rule.way}, which has no key`);
      if (rule.pkg !== undefined && pkgResolves(`${at} conflict`, rule.pkg) && rule.unless !== undefined) {
        if (!(rule.unless.option in (packages.get(rule.pkg)?.options ?? {}))) problems.push(`${at}: conflict with ${rule.pkg} unless option ${rule.unless.option}, which is not in its facts`);
      }
      evidenceProblems(`${at} conflict`, rule.evidence);
    }
    for (const order of key.packages.loadOrder ?? []) {
      for (const pkg of [order.after, order.before]) if (pkg !== undefined) pkgResolves(`${at} load order`, pkg);
    }

    // Nesting.
    for (const g of key.context.givesWhen ?? []) predicateProblems(`${at} gives when`, g.when, key.params);
    for (const n of key.context.needsWhen ?? []) predicateProblems(`${at} needs when`, n.when, key.params);
    const legal = new Set(parentsOf(nesting, key.node));
    for (const [parent, entry] of Object.entries(key.parents) as [NodeId, ParentEntry][]) {
      const where = `${at} under ${parent}`;
      if (parent !== '*' && !legal.has(parent)) problems.push(`${where}: ${parent} is not a legal parent of ${key.node} in Flouest's nesting list`);
      const parentWays = (way: string): HandlerKey | undefined =>
        way === '*' ? undefined : parent === '*' ? library.keys.find((k) => k.id === way) : (keyAt(parent, way) ?? library.keys.find((k) => k.id === way));
      for (const rule of [...(entry.allow ?? []), ...(entry.deny ?? []), ...(entry.adapt ?? [])]) {
        if (rule.way !== '*') {
          const parentKey = parentWays(rule.way);
          if (parentKey === undefined) problems.push(`${where}: names parent way ${rule.way}, which has no key`);
          else if (parent !== '*' && parentKey.node !== parent) problems.push(`${where}: names way ${rule.way}, which is a way of ${parentKey.node}`);
          predicateProblems(`${where} ${rule.way}`, rule.when, parentKey?.params);
        }
        if (rule.reason.trim() === '') problems.push(`${where}: a rule with no reason`);
        evidenceProblems(where, rule.evidence);
      }
      for (const rule of entry.adapt ?? []) {
        for (const name of Object.keys(rule.set)) if (!(name in key.params)) problems.push(`${where}: an adapt sets ${name}, which is not in the schema`);
        rule.addLoads?.forEach((load, i) => loadProblems(`${where} adapt load ${i + 1}`, load, key.params));
      }
      if (entry.fallback !== undefined) fallbackProblems(where, entry.fallback);
    }
    if (key.fallback !== undefined) fallbackProblems(at, key.fallback);

    // Provenance: a verified key has evidence for itself and every rule.
    if (key.status === 'verified') {
      const bare = [
        ...key.classes.deny.filter((r) => r.evidence.length === 0).map((r) => `class ${r.class}`),
        ...(key.classes.oneColumn !== undefined && key.classes.oneColumn.evidence.length === 0 ? ['one column'] : []),
        ...(key.classes.onlyWhen ?? []).filter((r) => r.evidence.length === 0).map((r) => `only when ${JSON.stringify(r.when)}`),
        ...key.packages.conflicts.filter((r) => r.evidence.length === 0).map((r) => `conflict with ${r.way ?? r.pkg ?? `General's ${r.general}`}`),
        ...Object.entries(key.parents).flatMap(([parent, e]) =>
          [...(e.allow ?? []), ...(e.deny ?? []), ...(e.adapt ?? [])].filter((r) => r.evidence.length === 0).map((r) => `${parent} ${r.way}`),
        ),
      ];
      if (key.evidence.length === 0) problems.push(`${at}: verified with no evidence`);
      for (const b of bare) problems.push(`${at}: verified, but its rule on ${b} has no evidence`);
    }

    function fallbackProblems(where: string, fallback: { readonly way: string; readonly preset?: string }): void {
      const to = keyAt(key.node, fallback.way) ?? library.keys.find((k) => k.id === fallback.way);
      if (to === undefined) problems.push(`${where}: falls back to ${fallback.way}, which has no key`);
      else if (to.node !== key.node) problems.push(`${where}: falls back to ${fallback.way}, a way of ${to.node}, not of ${key.node}`);
      else if (fallback.preset !== undefined && !(fallback.preset in to.presets)) problems.push(`${where}: falls back to preset ${fallback.preset}, which ${fallback.way} lacks`);
    }
  }

  for (const profile of library.classes) {
    const at = `class ${profile.id}`;
    if (!CLASS_ID.test(profile.id)) problems.push(`${at}: the id is not class.<name>`);
    if (profile.base !== undefined && !classes.has(profile.base)) problems.push(`${at}: builds on ${profile.base}, which has no profile`);
    for (const r of profile.defines) if (!RESOURCE.test(r)) problems.push(`${at}: defines ${r}, which is not kind:name`);
    for (const rule of [...profile.forbids.technical, ...profile.forbids.policy]) {
      pkgResolves(`${at} forbids`, rule.pkg);
      evidenceProblems(`${at} forbids ${rule.pkg}`, rule.evidence);
    }
    for (const rule of profile.forbids.names ?? []) {
      if (!RESOURCE.test(rule.name)) problems.push(`${at}: forbids ${rule.name}, which is not kind:name`);
      for (const pkg of rule.unlessLoaded ?? []) pkgResolves(`${at} forbids ${rule.name} unless`, pkg);
      evidenceProblems(`${at} forbids ${rule.name}`, rule.evidence);
    }
    for (const [option, effect] of Object.entries(profile.options)) {
      for (const r of [...(effect.removes ?? []), ...(effect.adds ?? [])]) if (!RESOURCE.test(r)) problems.push(`${at} option ${option}: ${r} is not kind:name`);
    }
    evidenceProblems(at, profile.evidence);
  }

  for (const facts of library.packages) {
    const at = `package ${facts.id}`;
    if (!PACKAGE_ID.test(facts.id)) problems.push(`${at}: the id is not a package name`);
    for (const group of facts.exclusive) for (const o of group) if (!(o in facts.options)) problems.push(`${at}: exclusive option ${o} is not among its options`);
    for (const order of facts.loadOrder) for (const pkg of [order.after, order.before]) if (pkg !== undefined) pkgResolves(`${at} load order`, pkg);
    for (const rule of facts.conflicts ?? []) {
      pkgResolves(`${at} conflict`, rule.pkg);
      evidenceProblems(`${at} conflict with ${rule.pkg}`, rule.evidence);
    }
    for (const r of facts.defines) if (!RESOURCE.test(r)) problems.push(`${at}: defines ${r}, which is not kind:name`);
    evidenceProblems(at, facts.evidence);
  }

  return problems;
};
