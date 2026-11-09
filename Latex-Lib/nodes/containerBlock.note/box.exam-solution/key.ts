import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'box.exam-solution',
    node: 'containerBlock/note',
    description:
      "exam's solution environment, \\begin{solution}[space] … \\end{solution}: the note as a question's answer, printed under a bold 'Solution:' (the note's title, when it has one) only when the document says \\printanswers, and otherwise left out, keeping the given blank space for the answer. solutionorbox, solutionorlines and solutionordottedlines keep an empty box, ruled or dotted lines instead. The note's title goes to a \\solutiontitle renewed in a group around it; framing and shading stay the class's \\framedsolutions and \\shadedsolutions. exam only.",
    writes: '\\begin{solution}[…] … \\end{solution}',
    ctan: ['exam'],
    features: ['bold-head'],
    params: {
      form: {
        type: 'enum',
        values: ['solution', 'solutionorbox', 'solutionorlines', 'solutionordottedlines'],
        default: 'solution',
        description: "the environment: solution (blank space where answers are hidden), solutionorbox (an empty box), solutionorlines (ruled lines), solutionordottedlines (dotted lines)",
      },
      space: { type: 'dimen', default: '', description: "the answer space on the students' copy (the optional argument): blank space, the box's height or the lines' height; '' gives none (exam's 0pt, and no box for solutionorbox)" },
      title: { type: 'enum', values: ['note', 'document'], default: 'note', description: "the solution's title: the note's own, when it has one, as a bold 'Title:' (a local \\solutiontitle), or always the document's \\solutiontitle (exam's 'Solution:' or the template's own)" },
      answers: { type: 'enum', values: ['document', 'printed'], default: 'document', description: "whether the solutions print: as the document says (exam prints them only after \\printanswers), or printed, \\printanswers for the whole document (the answer key)" },
    },
    presets: PRESETS,
    // exam defines solution, solutionorbox, solutionorlines and solutionordottedlines (exam 2023/07/09 v2.704, probed: \solution
    // = \@protected@testopt\solution\\solution{0pt}); its profile does not list them yet (reported to the profile's owner).
    requires: ['env:{form}'],
    only: ['class.exam'],
    // Hidden, the body is set in \setbox\z@\vbox\bgroup … \egroup and dropped; printed, in exam's \exam@MakeFramed, framed.sty's
    // breakable frame (\TheSolution, probed). A float in either is "Not in outer par mode"; a footnote in a hidden one is lost
    // with it. The box is never an argument, so verbatim stays.
    gives: { floats: false, boxDepth: 1 },
    needs: { paragraph: true },
    // Typeset on ZeroTeX-NG under exam (2023/07/09 v2.704), with answers hidden and with \printanswers and \framedsolutions:
    // all four forms with and without space, the note's title, an empty title, a body opening with [, \verb in a body, and a
    // solution outside the questions list, ok.
    targetEngine: 'yes',
  }),
);
