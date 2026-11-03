/**
 * The fakes keep the ports' promises, so the rest of core's tests can lean on
 * them: legality judged against every node above, LaTeX under a class setting
 * and a setup, spans that name a branch, and an engine that fails where TeX
 * would.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { NestingNode, NodeId } from '../src/model.ts';
import { FakeEngine } from './fakeEngine.ts';
import { FakeHost } from './fakeHost.ts';
import { FakeLibrary } from './fakeLibrary.ts';
import { ARTICLE, planOf, SETUP_B, sentinel } from './fakeRun.ts';

const host = new FakeHost();
const library = new FakeLibrary();

const pathsOf = (nodes: readonly NestingNode[], above: readonly NodeId[] = []): NodeId[][] =>
  nodes.flatMap((n) => [[...above, n.node], ...pathsOf(n.children, [...above, n.node])]);

test('the fake host judges a place against every node above it, not only its parent', () => {
  const paths = pathsOf(host.nesting(3).roots);
  assert.ok(paths.some((p) => p.join('>') === 'theorem>footnote'));
  assert.ok(paths.some((p) => p.join('>') === 'list>theorem'));
  assert.ok(!paths.some((p) => p.at(-1) === 'footnote' && p.slice(0, -1).includes('list')));
  assert.equal(Math.max(...paths.map((p) => p.length)), 4);
});

test('the fake host emits the class with the setup applied, and a span for each branch', () => {
  const [first, second] = planOf(host, library, 1).branches;
  assert.ok(first && second);
  const doc = host.pack([host.build(first, { sentinel, marked: true }), host.build(second, { sentinel, marked: false })]);
  const emitted = host.emit(doc, { classSetting: { ...ARTICLE, options: ['onecolumn', '11pt'] }, setup: SETUP_B, preamble: [] });
  const lines = emitted.latex.split('\n');
  assert.equal(lines[0], '\\documentclass[11pt,twocolumn]{article}');
  assert.deepEqual(emitted.spans.map((s) => s.branch), [first.id, second.id]);
  for (const span of emitted.spans) {
    const body = lines.slice(span.from - 1, span.to).join('\n');
    assert.ok(body.includes(`\\compatSentinel{${span.branch}.0}`));
  }
});

test('the fake engine fails a boxed theorem inside a footnote, at a line inside that branch', async () => {
  const branches = planOf(host, library, 2).branches;
  const ways = (b: (typeof branches)[number]) => b.path.map((s) => s.variant.way).join('>');
  const bad = branches.find((b) => ways(b) === 'thm.plain>fn.kernel>thm.boxed');
  const good = branches.find((b) => ways(b) === 'thm.boxed>fn.kernel>thm.plain');
  assert.ok(bad && good);
  const emitted = host.emit(host.pack([host.build(good, { sentinel, marked: true }), host.build(bad, { sentinel, marked: true })]), {
    classSetting: ARTICLE,
    setup: SETUP_B,
    preamble: [],
  });
  const engine = new FakeEngine();
  const result = await engine.compile({ id: 'doc', latex: emitted.latex, files: emitted.files });
  const lines = [...result.log.matchAll(/^l\.(\d+) /gm)].map((m) => Number(m[1]));
  assert.ok(result.log.includes('! LaTeX Error: Not in outer par mode.'));
  assert.equal(lines.length, 1);
  const at = lines[0] ?? 0;
  const span = emitted.spans.find((s) => s.from <= at && at <= s.to);
  assert.equal(span?.branch, bad.id);
});
