/**
 * front.acmart (paragraph/title). The acmart family's title block as samples.dtx (l.170-253, 330-399) and ACM's templates write
 * it: the paper's rights and identifiers, \title[short]{…}, \subtitle, one \author per author with \authornote, \correspondingauthor,
 * \email and \orcid, an \affiliation{\institution…\country} per affiliation, \thanks, \ccsdesc, \keywords and \received, then
 * \maketitle and the running authors (\shortauthors). Everything before \maketitle is only stored for it, so all of it is written
 * where the title stands, just before \maketitle, as front.class-native writes the class's title block.
 * CTAN: https://ctan.org/pkg/acmart
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import type { TitleAffiliation, TitleAuthor } from '../node.ts';
import key from './key.ts';
import { authorNotesOf, ccsConceptsOf, receivedOf, urlOf } from './records.ts';

/**
 * One affiliation. acmart stops at \maketitle with "No country present for an affiliation" (\@ACM@checkaffil, acmart.dtx
 * l.7354-7364), and in the journal formats an empty \country{} is not present either (l.7173-7175): typeset, \country{} stopped
 * under manuscript and acmsmall (2026-11-07). So the address's last comma part is the \country, its first the \city (a warning
 * when missing) and any between them the \state, as ACM's templates split it; no \streetaddress or \postcode, which the class
 * ignores with a warning (l.7160-7165). An affiliation with no address has no country to give, and goes to
 * \additionalaffiliation{…}, the class's footnote form (l.5316-5333), which checks none.
 */
const affiliationLines = (f: TitleAffiliation, inInstitution: boolean): string[] => {
  const institution = inInstitution ? [f.department, f.name].filter(Boolean).join(', ') : f.name !== '' ? f.name : f.department;
  const parts = f.address.split(/\s*,\s*/u).filter(Boolean);
  const inner = [
    ...(institution !== '' ? [`\\institution{${institution}}`] : []),
    ...(!inInstitution && f.name !== '' && f.department !== '' ? [`\\department{${f.department}}`] : []),
    ...(parts.length >= 2 ? [`\\city{${parts[0] ?? ''}}`] : []),
    ...(parts.length >= 3 ? [`\\state{${parts.slice(1, -1).join(', ')}}`] : []),
    ...(parts.length >= 1 ? [`\\country{${parts[parts.length - 1] ?? ''}}`] : []),
  ];
  return parts.length === 0 ? [`\\additionalaffiliation{${inner.join(' ')}}`] : ['\\affiliation{%', ...inner.map((l) => `  ${l}`), '}'];
};

