/**
 * bib.mdpi's presets, from MDPI's template (Source/0894-mdpi/template.tex l.473-516).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  // Variant B, the one the template fills in: the internal list, ACS format (l.491-516).
  mdpi: {
    description: 'MDPI: the reference list in the left margin column (\\begin{adjustwidth}{-\\extralength}{0cm}), headed \\reftitle{References}, a hand-written \\begin{thebibliography}{999} that the class sets 9/11pt with numbered labels.',
    features: ['class-styled', 'numeric-citations', 'hand-written', 'small-type', 'full-width'],
    params: {},
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0894-mdpi/template.tex', line: '473-477, 491-516' }, solution('0894-mdpi', '87')],
  },
  // Variant A, commented out in the template (l.486-489): the class's own \bibliographystyle{Definitions/mdpi} over \bibliography.
  'mdpi-external': {
    description: "MDPI with BibTeX: \\reftitle{References} and \\bibliography{\\jobname} in the margin column, styled by the class's own Definitions/mdpi.bst (the class names it; the .bst must ship with the template).",
    writes: '\\begin{adjustwidth}{-\\extralength}{0cm} \\reftitle{References} \\nocite{*} \\bibliography{\\jobname} \\end{adjustwidth}',
    features: ['class-styled', 'numeric-citations', 'small-type', 'full-width', 'external-tool'],
    params: { form: 'bibtex' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0894-mdpi/template.tex', line: '473-477, 483-489' }, { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '373-382' }],
  },
} as const satisfies { readonly [name: string]: Preset };
