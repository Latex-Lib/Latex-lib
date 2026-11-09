/**
 * ack.class-command's presets: each class's own acknowledgements command.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const PRESETS = {
  acknowledgments: {
    description:
      "The style's \\acknowledgments{…}: corl prints it only in its final and preprint modes, aistats only under [accepted], as \\subsubsection*{Acknowledgments} and the text; in review both drop it.",
    writes: '\\acknowledgments{…}',
    features: ['class-styled', 'unnumbered'],
    params: {},
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0794-aistats/aistats2026.sty', line: '65-73' },
      { kind: 'requirement', file: 'Template/template-requirement/AISTATS.md', line: '47' },
      solution('0794-aistats', '57'),
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty (2026/08/15)', line: '130-136' },
    ],
  },
  'agu-run-in': {
    description: "agu's \\acknowledgments on its own line, a bold run-in 'Acknowledgments' after 12pt, then the text (funding and the data availability statement).",
    writes: '\\acknowledgments …',
    features: ['class-styled', 'unnumbered', 'run-in-head'],
    params: { form: 'run-in' },
    evidence: [
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournal2019.cls', line: '1077-1079' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournaltemplate.tex', line: '385-386' },
      solution('0040-agu', '64'),
    ],
  },
  jmlr: {
    description: "jmlr's \\acks{…}, \\section*{Acknowledgments} and the text.",
    writes: '\\acks{…}',
    features: ['class-styled', 'unnumbered'],
    params: { command: 'acks' },
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0662-jmlr/jmlr.dtx', line: '4178-4181' }, solution('0662-jmlr', '70')],
  },
  iopjournal: {
    description:
      "iopjournal's back-matter commands, chosen by the node's title: \\ack{…} (Acknowledgments), \\funding{…}, \\data{…} (Data availability), \\roles{…} (Author contributions), \\suppdata{…}; each a \\section* with its fixed heading, the text replaced by a notice under [anonymous] (not \\suppdata's).",
    writes: '\\ack{…} | \\funding{…} | \\roles{…} | \\data{…} | \\suppdata{…}',
    features: ['class-styled', 'unnumbered'],
    params: { command: 'ack', byTitle: 'iopjournal' },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '143-163' },
      { kind: 'requirement', file: 'Template/template-requirement/IOP_Journals.md', line: '64, 96' },
      solution('0035-iop-journals', '47, 70'),
    ],
  },
  mdpi: {
    description:
      "mdpi's back-matter statements, chosen by the node's title: \\acknowledgments{…}, \\authorcontributions{…}, \\funding{…}, \\institutionalreview{…}, \\informedconsent{…}, \\dataavailability{…}, \\conflictsofinterest{…}, \\supplementary{…}, \\abbreviations{Abbreviations}{…}, or \\backnotes{title}{…} for any other title; each a bold 9pt run-in label.",
    writes: '\\acknowledgments{…} | \\authorcontributions{…} | \\funding{…} | \\conflictsofinterest{…} | \\abbreviations{…}{…} | \\backnotes{…}{…}',
    features: ['class-styled', 'unnumbered', 'run-in-head'],
    params: { byTitle: 'mdpi' },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1401-1460' },
      { kind: 'requirement', file: 'Template/template-requirement/MDPI.md', line: '121, 133, 154' },
    ],
  },
  lipics: {
    description: "lipics' \\acknowledgements{…}, given in the preamble: the class prints it under its 'Acknowledgements' heading in the abstract's metadata block, and blanks it in anonymous mode.",
    writes: '\\acknowledgements{…} (preamble)',
    features: ['class-styled'],
    params: { command: 'acknowledgements', form: 'preamble' },
    evidence: [{ kind: 'requirement', file: 'Template/template-requirement/LIPIcs.md', line: '85-94' }],
  },
} as const satisfies { readonly [name: string]: Preset };
