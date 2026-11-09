/**
 * front.letter (paragraph/title). The kernel letter class's own frame: the sender (\name, \signature, \address,
 * \location, \telephone) and \date in the preamble, \begin{letter}{recipient} and \opening{salutation} where the title
 * stands, and \closing, \ps, \encl, \cc and \end{letter} from the enddocument hook, after the last block of the body.
 * letter.cls (2024/08/12 v1.3c) l.153-162 (the sender commands, empty by default), l.172-181 (the letter environment; the
 * recipient is split at its first \\ into \toname and \toaddress, l.182-189), l.221-233 (\opening prints the sender's
 * address or the firstpage foot, the date, the recipient and the salutation), l.234-244 (\closing with \signature, else
 * \name), l.246-256 (\cc, \encl, \ps; \ps takes no argument, so its braced text is a group of its own).
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf } from '../node.ts';
import key from './key.ts';
import { joinNames, templateLines } from './lines.ts';

/** The sender's affiliation: the first author's first, else the title's first. */
const senderAffiliation = (node: Subject) => {
  const affiliations = affiliationsOf(node);
  const first = authorsOf(node)[0];
  return (first === undefined ? [] : affiliationsOfAuthor(first, affiliations))[0] ?? affiliations[0];
};

/** One `\command{…}` when the lines are there, the lines joined by \\. */
const command = (name: string, lines: readonly string[]): string[] => (lines.length === 0 ? [] : [`\\${name}{${lines.join('\\\\')}}`]);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  /** A template field the paper fills, else the template's own wording. */
  const wording = (node: Subject, name: string, fallback: string): string => templateLines(node, name).join(' ') || param(p, fallback);
  return {
    preamble: (_params, _parentType, node) => {
      if (node === undefined) return {};
      const names = authorsOf(node).map((a) => a.name);
      const sender = senderAffiliation(node);
      const signature = templateLines(node, 'signature');
      const { date } = peopleOf(node);
      // The letter is closed from the enddocument hook: \enddocument runs it before \@checkend{document} (latex.ltx
      // 2026-06-01 l.15472-15476; \AtEndDocument is \AddToHook{enddocument}, l.19194), so \end{letter} there closes the
      // environment the title opened, after the last block of the body. No node owns the end of the document.
      const close = [
        // An empty closing phrase leaves \closing's \\[6\medskipamount] with no line to end (l.238: "There's no line here to
        // end", compiled 2026-11-07); an empty box starts the line.
        `\\closing{${wording(node, 'closing', 'closing') || '\\mbox{}'}}`,
        ...command('ps', templateLines(node, 'postscript')),
        ...command('encl', templateLines(node, 'enclosures')),
        ...command('cc', templateLines(node, 'cc')),
        '\\end{letter}',
      ];
      return {
        declarations: [
          ...(names.length === 0 ? [] : [`\\name{${joinNames(names)}}`]),
          ...command('signature', signature.length > 0 ? signature : names),
          // With no \address, \opening sets the firstpage style, whose foot shows \location and \telephone (l.135-149).
          ...command('address', sender === undefined ? [] : [sender.department, sender.name, sender.address].filter(Boolean)),
          ...command('location', templateLines(node, 'location')),
          ...command('telephone', templateLines(node, 'telephone')),
          ...(dataOf(node)['dateMode'] === 'none' ? ['\\date{}'] : date !== '' ? [`\\date{${date}}`] : []),
          `\\AtEndDocument{${close.join('')}}`,
        ],
      };
    },
    emit: (node, content) => {
      const title = content.trim();
      // The title's text, when the template prints one, between \begin{letter} and \opening, as 0366's cover letter prints
      // its title (cover_letter.tex l.92-104); the letter class has no subject line of its own.
      const subject = param(p, 'subject', 'none') === 'before-opening' && title !== '' ? [`{\\bfseries ${title}\\par}`] : [];
      return `${[`\\begin{letter}{${templateLines(node, 'recipient').join('\\\\')}}`, ...subject, `\\opening{${wording(node, 'salutation', 'salutation')}}`].join('\n')}\n\n`;
    },
  };
};

export default realize;
