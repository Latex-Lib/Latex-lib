/**
 * Stages as a build graph (ARCHITECTURE.md section 6).
 *
 * A stage's output is saved under a hash of its name, its version and its
 * inputs, so it is computed once for each distinct set of inputs. Each instance
 * of a stage (one class setting's probe, one cell's compile) also keeps a
 * pointer to the key it last ran with. That is how `stageStatus` can say which
 * inputs changed since then.
 */
import { canonical, hashJson } from './hash.ts';
import type { Json } from './model.ts';
import type { Store } from './ports.ts';
import { checkKey } from './storeKeys.ts';

export type StageInputs = { readonly [name: string]: Json };

export type Stage<I, O extends Json> = {
  /** `probe`, `plan`, `run`…; also the folder its outputs are saved in. */
  readonly name: string;
  /** Raised when the stage's own logic changes, which puts every output it saved out of date. */
  readonly version: number;
  /** Which instance of the stage this input is: a class setting's id, a cell's id. */
  readonly instance: (input: I) => string;
  /** Everything the output depends on: hashed into its key, and kept to explain a later change. */
  readonly inputs: (input: I) => StageInputs;
  readonly compute: (input: I) => O | Promise<O>;
};

type Saved = { readonly version: number; readonly inputs: StageInputs; readonly output: Json };
type Pointer = { readonly key: string };

export type StageRun<O> = { readonly output: O; readonly key: string; readonly cached: boolean };

export type StageStatus =
  | { readonly state: 'current'; readonly key: string }
  | { readonly state: 'never-run'; readonly key: string }
  /** `changed` names each input that differs from the instance's last run; `(stage version)` when the stage's logic changed. */
  | { readonly state: 'stale'; readonly key: string; readonly changed: readonly string[] };

const outputAt = (stage: string, key: string): string => `artifacts/${stage}/${key}`;
const latestAt = (stage: string, instance: string): string => {
  const at = `latest/${stage}/${instance}`;
  checkKey(at);
  return at;
};

export const stageKey = <I, O extends Json>(stage: Stage<I, O>, input: I): string =>
  hashJson({ stage: stage.name, version: stage.version, inputs: stage.inputs(input) });

/** The stage's output for `input`: read back if saved, otherwise computed and saved. */
export const runStage = async <I, O extends Json>(store: Store, stage: Stage<I, O>, input: I): Promise<StageRun<O>> => {
  const key = stageKey(stage, input);
  const at = outputAt(stage.name, key);
  const saved = store.get(at) as Saved | undefined;
  let run: StageRun<O>;
  if (saved !== undefined) {
    run = { output: saved.output as O, key, cached: true };
  } else {
    const output = await stage.compute(input);
    const record: Saved = { version: stage.version, inputs: stage.inputs(input), output };
    store.put(at, record);
    run = { output, key, cached: false };
  }
  const pointer: Pointer = { key };
  store.put(latestAt(stage.name, stage.instance(input)), pointer);
  return run;
};

/** Whether `input`'s output is saved and, if not, what changed since this instance last ran. */
export const stageStatus = <I, O extends Json>(store: Store, stage: Stage<I, O>, input: I): StageStatus => {
  const key = stageKey(stage, input);
  if (store.get(outputAt(stage.name, key)) !== undefined) return { state: 'current', key };
  const pointer = store.get(latestAt(stage.name, stage.instance(input))) as Pointer | undefined;
  const previous = pointer === undefined ? undefined : (store.get(outputAt(stage.name, pointer.key)) as Saved | undefined);
  if (previous === undefined) return { state: 'never-run', key };
  const now = stage.inputs(input);
  const names = [...new Set([...Object.keys(now), ...Object.keys(previous.inputs)])].sort();
  const changed = names.filter((name) => canonical(now[name] ?? null) !== canonical(previous.inputs[name] ?? null));
  return { state: 'stale', key, changed: previous.version === stage.version ? changed : ['(stage version)', ...changed] };
};
