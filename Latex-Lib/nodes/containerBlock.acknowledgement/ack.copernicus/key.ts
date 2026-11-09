import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.copernicus',
    node: 'containerBlock/acknowledgement',
    description:
      "Copernicus Publications' back-matter statements, chosen by the node's title: copernicus.cls's \\begin{acknowledgements} … \\end{acknowledgements} with no title, the class's statement command for a title it names (\\authorcontribution{…}, \\competinginterests{…}, \\codeavailability, \\dataavailability, \\financialsupport, \\disclaimer …), or \\specialsection{title}{…} for any other; each first closes an open appendix with \\noappendix, as the template does.",
    writes:
      '\\ifx\\thesection\\theolds\\else\\noappendix\\fi \\begin{acknowledgements} … \\end{acknowledgements} | \\ifx\\thesection\\theolds\\else\\noappendix\\fi \\authorcontribution{…} | \\ifx\\thesection\\theolds\\else\\noappendix\\fi \\specialsection{…}{…}',
    ctan: ['copernicus'],
    features: ['class-styled', 'unnumbered', 'run-in-head', 'small-type'],
    params: {
      closeAppendix: {
        type: 'boolean',
        default: true,
        description: "first close an open appendix, \\ifx\\thesection\\theolds\\else\\noappendix\\fi (the template's \\noappendix, template.tex l.181)",
      },
    },
    presets: PRESETS,
    // The environment and the two commands the template marks mandatory (template.tex l.199-201), and \specialsection; the
    // other statement commands come with them from the same \generateCommand block (copernicus.cls l.2851-2866).
    requires: ['env:acknowledgements', 'cmd:\\authorcontribution', 'cmd:\\competinginterests', 'cmd:\\specialsection'],
    requiresWhen: [{ when: { closeAppendix: true }, requires: ['cmd:\\noappendix', 'cmd:\\theolds'] }],
    only: ['class.copernicus'],
    // A statement command reads the text as its argument (\generateCommand's \long\def, l.2823-2824): no verbatim child there.
    // The title picks the form, so the way gives it whatever the title: the environment alone would take verbatim.
    gives: { argument: true, verbatim: false },
    // Typeset ok on a scratch copy of copernicus.cls 10.1.35 patched for XeTeX as the pinned 10.1.34 is (the preset's compile
    // evidence), not on the pinned file itself, which is not in this checkout: so untested until the pinned class runs it.
    targetEngine: 'untested',
  }),
);
