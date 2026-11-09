import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/**
 * imsart's raw LaTeX block: custom.raw's body, with the block's preamble (data.preamble) wrapped in the class's
 * \startlocaldefs … \endlocaldefs, as the IMS journals' template asks ("Please put your definitions here",
 * aos-template.tex l.55-59, read through the requirement document: IMS_Imsart.md l.164, tier A).
 * - imsart is not on CTAN (ctan.org/pkg/imsart is a 404) and its files are not in testing-pipeline/settings/classes/files,
 *   so the way is not typeset here: targetEngine stays 'untested'.
 * - \startlocaldefs and \endlocaldefs are imsart.sty's own commands (the template uses them in its preamble); the class
 *   profile does not list them yet, so 'cmd:\startlocaldefs' is reported as a profile change. Each block's preamble gets its
 *   own pair, so two blocks' definitions stay separate entries and a repeated preamble is still de-duplicated as one string.
 */
export default defineKey(
  minimal({
    id: 'custom.imsart-localdefs',
    node: 'containerBlock/customLatex',
    description:
      "imsart (IMS journals: Annals of Statistics, AOAS, AOP, AAP, STS): a block of raw LaTeX the author wrote, printed unchanged in the body, with its preamble lines (data.preamble) wrapped in the class's \\startlocaldefs … \\endlocaldefs, where the IMS template puts the author's own definitions.",
    writes: '\\startlocaldefs … \\endlocaldefs ; … (the author\'s LaTeX, unchanged)',
    ctan: ['latex-base'],
    features: [],
    presets: PRESETS,
    requires: ['cmd:\\startlocaldefs'],
    only: ['class.imsart'],
    targetEngine: 'untested',
  }),
);
