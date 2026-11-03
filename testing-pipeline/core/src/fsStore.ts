/**
 * The default store (ARCHITECTURE.md section 7).
 *
 * Each value is a gzipped JSON file at its key under `root`, so `results/<hash>`
 * is `root/results/<hash>.json.gz`. Each log is a JSON-lines file,
 * `root/<log>.jsonl`. A value is written to a temporary file first and then
 * renamed into place, so a run stopped mid-write never leaves half a value
 * behind.
 */
import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { StringDecoder } from 'node:string_decoder';
import { gunzipSync, gzipSync } from 'node:zlib';

import { canonical } from './hash.ts';
import type { Json } from './model.ts';
import type { Store } from './ports.ts';
import { checkKey, checkLog } from './storeKeys.ts';

const CHUNK = 1 << 20;

export class FsStore implements Store {
  readonly root: string;

  constructor(root: string) {
    this.root = root;
    mkdirSync(root, { recursive: true });
  }

  get(key: string): Json | undefined {
    const at = this.#valueAt(key);
    if (!existsSync(at)) return undefined;
    return JSON.parse(gunzipSync(readFileSync(at)).toString('utf8')) as Json;
  }

  put(key: string, value: Json): void {
    const at = this.#valueAt(key);
    mkdirSync(dirname(at), { recursive: true });
    const partial = `${at}.${process.pid}.partial`;
    writeFileSync(partial, gzipSync(canonical(value)));
    renameSync(partial, at);
  }

  append(log: string, line: Json): void {
    appendFileSync(this.#logAt(log), `${canonical(line)}\n`);
  }

  /** Read a chunk at a time: a log can outgrow the longest string Node will hold. */
  *read(log: string): Iterable<Json> {
    const at = this.#logAt(log);
    if (!existsSync(at)) return;
    const fd = openSync(at, 'r');
    try {
      const chunk = Buffer.alloc(CHUNK);
      const decoder = new StringDecoder('utf8');
      let rest = '';
      for (let read = readSync(fd, chunk); read > 0; read = readSync(fd, chunk)) {
        const lines = (rest + decoder.write(chunk.subarray(0, read))).split('\n');
        rest = lines.pop() ?? '';
        for (const line of lines) if (line !== '') yield JSON.parse(line) as Json;
      }
      rest += decoder.end();
      if (rest !== '') yield JSON.parse(rest) as Json;
    } finally {
      closeSync(fd);
    }
  }

  #valueAt(key: string): string {
    checkKey(key);
    return join(this.root, `${key}.json.gz`);
  }

  #logAt(log: string): string {
    checkLog(log);
    return join(this.root, `${log}.jsonl`);
  }
}
