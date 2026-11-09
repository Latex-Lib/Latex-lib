/**
 * bib.cite-pkg's presets, each from the templates that use it (`node seed.ts bib --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;

export const PRESETS = {
  'sorted-compressed': {
    description: 'Numbered citations sorted and compressed to ranges, [1-3], with BibTeX\'s plain style.',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: {},
    evidence: [solution('0524-doem97-ntu-eee-msc-dissertation-template', '76'), solution('0125-eurographics', '54')],
  },
  superscript: {
    description: 'Citations as superscript numbers in the text (the super option), as optics journals print them.',
    features: ['numeric-citations', 'superscript', 'sorted-compressed', 'external-tool'],
    params: { superscript: true },
    evidence: [solution('0758-osa', '39')],
  },
  'citation-order': {
    description: 'Numbered in citation order (unsrt) and left unsorted in the text (nosort), compressed.',
    features: ['numeric-citations', 'external-tool'],
    params: { sort: false, bst: 'unsrt' },
    evidence: [solution('0250-ustc-thesis', '87')],
  },
  compsoc: {
    description: "IEEE Computer Society: cite with nocompress (sorted, each number written out: [1], [2], [3]) and IEEEtran.bst.",
    writes: '\\usepackage[nocompress]{cite} \\nocite{*} \\bibliographystyle{IEEEtran} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'external-tool'],
    params: { compress: false, bst: 'IEEEtran' },
    evidence: [src('0743-ieeetran-journal/IEEEtran/bare_jrnl_compsoc.tex', '92-99 (IEEE Computer Society needs nocompress option)'), { kind: 'requirement', file: 'Template/template-requirement/IEEEtran_Compsoc.md', line: '107' }],
  },
  ieeetran: {
    description: "IEEE's journals and IEEE Access: cite (sorted, compressed) with IEEEtran.bst.",
    writes: '\\usepackage{cite} \\nocite{*} \\bibliographystyle{IEEEtran} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'sorted-compressed', 'external-tool'],
    params: { bst: 'IEEEtran' },
    evidence: [{ kind: 'source', file: 'Template/templates/ieee-access/starter.tex', line: '343-345 (\\nocite{*} \\bibliographystyle{IEEEtran} \\bibliography{\\jobname})' }],
  },
  spie: {
    description: "SPIE: spiebib.bst over the class's own cite package (superscript numbers), which the way does not load again.",
    writes: '\\nocite{*} \\bibliographystyle{spiebib} \\bibliography{\\jobname}',
    features: ['numeric-citations', 'superscript', 'external-tool'],
    params: { bst: 'spiebib', load: false },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/SPIE_Proceedings.md', line: '49, 83' }, { kind: 'source', file: 'Latex-Lib/classes/spie.ts', line: '38 (spie.cls l.91-92: ifthen, cite[superscript])' }],
  },
} as const satisfies { readonly [name: string]: Preset };
