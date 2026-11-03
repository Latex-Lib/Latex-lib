/**
 * The library as it is on disk (ARCHITECTURE.md section 2): every key under
 * `nodes/<node>/<way>/key.ts`, every class profile in `classes/`, every
 * package's facts in `packages/`. Each file's default export is its value.
 * A key must sit in the folder its id and node name.
 */
import { existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { ClassProfile, PackageFacts } from './schema/class.ts';
import { nodeFolder } from './schema/ids.ts';
import type { HandlerKey } from './schema/key.ts';
import type { Library } from './schema/validate.ts';

const folders = (dir: string): string[] => (existsSync(dir) ? readdirSync(dir).filter((f) => statSync(join(dir, f)).isDirectory()).sort() : []);
const files = (dir: string): string[] => (existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.ts')).sort() : []);

const defaultOf = async <T>(file: string): Promise<T> => {
  const module = (await import(pathToFileURL(file).href)) as { default?: T };
  if (module.default === undefined) throw new Error(`library: ${file} has no default export`);
  return module.default;
};

/** The library at `root`, and each file that is not where its id says. */
export const loadLibrary = async (root: string): Promise<{ readonly library: Library; readonly misplaced: readonly string[] }> => {
  const keys: HandlerKey[] = [];
  const misplaced: string[] = [];
  for (const node of folders(join(root, 'nodes'))) {
    for (const way of folders(join(root, 'nodes', node))) {
      const file = join(root, 'nodes', node, way, 'key.ts');
      if (!existsSync(file)) continue;
      const key = await defaultOf<HandlerKey>(file);
      if (key.id !== way || nodeFolder(key.node) !== node) misplaced.push(`way ${key.id} (node ${key.node}) is in nodes/${node}/${way}/`);
      keys.push(key);
    }
  }
  const classes = await Promise.all(files(join(root, 'classes')).map((f) => defaultOf<ClassProfile>(join(root, 'classes', f))));
  const packages = await Promise.all(files(join(root, 'packages')).map((f) => defaultOf<PackageFacts>(join(root, 'packages', f))));
  for (const c of classes) if (!files(join(root, 'classes')).includes(`${c.id.slice('class.'.length)}.ts`)) misplaced.push(`class ${c.id} is not in classes/${c.id.slice('class.'.length)}.ts`);
  for (const p of packages) if (!files(join(root, 'packages')).includes(`${p.id}.ts`)) misplaced.push(`package ${p.id} is not in packages/${p.id}.ts`);
  return { library: { keys, classes, packages }, misplaced };
};
