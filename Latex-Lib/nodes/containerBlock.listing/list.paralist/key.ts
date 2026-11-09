import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.paralist',
    node: 'containerBlock/listing',
    description:
      "paralist: the lists in paralist's forms, compact (compactitem, compactenum, compactdesc), inline (inparaitem, inparaenum) or as paragraphs (asparaitem, asparaenum, asparadesc); a label template for numbered lists ([(a)]), \\setdefaultenum and \\setdefaultleftmargin. 27 templates.",
    writes: '\\begin{compactitem|compactenum|compactdesc}[…] \\item … \\end{compactitem|compactenum|compactdesc}',
    ctan: ['paralist'],
    features: ['compact', 'inline-list', 'custom-labels', 'numbered'],
    params: {
      form: { type: 'enum', values: ['compact', 'inline', 'aspara'], default: 'compact', description: 'compact lists, lists run into the paragraph, or items as paragraphs' },
      label: { type: 'string', default: '', description: "numbered lists: a label template ((a), 1., i.); ''" },
      defaultEnum: { type: 'tex', default: '', description: "\\setdefaultenum's four labels, braced ({(1)}{(a)}{(i)}{}); ''" },
      defaultMargins: { type: 'tex', default: '', description: "\\setdefaultleftmargin's six margins, braced; ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'paralist' },
    ],
    deny: [
      { class: 'class.acmart', reason: 'ACM: "changing list definitions is not allowed"', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '118' }] },
      // Whatever its params, the way writes a description list as compactdesc (forms compact and inline) or asparadesc (aspara)
      // whenever the node is one, and a deny keyed on params cannot see the node's style; so it is refused under beamer outright.
      // ctexbeamer (base class.beamer) takes the rule through its base.
      {
        class: 'class.beamer',
        reason: "under beamer, paralist's description lists (compactdesc, asparadesc) stop at every \\item[...] with 'Undefined control sequence' (<argument> \\makelabel {Sample}): they set \\makelabel from \\descriptionlabel, which the standard classes define (article.cls l.364) and beamer does not; with \\setdefaultenum and \\setdefaultleftmargin given, its numbered lists also stop at every \\item (<argument> \\makelabel {\\@itemlabel}, beamer's paralist patch)",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.ctexbeamer.log (2026-11-06), list.paralist@compact (defaultEnum and defaultMargins empty) writing \\begin{compactdesc}: "! Undefined control sequence. <argument> \\makelabel {Sample}", again for {Model}, at l.144 \\end{frame}' },
          { kind: 'source', file: 'texmf-dist/tex/latex/base/article.cls (TinyTeX)', line: '362-364 (description: \\let\\makelabel\\descriptionlabel; \\newcommand*\\descriptionlabel); no \\descriptionlabel anywhere in texmf-dist/tex/latex/beamer/' },
          { kind: 'compile', cell: "the copy's beamer.A run (index5): 28 of the 38 documents holding list.paralist@bold-labels, 0 of the 714 others, e.g. result 03b97fde3c98 l.219, e7477acdcc75 l.153, b87cc58f24ae l.805" },
        ],
      },
    ],
    // Its lists set their own \parshape at the full \linewidth, so below cols.vwcol, which fits only paragraph lines to its columns,
    // they came out a column too wide (vwcol > list > item: 26 of 222 branches passed, 180 overfull, 172.7pt in article), as D1 found
    // for the library's statements; it needs a paragraph place.
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
