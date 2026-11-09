/**
 * para.ieee-parstart: IEEEtran's drop cap on the document's first body paragraph, \IEEEPARstart{T}{his} … (IEEE Access:
 * \PARstart, the alias ieeeaccess.cls makes, l.1098-1099). Every other paragraph prints as para.kernel's class preset: its
 * text and a blank line, \hspace* for each indent step, \strut for an empty one.
 *
 * A handler sees one paragraph and cannot know which comes first, so the choice is TeX's, once per document, by a global
 * flag: each body paragraph whose first word starts with plain letters prints
 *   \ifdefined\LatexLibParstartDone This\else\global\let\LatexLibParstartDone\relax\IEEEPARstart{T}{his}\fi{} rest
 * The first one typeset takes the drop cap and sets the flag; the others print their word as written. Only the first word
 * sits inside the conditional (letters only, so a skipped branch holds no \if), and the rest of the text follows it.
 * A first word of one letter takes the next word as the rest, as bare_jrnl.tex l.465-466 asks (\IEEEPARstart{A}{demo}).
 * `{}` keeps the space after the word (TeX drops a space after \fi). \IEEEPARstart opens with \par and \noindent
 * (IEEEtran.cls l.5863-5869), so an indent step's \hspace* goes in the other branch only: in the first it would leave a
 * line of its own.
 *
 * A body paragraph is one whose parent is the document (Flouest's emitter passes the root's type, `doc`): a paragraph in an
 * abstract, a statement, a box, a cell, a caption or a header note prints as para.kernel.
 * Under IEEEtran's conference and technote modes the class locks \IEEEPARstart out and prints the letters plainly
 * (IEEEtran.cls l.6226-6228, 6233-6242).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

const DONE = '\\LatexLibParstartDone';

/** The first word as the drop cap's two arguments, what it was as written, and the text after it; or nothing. */
const firstWord = (content: string): { readonly letter: string; readonly word: string; readonly written: string; readonly rest: string } | undefined => {
  const m = /^([A-Za-z])([A-Za-z]*)/u.exec(content);
  if (m === null) return undefined;
  const [whole, letter = '', word = ''] = m;
  const after = content.slice(whole.length);
  const next = word === '' ? /^(\s+)([A-Za-z]+)/u.exec(after) : null;
  if (next !== null) return { letter, word: next[2] ?? '', written: `${letter}${next[1] ?? ''}${next[2] ?? ''}`, rest: after.slice(next[0].length) };
  return { letter, word, written: whole, rest: after };
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const command = param(p, 'command', 'IEEEPARstart');
  const step = Number.parseFloat(param(p, 'indentStep', '1.5em')) || 1.5;
  const unit = param(p, 'indentStep', '1.5em').replace(/^[\d.]+/u, '') || 'em';
  return {
    preamble: () => ({}),
    emit: (node, content, _context, parentType, location) => {
      const level = Math.max(0, Math.floor(Number(node.attrs?.['indent'] ?? 0)) || 0);
      const lead = level > 0 ? `\\hspace*{${level * step}${unit}}` : '';
      // As para.kernel: an empty paragraph in a caption or a header note keeps no \par (a runaway argument there).
      if (content.trim() === '') return location?.enclosingSpecialStructure !== undefined ? `${lead}\\strut` : `${lead}\\strut\\par\n\n`;
      const body = (parentType === undefined || parentType === '' || parentType === 'doc') && location?.enclosingSpecialStructure === undefined;
      const first = body ? firstWord(content) : undefined;
      if (first === undefined) return `${lead}${content}\n\n`;
      const plain = `${lead === '' ? ' ' : lead}${first.written}`;
      const glue = /^\s/u.test(first.rest) ? '{}' : '';
      return `\\ifdefined${DONE}${plain}\\else\\global\\let${DONE}\\relax\\${command}{${first.letter}}{${first.word}}\\fi${glue}${first.rest}\n\n`;
    },
  };
};

export default realize;
