/**
 * front.moderncv (paragraph/title). moderncv's head, as its own template writes it (Source/0196-moderncv/template.tex
 * l.56-116, 275-283): the personal data in the preamble (\name{first}{last}, \address{…}{…}{…}, \phone[type]{…},
 * \email{…}, \homepage{…}, \social[kind]{…}, \born, \extrainfo, \photo[height][frame]{file}, \quote), then \title{…} and
 * \makecvtitle where the title stands; or, for a cover letter, \recipient{…}{…}, \date, \subject, \opening, \closing,
 * \signature, \postscript, \enclosure and \makelettertitle, with \makeletterclosing at the end of the document.
 * CTAN: https://ctan.org/pkg/moderncv
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField } from '../node.ts';
import { templateEntries, templateFile, templateLines } from './fields.ts';
import key from './key.ts';

const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

/** A cover letter's head: the node names a recipient (templateSpecific.recipientName). One way serves both of template.tex's title nodes. */
const isLetter = (node: Subject): boolean => templateField(node, 'recipientName') !== '';

/** The CV holder's personal data, in the preamble: moderncv sets hyperref's pdfauthor and pdftitle from \@firstname and \@lastname at the end of the preamble (moderncv.cls l.104-121), so \name must come before \begin{document}. */
const personal = (node: Subject, p: { readonly [name: string]: unknown }): string[] => {
  const [author] = authorsOf(node);
  // \name{<every word but the last>}{<the last>} (template.tex l.57); the hyperref setup needs it even with no author.
  const words = (author?.name ?? '').split(/\s+/u).filter(Boolean);
  const name = `\\name{${words.slice(0, -1).join(' ')}}{${words[words.length - 1] ?? ''}}`;

  // \address{street}{city}{country} (template.tex l.60, moderncv.cls l.229): templateSpecific.address's lines, the third
  // taking the rest; or the author's (first) affiliation's address, split at its commas.
  const own = author === undefined ? [] : affiliationsOfAuthor(author, affiliationsOf(node));
  const lines = templateLines(node, 'address');
  const parts = lines.length > 0 ? lines : (own[0]?.address ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const address = parts.length === 0 ? [] : [`\\address{${parts[0]}}{${parts[1] ?? ''}}{${parts.slice(2).join(', ')}}`];

  // \phone[mobile|fixed|fax]{…} (l.61-63; moderncv.cls l.248-253); an untyped number takes the class's default type.
  const phones = templateEntries(node, 'phone', ['mobile', 'fixed', 'fax']).map((e) => `\\phone${e.type === '' ? '' : `[${e.type}]`}{${e.value}}`);

  // \homepage{www.…}: the class adds the protocol (\homepage[https]{…}, moderncv.cls l.241-243), so a given one is moved there.
  const page = templateField(node, 'homepage');
  const protocol = /^(https?):\/\//u.exec(page)?.[1];
  const homepage = page === '' ? [] : [`\\homepage${protocol === 'http' ? '[http]' : ''}{${page.replace(/^https?:\/\//u, '')}}`];

  // \social[kind]{account} (l.67-110; moderncv.cls l.256-337), and the author's ORCID as \social[orcid]{…} unless listed.
  const socials = templateEntries(node, 'social', 'any').filter((e) => e.type !== '');
  const orcid = author !== undefined && author.orcid !== '' && !socials.some((e) => e.type === 'orcid') ? [{ type: 'orcid', value: author.orcid }] : [];
  const photo = templateFile(node, 'photo');

  return [
    name,
    ...line('born', templateField(node, 'born')),
    ...address,
    ...phones,
    ...line('email', author?.email ?? ''),
    ...homepage,
    ...[...socials, ...orcid].map((e) => `\\social[${e.type}]{${e.value}}`),
    ...line('extrainfo', templateField(node, 'extrainfo')),
    // \photo[height][frame]{file} (l.112; moderncv.cls l.500): the class's defaults 64pt and 0.4pt.
    ...(photo === '' ? [] : [`\\photo[${param(p, 'photoHeight', '64pt')}][${param(p, 'photoFrame', '0.4pt')}]{${photo}}`]),
    ...line('quote', templateField(node, 'quote')),
  ];
};

/** The cover letter's fields and \makelettertitle (template.tex l.275-283; moderncv.cls l.810-841). */
const letter = (node: Subject, p: { readonly [name: string]: unknown }): string[] => {
  // \date only for a date the paper gives: the class's default is \today (moderncv.cls l.811).
  const date = dataOf(node)['dateMode'] === 'none' ? '' : peopleOf(node).date;
  const signature = templateFile(node, 'signature');
  return [
    `\\recipient{${templateField(node, 'recipientName')}}{${templateLines(node, 'recipientAddress').join('\\\\')}}`,
    ...line('date', date),
    ...line('subject', templateField(node, 'subject')),
    // The letter's head and closing print \@opening and \@closing unconditionally (moderncvheadi.sty l.202, moderncvbodyi.sty
    // l.183-185), so both always have a value: the paper's, or the template's.
    `\\opening{${templateField(node, 'opening') || param(p, 'opening')}}`,
    `\\closing{${templateField(node, 'closing') || param(p, 'closing')}}`,
    ...(signature === '' ? [] : [`\\signature{${param(p, 'signatureScale', '1')}}{${signature}}`]),
    ...line('postscript', templateField(node, 'postscript')),
    ...line('enclosure', templateField(node, 'enclosure')),
    '\\makelettertitle',
  ];
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The personal data, and for a letter \makeletterclosing at the end of the document: no node marks where a letter's body
    // ends, so it closes there, as template.tex (l.295) and 0410's cover_letter.tex (l.45) have it, the letter last.
    preamble: (_params, _parentType, node) =>
      node === undefined ? {} : { declarations: [...personal(node, p), ...(isLetter(node) ? ['\\AtEndDocument{\\makeletterclosing}'] : [])] },
    // \title is the CV's subtitle (template.tex l.58), omitted when the node is empty; moderncv's \title only stores it
    // (moderncv.cls l.225), so it stands in the body, just before \makecvtitle.
    emit: (node, content) => `${(isLetter(node) ? letter(node, p) : [...line('title', content.trim()), '\\makecvtitle']).join('\n')}\n\n`,
  };
};

export default realize;
