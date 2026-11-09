import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'bib.mdpi',
    node: 'containerBlock/refContainer',
    description:
      "MDPI's reference list (class Definitions/mdpi): set out into the left margin column with \\begin{adjustwidth}{-\\extralength}{0cm}, headed \\reftitle{References}, then a hand-written \\begin{thebibliography}{999} with one \\bibitem{key} per entry, which the class's own thebibliography heads, numbers and sets 9/11pt; or, with BibTeX, \\bibliography{\\jobname} under the class's own \\bibliographystyle{Definitions/mdpi} (the template's external bibliography).",
    // Printed as \LatexLibBibitem{…}{…}, which is \bibitem{…} (\bibitem[{…}]{…} under natbib: bibitemChooser, ../node.ts).
    writes: '\\begin{adjustwidth}{-\\extralength}{0cm} \\reftitle{References} \\begin{thebibliography}{999} \\bibitem{…} … \\end{thebibliography} \\end{adjustwidth}',
    ctan: ['latex-base', 'changepage'],
    features: ['class-styled', 'numeric-citations', 'hand-written', 'small-type', 'full-width', 'external-tool'],
    params: {
      form: { type: 'enum', values: ['thebibliography', 'bibtex'], default: 'thebibliography', description: "thebibliography: a hand-written list read from the entries (the template's variant B); bibtex: \\bibliography{\\jobname} under the class's own Definitions/mdpi.bst (variant A)" },
      heading: { type: 'string', default: 'References', description: "the list's heading, stored with \\reftitle{…} and printed by the class's thebibliography; '' gives none" },
      widest: { type: 'string', default: '999', description: 'the widest label, which sets the label column (form thebibliography)' },
      wide: { type: 'boolean', default: true, description: 'the list set out into the left margin column, \\begin{adjustwidth}{-\\extralength}{0cm}, as the template sets its back matter' },
    },
    presets: PRESETS,
    // mdpi.cls loads changepage itself (adjustwidth, profile preloads) and natbib; the way prints no package.
    loads: [],
    claims: ['bibliography-engine'],
    // The class's thebibliography (mdpi.cls l.1857-1887, which reads \@reftitle) and \reftitle (l.762-763); the margin column is
    // changepage's adjustwidth (mdpi.cls l.64 loads changepage) by the class's \extralength (l.1579-1580).
    requires: [
      'env:thebibliography',
      'cmd:\\reftitle',
    ],
    requiresWhen: [{ when: { wide: true }, requires: ['env:adjustwidth', 'length:\\extralength'] }],
    only: ['class.mdpi'],
    // The list's children are written to \jobname.bib as BibTeX source (refContainer/node.ts bibFile), so a child that is not an
    // entry never prints, as for every reference-list way. [OV3]
    gives: { footnotes: false },
    targetEngine: 'yes',
  }),
);
