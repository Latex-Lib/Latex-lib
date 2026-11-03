/**
 * What a store accepts as a key or a log name. Keys are relative paths of
 * plain segments (`results/<hash>`, `latest/probe/acmart-manuscript`), so the
 * file-system store can never write outside its root.
 */

const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9_.-]*$/;
const LOG = /^[a-z][a-z0-9-]*$/;

export const checkKey = (key: string): void => {
  const segments = key.split('/');
  if (!segments.every((s) => SEGMENT.test(s) && !s.includes('..'))) {
    throw new Error(`store: ${JSON.stringify(key)} is not a key (plain segments joined by "/")`);
  }
};

export const checkLog = (log: string): void => {
  if (!LOG.test(log)) throw new Error(`store: ${JSON.stringify(log)} is not a log name`);
};
