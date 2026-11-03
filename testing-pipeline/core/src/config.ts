/**
 * The workspace's data: `compat.config.json`, the class settings
 * (`classes/*.json`) and the setups (`setups.json`). All of it is read and
 * checked here, so a bad file fails before any compile, naming the file and
 * the field.
 *
 * The config's `host` section belongs to the host binding. Core passes it on
 * without reading it.
 */
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

import type { ClassSetting, EngineFile, Json, Setup } from './model.ts';

export type WorkspaceConfig = {
  /** The folder holding `compat.config.json`; every path below is resolved against it. */
  readonly root: string;
  readonly classes: string;
  readonly setups: string;
  readonly out: string;
  /** How many engines to open; `default` lets the engine decide. */
  readonly engines: number | 'default';
  readonly host: { readonly [key: string]: Json };
};

type Fields = { readonly [key: string]: unknown };

class ConfigError extends Error {}

const fail = (file: string, message: string): never => {
  throw new ConfigError(`${file}: ${message}`);
};

const objectIn = (value: unknown, file: string, where: string): Fields =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as Fields) : fail(file, `${where} must be an object`);

const onlyKnown = (fields: Fields, known: readonly string[], file: string, where: string): void => {
  const unknown = Object.keys(fields).filter((key) => !known.includes(key));
  if (unknown.length > 0) fail(file, `${where} has unknown field(s) ${unknown.join(', ')}`);
};

const stringIn = (fields: Fields, key: string, file: string, where: string): string => {
  const value = fields[key];
  return typeof value === 'string' && value !== '' ? value : fail(file, `${where}.${key} must be a non-empty string`);
};

const stringsIn = (fields: Fields, key: string, file: string, where: string): string[] => {
  const value = fields[key] ?? [];
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
    ? [...value]
    : fail(file, `${where}.${key} must be a list of strings`);
};

const readJson = (file: string): unknown => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    return fail(file, error instanceof Error ? error.message : String(error));
  }
};

const ID = /^[a-z0-9][a-z0-9.-]*$/;

export const loadConfig = (file: string): WorkspaceConfig => {
  const fields = objectIn(readJson(file), file, 'the config');
  onlyKnown(fields, ['classes', 'setups', 'out', 'engines', 'host'], file, 'the config');
  const root = dirname(resolve(file));
  const engines = fields.engines ?? 'default';
  if (engines !== 'default' && !(typeof engines === 'number' && Number.isInteger(engines) && engines > 0)) {
    fail(file, 'engines must be a positive whole number or "default"');
  }
  return {
    root,
    classes: resolve(root, stringIn(fields, 'classes', file, 'the config')),
    setups: resolve(root, stringIn(fields, 'setups', file, 'the config')),
    out: resolve(root, stringIn(fields, 'out', file, 'the config')),
    engines: engines as number | 'default',
    host: objectIn(fields.host ?? {}, file, 'host') as { readonly [key: string]: Json },
  };
};

/** Every class setting in `dir`, one per JSON file, each file named after its id. */
export const loadClassSettings = (dir: string): ClassSetting[] =>
  readdirSync(dir)
    .filter((name) => name.endsWith('.json'))
    .sort()
    .map((name) => {
      const file = join(dir, name);
      const fields = objectIn(readJson(file), file, 'a class setting');
      onlyKnown(fields, ['id', 'description', 'class', 'options', 'preamble', 'files', 'setups', 'omitPreamble'], file, 'the class setting');
      const id = stringIn(fields, 'id', file, 'the class setting');
      if (!ID.test(id)) fail(file, `id ${JSON.stringify(id)} must be lower case letters, digits, "." and "-"`);
      if (id !== basename(name, '.json')) fail(file, `id ${JSON.stringify(id)} must match the file name`);
      const files = (Array.isArray(fields.files) ? fields.files : fields.files === undefined ? [] : fail(file, 'files must be a list')).map(
        (entry: unknown, i: number) => {
          const f = objectIn(entry, file, `files[${i}]`);
          onlyKnown(f, ['path', 'sha256'], file, `files[${i}]`);
          const sha256 = stringIn(f, 'sha256', file, `files[${i}]`);
          if (!/^[0-9a-f]{64}$/.test(sha256)) fail(file, `files[${i}].sha256 must be 64 hex digits`);
          return { path: stringIn(f, 'path', file, `files[${i}]`), sha256 };
        },
      );
      const description = fields.description === undefined ? undefined : stringIn(fields, 'description', file, 'the class setting');
      return {
        id,
        ...(description === undefined ? {} : { description }),
        class: stringIn(fields, 'class', file, 'the class setting'),
        options: stringsIn(fields, 'options', file, 'the class setting'),
        preamble: stringsIn(fields, 'preamble', file, 'the class setting'),
        files,
        ...(fields.setups === undefined ? {} : { setups: stringsIn(fields, 'setups', file, 'the class setting') }),
        ...(fields.omitPreamble === undefined ? {} : { omitPreamble: stringsIn(fields, 'omitPreamble', file, 'the class setting') }),
      };
    });

/** The setups in `file`, a JSON list. */
export const loadSetups = (file: string): Setup[] => {
  const list = readJson(file);
  if (!Array.isArray(list)) return fail(file, 'the setups must be a list');
  const setups = list.map((entry: unknown, i: number) => {
    const where = `setups[${i}]`;
    const fields = objectIn(entry, file, where);
    onlyKnown(fields, ['id', 'description', 'addOptions', 'removeOptions', 'preamble'], file, where);
    return {
      id: stringIn(fields, 'id', file, where),
      description: stringIn(fields, 'description', file, where),
      addOptions: stringsIn(fields, 'addOptions', file, where),
      removeOptions: stringsIn(fields, 'removeOptions', file, where),
      preamble: stringsIn(fields, 'preamble', file, where),
    };
  });
  const ids = setups.map((s) => s.id);
  const twice = ids.find((id, i) => ids.indexOf(id) !== i);
  if (twice !== undefined) fail(file, `setup ${twice} is listed twice`);
  return setups;
};

/**
 * A class setting's files, as the engine gets them: each read from
 * `<classes>/files/<path>` and checked against its SHA-256, so a changed file
 * is refused, not compiled. These are files the engine cannot fetch (a
 * journal's own class, its logos).
 */
export const readClassFiles = (classesDir: string, setting: ClassSetting): EngineFile[] =>
  setting.files.map(({ path, sha256 }) => {
    const file = join(classesDir, 'files', ...path.split('/'));
    if (path.split('/').some((part) => part === '..' || part === '')) fail(file, `${setting.id}: ${JSON.stringify(path)} is not a plain relative path`);
    if (!existsSync(file)) fail(file, `${setting.id}: the file is missing`);
    const bytes = readFileSync(file);
    const sum = createHash('sha256').update(bytes).digest('hex');
    if (sum !== sha256) fail(file, `${setting.id}: SHA-256 is ${sum}, not ${sha256}`);
    return { path, bytes };
  });

/** Whether `setup` applies under `classSetting`. */
export const appliesTo = (setup: Setup, classSetting: ClassSetting): boolean =>
  classSetting.setups === undefined || classSetting.setups.includes(setup.id);
