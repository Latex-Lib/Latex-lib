/**
 * front.ieeetran-journal (paragraph/title). IEEEtran's journal title block as bare_jrnl.tex (l.361-442) and bare_jrnl_compsoc.tex
 * (l.402-485) write it: \title, one \author holding the names ("A,~\IEEEmembership{Member,~IEEE,} B and~C") followed, with no
 * space, by the affiliations as \thanks notes (or, under compsoc, one \IEEEcompsocitemizethanks of \IEEEcompsocthanksitem's),
 * the funding, the corresponding author and the "Manuscript received" line; \markboth for the running heads, \IEEEpubid, then
 * \maketitle. The index terms (IEEEkeywords) follow the abstract, or go into the compsoc title area; the biographies
 * (IEEEbiography) are written at \end{document}, after the references, where the template puts them (l.683-698).
 * CTAN: https://ctan.org/pkg/ieeetran
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAffiliation, TitleAuthor } from '../node.ts';
import key from './key.ts';
import { biographiesOf, membershipOf, nameList, namesAuthor, runningAuthorOf } from './records.ts';

/** A name or grade kept on one line, as the template writes them ("Michael~Shell", "Member,~IEEE"). */
const tied = (s: string): string => s.replace(/ +/gu, '~');

/**
 * The names: a comma after each but the last (when there are more than two, or the author has a grade), "and~" before the
 * last, and each grade as ",~\IEEEmembership{grade}" with the comma inside its braces, as bare_jrnl.tex l.373-375 does.
 */
const nameLines = (node: Subject, authors: readonly TitleAuthor[]): string[] =>
  authors.map((a, i) => {
    const last = i === authors.length - 1;
    const grade = membershipOf(node, a);
    const comma = !last && (authors.length > 2 || grade !== '') ? ',' : '';
    return `${last && i > 0 ? 'and~' : ''}${tied(a.name)}${grade !== '' ? `,~\\IEEEmembership{${tied(grade)}${comma}}` : comma}`;
  });

/**
 * One sentence per affiliation, naming its authors: "A and B are with the Department, Institution, Address (e-mail: a, b)."
 * (bare_jrnl.tex l.376-379). An author's e-mail is given once, at the first affiliation that names them; an affiliation no
 * author names is left out. Under compsoc the e-mails go on their own line, "\protect\\ E-mail: …" (bare_jrnl_compsoc.tex
 * l.405-410).
 */
const affiliationNotes = (authors: readonly TitleAuthor[], affiliations: readonly TitleAffiliation[], compsoc: boolean): string[] => {
  const mailed = new Set<string>();
  return affiliations.flatMap((f) => {
    const theirs = authors.filter((a) => affiliationsOfAuthor(a, affiliations).some((x) => x.id === f.id));
    if (theirs.length === 0) return [];
    const emails = theirs.filter((a) => a.email !== '' && !mailed.has(a.email)).map((a) => a.email);
    emails.forEach((e) => mailed.add(e));
    const where = `${f.department !== '' ? 'the ' : ''}${f.text}`;
    const sentence = `${nameList(theirs.map((a) => a.name))} ${theirs.length > 1 ? 'are' : 'is'} with ${where}`;
    if (compsoc) return [`${sentence}.${emails.length > 0 ? `\\protect\\\\ E-mail: ${emails.join(', ')}` : ''}`];
    return [`${sentence}${emails.length > 0 ? ` (e-mail: ${emails.join(', ')})` : ''}.`];
  });
};

/** The corresponding author's note: the author templateSpecific.correspondingAuthor names (by name or e-mail), with their e-mail. */
const correspondingNote = (node: Subject, authors: readonly TitleAuthor[]): string => {
  const value = templateField(node, 'correspondingAuthor');
  if (value === '') return '';
  const a = authors.find((x) => namesAuthor(x, value));
  if (a === undefined) return `Corresponding author: ${value}.`;
  return `Corresponding author: ${a.name}${a.email !== '' ? ` (e-mail: ${a.email})` : ''}.`;
};

