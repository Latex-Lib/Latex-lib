/**
 * toc.class-native: the contents as the class's own commands give them, in one of two forms.
 *
 * - memoir: memoir's tocloft-style hooks under its own names (it emulates tocloft, so tocloft's short names,
 *   \cftsecleader or \cfttoctitlefont, are not defined there: toc.tocloft's memoir deny). Preamble: \cftchapterdotsep or
 *   \cft<level>dotsep for the leaders (memoir.dtx l.20284, 20814), \cftchapterfont and \cftsectionfont, \printtoctitle
 *   for the heading (l.19818), \cftsetindents{<level>}{<indent>}{<numwidth>} per level (l.20344, memoir's own defaults
 *   l.20868-20877), \bibintoc or \nobibintoc (l.21652-21653). Body: \settocdepth{<level>} (l.21338-21350: it writes to
 *   the .toc, so it goes in the body, not the preamble, where the .aux is not open yet), then \tableofcontents* (starred,
 *   so the contents do not list themselves, l.19895 and the \newlistof code at l.19711-19745) and \listoffigures* /
 *   \listoftables* when asked.
 * - beamer: \tableofcontents[<options>] with beamer's keys (hideallsubsections, pausesections, sectionstyle=…,
 *   currentsection; beamerbasetoc.sty l.72-93). Beamer prints no heading and puts the list "into the current frame"
 *   (Beamer.md l.61), so there are no lists of floats and no break; the frame is the way's own only when `frame` asks for
 *   it (General's node set makes no frames, as ack.block's frame form says), titled by `frameTitle`.
 * CTAN: https://ctan.org/pkg/memoir, https://ctan.org/pkg/beamer
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

/** memoir's \settocdepth takes a division's name (memoir.dtx l.21300-21310); CONTENTS' depth is its number. */
const DIVISION = ['chapter', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph'] as const;
const division = (depth: number): string => DIVISION[depth] ?? 'all';

/** Every level memoir enters with \newlistentry below the chapter (memoir.dtx l.20868-20877). */
const LEVELS = ['section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph'] as const;

/** `section:1.5em:2.3em, subsection:3.8em:3.2em` as \cftsetindents lines; an entry not of three parts is left out. */
const indentLines = (spec: string): string[] =>
  spec
    .split(',')
    .map((e) => e.trim().split(':').map((s) => s.trim()))
    .filter((parts) => parts.length === 3 && parts.every((s) => s !== ''))
    .map(([level, indent, numwidth]) => `\\cftsetindents{${level}}{${indent}}{${numwidth}}`);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const depth = typeof p['depth'] === 'number' ? p['depth'] : 0;

  if (param(p, 'form', 'memoir') === 'beamer') {
    // beamer reads tocdepth (3 by default, beamerbasemisc.sty l.125) when it typesets the list: a preamble \setcounter holds.
    const declarations = depth > 0 ? [`\\setcounter{tocdepth}{${depth}}`] : [];
    const options = param(p, 'options').trim();
    const command = options === '' ? '\\tableofcontents' : `\\tableofcontents[${options}]`;
    const title = param(p, 'frameTitle');
    const body = p['frame'] === true ? `\\begin{frame}${title === '' ? '' : `{${title}}`}\n${command}\n\\end{frame}` : command;
    return {
      preamble: () => (declarations.length === 0 ? {} : { declarations }),
      emit: () => `${body}\n\n`,
    };
  }

  const set = (name: string, command: string): string[] => (param(p, name) === '' ? [] : [`\\renewcommand{\\${command}}{${param(p, name)}}`]);
  const leaders = param(p, 'leaders', 'class');
  const declarations = [
    ...(param(p, 'title') === '' ? [] : [`\\renewcommand{\\contentsname}{${param(p, 'title')}}`]),
    // memoir dots every level below the chapter (\cft<level>dotsep is \cftdotsep) and not the chapter (\cftnodots).
    ...(leaders === 'all' ? ['\\renewcommand{\\cftchapterdotsep}{\\cftdotsep}'] : leaders === 'none' ? LEVELS.map((l) => `\\renewcommand{\\cft${l}dotsep}{\\cftnodots}`) : []),
    ...set('chapterFont', 'cftchapterfont'),
    ...set('sectionFont', 'cftsectionfont'),
    // \printtoctitle{<title>} prints the heading inside the group that \aftertoctitle's \par closes, so a \centering holds.
    ...(param(p, 'titleFont') === '' ? [] : [`\\renewcommand{\\printtoctitle}[1]{${param(p, 'titleFont')}#1}`]),
    ...indentLines(param(p, 'indents')),
    ...(param(p, 'bibInToc', 'class') === 'yes' ? ['\\bibintoc'] : param(p, 'bibInToc') === 'no' ? ['\\nobibintoc'] : []),
  ];
  const star = p['starred'] === false ? '' : '*';
  const brk = param(p, 'after', 'none') === 'none' ? [] : [`\\${param(p, 'after')}`];
  const lists = param(p, 'lists', 'none');
  const body = [
    ...(depth > 0 ? [`\\settocdepth{${division(depth)}}`] : []),
    `\\tableofcontents${star}`,
    ...brk,
    ...(lists === 'figures' || lists === 'both' ? [`\\listoffigures${star}`, ...brk] : []),
    ...(lists === 'tables' || lists === 'both' ? [`\\listoftables${star}`, ...brk] : []),
  ];
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    emit: () => `${body.join('\n')}\n\n`,
  };
};

export default realize;
