import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'para.kernel',
    node: 'paragraph/paragraph',
    description:
      "A paragraph: its text and a blank line, indented by \\hspace* for each indent step; an empty one keeps its line with \\strut. Paragraphs set apart the class's way, by the parskip package (skip=, indent=), or by \\parskip and \\parindent.",
    writes: '\\hspace*{…}…',
    ctan: ['latex-base'],
    features: ['indented'],
    params: {
      separation: { type: 'enum', values: ['class', 'parskip', 'lengths'], default: 'class', description: "the class's indented paragraphs, the parskip package, or \\parskip and \\parindent set directly" },
      skip: { type: 'string', default: '', description: "space between paragraphs (parskip's skip=, or \\parskip); ''" },
      indent: { type: 'dimen', default: '', description: "the first-line indent (parskip's indent=, or \\parindent); ''" },
      indentStep: { type: 'dimen', default: '1.5em', description: "one step of the node's indent (\\hspace*)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'parskip', when: { separation: 'parskip' } },
      // The options the handler prints for these values (\usepackage[skip=10pt plus1pt, indent=40pt]{parskip}), so a class that loads
      // parskip itself is checked against them. resolve.ts unions the options of every matching load.
      { pkg: 'parskip', options: ['skip=10pt plus1pt', 'indent=40pt'], when: { separation: 'parskip', skip: '10pt plus1pt', indent: '40pt' } },
    ],
    deny: [
      {
        class: 'class.memoir',
        reason: 'memoir emulates parskip (marked loaded with no options): \\usepackage{parskip} does nothing, and with skip= or indent= it stops at "Option clash for package parskip"',
        evidence: [{ kind: 'compile', cell: "c43317ef2450034f457a0 (the copy's memoir.A run: all 168 documents with this error hold para.kernel)" }],
        unless: { separation: ['class', 'lengths'] },
      },
    ],
    targetEngine: 'untested',
  }),
);
