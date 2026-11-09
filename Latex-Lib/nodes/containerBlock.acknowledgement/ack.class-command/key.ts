import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'ack.class-command',
    node: 'containerBlock/acknowledgement',
    description:
      "The class's own acknowledgements command, which prints its fixed heading: the text as its argument, \\acknowledgments{…} (corl, aistats, mdpi), jmlr's \\acks{…}, iopjournal's \\ack{…}; agu's run-in \\acknowledgments before the text; lipics' \\acknowledgements{…} stored in the preamble for the abstract's metadata block. Under iopjournal and mdpi the node's title picks the class's other back-matter statement command instead: \\funding, \\roles, \\data, \\suppdata, \\authorcontributions, \\conflictsofinterest, \\abbreviations{…}{…} or \\backnotes{title}{…}.",
    writes:
      '\\acknowledgments{…} | \\acknowledgments … | \\acks{…} | \\ack{…} \\funding{…} \\roles{…} \\data{…} \\suppdata{…} | \\authorcontributions{…} \\conflictsofinterest{…} \\abbreviations{…}{…} \\backnotes{…}{…} | \\acknowledgements{…} (preamble)',
    ctan: ['jmlr', 'lipics'],
    features: ['class-styled', 'unnumbered'],
    params: {
      command: {
        type: 'enum',
        values: ['acknowledgments', 'acks', 'ack', 'acknowledgements'],
        default: 'acknowledgments',
        description: "the class's acknowledgements command, without its backslash",
      },
      form: {
        type: 'enum',
        values: ['argument', 'run-in', 'preamble'],
        default: 'argument',
        description: "the text as the command's argument, after the run-in command, or as its argument in the preamble (lipics)",
      },
      byTitle: {
        type: 'enum',
        values: ['none', 'iopjournal', 'mdpi'],
        default: 'none',
        description: "whose back-matter commands the node's title picks from (Funding, Data availability, Author contributions, …); none always prints the command",
      },
    },
    presets: PRESETS,
    requires: ['cmd:\\{command}'],
    // The commands the title can pick, each defined by the class (iopjournal.cls l.145-163; mdpi.cls l.1401-1460).
    requiresWhen: [
      { when: { byTitle: 'iopjournal' }, requires: ['cmd:\\funding', 'cmd:\\roles', 'cmd:\\data', 'cmd:\\suppdata'] },
      {
        when: { byTitle: 'mdpi' },
        requires: [
          'cmd:\\authorcontributions',
          'cmd:\\funding',
          'cmd:\\institutionalreview',
          'cmd:\\informedconsent',
          'cmd:\\dataavailability',
          'cmd:\\conflictsofinterest',
          'cmd:\\supplementary',
          'cmd:\\abbreviations',
          'cmd:\\backnotes',
        ],
      },
    ],
    only: ['class.agu', 'class.corl', 'class.aistats', 'class.jmlr-pmlr', 'class.iopjournal', 'class.mdpi', 'class.lipics'],
    // The argument forms read the text as a macro argument: no verbatim child. The commands are \long (\newcommand, \def with
    // no \par check), so paragraphs pass. lipics keeps its argument for the abstract's metadata block, which it sets after the
    // abstract: no float or footnote there either.
    givesWhen: [
      { when: { form: 'argument' }, gives: { argument: true, verbatim: false } },
      { when: { form: 'preamble' }, gives: { argument: true, verbatim: false, floats: false, footnotes: false } },
    ],
    // Typeset on ZeroTeX-NG (2026-11-07): agu's run-in \acknowledgments (agujournal2019.cls, the research copy), aistats'
    // \acknowledgments{…} with and without [accepted], jmlr's \acks{…}, iopjournal's five commands and mdpi's ten, each with two
    // paragraphs. The preamble form is not: lipics-v2021.cls is not on the engine's mirror nor in the pipeline's files, so
    // whether its \acknowledgements takes paragraphs is unmeasured; corl_2026.sty is not here either.
    targetEngine: 'untested',
  }),
);
