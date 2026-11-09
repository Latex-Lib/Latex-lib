/**
 * bib.tfapastyle's presets, from Taylor & Francis Interact's APA sample (Source/0207-tandf-interact/interactapasample.tex).
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  // The three preamble lines the sample says must be active for the BibTeX list (l.16-18, 758-762) and the two lines where the
  // list stands (l.764-767).
  interact: {
    description: "Taylor & Francis Interact (APA-7) with BibTeX: \\usepackage[natbibapa]{tfapastyle}, entries hanging 12pt (\\bibhang), a 10pt list (\\bibliographytypesize), \\bibliographystyle{tfapacite} and \\bibliography{\\jobname}.",
    features: ['author-year', 'small-type', 'hanging', 'external-tool'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/interactapasample.tex', line: '16-18, 756-767' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0207-tandf-interact/tfapastyle.sty', line: '46, 93-99, 996-1003' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
