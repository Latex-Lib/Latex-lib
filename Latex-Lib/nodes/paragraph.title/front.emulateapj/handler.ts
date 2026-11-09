/**
 * front.emulateapj (paragraph/title). emulateapj's title block as its sample paper writes it (class.emulateapj/main.tex
 * l.90-117): \shorttitle and \shortauthors in the preamble; \title, one \author line with \altaffilmark numbers, \affil,
 * \altaffiltext notes and \keywords in the body, with no \maketitle: the class's first \section runs it (emulateapj.cls
 * l.655-662), after any abstract the document gives.
 * CTAN: https://ctan.org/pkg/emulateapj
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAffiliation, TitleAuthor } from '../node.ts';
import key from './key.ts';

/** 'A', 'A and B', 'A, B, and C': the sample's "First Author…, Second Author…, and Third Author" (l.106). */
const joinNames = (names: readonly string[]): string =>
  names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1] ?? ''}`;

/**
 * The numbered notes: each author's affiliations that are not the shared one (one number per affiliation, reused by every
 * author who has it) and each e-mail (a number of its own), numbered in the order the authors name them.
 */
const notesOf = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], shared: TitleAffiliation | undefined, perAuthor: boolean) => {
  const notes: string[] = [];
  const byAffiliation = new Map<string, number>();
  const marks = authors.map((a) => {
    const own: number[] = [];
    // Per author, every affiliation is written as an \affil after the author; only the e-mail is a note.
    for (const f of perAuthor ? [] : affiliationsOfAuthor(a, affiliations).filter((x) => x.id !== shared?.id)) {
      if (!byAffiliation.has(f.id)) byAffiliation.set(f.id, notes.push(f.text));
      own.push(byAffiliation.get(f.id) ?? 0);
    }
    if (a.email !== '') own.push(notes.push(a.email));
    return own;
  });
  return { notes, marks };
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The running heads are only stored (\gdef\@versohead, \gdef\@rectohead, emulateapj.cls l.370-371): the sample sets them in
    // the preamble (l.95-96), where revtex4's \begin{document} leaves them alone (typeset, 2026-11-07: the page head reads the
    // short title). Read from the node, so nothing when the paper gives none.
    preamble: (_params, _parentType, node) => {
      if (node === undefined) return {};
      const short = templateField(node, 'shortTitle');
      const running = templateField(node, 'runningAuthor');
      const lines = [...(short !== '' ? [`\\shorttitle{${short}}`] : []), ...(running !== '' ? [`\\shortauthors{${running}}`] : [])];
      return lines.length > 0 ? { declarations: lines } : {};
    },
    // The rest in the body, before any abstract: revtex4 clears the title, authors and affiliations at \begin{document}, as
    // revtex4-2 and aastex701 do (front.class-native's note), and \keywords and \altaffiltext only store their text for
    // \maketitle (\aftermaketitle@chk, \alt@affil@toks), so they must come before it.
    emit: (node, content) => {
      const affiliations = affiliationsOf(node);
      const authors = authorsOf(node);
      const perAuthor = param(p, 'affiliations', 'affil-marks') === 'per-author';
      // The affiliation every author has (the first such), as the sample's one \affil; with none shared, every affiliation is a note.
      const shared = perAuthor ? undefined : affiliations.find((f) => authors.length > 0 && authors.every((a) => affiliationsOfAuthor(a, affiliations).some((x) => x.id === f.id)));
      const { notes, marks } = notesOf(authors, affiliations, shared, perAuthor);
      const named = authors.map((a, i) => ((marks[i] ?? []).length > 0 ? `${a.name}\\altaffilmark{${(marks[i] ?? []).join(',')}}` : a.name));
      const people = perAuthor
        ? authors.flatMap((a, i) => [`\\author{${named[i] ?? a.name}}`, ...affiliationsOfAuthor(a, affiliations).map((f) => `\\affil{${f.text}}`)])
        : [...(named.length > 0 ? [`\\author{${joinNames(named)}}`] : []), ...(shared !== undefined ? [`\\affil{${shared.text}}`] : [])];
      // The class's Subject headings are separated by em dashes (the sample's "galaxies: clusters: general --- methods: observational").
      const keywords = templateList(node, 'keywords');
      return `${[
        `\\title{${content.trim()}}`,
        ...people,
        ...notes.map((n, i) => `\\altaffiltext{${i + 1}}{${n}}`),
        ...(keywords.length > 0 ? [`\\keywords{${keywords.join(' --- ')}}`] : []),
        ...(param(p, 'maketitle', 'first-section') === 'here' ? ['\\maketitle'] : []),
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
