/**
 * The resolver (ARCHITECTURE.md section 8, step 2): whether a set of handler
 * choices can go together under a class. Each violation is one sentence:
 *
 * - the class: a class-native handler's `only` (and `onlyWhen`, for the
 *   presets whose params match), a key's class rules, a one-column way on a
 *   two-column page (the class's, `twocolumn`, or an option its profile says
 *   sets two columns), a name the handler defines
 *   that the class already does (`defines ∩ class.defines`), a package the
 *   class forbids (technically or by policy), a heading at a level whose
 *   command the class forbids though it defines it, unless a chosen way
 *   loads a package that replaces it (`forbids.names`), or a way that
 *   requires such a name, a package the class (or a class it builds on)
 *   preloads loaded again with an option the class did not give it (LaTeX's
 *   option clash; less what the class options given unload: tufte-handout's
 *   nobib), and text the class keeps for \maketitle (`heldByMaketitle`) where
 *   no chosen handler runs \maketitle (`claim:maketitle`), which loses it;
 * - the document: two handlers owning one claim, a package or way a handler
 *   conflicts with, two packages whose facts refuse each other, options a
 *   package's facts mark exclusive, a requirement nobody supplies (a counter
 *   the class lacks), and a conflict with General's ways of a node when the
 *   caller names the nodes General prints (`general`: the AI layer does, since
 *   a node it chose no handler for is printed by General; the testing
 *   pipeline files those conflicts itself and names none);
 * - the engine: the target engine is the only one; a handler or class that does not
 *   run there goes nowhere.
 *
 * `pick` is the theorem pilot's choice for one node: the target way as its
 * preset gives it, then renamed when the class defines its names, then the
 * way's own fallback, then the class's own environments.
 */
import type { ClassProfile } from '../schema/class.ts';
import type { ClassId, Json, NodeId, WayId } from '../schema/ids.ts';
import type { Definition, HandlerKey, Requirement, Resource } from '../schema/key.ts';
import { matches, withDefaults } from '../schema/params.ts';
import type { Library } from '../schema/validate.ts';

/** A handler chosen for a node: its way, the node when the way serves several, its parameters. */
export type Choice = { readonly way: WayId; readonly node?: NodeId; readonly params?: { readonly [name: string]: Json } };

/** The names a set of placeholders give: `{kind}` over the node's kinds, `{param}` by its value; empty or `none` gives nothing. */
const expand = (name: string, params: { readonly [name: string]: Json }, kinds: readonly string[]): string[] => {
  const withParams = name.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (m, p: string) => (p === 'kind' ? m : String(params[p] ?? '')));
  const names = withParams.includes('{kind}') ? kinds.map((k) => withParams.replace(/\{kind\}/g, k)) : [withParams];
  return names.filter((n) => !/:(none)?$/.test(n));
};

const definitions = (defines: readonly Definition[], params: { readonly [name: string]: Json }, kinds: readonly string[]): string[] =>
  defines.flatMap((d) => (typeof d === 'string' ? expand(d, params, kinds) : matches(d.when, params) ? expand(d.name, params, kinds) : []));

/** What the class defines once its options have done their work. */
const classDefines = (profile: ClassProfile, options: readonly string[]): Set<string> => {
  const removed = new Set(options.flatMap((o) => profile.options[o]?.removes ?? []));
  return new Set([...profile.defines, ...options.flatMap((o) => profile.options[o]?.adds ?? [])].filter((r) => !removed.has(r as Resource)));
};

