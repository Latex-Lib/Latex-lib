/**
 * Canonical JSON and its hash: the same value always prints, and so hashes,
 * the same, whatever order its keys were written in.
 */
import { createHash } from 'node:crypto';

import type { Json } from './schema/ids.ts';

export const canonical = (value: unknown): string =>
  JSON.stringify(value, (_key, v: unknown) =>
    v !== null && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)))
      : v,
  );

export const sha256 = (...parts: readonly (string | Uint8Array)[]): string => {
  const hash = createHash('sha256');
  for (const part of parts) hash.update(part);
  return hash.digest('hex');
};

export const hashJson = (value: Json | unknown): string => `sha256:${sha256(canonical(value))}`;
