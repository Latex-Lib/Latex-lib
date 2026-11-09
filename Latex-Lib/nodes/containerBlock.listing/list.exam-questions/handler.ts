/**
 * list.exam-questions: a list as the exam class's questions. The items' indent gives the level: \question in questions, \part in
 * parts, \subpart in subparts, \subsubpart in subsubparts (exam.cls's four levels; a deeper indent joins the fourth, as the
 * kernel's lists do in `nested`). An item's description (list.item's `\<level>[{label}]`) says what the item is:
 * - a number (4, 2.5, 04) is its points: \question[4], \part[2] (\bonusquestion[4], \bonuspart[2] with `bonus`);
 * - `choice` or `correct` makes it a \choice or \CorrectChoice, in a choices environment (or checkboxes, oneparchoices,
 *   oneparcheckboxes: `choiceForm`) at its level, so choices indented under a question are that question's;
 * - any other text titles a question, \titledquestion{<text>} (exam's own titled question), and at a deeper level, which has no
 *   title, starts the part's text in bold, so it is not lost.
 * exam numbers each questions environment from 1 (its list \usecounter's the question counter: measured, a second questions
 * environment's first \question is 1, and exam's own labels question@1 … come twice, "Label `question@1' multiply defined", so its
 * per-question points tables read the wrong question), as the template's sections A, B and C do (Latex-Template-Examples/
 * class.exam/main.tex l.177, 248, 294). With `numbering: 'continue'` a list split by other blocks numbers on: each questions
 * environment starts from the count the one before ended at (a counter of the way's own, LatexLibExamQuestion). A line that is no
 * item (a verbatim block an item holds) stays as it is, and a verbatim block's lines are never items. In a measure under 2in the lists
 * indent at most a fifth of it (`NARROW_LISTS`, OVL-3): questions, parts and choices are all kernel \list environments.
 * CTAN: https://ctan.org/pkg/exam
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { NARROW_LISTS } from '../node.ts';
import key from './key.ts';

/** Each level's environment and item command (exam.cls: questions, parts, subparts, subsubparts). */
const LEVELS = [
  { env: 'questions', item: 'question', bonus: 'bonusquestion' },
  { env: 'parts', item: 'part', bonus: 'bonuspart' },
  { env: 'subparts', item: 'subpart', bonus: 'bonussubpart' },
  { env: 'subsubparts', item: 'subsubpart', bonus: 'bonussubsubpart' },
] as const;

const CHOICE_FORMS: ReadonlySet<string> = new Set(['choices', 'checkboxes', 'oneparchoices', 'oneparcheckboxes']);

/** A verbatim block an item may hold (`node.ts`'s VERBATIM): its lines are code, never item lines. */
const VERBATIM = /\\begin\{(lstlisting|verbatim\*?|Verbatim|minted|tcblisting)\}/u;

/** The item line list.item writes: `\<level>[{label}] text` or `\<level>[label] text`. */
const ITEM = /^\s*\\(\d{1,2})(?:\[\{(.*)\}\]|\[([^\]]*)\])?(?:\s+(.*))?$/u;

/** The way's own count of the questions set so far, for `numbering: 'continue'`. */
const SAVED = String.raw`\makeatletter\@ifundefined{c@LatexLibExamQuestion}{\newcounter{LatexLibExamQuestion}}{}\makeatother`;

/** Points as exam reads them in \question[…]: a whole or decimal number. */
const POINTS = /^\d+(?:\.\d+)?$/u;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const choiceEnv = CHOICE_FORMS.has(param(p, 'choiceForm')) ? param(p, 'choiceForm') : 'choices';
  const bonus = p['bonus'] === true;
  const carry = param(p, 'numbering') === 'continue';
  return {
    preamble: () => ({ declarations: carry ? [SAVED, NARROW_LISTS] : [NARROW_LISTS] }),
    emit: (_node, content) => {
      const out: string[] = [];
      // The open environments, outermost first; `choice` marks a choices environment standing at that level.
      const stack: { readonly env: string; readonly choice: boolean }[] = [];
      const close = (): void => {
        const top = stack.pop();
        if (top === undefined) return;
        if (carry && top.env === 'questions') out.push('\\setcounter{LatexLibExamQuestion}{\\value{question}}');
        out.push(`\\end{${top.env}}`);
      };
      let verbatim: string | undefined;
      for (const line of content.trim().split('\n')) {
        if (verbatim !== undefined) {
          out.push(line);
          if (line.includes(`\\end{${verbatim}}`)) verbatim = undefined;
          continue;
        }
        const opened = VERBATIM.exec(line);
        if (opened?.[1] !== undefined && !line.includes(`\\end{${opened[1]}}`)) {
          verbatim = opened[1];
          out.push(line);
          continue;
        }
        const m = ITEM.exec(line);
        if (m === null || Number(m[1]) < 1) {
          out.push(line);
          continue;
        }
        const level = Math.min(Number(m[1]), stack.length + 1, LEVELS.length);
        const label = (m[2] ?? m[3] ?? '').trim();
        const lower = label.toLowerCase();
        const choice = lower === 'choice' || lower === 'correct';
        while (stack.length > level) close();
        // A choice after a question's parts at the same level, or a part after choices: the other environment closes first.
        if (stack.length === level && stack[level - 1]?.choice !== choice) close();
        while (stack.length < level) {
          const depth = stack.length + 1;
          const isChoice = choice && depth === level;
          const env = isChoice ? choiceEnv : (LEVELS[depth - 1]?.env ?? 'subsubparts');
          stack.push({ env, choice: isChoice });
          out.push(`\\begin{${env}}`);
          if (carry && env === 'questions') out.push('\\setcounter{question}{\\value{LatexLibExamQuestion}}');
        }
        const text = m[4] || '\\strut';
        // An item whose text starts with `[` would hand it to the command's optional argument (points, a titled question's points
        // after its title, a choice's label).
        const guard = /^\[/u.test(text) ? '\\relax' : '';
        const spec = LEVELS[level - 1] ?? LEVELS[LEVELS.length - 1];
        if (choice) out.push(`\\${lower === 'correct' ? 'CorrectChoice' : 'choice'}${guard} ${text}`);
        else if (POINTS.test(label)) out.push(`\\${bonus ? spec?.bonus : spec?.item}[${label}] ${text}`);
        else if (label !== '' && level === 1) out.push(`\\${bonus ? 'bonustitledquestion' : 'titledquestion'}{${label}}${guard} ${text}`);
        else if (label !== '') out.push(`\\${bonus ? spec?.bonus : spec?.item} \\textbf{${label}} ${text}`);
        else out.push(`\\${bonus ? spec?.bonus : spec?.item}${guard} ${text}`);
      }
      while (stack.length > 0) close();
      return `${out.join('\n')}\n\n`;
    },
  };
};

export default realize;
