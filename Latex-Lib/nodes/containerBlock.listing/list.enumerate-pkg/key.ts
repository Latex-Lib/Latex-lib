import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.enumerate-pkg',
    node: 'containerBlock/listing',
    description:
      "The enumerate package (tools bundle): a numbered list's labels from a template in brackets, \\begin{enumerate}[(a)] (1, a, A, i, I stand for the counter, braced text is kept); other lists stay the kernel's. 25 templates.",
    writes: '\\begin{enumerate}[(a)] \\item … \\end{enumerate}',
    ctan: ['enumerate'],
    features: ['numbered', 'custom-labels', 'lettered'],
    params: {
      label: { type: 'string', default: '(a)', description: 'the label template: (a), 1., i., A), {State} A:' },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'enumerate' },
    ],
    deny: [
      { class: 'class.acmart', reason: 'ACM: "changing list definitions is not allowed"', evidence: [{ kind: 'requirement', file: 'Template/template-requirement/ACM.md', line: '118' }] },
      // enumerate.sty redefines only the begin half, \enumerate (whose \@enum@ runs \list), and keeps the class's \endenumerate.
      // A class whose enumerate opens and closes its own \begin{list}...\end{list} is left with an \end{list} that meets an open
      // enumerate. enumitem (\renewenvironment{enumerate}, both halves) is not affected.
      {
        class: 'class.ascelike',
        reason: "ascelike redefines the enumerate environment as a \\begin{list}...\\end{list} pair; enumerate.sty replaces only \\enumerate and leaves the class's \\endenumerate, so every numbered list stops at \\end{enumerate} with '\\begin{enumerate} ... ended by \\end{list}'",
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.ascelike.log (2026-11-06), l.111 \\end{enumerate}: "! LaTeX Error: \\begin{enumerate} on input line 107 ended by \\end{list}", then "\\begin{document} ended by \\end{enumerate}" and "Extra \\endgroup"' },
          { kind: 'source', file: 'texmf-dist/tex/latex/tools/enumerate.sty (TinyTeX)', line: '67-84 (\\def\\enumerate, \\def\\@enum@{\\list...}; no \\endenumerate)' },
          { kind: 'source', file: 'ascelike.cls (ascelike 2025/03/17 v3.0, CTAN)', line: 'its enumerate environment, ended by \\end{list}, as Latex-Lib/classes/ascelike.ts (Names: enumerate and itemize are redefined) records' },
        ],
      },
    ],
    // A paragraph place, not below cols.vwcol (list.kernel's key says why).
    needs: { paragraph: true },
    targetEngine: 'untested',
  }),
);
