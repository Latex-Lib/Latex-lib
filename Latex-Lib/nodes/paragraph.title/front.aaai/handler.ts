/**
 * front.aaai (paragraph/title). AAAI's own title block (aaai2027.sty on article): \title (with a \thanks when the paper
 * gives one), \author with the authors joined by commas, each with \equalcontrib, \corresponding and
 * \textsuperscript{\rm 1,\rm 2} as the style's instructions write them, \affiliations{…} with the numbered affiliations
 * and the authors' e-mails on the last line, then the style's \maketitle.
 * Not on CTAN: AAAI's AuthorKit (aaai2027.sty; anonymous-submission-latex-2026.tex l.94-166, 483-523).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

const count = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.floor(v) : 0);

const front = (node: Subject, content: string, lineBreakEvery: number): string => {
  const affiliations = affiliationsOf(node);
  const authors = authorsOf(node);
  // The marks, by name or email (templateSpecific.equalContrib, a list; templateSpecific.correspondingAuthor). \equalcontrib and
  // \corresponding are defined only inside the style's \@maketitle (aaai2027.sty l.139-155, in the \author text it sets), each
  // printing one footnote ("These authors contributed equally.", "Corresponding author.") and then \footnotemark.
  const equal = templateList(node, 'equalContrib');
  const corresponding = templateList(node, 'correspondingAuthor');
  const marked = (list: readonly string[], a: { readonly name: string; readonly email: string }): boolean => list.includes(a.name) || (a.email !== '' && list.includes(a.email));
  // With more than one affiliation each author carries their numbers, \textsuperscript{\rm 1,\rm 2}, with no space before
  // it and the comma after it (anon.tex l.487-491, CameraReady l.147); with one affiliation no number at all (anon.tex l.129-139).
  const numbered = affiliations.length > 1;
  const people = authors.map((a) => {
    const numbers = numbered ? affiliationsOfAuthor(a, affiliations).map((f) => `\\rm ${affiliationNumber(f, affiliations)}`) : [];
    return `${a.name}${marked(equal, a) ? '\\equalcontrib' : ''}${marked(corresponding, a) ? '\\corresponding' : ''}${numbers.length > 0 ? `\\textsuperscript{${numbers.join(',')}}` : ''}`;
  });
  // Authors joined by ",\n", never \and: the style's \@maketitle sets \@author in a centred \vbox, not article's tabular, so
  // \and would close a tabular that was never opened (aaai2027.sty l.130-206: l.163, 201). A \\ after every n-th author breaks the line,
  // as the template does by hand (anon.tex l.98-100, 489).
  const authorText = people.map((p, i) => `${p}${i < people.length - 1 ? `,${lineBreakEvery > 0 && (i + 1) % lineBreakEvery === 0 ? '\\\\' : ''}` : ''}`).join('\n');
  // \affiliations: one affiliation as its lines (department, name, address), several each on a line after its number
  // (anon.tex l.107-126, 134-138, 494-498); then one roman line of the authors' e-mails, joined by commas (l.122-123, 154, 499-502).
  const lines = numbered
    ? affiliations.map((f) => `\\textsuperscript{\\rm ${affiliationNumber(f, affiliations)}}${f.text}`)
    : affiliations.flatMap((f) => [f.department, f.name, f.address].filter(Boolean));
  const emails = authors.map((a) => a.email).filter(Boolean);
  const affiliationText = [...lines, ...(emails.length > 0 ? [emails.join(', ')] : [])].join('\\\\\n');
  const thanks = templateField(node, 'thanks');
  return [
    `\\title{${content.trim()}${thanks === '' ? '' : `\\thanks{${thanks}}`}}`,
    ...(authors.length > 0 ? [`\\author{\n${authorText}\n}`] : []),
    ...(affiliationText !== '' ? [`\\affiliations{\n${affiliationText}\n}`] : []),
  ].join('\n');
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // The title lines go in the body, just before \maketitle, as front.class-native writes them. \affiliations stores its text
    // with a local \def (aaai2027.sty l.128), which holds there: \maketitle follows in the same group. In the submission
    // mode the style itself prints "Anonymous submission" for the authors and hides \affiliations (l.128, 131).
    preamble: () => ({}),
    emit: (node, content) => `${front(node, content, count(p['lineBreakEvery']))}\n\\maketitle\n\n`,
  };
};

export default realize;
