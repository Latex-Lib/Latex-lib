import { defineKey } from '../../../schema/key.ts';
import { ctan, minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'bib.named',
    node: 'containerBlock/refContainer',
    description:
      "IJCAI's reference list (ijcai27.sty, the IJCAI conference style on article): BibTeX with the kit's named.bst, \\nocite{*} \\bibliographystyle{named} \\bibliography{\\jobname}, the entries in \\jobname.bib, each labelled \\citeauthoryear{Author}{Year}, which the style's named.sty \\cite and \\shortcite print as [Author, Year] and [Year]; the heading through \\refname. ijcai only.",
    // The \LatexLib… once-guards around it (../node.ts) are the library's own, left out.
    writes: '\\nocite{*} \\bibliographystyle{named} \\bibliography{\\jobname}',
    // named.bst is the IJCAI kit's own file (FormattingGuidelines-IJCAI kit), not a CTAN package: its evidence is the kit's
    // sources below; BibTeX is the tool.
    ctan: ['bibtex'],
    features: ['author-year', 'external-tool'],
    params: {
      heading: { type: 'string', default: '', description: "the list's heading (\\refname); ''" },
    },
    presets: PRESETS,
    claims: ['bibliography-engine'],
    // named.bst's .bbl opens the kernel's \begin{thebibliography} (named.bst l.1272), and its \citeauthoryear labels need the
    // style's named.sty macros (ijcai26.sty l.286-317: \cite and \shortcite set \citeauthoryear before reading the label; under the
    // kernel's \cite it is undefined), of which \shortcite is the one no other class defines.
    requires: ['env:thebibliography', 'cmd:\\shortcite'],
    only: ['class.ijcai'],
    // The list's children are written to \jobname.bib as BibTeX source, so a footnote below it never prints, as for
    // bib.bibtex-bst [OV3].
    gives: { footnotes: false },
    // The pinned ijcai27.sty that classes/ijcai.ts cites is not in testing-pipeline/settings/classes/files/ here and the style is not
    // on CTAN, so the form is not typeset against it. A sanity run on the kit's ijcai26.sty (a copy of ijcai22.sty, whose named.sty
    // block ijcai27.sty shares) typeset ok on ZeroTeX-NG (2026-11-07), BibTeX making the .bbl and the list labelled [Knuth, 1984],
    // with named.bst not supplied: the engine's package mirror has it.
    targetEngine: 'untested',
  }),
  evidence: [
    ctan('bibtex'),
    { kind: 'solution', file: 'Solution/0319-ijcai.md', lines: '23, 73-74, 82' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.tex', line: '595-600, 630-632' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/ijcai26.sty', line: '284-319' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0319-ijcai/named.bst', line: '1067-1069, 1272' },
  ],
});