export const resolve = (
  library: Library,
  input: {
    readonly classId: ClassId;
    readonly classOptions?: readonly string[];
    readonly choices: readonly Choice[];
    /** Each node's kinds the document uses (a statement's elementName), for `{kind}`. */
    readonly kinds?: { readonly [node: NodeId]: readonly string[] };
    /** The nodes General's own ways print in this document. A key's conflict with General's ways of a node holds only for a node named here. */
    readonly general?: readonly NodeId[];
  },
): string[] => {
  const packages = new Map(library.packages.map((p) => [p.id, p]));
  const profile = library.classes.find((c) => c.id === input.classId);
  // The options the document gives, with those the class needs in the target engine (`setup`), which every document of it gives.
  const classOptions = [...new Set([...(input.classOptions ?? []), ...(profile?.setup?.options ?? [])])];
  // The class and every class it builds on: a rule for beamer holds under ctexbeamer.
  const chain: ClassId[] = [];
  for (let c: ClassProfile | undefined = profile, id: ClassId | undefined = input.classId; id !== undefined && !chain.includes(id); c = library.classes.find((x) => x.id === c?.base), id = c?.id) chain.push(id);
  const violations: string[] = [];
  const chosen = input.choices.flatMap((c) => {
    const key = library.keys.find((k) => k.id === c.way && (c.node === undefined || k.node === c.node));
    if (key === undefined) {
      violations.push(`${c.way}: no such handler`);
      return [];
    }
    const params = withDefaults(key.params, c.params);
    return [{ key, params, kinds: input.kinds?.[key.node] ?? [] }];
  });
  const loaded = new Map<string, Set<string>>();
  // What the class loads itself, less what an option given leaves out (tufte-handout's nobib: natbib and bibentry, so biblatex goes there).
  const unloaded = new Set(classOptions.flatMap((o) => profile?.options[o]?.unloads ?? []));
  for (const pre of profile?.preloads ?? []) if (!unloaded.has(pre.pkg)) loaded.set(pre.pkg, new Set(pre.options ?? []));
  // What its setup loads in every document's preamble (quantumarticle's hyperref).
  for (const load of profile?.setup?.loads ?? []) loaded.set(load.pkg, new Set([...(loaded.get(load.pkg) ?? []), ...(load.options ?? [])]));
  // What the class and the classes it builds on load themselves (less what an option given unloads), and keep for \maketitle.
  const profiles = chain.flatMap((id) => library.classes.filter((c) => c.id === id));
  const preloaded = new Map<string, Set<string>>();
  for (const pre of profiles.flatMap((c) => c.preloads)) if (!unloaded.has(pre.pkg)) preloaded.set(pre.pkg, new Set([...(preloaded.get(pre.pkg) ?? []), ...(pre.options ?? [])]));
  const held = new Map(profiles.flatMap((c) => c.heldByMaketitle ?? []).map((h) => [h.resource as string, h]));
  const runsMaketitle = chosen.some(({ key }) => key.claims.includes('maketitle'));
  for (const { key, params } of chosen) {
    for (const load of key.loads) {
      if (!matches(load.when, params)) continue;
      const options = loaded.get(load.pkg) ?? new Set<string>();
      for (const o of load.options ?? []) options.add(o);
      loaded.set(load.pkg, options);
    }
  }
  const defined = new Set<string>([...(profile === undefined ? [] : classDefines(profile, classOptions))]);
  for (const pkg of loaded.keys()) for (const r of packages.get(pkg)?.defines ?? []) defined.add(r);
  const ownDefinitions = chosen.map(({ key, params, kinds }) => ({ key, names: definitions(key.defines, params, kinds) }));
  for (const { names } of ownDefinitions) for (const n of names) defined.add(n);

  for (const { key, params, kinds } of chosen) {
    const at = key.id;
    // What it requires, with what it requires only when its parameters match.
    const requirements = [...key.requires, ...(key.requiresWhen ?? []).filter((r) => matches(r.when, params)).flatMap((r) => r.requires)] as readonly Requirement[];
    // The class.
    if (key.classes.only !== undefined && !key.classes.only.some((c) => chain.includes(c))) violations.push(`${at}: only for ${key.classes.only.join(', ')}, not ${input.classId}`);
    // A form only some classes give: `only` for the parameters that match (abs.class-native's \abstract{} command).
    for (const rule of key.classes.onlyWhen ?? []) {
      if (matches(rule.when, params) && !rule.classes.some((c) => chain.includes(c))) violations.push(`${at}: with ${JSON.stringify(rule.when)}, only for ${rule.classes.join(', ')}, not ${input.classId}: ${rule.reason}`);
    }
    // A class rule holds unless its `unless` is given and the parameters match it.
    for (const rule of key.classes.deny) if (chain.includes(rule.class) && (rule.unless === undefined || !matches(rule.unless, params))) violations.push(`${at}: ${rule.reason}`);
    const twoColumns = (profile?.layout?.columns === 2 && !classOptions.includes('onecolumn')) || classOptions.includes('twocolumn') || classOptions.some((o) => profile?.options[o]?.columns === 2);
    if (key.classes.oneColumn !== undefined && twoColumns) violations.push(`${at}: one column only: ${key.classes.oneColumn.reason}`);
    if (profile !== undefined) {
      // A class-native way (one with `only`) uses the class's own names and defines a name only where the class lacks it.
      const own = key.classes.only !== undefined ? [] : (ownDefinitions.find((d) => d.key === key)?.names ?? []);
      const clashes = own.filter((n) => classDefines(profile, classOptions).has(n));
      if (clashes.length > 0) violations.push(`${at}: defines ${clashes.join(', ')}, which ${input.classId} already defines`);
      for (const load of key.loads) {
        if (!matches(load.when, params)) continue;
        for (const rule of [...profile.forbids.technical, ...profile.forbids.policy]) if (rule.pkg === load.pkg) violations.push(`${at}: ${input.classId} forbids ${load.pkg}: ${rule.reason}`);
        // The class loaded it already: an option it did not give stops at LaTeX's option clash.
        const given = preloaded.get(load.pkg);
        const extra = given === undefined ? [] : (load.options ?? []).filter((o) => !given.has(o));
        if (extra.length > 0) violations.push(`${at}: ${input.classId} loads ${load.pkg} itself${given?.size ? ` with ${[...given].join(',')}` : ''}, so ${extra.join(',')} stops at "Option clash for package ${load.pkg}"`);
      }
      // A heading at a level whose command the class forbids though it defines it (llncs's \subparagraph), unless a chosen way loads a package that replaces it (sectsty).
      if (key.node === 'paragraph/heading') {
        for (const rule of profile.forbids.names ?? []) {
          if (kinds.some((k) => rule.name === `cmd:\\${k}`) && !(rule.unlessLoaded ?? []).some((p) => loaded.has(p))) violations.push(`${at}: ${input.classId} forbids ${rule.name}: ${rule.reason}`);
        }
      }
      // A name the class forbids though it defines it, required by the way (iopjournal's \maketitle, siamart's \tableofcontents), unless a chosen way loads a package that replaces it (none now: titling was one until batch 1 round 2 showed it only copies the title).
      for (const rule of profile.forbids.names ?? []) {
        if (requirements.some((r) => expand(r, params, kinds).includes(rule.name)) && !(rule.unlessLoaded ?? []).some((p) => loaded.has(p))) violations.push(`${at}: ${input.classId} forbids ${rule.name}: ${rule.reason}`);
      }
    }
    // The document.
    // A conflict with a `when` holds only for the parameters that match it.
    for (const rule of key.packages.conflicts.filter((r) => matches(r.when, params))) {
      if (rule.way !== undefined && chosen.some((c) => c.key.id === rule.way)) violations.push(`${at}: conflicts with ${rule.way}: ${rule.reason}`);
      if (rule.general !== undefined && (input.general ?? []).includes(rule.general)) violations.push(`${at}: conflicts with General's ${rule.general}, which the document prints: ${rule.reason}`);
      if (rule.pkg !== undefined && loaded.has(rule.pkg) && !key.loads.some((l) => l.pkg === rule.pkg)) {
        if (rule.unless === undefined || !loaded.get(rule.pkg)?.has(rule.unless.option)) violations.push(`${at}: conflicts with ${rule.pkg}, which the document loads: ${rule.reason}`);
      }
    }
    for (const r of requirements) {
      for (const name of expand(r, params, kinds)) {
        const keeps = held.get(name);
        // A claim's need, in the claim's own sentence: another choice can meet it, and a set is refused only when no chosen handler runs \maketitle.
        if (keeps !== undefined && !runsMaketitle) violations.push(`${at}: ${input.classId} keeps ${name} for \\maketitle, and its text is lost without it (${keeps.reason}): needs something to own maketitle`);
        if (name.startsWith('claim:')) {
          if (!chosen.some((c) => c.key.claims.includes(name.slice(6) as never))) violations.push(`${at}: needs something to own ${name.slice(6)}`);
        } else if (name.startsWith('pkg:')) {
          if (!loaded.has(name.slice(4))) violations.push(`${at}: needs package ${name.slice(4)}`);
        } else if (!defined.has(name)) violations.push(`${at}: needs ${name}, which nothing defines${profile === undefined ? '' : ` (${input.classId} lacks it)`}`);
      }
    }
    // The engine: the target engine, the only one.
    if (key.targetEngine === 'no') violations.push(`${at}: does not run in the target engine`);
  }
  if (profile?.targetEngine === 'no') violations.push(`${input.classId} does not run in the target engine`);
  const owners = new Map<string, string[]>();
  for (const { key } of chosen) for (const c of key.claims) owners.set(c, [...(owners.get(c) ?? []), key.id]);
  for (const [claim, ways] of owners) if (ways.length > 1) violations.push(`${ways.join(' and ')} both own ${claim}`);
  for (const [pkg, options] of loaded) {
    for (const rule of packages.get(pkg)?.conflicts ?? []) if (loaded.has(rule.pkg)) violations.push(`${pkg} cannot be loaded with ${rule.pkg}: ${rule.reason}`);
    for (const group of packages.get(pkg)?.exclusive ?? []) {
      const given = group.filter((o) => options.has(o));
      if (given.length > 1) violations.push(`${pkg}: options ${given.join(' and ')} exclude each other`);
    }
  }
  return violations;
};

