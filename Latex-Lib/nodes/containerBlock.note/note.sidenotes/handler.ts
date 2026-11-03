/**
 * note.sidenotes: \sidenote[number][offset]{text}, numbered like a footnote,
 * set in the margin; without an offset the note floats, with one it is fixed
 * there. The oneside package option for one-sided layouts.
 * CTAN: https://ctan.org/pkg/sidenotes (section 1)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { FIT_NOTE_COLUMN, titled } from '../node.ts';
import key from './key.ts';
import { keepingFootnotes } from '../node.ts';

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
      // Either way the note is \marginparwidth wide, fitted to the margin where the class's column is under 2cm or runs off the
      // paper (b22 MC1, `FIT_NOTE_COLUMN`).
      declarations: [...(offset === '' ? ['\\ifnum\\maxdeadcycles<1000 \\maxdeadcycles=1000 \\fi'] : []), FIT_NOTE_COLUMN],
    }),
    // A footnote in the note reaches the page's foot: footnotehyper's \savenotes around it (b22 OV2-alt, `keepingFootnotes`).
    emit: (node, content) => keepingFootnotes(content, `\\sidenote${offset === '' ? '' : `[][${offset}]`}{${titled(node, content)}}`),
  };
};

export default realize;
