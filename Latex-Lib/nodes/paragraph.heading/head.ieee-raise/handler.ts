/**
 * head.ieee-raise: the IEEE Computer Society journal's raised first section. IEEEtran V1.8a gives
 * \def\IEEEraisesectionheading#1{\noindent\raisebox{1.5\baselineskip}[0pt][0pt]{\parbox[b]{\columnwidth}{#1\unskip
 * \global\everypar=\everypar}}\vspace{-1\baselineskip}\vspace{-\parskip}\par} "for a raised line Introduction section for
 * use with Computer Society papers" (IEEEtran.cls l.5521-5527), and bare_adv.tex writes it under compsoc around the first
 * section only, \IEEEraisesectionheading{\section{Introduction}\label{sec:introduction}} (Solution/0743-ieeetran-journal.md
 * l.53, l.84). Raised anywhere else it lifts the heading 1.5 lines into the text above it.
 * CTAN: https://ctan.org/pkg/ieeetran
 *
 * A heading node does not know whether it is the document's first section, so the document keeps it: every \section is
 * written inside \LatexLibRaiseFirstSection{…}, which on its first use lets itself to \@firstofone (globally) and hands its
 * argument to \IEEEraisesectionheading. The first section is so \IEEEraisesectionheading{\section{…}\label{…}}, every
 * later one \section{…}\label{…} as it stands. The argument is read by \IEEEraisesectionheading, a \def, so it holds no
 * blank line: the heading's trailing one comes after the braces. Other levels are the kernel commands, as
 * head.class-native prints them.
 */
import type { Realization } from '../../../schema/realization.ts';
import { headingCommand, levelOf } from '../node.ts';

const RAISE_FIRST = String.raw`\makeatletter\providecommand*{\LatexLibRaiseFirstSection}{\global\let\LatexLibRaiseFirstSection\@firstofone\IEEEraisesectionheading}\makeatother`;

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  preamble: () => ({ declarations: [RAISE_FIRST] }),
  emit: (node, content) =>
    levelOf(node) === 'section' ? `\\LatexLibRaiseFirstSection{${headingCommand(node, content).trimEnd()}}\n\n` : headingCommand(node, content),
});

export default realize;
