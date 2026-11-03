/**
 * The theorem handlers (ARCHITECTURE.md 9.1): each preset's LaTeX fixed by
 * snapshot, and what each way must do whatever its preset (shared counters,
 * renaming, breaking where the box opens, the class's own environments), and
 * the box ways' rule for a head still waiting where they set a box (F3).
 *
 * The snapshot is written when missing; `UPDATE_SNAPSHOTS=1 npm test` writes
 * it again after a deliberate change.
 */
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { adapted } from '../engine/adapt.ts';
import type { Nesting } from '../nesting.ts';
import { HANDLERS } from '../nodes/containerBlock.mathElement/index.ts';
import amsthmKey from '../nodes/containerBlock.mathElement/thm.amsthm/key.ts';
import classNativeKey from '../nodes/containerBlock.mathElement/thm.class-native/key.ts';
import kernelKey from '../nodes/containerBlock.mathElement/thm.kernel/key.ts';
import mdframedKey from '../nodes/containerBlock.mathElement/thm.mdframed/key.ts';
import ntheoremKey from '../nodes/containerBlock.mathElement/thm.ntheorem/key.ts';
import tcolorboxKey from '../nodes/containerBlock.mathElement/thm.tcolorbox/key.ts';
import thmtoolsKey from '../nodes/containerBlock.mathElement/thm.thmtools/key.ts';
import { HANDLERS as IMAGES } from '../nodes/atomicBlock.image/index.ts';
import { HANDLERS as CODE } from '../nodes/code.code/index.ts';
import { HANDLERS as NOTES } from '../nodes/containerBlock.note/index.ts';
import { HEAD_OWN_LINE } from '../nodes/protocol.ts';
import type { HandlerKey } from '../schema/key.ts';
import type { Realization, Subject } from '../schema/realization.ts';

const KEYS: readonly HandlerKey[] = [amsthmKey, classNativeKey, kernelKey, mdframedKey, ntheoremKey, tcolorboxKey, thmtoolsKey];
const statement = (elementName: string, label = ''): Subject => ({ type: 'mathElement', attrs: { data: { elementName, label } } });
const handler = (way: string) => {
  const h = HANDLERS[way];
  assert.ok(h, way);
  return h;
};
const printed = (r: Realization, node: Subject, parentType = 'doc') => {
  const pre = r.preamble({}, parentType, node);
  return { packages: pre.packages ?? [], declarations: pre.declarations ?? [], body: r.emit(node, 'A body.', 'Note', parentType) };
};

test('every preset of every way prints what its snapshot holds', () => {
  const snapshots: Record<string, unknown> = {};
  for (const key of KEYS) {
    for (const [name, preset] of Object.entries(key.presets)) {
      const r = handler(key.id)(preset.params);
      snapshots[`${key.id} ${name}`] = ['theorem', 'lemma', 'definition'].map((e) => printed(r, statement(e, `${e}:one`)));
    }
  }
  const dir = join(import.meta.dirname, 'snapshots');
  const file = join(dir, 'handlers.json');
  const text = `${JSON.stringify(snapshots, null, 2)}\n`;
  if (!existsSync(file) || process.env['UPDATE_SNAPSHOTS'] === '1') {
    mkdirSync(dir, { recursive: true });
    writeFileSync(file, text);
  }
  assert.equal(text, readFileSync(file, 'utf8'), 'a handler prints something new: check it, then UPDATE_SNAPSHOTS=1 npm test');
});

test("a kind on the theorem's counter declares the theorem first, and each declaration is one entry", () => {
  const ams = printed(handler('thm.amsthm')(amsthmKey.presets['ams-section'].params), statement('lemma'));
  assert.deepEqual(ams.declarations, ['\\theoremstyle{plain}\n\\newtheorem{theorem}{Theorem}[section]', '\\theoremstyle{plain}\n\\newtheorem{lemma}[theorem]{Lemma}']);
  const global = printed(handler('thm.amsthm')(amsthmKey.presets.global.params), statement('definition'));
  assert.deepEqual(global.declarations, ['\\theoremstyle{plain}\n\\newtheorem{definition}{Definition}']);
  // thmtools breaks a shared counter in ZeroTeX-NG's tree, so a kind on the theorem's counter is declared alone and given that counter.
  assert.deepEqual(printed(handler('thm.thmtools')({}), statement('lemma')).declarations.slice(-1), [
    '\\declaretheorem[style=libthm, name=Lemma]{lemma}\n\\makeatletter\\let\\c@lemma\\c@theorem\\let\\thelemma\\thetheorem\\makeatother',
  ]);
  assert.deepEqual(printed(handler('thm.mdframed')({ sharedCounter: false, numberWithin: 'chapter' }), statement('remark')).declarations, [
    '\\newmdtheoremenv[linecolor=black,backgroundcolor=white,linewidth=0.4pt,usetwoside=false]{remark}{Remark}[chapter]',
  ]);
});