export type How = 'as-is' | 'renamed' | 'fallback' | 'class-native';
export type Pick = { readonly way: WayId; readonly params: { readonly [name: string]: Json }; readonly how: How } | { readonly violations: readonly string[] };

/**
 * One node's handler under a class: the target way with each of its presets
 * (the asked one first), then renamed if the class defines its names, its
 * fallback, else the class's own environments; or why none goes.
 */
export const pick = (
  library: Library,
  input: { readonly node: NodeId; readonly way: WayId; readonly preset?: string; readonly classId: ClassId; readonly kinds: readonly string[]; readonly nativeWay?: WayId },
): Pick => {
  const key: HandlerKey | undefined = library.keys.find((k) => k.id === input.way && k.node === input.node);
  if (key === undefined) return { violations: [`${input.way}: no such handler`] };
  const names = Object.keys(key.presets);
  const ordered = input.preset === undefined ? names : [input.preset, ...names.filter((n) => n !== input.preset)];
  const presets = ordered.map((n) => key.presets[n]?.params ?? {});
  const fallback = key.fallback === undefined ? undefined : library.keys.find((k) => k.id === key.fallback?.way && k.node === key.node);
  const fallbackPreset = fallback === undefined ? {} : (fallback.presets[key.fallback?.preset ?? Object.keys(fallback.presets)[0] ?? '']?.params ?? {});
  const tries: { readonly way: WayId; readonly params: { readonly [name: string]: Json }; readonly how: How }[] = [
    ...presets.map((params) => ({ way: input.way, params, how: 'as-is' as const })),
    ...('rename' in key.params ? presets.map((params) => ({ way: input.way, params: { ...params, rename: 'yes' }, how: 'renamed' as const })) : []),
    ...(fallback === undefined ? [] : [{ way: fallback.id, params: fallbackPreset, how: 'fallback' as const }]),
    ...(input.nativeWay === undefined || input.nativeWay === input.way ? [] : [{ way: input.nativeWay, params: {}, how: 'class-native' as const }]),
  ];
  let first: string[] = [];
  for (const t of tries) {
    const violations = resolve(library, { classId: input.classId, choices: [{ way: t.way, node: input.node, params: t.params }], kinds: { [input.node]: input.kinds } });
    if (violations.length === 0) return t;
    if (first.length === 0) first = violations;
  }
  return { violations: first };
};
