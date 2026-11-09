import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'head.tufte',
    node: 'paragraph/heading',
    description:
      "Tufte-LaTeX's headings (tufte-handout, tufte-book) kept within the class's levels: \\chapter, \\section, \\subsection and \\paragraph as the class styles them, unnumbered, and a heading at a level the class makes an error (\\subsubsection, \\subparagraph) written as \\newthought{…}, a small-capitals paragraph opening, or as \\paragraph or \\subsection. Never \\subsubsection.",
    writes: '\\section{…} \\label{…} \\subsection{…} \\newthought{…}|\\paragraph{…}',
    ctan: ['tufte-latex'],
    features: ['class-styled', 'italic-head', 'smallcaps-head', 'run-in-head', 'unnumbered'],
    params: {
      deepLevel: {
        type: 'enum',
        values: ['newthought', 'paragraph', 'subsection'],
        default: 'newthought',
        description:
          'what a \\subsubsection or \\subparagraph heading is written as: \\newthought{…} (both), \\paragraph (both), or one level up (\\subsection, \\paragraph)',
      },
    },
    presets: PRESETS,
    // The class's levels have their counters (`{kind}`, the document's levels; the forbidden two keep theirs too, tufte-common.def
    // only renews the commands). \newthought is the class's own (both profiles define it), needed only when the way prints it.
    requires: ['counter:{kind}'],
    requiresWhen: [{ when: { deepLevel: 'newthought' }, requires: ['cmd:\\newthought'] }],
    only: ['class.tufte-handout', 'class.tufte-book'],
    // As head.class-native: below cols.vwcol a heading comes out at the full text width.
    needs: { paragraph: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07), every preset under [nols]{tufte-handout} and [nols]{tufte-book} (the profiles' setup):
    // \section, \subsection, \paragraph and a \subsubsection and \subparagraph written at deepLevel's level, each with a \label.
    // The resolver still refuses it where the document has a \subsubsection or \subparagraph heading: resolve.ts charges the
    // profiles' forbids.names to every heading way by the document's levels, though this one never prints those commands.
    targetEngine: 'yes',
  }),
);
