/**
 * front.asmeconf (paragraph/title). asmeconf's own title block, where the title stands: \PaperNo, \title, \SetAuthors
 * with \affil{n}, \JointFirstAuthor and \CorrespondingAuthor{email} after the names, \SetAffiliation{n}{…}, \maketitle,
 * then \versionfootnote{date} and \keywords{…} (asmeconf-template.tex l.148-196).
 * Source: Latex Related Research/Latex-lib-main/Source/0909-asmeconf/asmeconf.cls (v1.46, 2026/01/10).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, peopleOf, templateField } from '../node.ts';
import key from './key.ts';
import { correspondingOf, jointFirstOf } from './people.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const grid = param(p, 'authorBlock', 'inline') === 'grid';
  return {
    // Nothing in the preamble: the class defines every command (asmeconf.cls l.1593-1634, 1700-1800, 2053-2195). The lines go in
    // the body, before the abstract, as the template sets them: \maketitle starts the two columns with \twocolumn[…] (l.2150-2163),
    // the version footnote must follow it, and \keywords must come before \end{abstract}, which prints them (l.1626-1631).
    preamble: () => ({}),
    emit: (node, content) => {
      const authors = authorsOf(node);
      const affiliations = affiliationsOf(node);
      const corresponding = correspondingOf(node, authors);
      const joint = jointFirstOf(node, authors);
      const lastCorresponding = corresponding.indexes[corresponding.indexes.length - 1];
      // The marks after a name, in the template's order: affiliation, joint first author, corresponding author (template l.169-175). Several
      // corresponding authors each take \CorrespondingAuthor{}, the last one all their emails (template l.165, 174): the class prints one
      // footnote, from the last call (l.1779-1786).
      const marks = (i: number, affils: readonly string[]): string =>
        `${affils.map((n) => `\\affil{${n}}`).join('')}${joint.includes(i) ? '\\JointFirstAuthor' : ''}${corresponding.indexes.includes(i) ? `\\CorrespondingAuthor{${i === lastCorresponding ? corresponding.emails.join(', ') : ''}}` : ''}`;
      let names: string[];
      let setAffiliations: string[];
      if (grid) {
        // [grid] (l.1808-2038): \SetAuthors splits its argument at commas into author blocks (\SplitList, l.1837), so a name with a
        // comma is braced (examples/asmeconf-authorgrid-example.tex l.523); each block shows the address of its first \affil only (l.1857-1877), and
        // \SetAffiliation{n} fills the n-th block's slot (\seq_gset_item, l.1883-1889), so n may not exceed the number of blocks.
        // So each author gets their own block number, and its address holds every affiliation of theirs, one per line (\\, as
        // the grid example's addresses break, authorgrid example l.180-183). The class lays out at most fifteen blocks (l.1983-1989).
        names = authors.map((a, i) => `${a.name.includes(',') ? `{${a.name}}` : a.name}${marks(i, affiliationsOfAuthor(a, affiliations).length > 0 ? [String(i + 1)] : [])}`);
        setAffiliations = authors.flatMap((a, i) => {
          const own = affiliationsOfAuthor(a, affiliations);
          return own.length > 0 ? [`\\SetAffiliation{${i + 1}}{${own.map((f) => f.text).join(' \\\\ ')}}`] : [];
        });
      } else {
        // Inline (the default, l.2040-2141): the names in one centred paragraph, each affiliation footnote-marked by its number
        // (consecutive marks get commas from the class, l.2099-2114). One affiliation shared by every author takes no mark at all:
        // \SetAffiliation{}{…} (template l.162).
        const shared = affiliations.length === 1 && authors.every((a) => affiliationsOfAuthor(a, affiliations).length === 1);
        names = authors.map((a, i) => `${a.name}${marks(i, shared ? [] : affiliationsOfAuthor(a, affiliations).map((f) => String(affiliationNumber(f, affiliations))))}`);
        setAffiliations = affiliations.map((f) => `\\SetAffiliation{${shared ? '' : affiliationNumber(f, affiliations)}}{${f.text}}`);
      }
      const paperNumber = templateField(node, 'paperNumber');
      const keywords = templateField(node, 'keywords', ', ');
      const { date } = peopleOf(node);
      return `${[
        ...(paperNumber !== '' ? [`\\PaperNo{${paperNumber}}`] : []),
        `\\title{${content.trim()}}`,
        ...(names.length > 0 ? [`\\SetAuthors{%\n  ${names.join(',\n  ')}}`] : []),
        ...setAffiliations,
        '\\maketitle',
        // asmeconf's \date is this unmarked footnote (l.2193-2195), and \thanks does nothing (l.2184), so neither is written.
        ...(date !== '' ? [`\\versionfootnote{${date}}`] : []),
        ...(keywords !== '' ? [`\\keywords{${keywords}}`] : []),
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
