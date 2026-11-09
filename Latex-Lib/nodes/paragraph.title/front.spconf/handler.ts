/**
 * front.spconf (paragraph/title). The IEEE Signal Processing Society's spconf.sty (ICASSP, ICIP) title block, at the
 * title's place before \maketitle: \title{…}, then the authors as spconf's \maketitle takes them, never \author (spconf's
 * \@maketitle prints \@name and \@address only, classes/icassp.ts): one \name{…} and \address{…}, the kit's
 * \twoauthors{names}{address}{names}{address} for two affiliation groups, or one \name with superscript affiliation
 * numbers and \address listing each affiliation after its number. The keywords print right after the abstract, in
 * spconf's keywords environment ("Index Terms"), through the kernel's env/abstract/after hook.
 * Kit: class.icassp/main.tex l.65-103 (Latex-Template-Examples).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList, type TitleAffiliation, type TitleAuthor } from '../node.ts';
import key from './key.ts';

type Group = { readonly authors: readonly TitleAuthor[]; readonly affiliations: readonly TitleAffiliation[] };

/** The authors grouped by their set of affiliations, in the order each set first appears. */
const groupsOf = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[]): Group[] => {
  const groups: { authors: TitleAuthor[]; affiliations: TitleAffiliation[]; ids: string }[] = [];
  for (const a of authors) {
    const own = affiliationsOfAuthor(a, affiliations);
    const ids = own.map((f) => f.id).join('\u0000');
    const found = groups.find((g) => g.ids === ids);
    if (found === undefined) groups.push({ authors: [a], affiliations: own, ids });
    else found.authors.push(a);
  }
  return groups;
};

/**
 * A group's address lines: one affiliation as the kit's School \\ Department \\ Address lines (main.tex l.80-82, the
 * department first, as General's affiliation text), several as one line each; the group's e-mails as a last line when asked.
 */
const addressLines = (affiliations: readonly TitleAffiliation[], emails: readonly string[]): string[] => [
  ...(affiliations.length === 1 ? [affiliations[0]?.department ?? '', affiliations[0]?.name ?? '', affiliations[0]?.address ?? ''].filter(Boolean) : affiliations.map((f) => f.text)),
  ...(emails.length === 0 ? [] : [emails.join(', ')]),
];

const emailsOf = (authors: readonly TitleAuthor[], wanted: boolean): string[] => (wanted ? authors.map((a) => a.email).filter(Boolean) : []);

const front = (node: Subject, content: string, p: { readonly [name: string]: unknown }): string[] => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  const groups = groupsOf(authors, affiliations);
  const withEmails = param(p, 'emails', 'none') === 'address';
  // templateSpecific.funding: the kit's \thanks after the names (main.tex l.73, \name{Author(s) Name(s)\thanks{…}}), or
  // \sthanks in \twoauthors (l.79; spconf defines it for the two-address form, classes/icassp.ts, spconf.sty l.181-190).
  const funding = templateField(node, 'funding');
  const asked = param(p, 'groups', 'auto');
  // auto: one group (or none) takes \name and \address, two take \twoauthors, more the superscript form.
  const form = asked !== 'auto' ? asked : groups.length <= 1 ? 'one' : groups.length === 2 ? 'two' : 'superscript';
  const lines = [`\\title{${content.trim()}}`];
  if (form === 'two' && groups.length >= 2) {
    // \twoauthors{names A}{address A}{names B}{address B} (main.tex l.77-86): the first group in the left slot, every later
    // author in the right one, with their affiliations.
    const [first, ...rest] = groups as [Group, ...Group[]];
    const second: Group = { authors: rest.flatMap((g) => g.authors), affiliations: rest.flatMap((g) => g.affiliations).filter((f, i, all) => all.findIndex((x) => x.id === f.id) === i) };
    const names = (g: Group, thanks: string): string => `${g.authors.map((a) => a.name).join(', ')}${thanks === '' ? '' : `\\sthanks{${thanks}}`}`;
    const address = (g: Group): string => addressLines(g.affiliations, emailsOf(g.authors, withEmails)).join('\\\\\n  ');
    lines.push(`\\twoauthors\n  {${names(first, funding)}}\n  {${address(first)}}\n  {${names(second, '')}}\n  {${address(second)}}`);
  } else if (form === 'superscript') {
    // One \name with each author's affiliation numbers as superscripts, names apart by \qquad, and \address with each
    // affiliation after its number, one per line: the usual ICASSP form for three or more addresses.
    const names = authors.map((a) => {
      const marks = affiliationsOfAuthor(a, affiliations).map((f) => affiliationNumber(f, affiliations));
      return `${a.name}${marks.length === 0 ? '' : `$^{${marks.join(',')}}$`}`;
    });
    const places = [...affiliations.map((f) => `$^{${affiliationNumber(f, affiliations)}}$${f.text}`), ...(withEmails && authors.some((a) => a.email !== '') ? [emailsOf(authors, true).join(', ')] : [])];
    lines.push(`\\name{${names.join(' \\qquad ')}${funding === '' ? '' : `\\thanks{${funding}}`}}`, `\\address{${places.join('\\\\\n  ')}}`);
  } else {
    // One \name and one \address (main.tex l.73-74). Always written, even empty: spconf's \maketitle prints \@name and
    // \@address whatever the paper gives.
    lines.push(
      `\\name{${authors.map((a) => a.name).join(', ')}${funding === '' ? '' : `\\thanks{${funding}}`}}`,
      `\\address{${addressLines(affiliations.length > 0 && groups.length <= 1 ? (groups[0]?.affiliations ?? affiliations) : affiliations, emailsOf(authors, withEmails)).join('\\\\\n  ')}}`,
    );
  }
  return lines;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // Everything in the body at the title's place: spconf's \title, \name, \address and \twoauthors only store their text
    // (\gdef) until \maketitle, so the body serves as well as the kit's preamble.
    preamble: () => ({}),
    emit: (node, content) => {
      const keywords = templateList(node, 'keywords');
      // The kit puts \begin{keywords} … \end{keywords} right after the abstract (main.tex l.101-103); spconf's keywords is
      // an environment printing a bold italic "Index Terms—" (spconf.sty l.211-215). The abstract node follows the title, so
      // the keywords wait for its end in the kernel's env/abstract/after hook.
      const hook = keywords.length === 0 ? [] : [`\\AddToHook{env/abstract/after}{\\begin{keywords}${keywords.join(', ')}\\end{keywords}}`];
      return `${[...front(node, content, p), ...hook, '\\maketitle'].join('\n')}\n\n`;
    },
  };
};

export default realize;
