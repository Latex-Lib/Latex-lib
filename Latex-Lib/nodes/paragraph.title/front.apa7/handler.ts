/**
 * front.apa7 (paragraph/title). apa7's own title page: \title, \shorttitle, \leftheader, \authorsnames[…]{…},
 * \authorsaffiliations{…}, \authornote{…} and \keywords, then the class's \maketitle.
 * CTAN: https://ctan.org/pkg/apa7
 *
 * The class's commands only store their text (apa7.cls 2022/07/25 v2.16: \shorttitle is \long\def\@shorttitle{#1},
 * \authornote \long\def\@acks{#1}, \keywords \long\def\@keywords{#1}, \leftheader \def\r@headl{#1}, read from their
 * \meaning under ZeroTeX-NG, 2026-11-07), and \maketitle prints them, so they go in the body just before \maketitle,
 * as the kernel's do (front.class-native). The form is the class example's (Latex-Template-Examples/class.apa7/main.tex
 * l.63-91).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField } from '../node.ts';
import key from './key.ts';

/** \authorsnames reads its names as an etoolbox comma list (\forcsvlist), so a name holding a comma is braced. */
const listItem = (s: string): string => (s.includes(',') ? `{${s}}` : s);

/** An ORCID iD as \href takes it: digits, X and hyphens only (it goes into the link's URL). */
const orcidId = (s: string): string => s.replace(/[^0-9Xx-]/gu, '');

export const lines = (node: Subject, content: string, p: { readonly [name: string]: unknown }): string[] => {
  const title = content.trim();
  const authors = authorsOf(node);
  const affiliations = affiliationsOf(node);
  const out = [`\\title{${title}}`];
  // \shorttitle always: man mode's running head prints \@shorttitle on every page, and without it the class warns "Short
  // title not defined" (ZeroTeX-NG, 2026-11-07). The title itself stands in when the paper gives no short title.
  out.push(`\\shorttitle{${templateField(node, 'shortTitle') || title}}`);
  const runningAuthor = templateField(node, 'runningAuthor');
  if (runningAuthor !== '') out.push(`\\leftheader{${runningAuthor}}`);
  if (authors.length > 0) {
    // Each author's affiliation numbers, braced when several (\authorsnames[1,{1,2},2]{…}, the class example l.66); no
    // optional argument when there is one affiliation or none (both typeset under man, ZeroTeX-NG, 2026-11-07).
    const marks = authors.map((a) => {
      const n = affiliationsOfAuthor(a, affiliations).map((x) => affiliationNumber(x, affiliations));
      // An author with no affiliation among several gets {\relax}: an empty {} stops at "Paragraph ended before \xtwo was
      // complete" and leaving the place out at "Number of Authors does not match number of Supers" (ZeroTeX-NG, 2026-11-07).
      return n.length === 1 ? String(n[0]) : n.length === 0 ? '{\\relax}' : `{${n.join(',')}}`;
    });
    out.push(`\\authorsnames${affiliations.length > 1 ? `[${marks.join(',')}]` : ''}{${authors.map((a) => listItem(a.name)).join(', ')}}`);
  }
  if (affiliations.length > 0) out.push(`\\authorsaffiliations{${affiliations.map((a) => `{${a.text}}`).join(',')}}`);
  // The author note: the ORCID lines, the note's own text, the correspondence line (the class example l.71-79), each its own paragraph.
  const note: string[] = [];
  if (p['orcid'] === true) for (const a of authors) if (orcidId(a.orcid) !== '') note.push(`\\addORCIDlink{${a.name}}{${orcidId(a.orcid)}}`);
  const authorNote = templateField(node, 'authorNote');
  if (authorNote !== '') note.push(authorNote);
  const corresponding = templateField(node, 'correspondingAuthor');
  if (p['correspondence'] === true && corresponding !== '') {
    const who = authors.find((a) => a.email === corresponding || a.name === corresponding);
    if (who === undefined) note.push(`Correspondence concerning this article should be addressed to ${corresponding}.`);
    else {
      const where = affiliationsOfAuthor(who, affiliations)[0]?.text ?? '';
      note.push(`Correspondence concerning this article should be addressed to ${[who.name, where].filter(Boolean).join(', ')}.${who.email === '' ? '' : ` Email: ${who.email}`}`);
    }
  }
  if (note.length > 0) out.push(`\\authornote{${note.join(' \\par ')}}`);
  const keywords = templateField(node, 'keywords');
  if (keywords !== '') out.push(`\\keywords{${keywords}}`);
  return out;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    // No \date: APA's title page prints none, so dateMode and dateText are not read.
    emit: (node, content) => `${lines(node, content, p).join('\n')}\n\\maketitle\n\n`,
  };
};

export default realize;
