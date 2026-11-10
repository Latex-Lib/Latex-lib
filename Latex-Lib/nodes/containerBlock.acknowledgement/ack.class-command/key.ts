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
    // Each preset prints one class's command or form, and `only` lets every preset under all seven classes; the matrix files by
    // `only` and `onlyWhen`, not by `requires: cmd:\{command}`. Batch 4 round 1 (testing-pipeline/out/fetched/batch4-round1):
    // agu-run-in failed 4,396 not-denied branches outside agu (aistats.A 945, corl.A 603, iopjournal.A 1,280, jmlr-pmlr.A 412,
    // lipics.A 899, mdpi.A 257; 0 passing under iopjournal, jmlr-pmlr and lipics), and the jmlr and iopjournal presets passed only
    // under their own class. These bind each form and command to the classes that define it.
    onlyWhen: [
      {
        when: { form: 'run-in' },
        classes: ['class.agu'],
        reason:
          "only agu's \\acknowledgments takes no argument (agujournal2025.cls l.1896); aistats', corl's and mdpi's take the text as their argument (aistats2027.sty l.67, corl_2026.sty l.130-131, mdpi.cls l.1428), so the run-in form hands them the text's first token: aistats drops it and a statement's \\begin{remark} goes with it (\"\\begin{document} ended by \\end{remark}\"), corl stops at \"Missing \\endcsname inserted\", mdpi at \"Argument of \\begin has an extra }\", and a document holding only the acknowledgement ships no page; iopjournal, jmlr and lipics have no \\acknowledgments ('Undefined control sequence')",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/agujournal2025.cls', line: '1896' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aistats2027.sty', line: '67' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/corl_2026.sty', line: '130-131' },
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1428' },
          { kind: 'compile', cell: 'batch 4 round 1, iopjournal.A: 161 cells under iopjournal.A, lipics.A and jmlr-pmlr.A whose first error is \\acknowledgments (2,172 failing branches; document d7e253f2fa247c15495fb, result 75e83235b2); agu-run-in passed 0 of its 2,591 not-denied branches there' },
          { kind: 'compile', cell: 'batch 4 round 1, aistats.A: document d4f0fceed5c09935ece85, result 06ea23466c28 (l.216 \\end{remark}); all 34 aistats.A cells stopping at "\\begin{document} ended by \\end{…}" and 14 stopping at "Missing number, treated as zero" hold agu-run-in; 101 more branches in no-page documents (cell cf24986cda861104428aa, result 8b250fea1082)' },
          { kind: 'compile', cell: 'batch 4 round 1, corl.A: agu-run-in, 275 branches stop at "Missing \\endcsname inserted" (document d56688b008e9337d96861, result c36234a1fd, l.548) and 111 are in no-page documents (document d85690afd4ea1c57bbdf2, result 4f154682627c)' },
          { kind: 'compile', cell: 'batch 4 round 1, mdpi.A: agu-run-in, 161 branches stop at "Argument of \\begin has an extra }" (document d7992426b406ae2c03d1b, result e1b1d4c7a0, l.52)' },
          { kind: 'compile', reproducer: '\\documentclass{article} \\usepackage{aistats2027} \\usepackage{amsthm}\\newtheorem{remark}{Remark} \\begin{document} \\acknowledgments \\begin{remark}A remark.\\end{remark} \\end{document}: "\\begin{document} ended by \\end{remark}" (ZeroTeX-NG through compat cases, 2026-11-09)' },
        ],
      },
      {
        when: { form: 'preamble' },
        classes: ['class.lipics'],
        reason: "the stored form is lipics' \\acknowledgements{…}, kept for the abstract's metadata block (lipics-v2021.cls l.1009); no other listed class defines it",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '1009' }],
      },
      {
        when: { command: 'acknowledgments', form: 'argument' },
        classes: ['class.agu', 'class.corl', 'class.aistats', 'class.mdpi'],
        reason: "\\acknowledgments is agu's, corl's, aistats' and mdpi's; iopjournal (\\ack), jmlr (\\acks) and lipics (\\acknowledgements) do not define it: 'Undefined control sequence'",
        evidence: [{ kind: 'compile', cell: 'batch 4 round 1: the acknowledgments preset fails under iopjournal.A, jmlr-pmlr.A and lipics.A ("Undefined control sequence") and passes under agu.A, aistats.A, corl.A and mdpi.A' }],
      },
      {
        when: { command: 'acks' },
        classes: ['class.jmlr-pmlr'],
        reason: "\\acks is jmlr's (jmlr.dtx l.4178-4181); under the other listed classes it is undefined",
        evidence: [{ kind: 'compile', cell: 'batch 4 round 1: the jmlr preset passes under jmlr-pmlr.A only; under agu.A, iopjournal.A and lipics.A it stops at "Undefined control sequence", under aistats.A, corl.A and mdpi.A at other errors' }],
      },
      {
        when: { command: 'ack' },
        classes: ['class.iopjournal'],
        reason: "\\ack is iopjournal's (iopjournal.cls l.145); under the other listed classes it is undefined",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '145' }],
      },
      {
        when: { command: 'acknowledgements' },
        classes: ['class.lipics'],
        reason: "\\acknowledgements is lipics' own (lipics-v2021.cls l.1009)",
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/lipics-v2021.cls', line: '1009' }],
      },
      {
        when: { byTitle: 'iopjournal' },
        classes: ['class.iopjournal'],
        reason: "the commands the title picks (\\funding, \\roles, \\data, \\suppdata) are iopjournal's (iopjournal.cls l.145-163)",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/iopjournal.cls', line: '145-163' },
          { kind: 'compile', cell: 'batch 4 round 1: ack.class-command@iopjournal passes under iopjournal.A only and fails under the six other listed classes' },
        ],
      },
      {
        when: { byTitle: 'mdpi' },
        classes: ['class.mdpi'],
        reason: "the commands the title picks (\\authorcontributions, \\conflictsofinterest, \\abbreviations, \\backnotes, …) are mdpi's (mdpi.cls l.1401-1460), as the key's requiresWhen says",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '1401-1460' },
          { kind: 'compile', cell: 'batch 4 round 1: ack.class-command@mdpi failed 3 of its 6 not-denied branches under the other listed classes (iopjournal.A, jmlr-pmlr.A and lipics.A), each at an undefined command' },
        ],
      },
    ],
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
