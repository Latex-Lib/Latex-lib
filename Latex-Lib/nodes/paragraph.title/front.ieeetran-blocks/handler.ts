/**
 * front.ieeetran-blocks (paragraph/title). The IEEE conference title block, at the title's place before \maketitle:
 * \title{…} (with the funding \thanks), the authors in IEEEtran's conference author blocks (\IEEEauthorblockN{name}
 * \IEEEauthorblockA{affiliation lines} joined by \and), or one name block with \IEEEauthorrefmark symbols and one
 * affiliation block per mark, or ieeeconf's \thanks notes; the special paper notice; \maketitle; and the keywords in
 * IEEEkeywords (ieeeconf: keywords) right after the abstract through the kernel's env/abstract/after hook.
 * ieeeconf (IEEE RAS, a renamed IEEEtran V1.6b) has the same blocks without the IEEE prefix (\authorblockN, \authorblockA,
 * \authorrefmark, \specialpapernotice, keywords): the `commands` parameter picks the names.
 * CTAN: https://ctan.org/pkg/ieeetran
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { escapeText, param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAffiliation, type TitleAuthor } from '../node.ts';
import key from './key.ts';

type P = { readonly [name: string]: unknown };

/** The class's names: IEEEtran V1.7 and later prefix them with IEEE (IEEEtran.cls l.4541, 4636, 4653, 5286, 6105); ieeeconf's V1.6b does not (ieeeconf.cls l.3399, 3484, 3501, 3809, 4404). */
const namesOf = (p: P) => {
  const ieee = param(p, 'commands', 'ieeetran') === 'ieeetran';
  return {
    blockN: ieee ? '\\IEEEauthorblockN' : '\\authorblockN',
    blockA: ieee ? '\\IEEEauthorblockA' : '\\authorblockA',
    refmark: ieee ? '\\IEEEauthorrefmark' : '\\authorrefmark',
    notice: ieee ? '\\IEEEspecialpapernotice' : '\\specialpapernotice',
    keywords: ieee ? 'IEEEkeywords' : 'keywords',
  };
};