test('renaming prefixes every environment, the shared counter included', () => {
  const r = printed(handler('thm.kernel')({ rename: 'yes' }), statement('lemma', 'l:1'));
  assert.deepEqual(r.declarations, ['\\newtheorem{libtheorem}{Theorem}[section]', '\\newtheorem{liblemma}[libtheorem]{Lemma}']);
  assert.equal(r.body, '\\begin{liblemma}[{Note}]\n\\label{l:1}\nA body.\n\\end{liblemma}\n\n');
});

test('a body that opens with a box or a table gets \\leavevmode first, as General does', () => {
  const r = handler('thm.amsthm')({});
  assert.match(r.emit(statement('theorem'), '\\begin{tcolorbox}x\\end{tcolorbox}'), /\\begin\{theorem\}\n\\leavevmode\n\\begin\{tcolorbox\}/);
  // General's enumitem list whose first entry is a boxed General statement (b16 DF6); thm.mdframed's frame keeps the plain rule.
  const listed = '{\n\\setlist[itemize]{label=-}\n\\begin{tcolorbox}[colback=white]\n\\begin{definitionByChapter}\nx\n\\end{definitionByChapter}\n\\end{tcolorbox}\n}';
  assert.match(r.emit(statement('theorem'), listed), /\\begin\{theorem\}\n\\leavevmode\n\{\n\\setlist/);
  assert.doesNotMatch(handler('thm.mdframed')({}).emit(statement('theorem'), listed), /\\leavevmode/);
});

const NESTING: Nesting = {
  nodes: {
    'containerBlock/mathElement': { family: 'container', parents: ['containerBlock/footnote', 'table_cell'] },
    'containerBlock/footnote': { family: 'container', parents: [] },
    table_cell: { family: 'container', parents: [] },
  },
};

test('a tcolorbox statement breaks across pages in the body and not in a footnote, with one declaration for both', () => {
  const r = adapted({
    key: tcolorboxKey,
    params: tcolorboxKey.presets.boxed.params,
    handlerOf: (way) => HANDLERS[way],
    keyOf: (way) => KEYS.find((k) => k.id === way),
    nesting: NESTING,
  });
  const inBody = printed(r, statement('theorem'), 'doc');
  const inNote = printed(r, statement('theorem'), 'footnote');
  assert.match(inBody.body, /^\\begin\{theorem\}\[breakable\]\{Note\}\{\}/);
  assert.match(inNote.body, /^\\begin\{theorem\}\{Note\}\{\}/);
  assert.equal(inBody.declarations.at(-1), inNote.declarations.at(-1), 'the environment is declared the same way in both');
  assert.deepEqual([inBody.declarations[0], inNote.declarations[0]], ['\\tcbuselibrary{theorems,skins,breakable}', '\\tcbuselibrary{theorems,skins}']);
});

test('a thm.tcolorbox box that holds a list-based statement first ends a label pending where it opens, and no other box does', () => {
  const r = handler('thm.tcolorbox')();
  const node = statement('lemma');
  assert.ok(r.preamble({}, 'doc', node).declarations?.includes(String.raw`\makeatletter\providecommand*\LatexLibFlushLabel{\if@inlabel\leavevmode\fi}\makeatother`));
  assert.doesNotMatch(r.emit(node, 'A body.', 'Note', 'doc'), /LatexLibFlushLabel/);
  // General's statement (here in General's box, and with a look's suffix and no counter) and a library way's (`statementIn`)
  // open with \begin{env}, then a note or the line's end.
  for (const inner of [
    '\\begin{remark}[{A note}]\nText.\n\\end{remark}',
    '\\begin{tcolorbox}[enhanced]\n\\begin{theoremBySubparagraph}\nText.\n\\end{theoremBySubparagraph}\n\\end{tcolorbox}',
    '\\begin{corollaryLookItalicHeader}[{A note}]\nText.\n\\end{corollaryLookItalicHeader}',
  ]) {
    assert.match(r.emit(node, inner, 'Note', 'doc'), /^\\LatexLibFlushLabel\n\\begin\{lemma\}/, inner);
  }
  // Another thm.tcolorbox box inside is no list-based statement.
  assert.doesNotMatch(r.emit(node, '\\begin{theorem}[breakable]{}{}\nText.\n\\end{theorem}', 'Note', 'doc'), /LatexLibFlushLabel/);
});

test('a box set at the start of a line first sets a head still waiting there on its own line; a centred or floated one does not', () => {
  const image: Subject = { type: 'image', attrs: { data: { imagePath: 'figures/theme-sample.png', widthFraction: 1 } } };
  const note: Subject = { type: 'note', attrs: { data: { title: 'Note' } } };
  const flush: [Realization, Subject][] = [
    [IMAGES['fig.graphicx']!({ float: false, center: false }), image],
    [IMAGES['fig.adjustbox']!({ float: false, background: 'white', center: false }), image],
    [IMAGES['fig.adjustbox']!({ float: false }), image],
    [NOTES['box.fancybox']!({ frame: 'colorbox', center: false }), note],
    [NOTES['box.awesomebox']!({}), note],
    [NOTES['box.awesomebox']!({ block: 'custom' }), note],
  ];
  for (const [r, node] of flush) {
    assert.match(r.emit(node, 'Text.', undefined, 'doc'), /^\\LatexLibHeadOwnLine\n(\\noindent|\\begin\{)/);
    assert.ok((r.preamble({}, 'doc', node).declarations ?? []).includes(HEAD_OWN_LINE));
  }
  // The tcolorbox ways run it as a key where the box opens, so their text still opens with the box (General's and bodyOf's tests).
  assert.match(NOTES['box.tcolorbox']!({}).emit(note, 'Text.', undefined, 'doc'), /^\\begin\{tcolorbox\}\[[^\n]*code=\{\\LatexLibHeadOwnLine\}/);
  assert.match(CODE['code.tcblisting']!({}).emit({ type: 'code', attrs: { data: {} } }, 'x', undefined, 'doc'), /^\\begin\{tcblisting\}\{listing only, code=\{\\LatexLibHeadOwnLine\}/);
  const declared = handler('thm.tcolorbox')().preamble({}, 'doc', statement('lemma')).declarations ?? [];
  assert.ok(declared.includes(HEAD_OWN_LINE));
  assert.ok(declared.some((d) => d.startsWith('\\newtcbtheorem') && d.includes('code={\\LatexLibHeadOwnLine}')));
  // A float leaves the head waiting for the next line, and a centred box lets the head end its own line: neither changes.
  const kept: [Realization, Subject][] = [
    [IMAGES['fig.graphicx']!({}), image],
    [IMAGES['fig.graphicx']!({ float: false }), image],
    [IMAGES['fig.adjustbox']!({}), image],
    [NOTES['box.fancybox']!({}), note],
  ];
  for (const [r, node] of kept) {
    assert.doesNotMatch(r.emit(node, 'Text.', undefined, 'doc'), /LatexLibHeadOwnLine/);
    assert.ok(!(r.preamble({}, 'doc', node).declarations ?? []).includes(HEAD_OWN_LINE));
  }
});

test('a denied parent emits the fallback', () => {
  const denying: HandlerKey = { ...tcolorboxKey, parents: { table_cell: { scope: 'direct', deny: [{ way: '*', reason: 'test', evidence: [] }] } } };
  const r = adapted({ key: denying, params: {}, handlerOf: (way) => HANDLERS[way], keyOf: (way) => KEYS.find((k) => k.id === way), nesting: NESTING });
  assert.match(printed(r, statement('lemma'), 'table_cell').body, /^\\begin\{lemma\}\[\{Note\}\]/, 'thm.amsthm, its fallback');
});

test("the class's own environments are used by name, and a kind the class lacks is declared only if undefined", () => {
  const r = printed(handler('thm.class-native')(), statement('remark'));
  // Under aa (\aa@newtheorem defined) \newtheorem takes the head and body fonts after the title (b16 DF11).
  assert.deepEqual(r.declarations, ['\\makeatletter\n\\@ifundefined{remark}{\\ifdefined\\aa@newtheorem\\newtheorem{remark}{Remark}{\\itshape}{\\rmfamily}\\else\\newtheorem{remark}{Remark}\\fi}{}\n\\makeatother']);
  assert.equal(r.packages.length, 0);
  assert.match(r.body, /^\\begin\{remark\}\[\{Note\}\]/);
});
