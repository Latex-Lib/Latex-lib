/**
 * front.author-blocks' author block: the authors, grouped as the template groups them, each group with its names, its
 * notes (\thanks), its affiliation and e-mail lines, joined by the class's separator (\and, \And/\AND, or a line break).
 * Every text comes from node.ts's readers, so it is LaTeX text already.
 */
import { escapeText } from '../../protocol.ts';
import type { Subject } from '../../../schema/realization.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, type TitleAffiliation, type TitleAuthor } from '../node.ts';

export type BlockParams = {
  readonly affiliationForm: string;
  readonly affiliationLines: string;
  readonly emailAt: string;
  readonly emailForm: string;
  readonly emailCompress: boolean;
  readonly orcidAt: string;
  readonly correspondingNote: string;
  readonly grouping: string;
  readonly nameJoin: string;
  readonly nameFont: string;
  readonly detailsFont: string;
  readonly separator: string;
  readonly perLine: number;
  readonly degreeLine: boolean;
};

type Block = { readonly authors: readonly TitleAuthor[]; readonly affiliations: readonly TitleAffiliation[] };

const sameIds = (a: readonly TitleAffiliation[], b: readonly TitleAffiliation[]): boolean => a.length === b.length && a.every((x, i) => x.id === b[i]?.id);

/** The groups: one per author, consecutive authors with the same affiliations, or every author by their first affiliation. */
const blocksOf = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], grouping: string): Block[] => {
  const blocks: { authors: TitleAuthor[]; affiliations: readonly TitleAffiliation[] }[] = [];
  for (const author of authors) {
    const own = affiliationsOfAuthor(author, affiliations);
    if (grouping === 'firstAffiliation') {
      const first = own[0];
      const block = first === undefined ? undefined : blocks.find((b) => b.affiliations[0]?.id === first.id);
      if (block !== undefined) block.authors.push(author);
      else blocks.push({ authors: [author], affiliations: first === undefined ? [] : [first] });
      continue;
    }
    const last = blocks[blocks.length - 1];
    if (grouping === 'shared' && last !== undefined && sameIds(last.affiliations, own)) last.authors.push(author);
    else blocks.push({ authors: [author], affiliations: own });
  }
  return blocks;
};

/** An escaped e-mail back to what \url reads verbatim (the underscore and the tilde, the only escapes an address has in practice). */
const forUrl = (email: string): string => email.replace(/\\_/gu, '_').replace(/\\textasciitilde\{\}/gu, '~');

const emailText = (emails: readonly string[], form: string, compress: boolean): string => {
  const domains = emails.map((e) => e.slice(e.lastIndexOf('@') + 1));
  const braced = compress && emails.length > 1 && emails.every((e) => e.includes('@')) && domains.every((d) => d === domains[0]);
  // The kit's shared-domain form, \texttt{\{a,b\}@domain} (iclr2026_conference.tex l.24; cvpr's 0973 _constants.tex l.13).
  const one = braced ? `\\{${emails.map((e) => e.slice(0, e.lastIndexOf('@'))).join(',')}\\}@${domains[0]}` : undefined;
  const wrap = (t: string): string => (form === 'texttt' ? `\\texttt{${t}}` : form === 'tt-small' ? `{\\tt\\small ${t}}` : form === 'url' ? `\\url{${forUrl(t)}}` : t);
  return one !== undefined ? wrap(one) : emails.map(wrap).join(', ');
};

const joinNames = (names: readonly string[], how: string): string => {
  if (how === 'comma-amp') return names.length < 2 ? (names[0] ?? '') : `${names.slice(0, -1).join(', ')} \\& ${names[names.length - 1]}`;
  return names.join(how === 'qquad' ? ' \\qquad ' : how === 'comma' ? ', ' : ' and ');
};

/** The \author{…} argument, or '' for a title with no authors. */
export const authorBlock = (node: Subject, p: BlockParams): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  if (authors.length === 0) return '';
  const corresponding = templateField(node, 'correspondingAuthor');
  const degree = p.degreeLine ? templateField(node, 'degreeLine') : '';
  const blocks = blocksOf(authors, affiliations, p.grouping);
  const line = (text: string): string => `\\\\ ${p.detailsFont === '' ? '' : `${p.detailsFont} `}${text}`;
  // With the inline form, an author's second, third... affiliation is a numbered mark and an "also at" line after the block (JACoW).
  const also: TitleAffiliation[] = [];
  const marks = (author: TitleAuthor): string => {
    if (p.affiliationForm !== 'inline') return '';
    const extra = affiliationsOfAuthor(author, affiliations).slice(1);
    for (const a of extra) if (!also.some((x) => x.id === a.id)) also.push(a);
    return extra.length === 0 ? '' : `\\textsuperscript{${extra.map((a) => also.findIndex((x) => x.id === a.id) + 1).join(',')}}`;
  };
  const note = (author: TitleAuthor): string => {
    const parts = [
      ...(p.affiliationForm === 'thanks' ? [affiliationsOfAuthor(author, affiliations).map((a) => a.text).join('; ')] : []),
      ...(p.emailAt === 'thanks' && author.email !== '' ? [emailText([author.email], p.emailForm, false)] : []),
      ...(p.orcidAt === 'thanks' && author.orcid !== '' ? [`ORCID: ${escapeText(author.orcid)}`] : []),
      ...(p.correspondingNote !== '' && corresponding !== '' && (corresponding === author.email || corresponding === author.name) ? [p.correspondingNote] : []),
    ].filter((x) => x !== '');
    return parts.length === 0 ? '' : `\\thanks{${parts.join('. ')}}`;
  };
  const name = (author: TitleAuthor): string => `${p.nameFont === '' ? author.name : `{${p.nameFont} ${author.name}}`}${marks(author)}${note(author)}`;

  const texts = blocks.map((block, i) => {
    const names = joinNames(block.authors.map(name), p.nameJoin);
    const head = p.affiliationForm === 'inline' && block.affiliations[0] !== undefined ? `${names}, ${block.affiliations[0].text}` : names;
    const lines = [
      ...(i === 0 && degree !== '' ? [line(degree)] : []),
      ...(p.affiliationForm === 'lines'
        ? block.affiliations.flatMap((a) => (p.affiliationLines === 'joined' ? [a.text] : [a.department, a.name, a.address].filter(Boolean))).map(line)
        : []),
      ...(p.orcidAt === 'line' ? block.authors.filter((a) => a.orcid !== '').map((a) => line(`ORCID: ${escapeText(a.orcid)}`)) : []),
      ...(p.emailAt === 'line' && block.authors.some((a) => a.email !== '') ? [line(emailText(block.authors.map((a) => a.email).filter(Boolean), p.emailForm, p.emailCompress))] : []),
    ];
    return [head, ...lines].join('\n');
  });

  // \And keeps the next block on the line, \AND starts a new one after every perLine blocks (iclr2027_conference.sty l.89-99,
  // neurips_2026.sty l.344-351, acl.sty l.154-159); the kits end each block with \\ before it.
  const sep = (i: number): string =>
    p.separator === 'And-AND' ? (p.perLine > 0 && (i + 1) % p.perLine === 0 ? ' \\\\\n\\AND\n' : ' \\\\\n\\And\n') : p.separator === 'newline' ? ' \\\\\n' : '\n\\and\n';
  const joined = texts.reduce((acc, t, i) => (i === 0 ? t : `${acc}${sep(i - 1)}${t}`), '');
  const alsoLines = also.map((a, k) => ` \\\\\n\\textsuperscript{${k + 1}}also at ${a.text}`).join('');
  return `${joined}${alsoLines}`;
};
