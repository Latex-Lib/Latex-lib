/**
 * front.revtex (paragraph/title). The author-then-affiliation title block of REVTeX 4.2 (APS, AIP) and of quantumarticle,
 * which copies its syntax: \preprint, \title[short]{…} and a title \thanks, then per author \author{…} with its \email (and,
 * under quantumarticle, \orcid), each run of authors sharing their institutes followed by one \affiliation per institute
 * (\noaffiliation under revtex for none), \collaboration, \date, \keywords and \pacs, and \maketitle unless the abstract
 * way runs it after the abstract (revtex keeps the abstract for \maketitle and must read it first).
 * CTAN: https://ctan.org/pkg/revtex, https://ctan.org/pkg/quantumarticle
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { dataOf, param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField, templateList, type TitleAffiliation, type TitleAuthor } from '../node.ts';
import key from './key.ts';

const line = (command: string, value: string): string[] => (value === '' ? [] : [`\\${command}{${value}}`]);

/** Whether the author is the one templateSpecific.correspondingAuthor names (by e-mail or by name). */
const names = (author: TitleAuthor, value: string): boolean => value !== '' && (author.email === value || author.name === value);

const ORCID = /^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/u;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const revtex = param(p, 'form', 'revtex') === 'revtex';
  const alt = param(p, 'secondaryAffiliation', 'affiliation') === 'altaffiliation';

  const body = (node: Subject, content: string): string => {
    const authors = authorsOf(node);
    const affiliations = affiliationsOf(node);
    const correspondingValue = templateField(node, 'correspondingAuthor');
    const prefix = param(p, 'correspondingText', '');
    const emails = param(p, 'emails', 'all');

    // The institutes \affiliation lists after an author: all of them, or only the first when the others go to \altaffiliation.
    const primary = (a: TitleAuthor): TitleAffiliation[] => affiliationsOfAuthor(a, affiliations).slice(0, alt ? 1 : undefined);
    // Runs of consecutive authors with the same institutes: revtex and quantumarticle give an \affiliation to every author since
    // the last one (revtex4-2.cls l.2227-2240, the AF@grp; quantumarticle.cls l.1164-1171, \@authorgroup), so a run shares one
    // set of lines, as apstemplate.tex l.35-60 writes them; groupedaddress and superscriptaddress both read it.
    const runs: TitleAuthor[][] = [];
    for (const a of authors) {
      const last = runs[runs.length - 1];
      const same = (b: TitleAuthor): boolean => primary(b).map((x) => x.id).join('\n') === primary(a).map((x) => x.id).join('\n');
      if (last !== undefined && last[0] !== undefined && same(last[0])) last.push(a);
      else runs.push([a]);
    }

    // Each author's own lines, filed by the class under the \author just before (revtex4-2.cls l.2404-2422: \email, \altaffiliation
    // join the current author; quantumarticle.cls l.1220-1231 stops when \email or \orcid comes before the first \author).
    const author = (a: TitleAuthor): string[] => {
      const isCorresponding = names(a, correspondingValue);
      const email = a.email !== '' && (emails === 'all' || isCorresponding) ? [`\\email${isCorresponding && prefix !== '' ? `[${prefix}]` : ''}{${a.email}}`] : [];
      const others = alt ? affiliationsOfAuthor(a, affiliations).slice(1) : [];
      return [
        `\\author{${a.name}}`,
        // quantumarticle's \orcid links the author's name to the ORCID page (l.1110, 1229-1231); revtex4-2 has no ORCID command.
        ...(!revtex && ORCID.test(a.orcid) ? [`\\orcid{${a.orcid}}`] : []),
        ...email,
        ...others.map((x) => `\\altaffiliation[${param(p, 'altaffiliationText', 'Also at ')}]{${x.text}}`),
      ];
    };
    const run = (group: readonly TitleAuthor[]): string[] => {
      const own = group[0] === undefined ? [] : primary(group[0]);
      // revtex warns "Assuming \noaffiliation for authors" and moves on (l.2198-2207); \noaffiliation says so. quantumarticle has none.
      return [...group.flatMap(author), ...(own.length > 0 ? own.map((x) => `\\affiliation{${x.text}}`) : revtex ? ['\\noaffiliation'] : [])];
    };

    // The date: the node's own (dateMode custom), else \today when the preset asks for it (apstemplate.tex l.69: revtex's own
    // default date is empty, l.2520-2521), else none. A \date{} would still print revtex's "Dated:" prefix, so none writes nothing;
    // quantumarticle's default is already \date{} (l.221), and its \today stops at a ClassError (l.296-307).
    const date = peopleOf(node).date;
    const dateLine = date !== '' ? [`\\date{${date}}`] : param(p, 'date', 'given') === 'today' && dataOf(node)['dateMode'] !== 'none' ? ['\\date{\\today}'] : [];
    const keywords = templateList(node, 'keywords').join(param(p, 'keywordSeparator', ', '));
    const short = templateField(node, 'shortTitle');

    return [
      // \preprint, the title \thanks and \pacs are revtex's (l.2530-2537, 2416); quantumarticle defines no \preprint or \pacs and
      // takes \thanks for an author only (l.1226-1228).
      ...(revtex ? templateList(node, 'preprint').map((x) => `\\preprint{${x}}`) : []),
      `\\title${short === '' ? '' : `[${short}]`}{${content.trim()}}`,
      ...(revtex ? line('thanks', templateField(node, 'titleNote')) : []),
      ...runs.flatMap(run),
      ...templateList(node, 'collaboration').flatMap((c) => [`\\collaboration{${c}}`, ...(revtex ? ['\\noaffiliation'] : [])]),
      ...dateLine,
      ...line('keywords', keywords),
      ...(revtex ? line('pacs', templateList(node, 'pacs').join(', ')) : []),
    ].join('\n');
  };

  return {
    // In the body, where the title stands: revtex4-2 resets the title, the authors and the affiliations at \begin{document}
    // (revtex4-2.cls l.2121-2126, 2154, 2382), as front.class-native notes.
    preamble: () => ({}),
    // after-abstract: \maketitle is the abstract way's, after \begin{abstract} … \end{abstract}, which revtex stores in \absbox for
    // \maketitle and undefines after it (l.2548-2574, 2685; apstemplate.tex l.71-79 "\maketitle must follow title, authors,
    // abstract, and keywords").
    emit: (node, content) => `${body(node, content)}${param(p, 'maketitle', 'here') === 'here' ? '\n\\maketitle' : ''}\n\n`,
  };
};

export default realize;
