import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.tikzposter-block',
    node: 'containerBlock/refContainer',
    description:
      "A tikzposter poster's reference list in its own block: \\block[options]{title}{\\small \\nocite{*} \\bibliographystyle{unsrtnat} \\bibliography{\\jobname}} with \\usepackage[square,numbers]{natbib}, the entries in \\jobname.bib, numbered in citation order (plainnat, abbrvnat too), optionally spread over columns with multicols; natbib's list brings its References heading, so the block's title is usually empty. tikzposter only.",
    // The \LatexLib… once-guards around it (../node.ts) are the library's own, left out.
    writes: '\\block{…}{\\small \\nocite{*} \\bibliographystyle{unsrtnat} \\bibliography{\\jobname}}',
    ctan: ['tikzposter', 'natbib'],
    features: ['numeric-citations', 'small-type', 'external-tool'],
    params: {
      title: { type: 'string', default: '', description: "the block's title (\\block{title}{…}); '' as in the template, natbib's list printing its own heading" },
      blockOptions: { type: 'tex', default: '', description: "the block's tikzposter keys (\\block[titleleft,roundedcorners=16]); ''" },
      font: { type: 'enum', values: ['small', 'footnotesize', 'scriptsize', 'normalsize'], default: 'small', description: "the list's font size inside the block" },
      bst: { type: 'enum', values: ['unsrtnat', 'plainnat', 'abbrvnat'], default: 'unsrtnat', description: 'the natbib-compatible BibTeX style' },
      columns: { type: 'enum', values: ['1', '2', '3', '4'], default: '1', description: 'the list in a multicols of this many columns inside the block; 1, none' },
      heading: { type: 'string', default: '', description: "the list's heading (\\refname); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'natbib', options: ['square', 'numbers'] },
      { pkg: 'multicol', when: { columns: ['2', '3', '4'] } },
    ],
    claims: ['bibliography-engine'],
    // \block is tikzposter's (the class profile lists it); natbib redefines thebibliography as it loads (natbib.sty 8.31b l.1063),
    // which the class has from article.
    requires: ['cmd:\\block', 'env:thebibliography'],
    only: ['class.tikzposter'],
    // The list's children are written to \jobname.bib as BibTeX source, so a footnote below it never prints, as for
    // bib.bibtex-bst [OV3].
    gives: { footnotes: false },
    // Typeset on ZeroTeX-NG under tikzposter, both presets (scratchpad build/work/bib.named+bib.tikzposter-block, 2026-11-07).
    targetEngine: 'yes',
  }),
);
