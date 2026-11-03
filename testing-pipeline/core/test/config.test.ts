import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';

import { createHash } from 'node:crypto';

import { appliesTo, loadClassSettings, loadConfig, loadSetups, readClassFiles } from '../src/config.ts';

const folders: string[] = [];
const workspace = (files: Record<string, unknown>): string => {
  const root = mkdtempSync(join(tmpdir(), 'compat-core-config-'));
  folders.push(root);
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(root, path, '..'), { recursive: true });
    writeFileSync(join(root, path), typeof content === 'string' ? content : JSON.stringify(content));
  }
  return root;
};
after(() => {
  for (const folder of folders) rmSync(folder, { recursive: true, force: true });
});

const ARTICLE = { id: 'article', class: 'article', options: [], preamble: [], files: [] };
const SETUPS = [
  { id: 'A', description: 'default', addOptions: [], removeOptions: [], preamble: [] },
  { id: 'B', description: 'other', addOptions: ['twocolumn'], removeOptions: ['onecolumn'], preamble: [] },
];

test('the config resolves its paths against its own folder and passes the host section on', () => {
  const root = workspace({ 'compat.config.json': { classes: 'classes', setups: 'setups.json', out: 'out', host: { kind: 'x', root: '../y' } } });
  const config = loadConfig(join(root, 'compat.config.json'));
  assert.equal(config.classes, join(root, 'classes'));
  assert.equal(config.out, join(root, 'out'));
  assert.equal(config.engines, 'default');
  assert.deepEqual(config.host, { kind: 'x', root: '../y' });
});

test('class settings load one per file, in name order, and setups say where they apply', () => {
  const root = workspace({
    'classes/article.json': ARTICLE,
    'classes/ieeetran-journal.json': { ...ARTICLE, id: 'ieeetran-journal', class: 'IEEEtran', options: ['journal'], setups: ['A'] },
    'setups.json': SETUPS,
  });
  const classes = loadClassSettings(join(root, 'classes'));
  const setups = loadSetups(join(root, 'setups.json'));
  assert.deepEqual(classes.map((c) => c.id), ['article', 'ieeetran-journal']);
  const [article, journal] = classes;
  const [a, b] = setups;
  assert.ok(article && journal && a && b);
  assert.equal(appliesTo(b, article), true);
  assert.equal(appliesTo(a, journal), true);
  assert.equal(appliesTo(b, journal), false);
});

const refused = (files: Record<string, unknown>, load: (root: string) => unknown, message: RegExp) => {
  const root = workspace(files);
  assert.throws(() => load(root), message);
};

test('a bad file is refused before any compile, naming the file and the field', () => {
  const classes = (root: string) => loadClassSettings(join(root, 'classes'));
  refused({ 'classes/amsart.json': ARTICLE }, classes, /amsart\.json: id "article" must match the file name/);
  refused({ 'classes/article.json': { ...ARTICLE, option: [] } }, classes, /unknown field\(s\) option/);
  refused({ 'classes/article.json': { ...ARTICLE, options: 'twocolumn' } }, classes, /options must be a list of strings/);
  refused({ 'classes/article.json': { ...ARTICLE, files: [{ path: 'x.cls', sha256: 'abc' }] } }, classes, /sha256 must be 64 hex digits/);
  refused({ 'classes/article.json': '{ not json' }, classes, /article\.json: /);
  refused({ 'setups.json': [SETUPS[0], SETUPS[0]] }, (root) => loadSetups(join(root, 'setups.json')), /setup A is listed twice/);
  refused(
    { 'compat.config.json': { classes: 'c', setups: 's', out: 'o', engines: 0 } },
    (root) => loadConfig(join(root, 'compat.config.json')),
    /engines must be a positive whole number/,
  );
});

test("a class setting's omitPreamble loads back, and must be a list of strings", () => {
  const root = workspace({ 'classes/acmart-manuscript.json': { ...ARTICLE, id: 'acmart-manuscript', class: 'acmart', omitPreamble: ['\\usepackage{lmodern}'] } });
  assert.deepEqual(loadClassSettings(join(root, 'classes'))[0]?.omitPreamble, ['\\usepackage{lmodern}']);
  refused({ 'classes/article.json': { ...ARTICLE, omitPreamble: 'lmodern' } }, (r) => loadClassSettings(join(r, 'classes')), /omitPreamble must be a list of strings/);
});

test("a class setting's files are read from classes/files and checked against their SHA-256", () => {
  const cls = '\\LoadClass{article}\n';
  const sum = createHash('sha256').update(cls).digest('hex');
  const root = workspace({ 'classes/files/demo/demo.cls': cls });
  const setting = { ...ARTICLE, id: 'demo', class: 'demo', files: [{ path: 'demo/demo.cls', sha256: sum }] };
  const files = readClassFiles(join(root, 'classes'), setting);
  assert.deepEqual(files.map((f) => [f.path, Buffer.from(f.bytes).toString('utf8')]), [['demo/demo.cls', cls]]);
  assert.throws(() => readClassFiles(join(root, 'classes'), { ...setting, files: [{ path: 'demo/demo.cls', sha256: '0'.repeat(64) }] }), /SHA-256 is/);
  assert.throws(() => readClassFiles(join(root, 'classes'), { ...setting, files: [{ path: 'demo/other.cls', sha256: sum }] }), /missing/);
  assert.throws(() => readClassFiles(join(root, 'classes'), { ...setting, files: [{ path: '../escape.cls', sha256: sum }] }), /not a plain relative path/);
});
