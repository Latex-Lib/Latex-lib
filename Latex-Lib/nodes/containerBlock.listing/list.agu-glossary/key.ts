import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.agu-glossary',
    node: 'containerBlock/listing',
    description:
      "AGU's back-matter lists (agujournal): a list as the class's glossary, acronyms or notation environment, which prints its own Glossary, Acronyms or Notation heading over a description list, each labelled item \\term{…}, \\acro{…} or \\notation{…} (bold maths) and its text.",
    writes: '\\begin{glossary} \\term{…} … \\end{glossary}',
    ctan: [],
    features: ['class-styled'],
    params: {
      form: {
        type: 'enum',
        values: ['glossary', 'acronyms', 'notation'],
        default: 'glossary',
        compat: true,
        description: 'which list: a glossary (\\term), the acronyms (\\acro) or the notation (\\notation, its symbols in bold maths), each under its own heading',
      },
    },
    presets: PRESETS,
    // agujournal2019.cls l.1055-1075 defines the three environments (each \section*, a description and \vskip12pt); classes/agu.ts
    // (agujournal2025) lists none of them yet.
    requiresWhen: [
      { when: { form: 'glossary' }, requires: ['env:glossary'] },
      { when: { form: 'acronyms' }, requires: ['env:acronyms'] },
      { when: { form: 'notation' }, requires: ['env:notation'] },
    ],
    only: ['class.agu'],
    // A list sets its own \parshape at the full \linewidth, as the kernel's lists do (list.kernel's needs).
    needs: { paragraph: true },
    // Typeset (ZeroTeX-NG, 2026-11-07) with agujournal2019.cls from the research beside the document, all three forms; the agu
    // profile's class, agujournal2025.cls, is not in this checkout (testing-pipeline/settings/classes/files holds no copy), so the
    // way is unmeasured under the class it is for.
    targetEngine: 'untested',
  }),
);
