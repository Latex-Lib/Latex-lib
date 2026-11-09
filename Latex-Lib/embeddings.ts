/**
 * The library's description embeddings (Ai/ARCHITECTURE.md section 5.1): the
 * description of every handler, preset and class profile as a vector from one
 * pinned model, so the AI layer's search can compare a target key's words with
 * the library's. `npm run embed` in Ai/ writes them (Ai/ holds the model);
 * `npm run verify` here finds them missing or stale, as it does the compat
 * tables.
 *
 * Each entry keeps the hash of the text it was made from and its vector as
 * little-endian float32 in base64.
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { sha256 } from './hash.ts';
import type { Library } from './schema/validate.ts';

export const EMBEDDINGS_FILE = 'embeddings.generated.json';

export type EmbeddingEntry = { readonly id: string; readonly hash: string; readonly vector: string };

export type EmbeddingsFile = {
  /** The model and its revision, as the AI layer names it. */
  readonly model: string;
  readonly dimensions: number;
  readonly entries: readonly EmbeddingEntry[];
};

/**
 * Every text the library embeds, by id: `handler:<node>:<way>`,
 * `preset:<node>:<way>:<preset>`, `class:<id>`. A class profile's text is its
 * name and its own commands.
 */
export const embeddingTexts = (library: Library): { readonly id: string; readonly text: string }[] => [
  ...library.keys.flatMap((k) => [
    { id: `handler:${k.node}:${k.id}`, text: k.description },
    ...Object.entries(k.presets).map(([name, p]) => ({ id: `preset:${k.node}:${k.id}:${name}`, text: p.description })),
  ]),
  ...library.classes.map((c) => ({ id: `class:${c.id}`, text: [`${c.name} document class.`, ...Object.entries(c.vocabulary).map(([command, what]) => `${command}: ${what}`)].join(' ') })),
];

export const textHash = (text: string): string => sha256(text);

export const readEmbeddings = (lib: string): EmbeddingsFile | undefined => {
  const path = join(lib, EMBEDDINGS_FILE);
  return existsSync(path) ? (JSON.parse(readFileSync(path, 'utf8')) as EmbeddingsFile) : undefined;
};

/** What is missing or stale in the embeddings file, as sentences; nothing when it matches the library. */
export const checkEmbeddings = (lib: string, library: Library): string[] => {
  const file = readEmbeddings(lib);
  if (file === undefined) return [`${EMBEDDINGS_FILE}: missing; run npm run embed in Ai/`];
  const have = new Map(file.entries.map((e) => [e.id, e.hash]));
  const texts = embeddingTexts(library);
  const missing = texts.filter((t) => !have.has(t.id)).length;
  const stale = texts.filter((t) => have.has(t.id) && have.get(t.id) !== textHash(t.text)).length;
  const extra = file.entries.length - texts.filter((t) => have.has(t.id)).length;
  if (missing + stale + extra === 0) return [];
  return [`${EMBEDDINGS_FILE}: ${missing} missing, ${stale} stale, ${extra} no longer in the library; run npm run embed in Ai/`];
};
