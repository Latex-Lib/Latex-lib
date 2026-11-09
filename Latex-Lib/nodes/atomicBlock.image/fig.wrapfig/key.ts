import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'fig.wrapfig',
    node: 'atomicBlock/image',
    description:
      'wrapfig: the text wraps round the image, \\begin{wrapfigure}[lines]{placement}[overhang]{width} … \\end{wrapfigure}; placement r, l, i or o (upper case lets it float). Not in lists or boxes; in columns (multicol, paracol, \\twocolumn) it wraps inside the column it stands in. 43 templates.',
    writes: '\\begin{wrapfigure}{…}{…} \\centering \\includegraphics[width=\\linewidth]{…} \\caption{…} \\label{…} \\end{wrapfigure}',
    ctan: ['wrapfig'],
    features: ['wrapped', 'captioned', 'scaled'],
    params: {
      side: { type: 'enum', values: ['r', 'l', 'i', 'o', 'R', 'L', 'I', 'O'], default: 'r', description: 'right, left, inner or outer edge; upper case may float to a later paragraph' },
      width: { type: 'string', default: '0.45\\linewidth', description: "the wrapped column's width" },
      lines: { type: 'number', default: 0, description: 'the number of narrowed lines; 0 lets wrapfig count' },
      overhang: { type: 'dimen', default: '', description: "how far it reaches into the margin; ''" },
      raise: { type: 'dimen', default: '', description: "pulls the image up against the text above (\\vspace{-…}); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'graphicx' },
      { pkg: 'wrapfig' },
    ],
    requires: [
      'env:figure',
    ],
    deny: [
      { class: 'class.beamer', reason: "beamer's figure is a centre environment placed where it starts; there is no paragraph to wrap round it", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '85' }] },
    ],
    // b23 (round 3 of batch 1): columns no longer deny it. wrapfig measures and indents against \hsize, the column it stands in
    // (wrapfig.sty l.137-150: the i/o placement is turned into l/r there, the figure's box and the wrapped lines' indentation are
    // set inside \hsize), its documentation says "It does work in two-column format" (l.362), and the presets' placements are the
    // lower-case ones (r, l, o: here), so multicol's and paracol's output routines split the column with the figure's lines as with
    // any other (\pagegoal, which those routines change, only decides whether to float an upper-case placement or break before
    // the figure, l.110-128; a figure that cannot start where it stands, in a list's indentation or beside another still
    // wrapping, waits for the next paragraph, "Stationary wrapfigure forced to float", in columns or not). GitHub run
    // r2-461ed0e compiled 1,187 such denied branches (below cols.twocolumn-cmd 444, cols.multicol 325, General's multicol 268,
    // cols.paracol 150) and 1,051 passed (88.5%, against 92.0% of the 18,643 not-denied fig.wrapfig branches); every failure was
    // an overfull line or page beside the figure in a narrow column, no TeX error. b23's GitHub probe (run 41775212344,
    // CLASSPIPE-wrapfig-cols-article-A/-B) compiled 38 such branches under article.A and 30 under article.B: no wrapfig error; the
    // PDFs draw 34 of the 38 figures and 27 of the 30, one fewer for each branch whose statement environment the probe document's
    // merged preamble had already defined for tcolorbox (its TeX errors are that clash's); the other failures were overfull lines
    // and one page overflow. cols.vwcol still turns paragraph off: 0 of 62.
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
