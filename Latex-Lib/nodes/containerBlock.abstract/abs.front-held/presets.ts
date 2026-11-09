/**
 * abs.front-held's presets, each from the class's own template (Latex-Template-Examples) and source.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const AASTEX = 'testing-pipeline/settings/classes/files/aastex701.cls';
export const REVTEX = 'Latex Related Research/Latex-lib-main/Source/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls';
export const EXAMPLES = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  aastex: {
    description:
      "AASTeX 7's abstract: the class's abstract environment after the title block's declarations and before the first \\section, with no \\maketitle; the class keeps it in its box and the first \\section prints it in the title block, under ABSTRACT, with the keywords.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [solution('0563-aastex', '39'), solution('0941-aastex', '42'), { kind: 'source', file: `${EXAMPLES}/class.aastex/main.tex`, line: '100-111' }],
  },
  emulateapj: {
    description:
      "emulateapj's abstract: the class's abstract environment after the title's declarations and before the first \\section, with no \\maketitle; revtex4 keeps it for the title block, which the first \\section prints across both columns.",
    features: ['class-styled'],
    params: {},
    evidence: [{ kind: 'source', file: `${EXAMPLES}/class.emulateapj/main.tex`, line: '108-117' }],
  },
  revtex: {
    description:
      "REVTeX 4.2's abstract (APS, AIP): the class's abstract environment after the title's declarations, then \\maketitle, which prints the title, the authors and the abstract together; the title way leaves its own \\maketitle out (front.revtex's after-abstract).",
    writes: '\\begin{abstract} … \\end{abstract} \\maketitle',
    features: ['class-styled'],
    params: { maketitle: 'after' },
    evidence: [
      solution('0908-aip-conference-proceedings', '37'),
      { kind: 'source', file: `${EXAMPLES}/class.revtex4-2/main.tex`, line: '126-135' },
      { kind: 'source', file: `${EXAMPLES}/class.revtex4-2-aip/main.tex`, line: '75-83' },
    ],
  },
  ecai: {
    description:
      "ECAI's abstract: the class's abstract environment, which fills the box its frontmatter's \\maketitle prints, set at \\begin{document} so it is filled before the title's \\end{frontmatter} wherever the abstract stands.",
    writes: '\\AtBeginDocument{\\begin{abstract} … \\end{abstract}}',
    features: ['class-styled'],
    params: { place: 'begin-document' },
    evidence: [{ kind: 'source', file: `${EXAMPLES}/class.ecai/main.tex`, line: '82-101' }, { kind: 'source', file: 'Latex-Lib/classes/ecai.ts', line: '21-22' }],
  },
} as const satisfies { readonly [name: string]: Preset };
