/**
 * The hashing behind every id and key core makes. JSON is hashed in one
 * canonical spelling (keys sorted, no whitespace), so the same value gives the
 * same id whatever order it was built in.
 */
import { createHash } from 'node:crypto';

import type { Json } from './model.ts';

/**
 * `value` in one spelling: object keys sorted, arrays in order, and keys whose
 * value is `undefined` left out, as `JSON.stringify` leaves them. Throws on a
 * number JSON cannot hold.
 */
export const canonical = (value: Json): string => {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError(`canonical: ${value} is not JSON`);
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map((item: Json) => canonical(item)).join(',')}]`;
  const object = value as { readonly [key: string]: Json | undefined };
  const entries = Object.keys(object)
    .sort()
    .flatMap((key) => {
      const item = object[key];
      return item === undefined ? [] : [`${JSON.stringify(key)}:${canonical(item)}`];
    });
  return `{${entries.join(',')}}`;
};

/** SHA-256 in hex over `parts`, each prefixed with its byte length, so no two lists of parts hash alike. */
export const sha256 = (...parts: readonly (string | Uint8Array)[]): string => {
  const hash = createHash('sha256');
  for (const part of parts) {
    const bytes = typeof part === 'string' ? Buffer.from(part, 'utf8') : part;
    hash.update(`${bytes.byteLength}:`).update(bytes);
  }
  return hash.digest('hex');
};

/** The hash of a JSON value's canonical spelling. */
export const hashJson = (value: Json): string => sha256(canonical(value));
