/**
 * front.mnras (paragraph/title). The Monthly Notices' front matter, as MNRAS's own template writes it
 * (Latex-Template-Examples/class.mnras/main.tex l.106-132): \title[short]{full}, \author[short]{A,$^{1}$\thanks{E-mail: …}
 * B,$^{2}$ and C$^{1,2}$ \\ $^{1}$affiliation \\ $^{2}$affiliation}, \date{…}, \pubyear{…}, then \label{firstpage},
 * \pagerange{\pageref{firstpage}--\pageref{lastpage}} and \maketitle; the keywords environment after the abstract; \bsp and
 * \label{lastpage} at the end.
 * CTAN: https://ctan.org/pkg/mnras
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField, templateList, type TitleAuthor } from '../node.ts';
import key from './key.ts';

/** Whether the author is the one a templateSpecific value names (by e-mail or by name). */
const names = (author: TitleAuthor, value: string): boolean => value !== '' && (author.email === value || author.name === value);

/** The running head's authors when the paper gives none: "A", "A and B", "A et al." (as the template's "A. N. Author et al."). */
const runningAuthors = (authors: readonly TitleAuthor[]): string =>
  authors.length === 0 ? '' : authors.length === 1 ? authors[0]!.name : authors.length === 2 ? `${authors[0]!.name} and ${authors[1]!.name}` : `${authors[0]!.name} et al.`;

/** The \author argument: each name with its affiliations' numbers and, where asked, its e-mail as \thanks, then the affiliations. */
const authorBlock = (node: Subject, emails: string): string => {
  const authors = authorsOf(node);
  const affiliations = affiliationsOf(node);
  const corresponding = templateField(node, 'correspondingAuthor');
  // 'corresponding': the author templateSpecific.correspondingAuthor names (by e-mail or name); when it names none of them,
  // every author with an e-mail, as the template's \thanks on the first author leaves open (MNRAS.md l.48: "may be included").
  const named = authors.some((a) => names(a, corresponding));
  const thanked = (a: TitleAuthor): boolean => a.email !== '' && (emails === 'all' || (emails === 'corresponding' && (named ? names(a, corresponding) : true)));
  const last = authors.length - 1;
  const people = authors.map((a, i) => {
    const numbers = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    // The template's punctuation: "A. N. Author,$^{1}$ B. C. Other,$^{2}$ and C. D. Writer$^{2,3}$" (main.tex l.107-110): a comma
    // after every name but the last, "and" before the last; the mark after the comma.
    const mark = numbers.length > 0 ? `$^{${numbers.join(',')}}$` : '';
    const thanks = thanked(a) ? `\\thanks{E-mail: ${a.email}}` : '';
    return `${i === last && i > 0 ? 'and ' : ''}${a.name}${i === last ? '' : ','}${mark}${thanks}`;
  });
  // Each affiliation on its own line after \\, which mnras's author tabular sets small and italic (\author@nextline, mnras.cls
  // l.1096-1099), as "Department, Institution, Street Address, City and Postal Code, Country" (MNRAS.md l.45).
  const lines = affiliations.map((f) => `$^{${affiliationNumber(f, affiliations)}}$${f.text}`);
  return [people.join('\n'), ...(lines.length > 0 ? [`\\\\\n${lines.join('\\\\\n')}`] : [])].join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const emails = param(p, 'emails', 'corresponding');

  /** The declarations and the opening lines, at the title's place. */
  const front = (node: Subject, content: string): string[] => {
    const short = templateField(node, 'shortTitle');
    const authors = authorsOf(node);
    const running = templateField(node, 'runningAuthor') || runningAuthors(authors);
    const date = dataOf(node)['dateMode'] === 'none' ? '' : peopleOf(node).date || param(p, 'date');
    const year = templateField(node, 'pubYear') || param(p, 'pubYear', '\\the\\year');
    return [
      `\\title${short === '' ? '' : `[${short}]`}{${content.trim()}}`,
      // Always a short author list: \author{…} alone makes the whole block, \thanks and \\ included, the even pages' running head
      // (\@authorone, mnras.cls l.1185; \ps@headings l.1222-1226).
      ...(authors.length > 0 ? [`\\author[${running}]{\n${authorBlock(node, emails)}\n}`] : []),
      `\\date{${date}}`,
      `\\pubyear{${year}}`,
      // "Don't change these lines" (main.tex l.129-132, MNRAS.md l.47).
      '\\label{firstpage}',
      '\\pagerange{\\pageref{firstpage}--\\pageref{lastpage}}',
      '\\maketitle',
    ];
  };

  return {
    // Two preamble lines. The keywords go to the kernel's env/abstract/after hook (latex.ltx l.15601-15609), once, so they follow
    // the abstract wherever it is printed, as the template has them (main.tex l.144-146); with no keywords \nokeywords stands
    // there instead. Either one prints the \thanks footnotes, which mnras's \maketitle stores and only \endkeywords or \nokeywords
    // print (mnras.cls l.1070, 1133-1146; MNRAS.md l.49): a document with no abstract after its title loses them, and its keywords.
    // \bsp and \label{lastpage} end the document (main.tex l.333-334), so \pagerange's last page is found.
    preamble: (_params, _parentType, node) => {
      const keywords = node === undefined ? [] : templateList(node, 'keywords');
      return {
        declarations: [
          ...(node === undefined ? [] : [`\\AddToHookNext{env/abstract/after}{${keywords.length > 0 ? `\\begin{keywords}\n${keywords.join(' -- ')}\n\\end{keywords}` : '\\nokeywords'}}`]),
          '\\AtEndDocument{\\bsp\\label{lastpage}}',
        ],
      };
    },
    // In the body, where the title stands: mnras's \title, \author, \date and \pubyear only store their text (mnras.cls
    // l.1183-1197), so the body serves as the template's preamble does, and \label{firstpage} must follow \begin{document}.
    emit: (node, content) => `${front(node, content).join('\n')}\n\n`,
  };
};

export default realize;
