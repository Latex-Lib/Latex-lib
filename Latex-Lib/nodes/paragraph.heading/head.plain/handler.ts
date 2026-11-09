/**
 * head.plain (paragraph/heading). A heading set by hand where the class has no sectioning commands: letter.cls defines no
 * \section and no sectioning counter (Template/template-requirement/Letter.md l.81-85), minimal.cls nothing but \normalsize
 * (Source/0577-latex-base-dev/minimal.cls l.36). Two forms, both the class examples' own:
 * - run-in: \par\noindent\textbf{Main result.} and the next paragraph runs on after it, as the letter writes its heads
 *   (Latex-Template-Examples/class.letter/main.tex l.127, 149). The emit leaves the paragraph open: Flouest joins blocks with
 *   nothing between them (Emit/emit.ts) and a paragraph ends with its own blank line, so the next paragraph's text follows the
 *   head on its line; a next block that starts a paragraph of its own (another heading, a display) only leaves the head alone.
 * - display: \bigskip, \noindent{\large\bfseries 1\quad Introduction}\par, \medskip, as the minimal class's technical note
 *   writes its sections (class.minimal/main.tex l.145-147, 164-166, 219-221) and its reference list's heading (l.103).
 * Numbers come from counters the way declares where the class has none (section, subsection within it, subsubsection within
 * that), stepped with \refstepcounter outside the head's group (\@currentlabel is set locally), so \label and \ref still work
 * where the template writes its numbers by hand. An unnumbered head drops its label: nothing numbers it, and \label would take
 * the last counter stepped before it. The short title is unused: these classes print no contents and no running heads.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { field, labelLine, param } from '../../protocol.ts';
import { levelOf, stepUp } from '../node.ts';
import key from './key.ts';

/**
 * The size commands a class may lack, at the 10pt sizes minimal's example provides (class.minimal/main.tex l.44-50; \LARGE and
 * \huge at size10.clo's). \providecommand leaves a class's own (letter's, from size10.clo) untouched.
 */
const SIZES: { readonly [command: string]: string } = {
  '\\small': '\\fontsize{9}{11}\\selectfont',
  '\\large': '\\fontsize{12}{14}\\selectfont',
  '\\Large': '\\fontsize{14.4}{18}\\selectfont',
  '\\LARGE': '\\fontsize{17.28}{22}\\selectfont',
  '\\huge': '\\fontsize{20.74}{25}\\selectfont',
  '\\Huge': '\\fontsize{24.88}{30}\\selectfont',
};

const provideSizes = (fonts: readonly string[]): string[] =>
  Object.entries(SIZES)
    .filter(([command]) => fonts.some((f) => new RegExp(`${command.replace(/\\/gu, '\\\\')}(?![A-Za-z])`, 'u').test(f)))
    .map(([command, size]) => `\\providecommand{${command}}{${size}}`);

/** The counters, each declared only where nothing has it (a class's or another way's stays as it is). */
const COUNTERS = [
  '\\ifcsname c@section\\endcsname\\else\\newcounter{section}\\fi',
  '\\ifcsname c@subsection\\endcsname\\else\\newcounter{subsection}[section]\\renewcommand\\thesubsection{\\thesection.\\arabic{subsection}}\\fi',
  '\\ifcsname c@subsubsection\\endcsname\\else\\newcounter{subsubsection}[subsection]\\renewcommand\\thesubsubsection{\\thesubsection.\\arabic{subsubsection}}\\fi',
];

const NUMBERED_LEVELS = new Set(['section', 'subsection', 'subsubsection']);
const RUN_IN_LEVELS = new Set(['paragraph', 'subparagraph']);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = param(p, 'form', 'runin');
  const numbers = p['numbers'] === true;
  const size = param(p, 'size', '\\large');
  const subSize = param(p, 'subSize');
  const before = param(p, 'before');
  const after = param(p, 'after', '\\medskip');
  const sep = param(p, 'numberSep', '\\quad');
  const punctuation = param(p, 'punctuation', '.');
  return {
    preamble: () => {
      const declarations = [...(form === 'display' ? provideSizes([size, subSize, stepUp(size)]) : []), ...(numbers ? COUNTERS : [])];
      return declarations.length === 0 ? {} : { declarations };
    },
    emit: (node, content) => {
      const level = levelOf(node);
      const title = content.trim();
      const numbered = numbers && NUMBERED_LEVELS.has(level) && (node.attrs?.['data'] as { numbered?: unknown } | undefined)?.numbered !== false;
      const step = numbered ? `\\refstepcounter{${level}}` : '';
      const number = numbered ? `\\the${level}${sep} ` : '';
      const label = numbered ? labelLine(field(node, 'label')) : '';
      if (form === 'runin' || RUN_IN_LEVELS.has(level)) {
        const closed = punctuation === '' || /[.:;!?]$/u.test(title) ? title : `${title}${punctuation}`;
        // The label sits in the run-on paragraph, after the head (labelLine's newline is a space there).
        return `\\par${before}\\noindent${step}\\textbf{${number}${closed}}${label.replace(/^\n/u, '')} `;
      }
      const font = level === 'part' || level === 'chapter' ? stepUp(size) : level === 'section' ? size : subSize;
      return `\\par${before}\n\\noindent${step}{${font}\\bfseries ${number}${title}}\\par${label}${after === '' ? '' : `\n${after}`}\n\n`;
    },
  };
};

export default realize;
