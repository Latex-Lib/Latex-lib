/**
 * doc.generic-packages's presets, each from the template that switches the packages on.
 */
import type { Preset } from '../../../schema/params.ts';

const examples = 'Latex Related Research/Latex-Template-Examples';
const source = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  minimal: {
    description: "The minimal class's 6.5in by 8in text block centred on US letter paper: \\usepackage[letterpaper,text={6.5in,8in},centering]{geometry}.",
    writes: '\\usepackage[letterpaper,text={6.5in,8in},centering]{geometry}',
    features: [],
    params: { geometry: true, geometryOptions: 'letterpaper,text={6.5in,8in},centering' },
    evidence: [{ kind: 'source', file: `${examples}/class.minimal/main.tex`, line: '36-38' }],
  },
  ijcai: {
    description:
      "IJCAI's submission preamble: line numbers in the outer margin, alternating (\\usepackage[switch]{lineno} \\linenumbers), and the template's version in the PDF's document information (TemplateVersion IJCAI.2026.0).",
    writes: '\\usepackage[switch]{lineno} \\linenumbers \\AtBeginDocument{\\ifdefined\\hypersetup\\hypersetup{pdfinfo={TemplateVersion={…}}}\\fi}',
    features: ['line-numbers'],
    params: { lineno: 'switch', pdfinfo: 'TemplateVersion={IJCAI.2026.0}' },
    evidence: [{ kind: 'source', file: `${source}/0319-ijcai/ijcai26.tex`, line: '28-31, 66-72' }],
  },
  frontiers: {
    description: "Frontiers' submission preamble: line numbers (\\usepackage{lineno} \\linenumbers) and one-and-a-half line spacing (\\usepackage[onehalfspacing]{setspace}).",
    writes: '\\usepackage{lineno} \\usepackage[onehalfspacing]{setspace} \\linenumbers',
    features: ['line-numbers'],
    params: { lineno: 'plain', setspace: 'onehalfspacing' },
    evidence: [{ kind: 'source', file: `${source}/0757-frontiers/frontiers.tex`, line: '19-23' }],
  },
  'double-spacing': {
    description: 'Double line spacing for a review copy, \\usepackage[doublespacing]{setspace}, as the PLOS template offers it (commented out there).',
    writes: '\\usepackage[doublespacing]{setspace}',
    features: [],
    params: { setspace: 'doublespacing' },
    evidence: [{ kind: 'source', file: `${source}/0862-plos/plos_latex_template.tex`, line: '125-127' }],
  },
} as const satisfies { readonly [name: string]: Preset };
