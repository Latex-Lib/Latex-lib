/**
 * pg.numbering (atomicBlock/pageBreak): the break, then the kernel's \pagenumbering{<style>}, which restarts the page counter at 1
 * in the new style: roman after the title page, arabic before the first chapter, as the report and thesis templates switch it
 * (class.report main.tex l.102, 150; class.ctexrep main.tex l.154-155, 168-169). Any class: \pagenumbering is the kernel's.
 */
import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'pg.numbering',
    node: 'atomicBlock/pageBreak',
    description:
      "A page break that also switches the page numbering: \\clearpage (or \\cleardoublepage, \\newpage), then the kernel's \\pagenumbering{arabic}, {roman} or {Roman}, restarting the page count at 1 in that style, as a thesis or report starts arabic numbers after its roman front pages. Any class.",
    writes: '\\clearpage \\pagenumbering{arabic}',
    ctan: ['latex-base'],
    features: ['float-flush'],
    params: {
      command: { type: 'enum', values: ['clearpage', 'cleardoublepage', 'newpage'], default: 'clearpage', description: 'the break before the switch' },
      style: { type: 'enum', values: ['arabic', 'roman', 'Roman', 'alph', 'Alph'], default: 'arabic', description: 'the page numbers from the break on (\\pagenumbering{…})' },
    },
    presets: PRESETS,
    targetEngine: 'yes',
  }),
);