/** A, B and C: IEEE joins names with commas and "and" before the last, no serial comma (bare_conf.tex l.355-359). */
const joinNames = (names: readonly string[]): string => (names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] ?? ''}`);

/** An author's contact lines: the e-mail after its label, and the ORCID where asked (0859: "email address or ORCID"). */
const contactLines = (a: TitleAuthor, p: P): string[] => {
  const label = escapeText(param(p, 'emailLabel', 'Email: '));
  const orcid = param(p, 'orcid', 'none');
  const email = a.email === '' ? [] : [`${label}${a.email}`];
  const id = a.orcid === '' || orcid === 'none' || (orcid === 'fallback' && a.email !== '') ? [] : [`ORCID: ${escapeText(a.orcid)}`];
  return [...email, ...id];
};

/** An affiliation's lines in a block: department, organization, address, each on its own line (bare_conf.tex l.330-333), the first two in italics where asked (0859 l.23-24). */
const affiliationLines = (f: TitleAffiliation, p: P): string[] => {
  const it = (s: string): string => (s !== '' && param(p, 'affiliationStyle', 'plain') === 'italic' ? `\\textit{${s}}` : s);
  return [it(f.department), it(f.name), f.address].filter(Boolean);
};

/** blocks: one \IEEEauthorblockN{name}\IEEEauthorblockA{lines} per author, joined by \and (bare_conf.tex l.329-344; 0859 l.22-57). */
const blocks = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], p: P): string => {
  const n = namesOf(p);
  return authors
    .map((a) => {
      const lines = [...affiliationsOfAuthor(a, affiliations).flatMap((f) => affiliationLines(f, p)), ...contactLines(a, p)];
      return `${n.blockN}{${a.name}}${lines.length === 0 ? '' : `\n${n.blockA}{${lines.join('\\\\\n')}}`}`;
    })
    .join('\n\\and\n');
};

/**
 * refmark: one name block with each author's \IEEEauthorrefmark{n} (n = the affiliation's number), then one affiliation
 * block per affiliation opening with its mark, holding the e-mails of the authors whose first affiliation it is (bare_conf.tex
 * l.354-366). The mark is a footnote symbol picked by \ifcase, so it takes one number each (IEEEtran.cls l.4543-4545).
 */
const refmarks = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], p: P): string => {
  const n = namesOf(p);
  const label = escapeText(param(p, 'emailLabel', 'Email: '));
  const names = authors.map((a) => `${a.name}${affiliationsOfAuthor(a, affiliations).map((f) => `${n.refmark}{${affiliationNumber(f, affiliations)}}`).join('')}`);
  const firstOf = (a: TitleAuthor): string | undefined => affiliationsOfAuthor(a, affiliations)[0]?.id;
  const emails = (list: readonly TitleAuthor[]): string[] => list.map((a) => a.email).filter(Boolean);
  const places = affiliations.map((f) => {
    const mine = emails(authors.filter((a) => firstOf(a) === f.id));
    return `${n.blockA}{${n.refmark}{${affiliationNumber(f, affiliations)}}${f.text}${mine.length === 0 ? '' : `\\\\\n${label}${mine.join(', ')}`}}`;
  });
  const loose = emails(authors.filter((a) => firstOf(a) === undefined));
  return [`${n.blockN}{${joinNames(names)}}`, ...places, ...(loose.length === 0 ? [] : [`${n.blockA}{${label}${loose.join(', ')}}`])].join('\n');
};

/**
 * thanks (ieeeconf's root.tex l.38-46): the names with superscript affiliation numbers, then one \thanks per affiliation,
 * "$^{n}$A and B are with …, {\tt\small e-mails}". The funding \thanks comes first, its "*" matching the one after the title.
 */
const thanksForm = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], funding: string): string => {
  const names = authors.map((a) => {
    const marks = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
    return `${a.name}${marks.length === 0 ? '' : `$^{${marks.join(',')}}$`}`;
  });
  const notes = affiliations.map((f) => {
    const members = authors.filter((a) => affiliationsOfAuthor(a, affiliations).some((x) => x.id === f.id));
    const mails = members.filter((a) => affiliationsOfAuthor(a, affiliations)[0]?.id === f.id).map((a) => a.email).filter(Boolean);
    const who = members.length === 0 ? '' : `${joinNames(members.map((a) => a.name))} ${members.length === 1 ? 'is' : 'are'} with `;
    return `\\thanks{$^{${affiliationNumber(f, affiliations)}}$${who}${f.text}${mails.length === 0 ? '' : ` {\\tt\\small ${mails.join(', ')}}`}}`;
  });
  const loose = authors.filter((a) => a.email !== '' && affiliationsOfAuthor(a, affiliations).length === 0).map((a) => `\\thanks{${a.name}: {\\tt\\small ${a.email}}}`);
  // Each line ends in % as root.tex's do, so no space comes between the names and the marks; the last closes \author.
  const marks = [...(funding === '' ? [] : [`\\thanks{*${funding}}`]), ...notes, ...loose];
  return marks.length === 0 ? joinNames(names) : `${joinNames(names)}%\n${marks.join('%\n')}`;
};

const front = (node: Subject, content: string, p: P): string[] => {
  const n = namesOf(p);
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const form = param(p, 'form', 'blocks');
  const funding = templateField(node, 'funding');
  const font = param(p, 'titleFont', '');
  const title = `${font === '' ? '' : `${font} `}${content.trim()}`;
  // Funding: \title{…\thanks{funding}} (0859 l.16-20); in the thanks form, root.tex's "*" after the title and \thanks{*…}
  // in \author (l.33-35, 39).
  const lines: string[] = [];
  const thanks = funding !== '' || (form === 'thanks' && authors.length > 0);
  // Conference mode swallows \thanks unless \IEEEoverridecommandlockouts, which only \let's it back and so serves in the body
  // too (IEEEtran.cls l.6278-6289; ieeeconf.cls l.4538, 4572). 0859 l.2 gives it after \documentclass for the funding note.
  if (thanks && p['overrideLockouts'] === true) lines.push('\\IEEEoverridecommandlockouts');
  lines.push(form === 'thanks' ? `\\title{${title}${funding === '' ? '' : '*'}}` : `\\title{${title}${funding === '' ? '' : `\\thanks{${funding}}`}}`);
  if (authors.length > 0) {
    const body = form === 'refmark' ? refmarks(authors, affiliations, p) : form === 'thanks' ? thanksForm(authors, affiliations, funding) : blocks(authors, affiliations, p);
    lines.push(`\\author{${body}}`);
  }
  // templateSpecific.specialPaperNotice: "(Invited Paper)", set under the authors by \maketitle (bare_conf.tex l.371;
  // IEEEtran.cls l.6105-6109, ieeeconf.cls l.4404).
  const notice = templateField(node, 'specialPaperNotice');
  if (notice !== '') lines.push(`${n.notice}{${notice}}`);
  return lines;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as P;
  return {
    // Everything in the body at the title's place: \title, \author and the notice only store their text until \maketitle
    // (0859 and bare_conf.tex set them in the body; ieeeconf's root.tex in the preamble), so the body serves every class.
    preamble: () => ({}),
    emit: (node, content) => {
      const n = namesOf(p);
      const keywords = templateList(node, 'keywords');
      // The keywords right after the abstract (0859 l.67-69: \begin{IEEEkeywords} … \end{IEEEkeywords}; IEEEtran.cls l.5286-5292,
      // ieeeconf.cls l.3809-3818), and bare_conf.tex's \IEEEpeerreviewmaketitle after them (l.393-399; it does nothing unless
      // the peerreview option is given, IEEEtran.cls l.4931). The abstract node follows the title, so they wait for its end in the
      // kernel's env/abstract/after hook; the after-title form prints them right after \maketitle, for a paper with no abstract.
      const after = [...(keywords.length === 0 ? [] : [`\\begin{${n.keywords}}${keywords.join(', ')}\\end{${n.keywords}}`]), ...(p['peerReview'] === true ? ['\\IEEEpeerreviewmaketitle'] : [])];
      const underTitle = param(p, 'keywords', 'after-abstract') === 'after-title';
      const hook = after.length === 0 || underTitle ? [] : [`\\AddToHook{env/abstract/after}{${after.join('')}}`];
      // ieeeconf's root.tex clears the running heads right after \maketitle (l.53-55).
      const pages = param(p, 'pageStyle', 'class') === 'empty' ? ['\\thispagestyle{empty}', '\\pagestyle{empty}'] : [];
      return `${[...front(node, content, p), ...hook, '\\maketitle', ...pages, ...(underTitle ? after : [])].join('\n')}\n\n`;
    },
  };
};

export default realize;
