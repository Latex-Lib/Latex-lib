/**
 * A handler's parameters (ARCHITECTURE.md section 3), typed from the Flouest
 * `Packages/` printer it calls, and the presets that fix them. Parameters
 * never make a new handler: a styling variation is a preset.
 */
import type { Evidence } from './evidence.ts';
import type { Feature } from './features.ts';
import type { Json } from './ids.ts';

/**
 * One parameter. `compat: true` marks one that can change whether the handler
 * works (`breakable`, a column spec, `ntheorem[amsthm]`): it splits variants in
 * the matrix, where every other parameter only rotates.
 */
export type ParamSpec = {
  readonly type: 'string' | 'number' | 'boolean' | 'enum' | 'dimen' | 'color' | 'tex';
  /** For `enum`: the values allowed. */
  readonly values?: readonly string[];
  readonly default?: Json;
  readonly compat?: boolean;
  readonly description: string;
};

export type ParamSchema = { readonly [name: string]: ParamSpec };

/** Each named parameter has one of the listed values (one value, or a list of them). */
export type ParamPredicate = { readonly [name: string]: Json };

/** A named parameter set, with its own styling description: many presets map to one handler. */
export type Preset = {
  readonly description: string;
  readonly features: readonly Feature[];
  readonly params: { readonly [name: string]: Json };
  readonly evidence: readonly Evidence[];
};

const DIMEN = /^-?(\d+(\.\d+)?|\.\d+)\s*(pt|pc|in|bp|cm|mm|dd|cc|sp|ex|em|mu)$|^\\[A-Za-z@]+$|^-?(\d+(\.\d+)?|\.\d+)?\s*\\[A-Za-z@]+$|^0$/;

/** Why `value` does not fit `spec`, or nothing. */
export const paramProblem = (spec: ParamSpec, value: Json): string | undefined => {
  switch (spec.type) {
    case 'boolean':
      return typeof value === 'boolean' ? undefined : 'is not true or false';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value) ? undefined : 'is not a number';
    case 'enum':
      return typeof value === 'string' && (spec.values ?? []).includes(value) ? undefined : `is not one of ${(spec.values ?? []).join(', ')}`;
    case 'dimen':
      return typeof value === 'string' && (value === '' || DIMEN.test(value.trim())) ? undefined : 'is not a TeX length';
    case 'color':
    case 'string':
    case 'tex':
      return typeof value === 'string' ? undefined : 'is not a string';
  }
};

/** Whether `params` satisfy `when`: each named parameter equals the value, or one of the values listed. */
export const matches = (when: ParamPredicate | undefined, params: { readonly [name: string]: Json | undefined }): boolean =>
  when === undefined ||
  Object.entries(when).every(([name, wanted]) => {
    const value = params[name];
    const options = Array.isArray(wanted) ? wanted : [wanted];
    return options.some((o) => JSON.stringify(o) === JSON.stringify(value));
  });

/** A key's parameters with their defaults, over which `given` is laid. */
export const withDefaults = (schema: ParamSchema, given: { readonly [name: string]: Json | undefined } = {}): { readonly [name: string]: Json } => {
  const out: { [name: string]: Json } = {};
  for (const [name, spec] of Object.entries(schema)) if (spec.default !== undefined) out[name] = spec.default;
  for (const [name, value] of Object.entries(given)) if (value !== undefined) out[name] = value;
  return out;
};
