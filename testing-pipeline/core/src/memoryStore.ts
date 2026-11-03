/**
 * A store held in memory, for tests and dry runs. Values are copied in and
 * out as canonical JSON, so a caller's later change to an object never reaches
 * what was stored.
 */
import { canonical } from './hash.ts';
import type { Json } from './model.ts';
import type { Store } from './ports.ts';
import { checkKey, checkLog } from './storeKeys.ts';

export class MemoryStore implements Store {
  readonly #values = new Map<string, string>();
  readonly #logs = new Map<string, string[]>();

  get(key: string): Json | undefined {
    checkKey(key);
    const value = this.#values.get(key);
    return value === undefined ? undefined : (JSON.parse(value) as Json);
  }

  put(key: string, value: Json): void {
    checkKey(key);
    this.#values.set(key, canonical(value));
  }

  append(log: string, line: Json): void {
    checkLog(log);
    const lines = this.#logs.get(log) ?? [];
    lines.push(canonical(line));
    this.#logs.set(log, lines);
  }

  read(log: string): readonly Json[] {
    checkLog(log);
    return (this.#logs.get(log) ?? []).map((line) => JSON.parse(line) as Json);
  }

  /** How many values it holds under a key prefix (`results/`). */
  count(prefix = ''): number {
    return [...this.#values.keys()].filter((key) => key.startsWith(prefix)).length;
  }
}
