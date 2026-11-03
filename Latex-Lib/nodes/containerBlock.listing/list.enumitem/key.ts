import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.enumitem',
    node: 'containerBlock/listing',
    description:
      "enumitem: the kernel lists with key-value options, per list (\\begin{itemize}[nosep]) or once for the document's first level (\\setlist[itemize,1]{…}): nosep, noitemsep, itemsep, leftmargin (* fits the widest label), labelindent, label (\\alph*) for numbers), style=nextline for descriptions. 258 templates.",
    ctan: ['enumitem'],
    features: ['compact', 'custom-labels', 'lettered', 'numbered', 'aligned-labels'],
    params: {
      scope: { type: 'enum', values: ['list', 'document'], default: 'list', description: "the options on each list, or once for the document's first level (\\setlist)" },
      spacing: { type: 'enum', values: ['class', 'nosep', 'noitemsep'], default: 'class', description: 'no space around and between items (nosep), or only between (noitemsep)' },
      itemsep: { type: 'dimen', default: '', description: "space between items (itemsep=); ''" },
      leftmargin: { type: 'string', default: '', description: "the left margin (leftmargin=), * to fit the widest label; ''" },
      labelindent: { type: 'string', default: '', description: "the label's indent (labelindent=); ''" },
      label: { type: 'tex', default: '', description: "itemize: the bullet (label=); ''" },
      enumLabel: { type: 'tex', default: '', description: "enumerate: the label, with \\arabic*, \\alph*, \\roman* (label=\\alph*)); ''" },
      descriptionStyle: { type: 'enum', values: ['standard', 'nextline', 'sameline', 'multiline', 'unboxed'], default: 'standard', description: 'description: how labels and text share the line (style=)' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'enumitem' },
    ],
    deny: [
      { class: 'class.acmart', reason: 'ACM: "changing list definitions is not allowed"; the class fixes list margins and labels', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '118' }] },
      { class: 'class.beamer', reason: 'beamer redefines itemize, enumerate and description; enumitem replaces them again', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '96' }] },
    ],
    // A paragraph place, not below cols.vwcol (list.kernel's key says why).
    needs: { paragraph: true },
    zerotex: 'yes',
  }),
);
