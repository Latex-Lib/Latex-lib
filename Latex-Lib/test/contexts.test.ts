/**
 * Contexts fold down the chain: an allowance turned off stays off, a
 * situation turned on stays on, boxes add up; a key's params add to what it
 * gives and needs.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { below, DOCUMENT, fold, givesOf, needsOf, unmet } from '../contexts.ts';

test('an allowance one ancestor turns off reaches every descendant, and a body cannot turn it back on', () => {
  const inCell = fold([{ breakable: false, floats: false, boxDepth: 1 }, { boxDepth: 1 }]);
  assert.equal(inCell.breakable, false);
  assert.equal(inCell.floats, false);
  assert.equal(inCell.boxDepth, 2);
  assert.equal(below(inCell, {}).breakable, false, 'nothing turns it back on');
});

test('a situation one ancestor is in holds below it', () => {
  const inNote = fold([{ argument: true }, {}]);
  assert.equal(inNote.argument, true);
  assert.equal(DOCUMENT.argument, false);
});

test('a need the context does not meet is named, each one', () => {
  assert.deepEqual(unmet({ breakable: true, argument: false }, DOCUMENT), []);
  assert.deepEqual(unmet({ breakable: true, argument: false, maxBoxDepth: 0 }, fold([{ breakable: false, argument: true, boxDepth: 1 }])), [
    'needs breakable',
    'cannot have argument',
    'at most 0 boxes above, not 1',
  ]);
});

test('a key gives and needs more under the params its givesWhen and needsWhen match', () => {
  const box = { gives: { floats: false, boxDepth: 1 } as const, givesWhen: [{ when: { breakable: false }, gives: { breakable: false, boxDepth: 1 } as const }] };
  assert.deepEqual(givesOf(box, { breakable: true }), { floats: false, boxDepth: 1 });
  assert.deepEqual(givesOf(box, { breakable: false }), { floats: false, breakable: false, boxDepth: 2 });
  const image = { needs: { maxBoxDepth: 2 }, needsWhen: [{ when: { float: true }, needs: { floats: true, maxBoxDepth: 3 } }] };
  assert.deepEqual(needsOf(image, { float: false }), { maxBoxDepth: 2 });
  assert.deepEqual(needsOf(image, { float: true }), { floats: true, maxBoxDepth: 2 }, 'the lower cap holds');
  assert.deepEqual(unmet(needsOf(image, { float: true }), fold([{ floats: false, boxDepth: 1 }])), ['needs floats']);
});