/** The received line: as the paper writes it, or after "Manuscript received" when it gives only the dates (bare_jrnl.tex l.379). */
const receivedNote = (node: Subject): string => {
  const value = templateField(node, 'received', '; ');
  return value === '' ? '' : /^manuscript\b/iu.test(value) ? value : `Manuscript received ${value}`;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const compsoc = param(p, 'thanks', 'plain') === 'compsoc';
  const keywordsAt = param(p, 'keywords', 'after-abstract');
  const biographies = param(p, 'biographies', 'end') === 'end';

  /** IEEEbiography with the photo (bare_jrnl.tex l.680, the template's photo size) or IEEEbiographynophoto (l.689-691). */
  const biographyLines = (node: Subject): string[] => {
    const authors = authorsOf(node);
    return biographiesOf(node).map((b) => {
      const name = authors.find((a) => namesAuthor(a, b.author))?.name ?? b.author;
      return b.photo !== ''
        ? `\\begin{IEEEbiography}[{\\includegraphics[width=1in,height=1.25in,clip,keepaspectratio]{${b.photo}}}]{${name}}\n${b.text}\n\\end{IEEEbiography}`
        : `\\begin{IEEEbiographynophoto}{${name}}\n${b.text}\n\\end{IEEEbiographynophoto}`;
    });
  };

  return {
    // The biographies close the document, after the reference list, as the template has them (bare_jrnl.tex l.683-698): Flouest's
    // document has no place after its references, so they go to \AtEndDocument, with graphicx only when one has a photo
    // (IEEEtran loads no graphics package).
    preamble: (_params, _parentType, node) => {
      if (node === undefined || !biographies) return {};
      const lines = biographyLines(node);
      if (lines.length === 0) return {};
      return {
        ...(biographiesOf(node).some((b) => b.photo !== '') ? { packages: ['\\usepackage{graphicx}'] } : {}),
        declarations: [`\\AtEndDocument{${lines.join('\n')}}`],
      };
    },
    // In the body, just before \maketitle, as front.class-native writes the title block: IEEEtran's \title, \author, \markboth and
    // \IEEEpubid only store their text until \maketitle (IEEEtran.cls l.4360, 6153).
    emit: (node, content) => {
      const authors = authorsOf(node);
      const affiliations = affiliationsOf(node);
      const field = (name: string): string => templateField(node, name);

      // The notes, in the template's order: the affiliations first, the received line last (bare_jrnl.tex l.376-379; compsoc
      // gathers the affiliations into one itemized note, bare_jrnl_compsoc.tex l.405-412). Under the plain journal format
      // \IEEEcompsocitemizethanks is \thanks (IEEEtran.cls l.4910), so the compsoc form compiles there too.
      const places = affiliationNotes(authors, affiliations, compsoc);
      const notes = [
        ...(compsoc ? (places.length > 0 ? [`\\IEEEcompsocitemizethanks{${places.map((t) => `\\IEEEcompsocthanksitem ${t}`).join('\n')}}`] : []) : places.map((t) => `\\thanks{${t}}`)),
        ...(field('funding') !== '' ? [`\\thanks{${field('funding')}}`] : []),
        ...(correspondingNote(node, authors) !== '' ? [`\\thanks{${correspondingNote(node, authors)}}`] : []),
        ...(receivedNote(node) !== '' ? [`\\thanks{${receivedNote(node)}}`] : []),
      ];
      // Every note follows the last name with no space between them: "% <-this % stops a space" (bare_jrnl.tex l.375-379).
      const names = nameLines(node, authors);
      const author = names.length > 0 || notes.length > 0 ? [`\\author{${names.join('\n')}${notes.map((n) => `%\n${n}`).join('')}}`] : [];

      // The running heads (bare_jrnl.tex l.403-404): the journal's line on the left, "Surname et al.: short title" on the right.
      const running = field('runningAuthor') || runningAuthorOf(authors, '\\MakeLowercase{\\textit{et al.}}');
      const short = field('shortTitle') || content.trim();
      const heads = [`\\markboth{${field('journalHead')}}%\n{${running !== '' ? `${running}: ` : ''}${short}}`];
      // The publisher's ID mark at the foot of the first page (bare_jrnl.tex l.418-420). The template asks for \IEEEpubidadjcol in
      // the second column to clear it, which no title way can place: a long first column may run into the mark.
      const pubid = field('pubid') !== '' ? [`\\IEEEpubid{${field('pubid')}}`] : [];

      // The index terms. after-abstract: IEEEkeywords right after the abstract, as bare_jrnl.tex l.435-442 has them, through the
      // kernel's environment hook, once; and before the first \section when no abstract came first. index-text (the compsoc
      // journal): the terms in \LatexLibIndexTerms, which abs.ieee-indextext adds to the \IEEEtitleabstractindextext it stores;
      // when no abstract stored one, the terms alone are the title area's text (IEEEtran.cls l.5226-5227, 4834).
      const keywords = templateList(node, 'keywords');
      const terms = `\\begin{IEEEkeywords}\n${keywords.join(', ')}\n\\end{IEEEkeywords}`;
      const index =
        keywords.length === 0
          ? []
          : keywordsAt === 'index-text'
            ? [`\\def\\LatexLibIndexTerms{${terms}}`, '\\expandafter\\ifx\\csname @IEEEtitleabstractindextext\\endcsname\\relax\\IEEEtitleabstractindextext{\\LatexLibIndexTerms}\\fi']
            : [
                `\\gdef\\LatexLibIEEEKeywords{\\global\\let\\LatexLibIEEEKeywords\\relax${terms}}`,
                '\\AddToHookNext{env/abstract/after}{\\LatexLibIEEEKeywords}',
                '\\AddToHookNext{cmd/section/before}{\\LatexLibIEEEKeywords}',
              ];
      return `${[`\\title{${content.trim()}}`, ...author, ...heads, ...pubid, ...index, '\\maketitle'].join('\n')}\n\n`;
    },
  };
};

export default realize;
