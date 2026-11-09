import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.nomenclature',
    node: 'containerBlock/listing',
    description:
      "ASME's nomenclature (asmeconf, asmejour): a list as the class's nomenclature environment, under its own Nomenclature heading with the symbols in a hanging column, each item with a description \\entry{symbol}{meaning}, a first-level item with items below it (or a label with no text) an \\EntryHeading{…} subheading; the label column's width and the heading's name when asked.",
    writes: '\\begin{nomenclature}[…] \\EntryHeading{…} \\entry{…}{…} \\end{nomenclature}',
    ctan: ['asmeconf', 'asmejour'],
    features: ['class-styled', 'aligned-labels'],
    params: {
      labelWidth: {
        type: 'dimen',
        default: '',
        description: "the symbol column's width, the environment's first optional argument; '' the class's (asmeconf 2em, asmejour the widest symbol)",
      },
      title: { type: 'tex', default: '', description: "the heading's name, through \\renewcommand*{\\nomname}{…} (List of Symbols); '' the class's Nomenclature" },
    },
    presets: PRESETS,
    // asmeconf.cls l.1650-1680 and asmejour.cls l.1459-1525 define \entry and \EntryHeading with the environment; classes/asmejour.ts
    // lists env:nomenclature but neither command yet. \nomname (for `title`) is \providecommand'ed by both (asmeconf.cls l.1583,
    // asmejour.cls l.1442); a predicate cannot say "title is not ''", so it is not required, and the environment implies it.
    requires: ['env:nomenclature', 'cmd:\\entry', 'cmd:\\EntryHeading'],
    only: ['class.asmeconf', 'class.asmejour'],
    // A list sets its own \parshape at the full \linewidth, as the kernel's lists do (list.kernel's needs).
    needs: { paragraph: true },
    // Typeset (ZeroTeX-NG, 2026-11-07) under asmeconf from the mirror, and under asmejour with asmejour.cls v1.28 beside the
    // document: the mirror's v1.27 stops at class load here (\ClassErrorNoLine undefined, l.362), which the setting's patched file
    // (asmejour-latexlib) addresses and which is not in this checkout.
    targetEngine: 'yes',
  }),
);
