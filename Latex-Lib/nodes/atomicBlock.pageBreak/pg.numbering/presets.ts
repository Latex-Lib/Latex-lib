/**
 * pg.numbering's presets, each from the templates that use it.
 */
import type { Preset } from '../../../schema/params.ts';

const src = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/${file}`, line }) as const;

export const PRESETS = {
  arabic: {
    description: 'A new page, then arabic page numbers from 1 (\\clearpage \\pagenumbering{arabic}): the main text after roman front pages.',
    features: ['float-flush'],
    params: {},
    evidence: [
      src('Latex-Template-Examples/class.ctexrep/main.tex', '168-169'),
      src('Latex-Template-Examples/class.report/main.tex', '150'),
      src('Latex-lib-main/Source/0042-jankapunkt-master-thesis/complex/main.tex', '94'),
      {
        kind: 'compile',
        reproducer:
          'article, book, report and ctexrep, with breaks switching to roman, Roman, arabic (after \\cleardoublepage) and alph: ok, \\thepage reads i, I, 1, a (Flouest headless ZeroTeX-NG runner, 2026-11-07)',
      },
    ],
  },
  roman: {
    description: 'A new page, then lower-case roman page numbers from i (\\clearpage \\pagenumbering{roman}): the front pages after the title page.',
    writes: '\\clearpage \\pagenumbering{roman}',
    features: ['float-flush'],
    params: { style: 'roman' },
    evidence: [src('Latex-lib-main/Source/0650-ecothesis/preambulo/agradecimentos.tex', '1-2'), src('Latex-Template-Examples/class.report/main.tex', '102'), src('Latex-lib-main/Source/0042-jankapunkt-master-thesis/complex/main.tex', '62')],
  },
  'upper-roman': {
    description: 'A new page, then upper-case roman page numbers from I (\\clearpage \\pagenumbering{Roman}), as Chinese reports number their front pages.',
    writes: '\\clearpage \\pagenumbering{Roman}',
    features: ['float-flush'],
    params: { style: 'Roman' },
    evidence: [src('Latex-Template-Examples/class.ctexrep/main.tex', '154-155')],
  },
  'odd-arabic': {
    description: 'A new right-hand page, then arabic page numbers from 1 (\\cleardoublepage \\pagenumbering{arabic}), so page 1 opens on the right in two-sided documents.',
    writes: '\\cleardoublepage \\pagenumbering{arabic}',
    features: ['float-flush', 'odd-page'],
    params: { command: 'cleardoublepage' },
    evidence: [src('Latex-lib-main/Source/0833-jyu-chem-thesis/jyu-chem-thesis-template.tex', '160-161'), src('Latex-lib-main/Source/0198-arsclassica/ArsClassica.tex', '37-38')],
  },
} as const satisfies { readonly [name: string]: Preset };