/** Whether an author is the one a field names, by e-mail or by name (both escaped alike). */
const names = (a: TitleAuthor, v: string): boolean => (a.email !== '' && a.email === v) || a.name === v;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const on = (name: string): boolean => p[name] === true;
  return {
    // acmart's title commands only store their text until \maketitle, so the body serves; nothing goes in the preamble, where a
    // template's own constants (\acmConference, \acmBooktitle, \acmISBN) stand.
    preamble: () => ({}),
    emit: (node, content) => {
      const field = (name: string): string => templateField(node, name);
      const set = (command: string, name: string): string[] => (field(name) !== '' ? [`${command}{${field(name)}}`] : []);
      const affiliations = affiliationsOf(node);
      const authors = authorsOf(node);
      const inInstitution = param(p, 'department', 'department') === 'in-institution';

      // The paper's rights and identifiers, each only when the paper gives it (samples.dtx l.330-358); none under PVLDB's
      // nonacm, which drops ACM's rights block (acmart l.115-126), whose own per-paper values pvldb.sty takes instead.
      const rights = on('rights')
        ? [
            ...set('\\setcopyright', 'copyright'),
            ...set('\\copyrightyear', 'copyrightYear'),
            ...set('\\acmDOI', 'doi'),
            ...set('\\acmVolume', 'volume'),
            ...set('\\acmNumber', 'issue'),
            ...set('\\acmArticle', 'articleNumber'),
            ...set('\\acmMonth', 'month'),
            ...set('\\acmSubmissionID', 'submissionId'),
          ]
        : [];
      // The values pvldb.sty's \vldbtopmatter prints after \maketitle (the setting's command hook; class.vldb/main.tex l.17-31).
      const url = urlOf(node, 'availabilityUrl');
      const vldb = on('pvldb')
        ? [...(field('vldbDoi') !== '' ? [`\\renewcommand\\vldbdoi{${field('vldbDoi')}}`] : []), ...(field('vldbPages') !== '' ? [`\\renewcommand\\vldbpages{${field('vldbPages')}}`] : []), ...(url !== '' ? [`\\renewcommand\\vldbavailabilityurl{${url}}`] : [])]
        : [];

      const short = field('shortTitle');
      const title = [`\\title${short !== '' ? `[${short}]` : ''}{${content.trim()}}`, ...set('\\subtitle', 'subtitle')];

      // Author notes: a note's first author writes \authornote{…}, every later author with the same text \authornotemark[n], n its
      // footnote number (samples.dtx l.181-187: "Both authors contributed equally"). A note naming no author is the first author's.
      const notes = authorNotesOf(node);
      const numbered = new Map<string, number>();
      const corresponding = templateList(node, 'correspondingAuthor');
      const person = (a: TitleAuthor, i: number): string[] => [
        `\\author{${a.name}}`,
        ...notes
          .filter((n) => (n.author === '' ? i === 0 : names(a, n.author)))
          .map((n) => {
            const n0 = numbered.get(n.text);
            if (n0 !== undefined) return `\\authornotemark[${n0}]`;
            numbered.set(n.text, numbered.size + 1);
            return `\\authornote{${n.text}}`;
          }),
        // acmart v2.18 (acmart.dtx l.5464-5471): an envelope after the author's name; ACM asks for the author's e-mail beside it.
        ...(corresponding.some((v) => names(a, v)) ? ['\\correspondingauthor'] : []),
        ...(a.email !== '' ? [`\\email{${a.email}}`] : []),
        ...(a.orcid !== '' ? [`\\orcid{${a.orcid}}`] : []),
      ];
      // Authors in a row with the same affiliations share one block after the last of them (samples.dtx l.181-194), or each
      // repeats them (the acmtog, aamas and PVLDB templates). An author with none closes the group with none.
      const shared = param(p, 'authorGrouping', 'shared') === 'shared';
      const ids = (a: TitleAuthor): string => affiliationsOfAuthor(a, affiliations).map((f) => f.id).join('\u0000');
      const people = authors.flatMap((a, i) => {
        const next = authors[i + 1];
        const closes = !shared || next === undefined || ids(next) !== ids(a) || ids(a) === '';
        return [...person(a, i), ...(closes ? affiliationsOfAuthor(a, affiliations).flatMap((f) => affiliationLines(f, inInstitution)) : [])];
      });

      // CCS concepts: \ccsdesc[significance]{General~Specific} (acmart.dtx l.6018); the CCSXML block is not written: the class
      // discards it (a comment environment) and its concept ids are not among the paper's fields.
      const ccs = on('ccs') ? ccsConceptsOf(node).map((c) => `\\ccsdesc${c.significance !== '' ? `[${c.significance}]` : ''}{${c.concept}}`) : [];
      const keywords = templateList(node, 'keywords');
      // \received{date} prints "Received date", a later unlabelled one "; revised date", \received[kind]{date} "kind date"
      // (acmart.dtx l.5893-5911), at the end of the document.
      const received = on('received') ? receivedOf(node).map((r, i) => (r.kind === '' || (i === 0 && /^received$/iu.test(r.kind)) ? `\\received{${r.date}}` : `\\received[${r.kind}]{${r.date}}`)) : [];
      const running = field('runningAuthor');
      return `${[
        ...rights,
        ...vldb,
        ...title,
        ...people,
        ...set('\\thanks', 'thanks'),
        ...ccs,
        ...(keywords.length > 0 ? [`\\keywords{${keywords.join(param(p, 'keywordSeparator', ', '))}}`] : []),
        ...received,
        '\\maketitle',
        // After \maketitle, as the class guide puts it (acmart.dtx l.1144-1150): \author keeps rebuilding \shortauthors until then.
        ...(running !== '' ? [`\\renewcommand{\\shortauthors}{${running}}`] : []),
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
