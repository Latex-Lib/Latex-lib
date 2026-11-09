/**
 * front.koma-letter (paragraph/title). KOMA-Script's letter class, scrlttr2: the sender, the reference fields, the
 * subject (the title's text), the date and the signature as komavars in the preamble; \begin{letter}{recipient} and
 * \opening{salutation} where the title stands; \closing, \ps, \encl, \cc and \end{letter} from the enddocument hook,
 * after the last block of the body.
 * scrkernel-notepaper.dtx (KOMA-Script source, Source/0020-koma-script) l.4175 (the letter environment), l.4557
 * (\opening), l.4632 (\closing), l.4740, 4761, 4791 (\ps, \cc, \encl; \ps takes no argument, so its braced text is a
 * group of its own), l.4836-4847 and 5101-5123 (the komavars); scrkernel-variables.dtx l.173 (\setkomavar).
 * CTAN: https://ctan.org/pkg/koma-script
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

/** One `\setkomavar{name}{…}` when the lines are there, the lines joined by \\. */
const komavar = (name: string, lines: readonly string[]): string[] => (lines.length === 0 ? [] : [`\\setkomavar{${name}}{${lines.join('\\\\')}}`]);

/** One `\command{…}` when the lines are there, the lines joined by \\. */
const command = (name: string, lines: readonly string[]): string[] => (lines.length === 0 ? [] : [`\\${name}{${lines.join('\\\\')}}`]);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  /** A template field the paper fills, else the template's own wording. */
  const wording = (node: Subject, name: string, fallback: string): string => templateLines(node, name).join(' ') || param(p, fallback);
  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined) return {};
      const authors = authorsOf(node);
      const sender = senderAffiliation(node);
      const email = authors.find((a) => a.email !== '')?.email ?? '';
      const phone = templateLines(node, 'phone');
      const url = templateLines(node, 'url');
      const { date } = peopleOf(node);
      const title = (content ?? '').trim();
      // The phone, e-mail and URL fields are printed in the letterhead only when their options are on (0688's
      // Latex-Briefvorlage.tex l.20, 26, 29: fromphone=true, fromemail=true, fromurl=true).
      const shown = [...(phone.length > 0 ? ['fromphone=true'] : []), ...(email !== '' ? ['fromemail=true'] : []), ...(url.length > 0 ? ['fromurl=true'] : [])];
      // The letter is closed from the enddocument hook: \enddocument runs it before \@checkend{document} (latex.ltx
      // 2026-06-01 l.15472-15476; \AtEndDocument is \AddToHook{enddocument}, l.19194), so \end{letter} there closes the
      // environment the title opened, after the last block of the body. No node owns the end of the document.
      const close = [
        `\\closing{${wording(node, 'closing', 'closing')}}`,
        ...command('ps', templateLines(node, 'ps')),
        ...command('encl', templateLines(node, 'enclosures')),
        ...command('cc', templateLines(node, 'cc')),
        '\\end{letter}',
      ];
      return {
        declarations: [
          ...(shown.length === 0 ? [] : [`\\KOMAoptions{${shown.join(',')}}`]),
          ...komavar('fromname', authors.length === 0 ? [] : [joinNames(authors.map((a) => a.name))]),
          ...komavar('fromaddress', sender === undefined ? [] : [sender.department, sender.name, sender.address].filter(Boolean)),
          ...komavar('fromphone', phone),
          ...komavar('fromemail', email === '' ? [] : [email]),
          ...komavar('fromurl', url),
          ...komavar('place', templateLines(node, 'place')),
          ...komavar('yourref', templateLines(node, 'yourRef')),
          ...komavar('myref', templateLines(node, 'myRef')),
          ...komavar('customer', templateLines(node, 'customer')),
          ...komavar('subject', title === '' ? [] : [title]),
          // The date as the node asks: none, its own text, or the class's (\today) when it gives none.
          ...(dataOf(node)['dateMode'] === 'none' ? ['\\setkomavar{date}{}'] : komavar('date', date === '' ? [] : [date])),
          // With no signature of its own, the class signs with fromname (its default signature).
          ...komavar('signature', templateLines(node, 'signature')),
          `\\AtEndDocument{${close.join('')}}`,
        ],
      };
    },
    // An empty recipient stops scrlttr2's \opening at "There's no line here to end" (its address field sets \toname, then
    // \\, then \toaddress); an empty box starts the line (compiled 2026-11-07, ZeroTeX-NG, scrlttr2 with \begin{letter}{}).
    emit: (node) => `\\begin{letter}{${templateLines(node, 'recipient').join('\\\\') || '\\mbox{}'}}\n\\opening{${wording(node, 'opening', 'opening')}}\n\n`,
  };
};

export default realize;
