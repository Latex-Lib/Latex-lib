/**
 * note.sidenotes: \sidenote[number][offset]{text}, numbered like a footnote,
 * set in the margin; without an offset the note floats, with one it is fixed
 * there. The oneside package option for one-sided layouts.
 * CTAN: https://ctan.org/pkg/sidenotes (section 1)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const offset = param(p, 'offset');
  return {
    // Without an offset \sidenote places its note with \marginpar (sidenotes.sty l.60-65), which runs the output routine twice
    // without shipping a page: a page of 50 such notes stops at "Output loop---100 consecutive dead cycles", as note.marginpar's
    // and note.todonotes' 63-note documents did (run 41584963423: d08f06e41bd6b4c059d1f, d2f9893f01482515bc703; this run filed
    // at most 16 floating side notes in a document, its 63-note document dd032bb91230435a31f1d is @fixed, a \marginnote). So
    // \maxdeadcycles is raised as there, never lowered (mdpi.cls sets 10000).
    preamble: () => ({
      packages: [p['oneside'] === true ? '\\usepackage[oneside]{sidenotes}' : '\\usepackage{sidenotes}'],
      ...(offset === '' ? { declarations: ['\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi'] } : {}),
    }),
    emit: (node, content) => `\\sidenote${offset === '' ? '' : `[][${offset}]`}{${titled(node, content)}}`,
  };
};

export default realize;
