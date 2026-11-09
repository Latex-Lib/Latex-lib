/**
 * front.oup (paragraph/title). The Oxford University Press authoring template's title block, in the body where the title
 * stands, as its sample has it (oup-authoring-template.tex l.76-130): the paper's own metadata (\firstpage, \vol, \issue,
 * \pubyear, \copyrightyear, \DOI), \title[short]{…}, one \author[marks]{name\ORCID{…}} per author, one
 * \address[n]{\orgdiv{…}, \orgname{…}, \orgaddress{…}} per affiliation, \corresp, the history dates, \keywords (and
 * \keywords[Abbreviations]), \otherabstract, \boxedtext with the key messages, then \maketitle.
 * CTAN: https://ctan.org/pkg/oup-authoring-template
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, escapeText, param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAuthor } from '../node.ts';
import { oupDate } from './dates.ts';
import key from './key.ts';

const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

/** Whether the author is the one templateSpecific.correspondingAuthor names (by e-mail or by name). */
const names = (author: TitleAuthor, value: string): boolean => value !== '' && (author.email === value || author.name === value);

/** The key messages, each an item: a list as it is, a string split at line ends or semicolons (a message may hold commas). */
const keyMessages = (node: Subject): string[] => {
  const ts = dataOf(node)['templateSpecific'];
  const v = ts !== null && typeof ts === 'object' && !Array.isArray(ts) ? (ts as { readonly [name: string]: unknown })['keyMessages'] : undefined;
  const items = Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : typeof v === 'string' ? v.split(/\r\n?|\n|;/u) : [];
  return items.map((x) => x.trim()).filter(Boolean).map(escapeText);
};

const ORCID = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/u;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };

  const body = (node: Subject, content: string): string => {
    const title = content.trim();
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    const correspondingValue = templateField(node, 'correspondingAuthor');
    const corresponding = authors.find((a) => names(a, correspondingValue));

    // Marks: the author's affiliation numbers, then $\ast$ for the corresponding author, as the sample's \author[1,$\ast$]
    // (l.84). \@@author prints them as a superscript after the name (cls l.1162-1167).
    const author = (a: TitleAuthor): string => {
      const marks = [...affiliationsOfAuthor(a, affiliations).map((x) => String(affiliationNumber(x, affiliations))), ...(a === corresponding ? ['$\\ast$'] : [])];
      return `\\author${marks.length === 0 ? '' : `[${marks.join(',')}]`}{${a.name}${ORCID.test(a.orcid) ? `\\ORCID{${a.orcid}}` : ''}}`;
    };
    // The address's parts in the sample's order (l.89), each in the class's tag (cls l.1285-1287, which print their argument).
    const address = (n: number, x: (typeof affiliations)[number]): string => {
      const parts = [...(x.department === '' ? [] : [`\\orgdiv{${x.department}}`]), ...(x.name === '' ? [] : [`\\orgname{${x.name}}`]), ...(x.address === '' ? [] : [`\\orgaddress{${x.address}}`])];
      return `\\address[${n}]{${parts.join(', ')}}`;
    };
    // \corresp[mark]{text} (cls l.1322-1326), as the sample's l.94, with a mailto link (the sample's "email:" is no URL scheme).
    const corresp = corresponding
      ? [`\\corresp[$\\ast$]{Corresponding author.${corresponding.email === '' ? '' : ` \\href{mailto:${corresponding.email}}{${corresponding.email}}`}}`]
      : correspondingValue === ''
        ? []
        : [`\\corresp{Corresponding author. ${correspondingValue}}`];
    const history = (['received', 'revised', 'accepted'] as const).flatMap((name) => {
      const d = oupDate(templateField(node, name));
      return d === undefined ? [] : [`\\${name}{${d[0]}}{${d[1]}}{${d[2]}}`];
    });
    const keywords = templateList(node, 'keywords').join(', ');
    const abbreviations = templateList(node, 'abbreviations').join(', ');
    const otherAbstract = templateField(node, 'otherAbstract');
    const otherHeading = templateField(node, 'otherAbstractHeading') || param(p, 'otherAbstractHeading', 'Additional Abstract');
    const messages = keyMessages(node);
    const firstPage = templateField(node, 'firstPage');

    return [
      // \firstpage compares its argument with the page counter (\ifnum, cls l.1023-1030): a number only.
      ...(/^\d+$/u.test(firstPage) ? [`\\firstpage{${firstPage}}`] : []),
      ...line('vol', templateField(node, 'volume')),
      ...line('issue', templateField(node, 'issue')),
      ...line('pubyear', templateField(node, 'pubYear')),
      ...line('copyrightyear', templateField(node, 'copyrightYear')),
      ...line('DOI', templateField(node, 'doi')),
      // The running heads and the first page print \@journaltitle, \@pubyear and \@copyrightyear (cls l.870-1015), which have no
      // default (l.1275-1277), and \maketitle prints \@abstract (l.1564, 1637), which only \abstract defines (l.1205): undefined,
      // each stops at "Undefined control sequence" (measured, see the key). The journal's values are the template's (its doc way's
      // \journaltitle in the preamble), the abstract the abstract way's \abstract{…} in the preamble; these lines, after the preamble,
      // only give empty ones where nothing did. \societylogo, which the opening page prints (l.966-984) and the class never
      // defines, is the same (the sample defines it empty, tex l.44).
      '\\providecommand\\societylogo{}',
      ...['@journaltitle', '@pubyear', '@copyrightyear', '@abstract'].map((n) => `\\expandafter\\providecommand\\csname ${n}\\endcsname{}`),
      // Always with the short title: without it \@@title calls \authormark (cls l.1149), which v1.5 never defines.
      `\\title[${templateField(node, 'shortTitle') || title}]{${title}}`,
      ...authors.map(author),
      ...affiliations.map((x, i) => address(i + 1, x)),
      ...corresp,
      ...history,
      ...line('keywords', keywords),
      ...line(`keywords[${param(p, 'abbreviationsHeading', 'Abbreviations')}]`, abbreviations),
      ...line(`otherabstract[${otherHeading}]`, otherAbstract),
      ...(messages.length === 0 ? [] : [`\\boxedtext{${param(p, 'keyMessagesHeading', 'Key Messages')}}{\n\\begin{itemize}\n${messages.map((m) => `\\item ${m}`).join('\n')}\n\\end{itemize}}`]),
    ].join('\n');
  };

  return {
    // In the body, where the sample sets it (tex l.76-130): \maketitle clears \title, \author, \address and \boxedtext (cls
    // l.1365-1386) and stores nothing from the preamble the body needs again.
    preamble: () => ({}),
    emit: (node, content) => `${body(node, content)}\n\\maketitle\n\n`,
  };
};

export default realize;
