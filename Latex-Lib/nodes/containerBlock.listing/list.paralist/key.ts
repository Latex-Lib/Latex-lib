import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.paralist',
    node: 'containerBlock/listing',
    description:
      "paralist: the lists in paralist's forms, compact (compactitem, compactenum, compactdesc), inline (inparaitem, inparaenum) or as paragraphs (asparaitem, asparaenum, asparadesc); a label template for numbered lists ([(a)]), \\setdefaultenum and \\setdefaultleftmargin. 27 templates.",
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
      {
        class: 'class.beamer',
        reason: "under beamer (its paralist patch), paralist's lists stopped at every \\item with 'Undefined control sequence' (<argument> \\makelabel {\\@itemlabel}) once \\setdefaultenum and \\setdefaultleftmargin were given; never with paralist's other presets",
        evidence: [{ kind: 'compile', cell: "the copy's beamer.A run (index5): 28 of the 38 documents holding list.paralist@bold-labels, 0 of the 714 others, e.g. result 03b97fde3c98 l.219, e7477acdcc75 l.153, b87cc58f24ae l.805" }],
        unless: { defaultEnum: '', defaultMargins: '' },
      },
    ],
    // Its lists set their own \parshape at the full \linewidth, so below cols.vwcol, which fits only paragraph lines to its columns,
    // they came out a column too wide (vwcol > list > item: 26 of 222 branches passed, 180 overfull, 172.7pt in article), as D1 found
    // for the library's statements; it needs a paragraph place.
    needs: { paragraph: true },
    zerotex: 'untested',
  }),
);
