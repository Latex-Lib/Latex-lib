/**
 * list.nomenclature's presets, from the classes' templates.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

/** A file at its lines. */
const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const ASMECONF = 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf';

export const PRESETS = {
  class: {
    description: "The class's nomenclature as the templates write it: a Nomenclature heading, symbols in a hanging column (2em in asmeconf, the widest symbol in asmejour), italic or bold subheadings.",
    features: ['class-styled', 'aligned-labels'],
    params: {},
    evidence: [
      source(`${ASMECONF}/asmeconf-template.tex`, '216-232 (nomenclature, \\EntryHeading, \\entry)'),
      source(`${ASMECONF}/asmeconf.cls`, '1583 (\\nomname), 1650-1680 (\\entry, \\EntryHeading, nomenclature)'),
      source('Latex Related Research/Latex-Template-Examples/class.asmejour/main.tex', '107-115'),
      solution('0909-asmeconf', '57'),
    ],
  },
  'list-of-symbols': {
    description: 'The nomenclature renamed List of Symbols, with a wider 4em symbol column for long symbols (asmeconf-template.tex l.211, 554).',
    writes: '\\renewcommand*{\\nomname}{…}; \\begin{nomenclature}[…] \\EntryHeading{…} \\entry{…}{…} \\end{nomenclature}',
    features: ['class-styled', 'aligned-labels'],
    params: { labelWidth: '4em', title: 'List of Symbols' },
    evidence: [source(`${ASMECONF}/asmeconf-template.tex`, '210-213 (the width argument, [Xcm]), 550-554 (\\renewcommand*{\\nomname}{List of Symbols})')],
  },
} as const satisfies { readonly [name: string]: Preset };
