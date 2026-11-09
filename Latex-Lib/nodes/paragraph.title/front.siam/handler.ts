/**
 * front.siam (paragraph/title). SIAM's title block (siamart): \headers{short title}{running authors} in the preamble, then
 * \title{…\thanks{note \funding{…}}}, \author{A\thanks{affiliation (\email{…})} \and B\footnotemark[2]} and the class's own
 * \maketitle; the keywords and the MSC codes (or the older AMS subject classifications) in their environments right after the
 * abstract, through the kernel's env/abstract/after hook.
 * Source: Latex Related Research/Latex-lib-main/Source/0186-siam-siamart (ex_shared.tex l.31-43, ex_article.tex l.39-59);
 * testing-pipeline/settings/classes/files/siamart251216.cls.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAuthor } from '../node.ts';
import key from './key.ts';

/** The running authors' fallback, as SIAM writes them (ex_shared.tex l.31): "A", "A and B", "A, B, and C". */
const runningNames = (authors: readonly TitleAuthor[]): string => {
  const names = authors.map((a) => a.name);
  return names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]!}`;
};

/** A note's text ends with one full stop, as ex_shared.tex l.38-41 writes them ("…, Chicago, IL (\email{…})."). */
const sentence = (s: string): string => (s === '' || /[.!?]$/u.test(s) ? s : `${s}.`);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const heads = param(p, 'runningHeads', 'always');
  const classification = param(p, 'classification', 'MSCcodes');

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);

    // The title's one \thanks: templateSpecific.titleNote ("Submitted to the editors DATE.") and the class's \funding{…} after it
    // (siamart251216.cls l.1158: \protect\\ then "Funding:" on a line of its own), as ex_shared.tex l.35-36 writes them.
    const note = templateField(node, 'titleNote');
    const funding = templateField(node, 'funding');
    const titleThanks = note === '' && funding === '' ? '' : `\\thanks{${note}${funding === '' ? '' : `\\funding{${funding}}`}}`;

    // Each author's e-mail goes into the note of their first affiliation, whoever that note belongs to (ex_shared.tex l.40-42:
    // Frank's note carries Smith's e-mail, and Smith points at it with \footnotemark[3]).
    const mailsAt = new Map<string, string[]>();
    for (const a of authors) {
      const first = affiliationsOfAuthor(a, affiliations)[0];
      if (a.email !== '' && first !== undefined) mailsAt.set(first.id, [...(mailsAt.get(first.id) ?? []), a.email]);
    }
    const mails = (list: readonly string[]): string => list.map((e) => `\\email{${e}}`).join(', ');

    // The footnote numbers \maketitle gives: the title's \thanks is 1 when there is one, then each author's \thanks in turn
    // (siamart's \maketitle starts the counter at 0 and marks them with \fnsymbol, l.474-496).
    let mark = titleThanks === '' ? 0 : 1;
    const numberOf = new Map<string, number>();

    // siamart's \@doauth upper-cases each name up to its first \thanks and passes everything after it to one \thanks
    // (\@ucnothanks, \@ucntb, l.576-586): an author takes at most one \thanks, and last. So an affiliation an earlier note already
    // gives is a \footnotemark[n] before it, and the author's new affiliations share the one \thanks, joined by "; ".
    const entry = (a: TitleAuthor): string => {
      const own = affiliationsOfAuthor(a, affiliations);
      const shared = own.filter((x) => numberOf.has(x.id)).map((x) => `\\footnotemark[${numberOf.get(x.id)!}]`);
      const fresh = own.filter((x) => !numberOf.has(x.id));
      let thanks = '';
      if (fresh.length > 0) {
        mark += 1;
        for (const x of fresh) numberOf.set(x.id, mark);
        const at = fresh.flatMap((x) => mailsAt.get(x.id) ?? []);
        thanks = `\\thanks{${sentence(`${fresh.map((x) => x.text).join('; ')}${at.length === 0 ? '' : ` (${mails(at)})`}`)}}`;
      } else if (own.length === 0 && a.email !== '') {
        mark += 1;
        thanks = `\\thanks{${mails([a.email])}.}`;
      }
      // The class's marks are boxes of no width (\@makefnmark, l.479): two in a row would print over each other, so an en space parts them.
      const marks = [...shared, ...(thanks === '' ? [] : [thanks])].join('\\enspace ');
      // siamart's \orcid{…} records the ORCID and prints nothing (l.821); it sits before the marks, in the upper-cased part.
      const orcid = param(p, 'orcid', 'orcid') === 'orcid' && a.orcid !== '' ? `\\orcid{${a.orcid}}` : '';
      return `${a.name}${orcid}${marks}`;
    };

    return [`\\title{${content.trim()}${titleThanks}}`, ...(authors.length === 0 ? [] : [`\\author{${authors.map(entry).join('\n  \\and ')}}`])].join('\n');
  };

  return {
    preamble: (_params, _parentType, node, content) => {
      if (node === undefined) return {};
      const declarations: string[] = [];
      // \headers{short title}{running authors} sets the running heads (siamart251216.cls l.1588-1593: myheadings, upper-cased), in
      // the preamble as ex_shared.tex l.31 writes it. Always (the default): the title and the authors' names when not given.
      if (heads !== 'none') {
        const short = templateField(node, 'shortTitle') || (heads === 'always' ? (content ?? '').trim() : '');
        const running = templateField(node, 'runningAuthor') || (heads === 'always' ? runningNames(authorsOf(node)) : '');
        if (short !== '' || running !== '') declarations.push(`\\headers{${short}}{${running}}`);
      }
      // The keywords and the classification come right after the abstract, each in the class's environment (ex_article.tex
      // l.48-59; siamart251216.cls l.769-773). The title cannot write there, so the kernel's env/abstract/after hook does, once;
      // with no abstract environment in the document they are not printed.
      const keywords = p['keywords'] === false ? '' : templateList(node, 'keywords').join(', ');
      const codes = classification === 'none' ? '' : templateList(node, 'mscCodes').join(', ');
      const after = [
        ...(keywords === '' ? [] : [`\\begin{keywords}${keywords}\\end{keywords}`]),
        ...(codes === '' ? [] : [`\\begin{${classification}}${codes}\\end{${classification}}`]),
      ];
      if (after.length > 0) declarations.push(`\\AddToHookNext{env/abstract/after}{${after.join('')}}`);
      return declarations.length === 0 ? {} : { declarations };
    },
    // The title lines go in the body, just before \maketitle, as front.class-native writes them (the class keeps them until it).
    emit: (node, content) => `${body(node, content)}\n\\maketitle\n\n`,
  };
};

export default realize;
