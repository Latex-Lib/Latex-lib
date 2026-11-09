import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'list.exam-questions',
    node: 'containerBlock/listing',
    description:
      "exam class: a list as the exam's questions, by indent \\question in questions, \\part in parts, \\subpart in subparts; an item's description gives its points (\\question[4], \\part[2]), makes it a multiple choice (choice: \\choice, correct: \\CorrectChoice, in choices, checkboxes or oneparchoices) or titles it (\\titledquestion{…}); bonus questions and parts, and questions numbered on across lists, when asked.",
    writes: '\\begin{questions} \\question[…] … \\begin{parts} \\part[…] … \\end{parts} \\begin{choices} \\choice … \\CorrectChoice … \\end{choices} \\end{questions}',
    ctan: ['exam'],
    features: ['numbered', 'lettered'],
    params: {
      choiceForm: {
        type: 'enum',
        values: ['choices', 'checkboxes', 'oneparchoices', 'oneparcheckboxes'],
        default: 'choices',
        description: 'the environment of the multiple choices: lettered (choices), boxes to tick (checkboxes), or either run into one paragraph',
      },
      numbering: {
        type: 'enum',
        values: ['restart', 'continue'],
        default: 'restart',
        description: "each list's questions from 1, as exam numbers each questions environment (restart), or numbered on across lists split by other blocks (continue)",
      },
      bonus: { type: 'boolean', default: false, description: 'every question and part a bonus one (\\bonusquestion, \\bonuspart, \\bonussubpart, \\bonustitledquestion)' },
    },
    presets: PRESETS,
    // exam.cls defines questions, parts and choices (classes/exam.ts); subparts, subsubparts, checkboxes and the one-paragraph
    // forms come with them in exam.cls, which the profile does not list.
    requires: ['env:questions', 'env:parts', 'env:choices'],
    only: ['class.exam'],
    // A list sets its own \parshape at the full \linewidth, as the kernel's lists do (list.kernel's needs).
    needs: { paragraph: true },
    targetEngine: 'yes',
  }),
);
