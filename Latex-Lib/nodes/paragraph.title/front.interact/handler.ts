/**
 * front.interact (paragraph/title). Taylor & Francis' Interact title block as its sample writes it (interactapasample.tex
 * l.39-56): \articletype, \title, one \author{\name{…}\affil{…}} holding every name with its affiliation letter
 * (\textsuperscript{a}) and the corresponding author's \thanks{CONTACT … Email: …}, \received for the article history,
 * then \maketitle, and the keywords, abbreviations and AMS, JEL and PACS code environments.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { affiliationNumber, affiliationsOf, affiliationsOfAuthor, authorsOf, templateField, templateList } from '../node.ts';
import key from './key.ts';

/** The affiliation mark: a, b, … z, then aa, ab, … (the sample's \textsuperscript{a}, \textsuperscript{b}). */
const letter = (n: number): string => {
  let s = '';
  for (let k = n; k > 0; k = Math.floor((k - 1) / 26)) s = String.fromCharCode(97 + ((k - 1) % 26)) + s;
  return s;
};

/** 'A', 'A and B', 'A, B and C': T&F's style, no comma before 'and' (the class's own \and is 'and ', interact.cls l.266). */
const joinNames = (names: readonly string[]): string =>
  names.length <= 2 ? names.join(' and ') : `${names.slice(0, -1).join(', ')} and ${names[names.length - 1] ?? ''}`;

const env = (name: string, text: string): string[] => (text === '' ? [] : [`\\begin{${name}}`, text, `\\end{${name}}`]);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    // interact's \title, \author and \received only store their text for \maketitle (interact.cls l.265-270), so they could go in
    // the preamble; they stand in the body with \maketitle, as the sample writes them (l.39-48), and as front.maketitle does.
    preamble: () => ({}),
    emit: (node, content) => {
      const affiliations = affiliationsOf(node);
      const authors = authorsOf(node);
      // Letters only when there are two affiliations or more: with one, every author shares it and a mark tells nothing.
      const marked = affiliations.length > 1;
      // The corresponding author, named by email or name (the sample's one CONTACT footnote, l.44); the class's \thanks collects a
      // \footnotetext that \maketitle prints with an empty mark (l.276-288).
      const wanted = templateField(node, 'correspondingAuthor');
      const corresponding = wanted === '' ? undefined : authors.find((a) => (a.email !== '' && a.email === wanted) || a.name === wanted);
      const names = authors.map((a) => {
        const letters = marked ? affiliationsOfAuthor(a, affiliations).map((f) => letter(affiliationNumber(f, affiliations))) : [];
        const mark = letters.length > 0 ? `\\textsuperscript{${letters.join(',')}}` : '';
        const thanks = a === corresponding ? `\\thanks{CONTACT ${a.name}.${a.email !== '' ? ` Email: ${a.email}` : ''}}` : '';
        return `${a.name}${mark}${thanks}`;
      });
      // One \affil, the affiliations joined by '; ' each after its letter (l.45).
      const affil = affiliations.map((f) => `${marked ? `\\textsuperscript{${letter(affiliationNumber(f, affiliations))}}` : ''}${f.text}`).join('; ');
      const author =
        names.length > 0 || affil !== ''
          ? ['\\author{', ...(names.length > 0 ? [`\\name{${joinNames(names)}}`] : []), ...(affil !== '' ? [`\\affil{${affil}}`] : []), '}']
          : [];
      const articleType = templateField(node, 'articleType');
      // The article history: \received sets what \maketitle prints under ARTICLE HISTORY, else "Compiled \today" (l.267-270, 305).
      const history = templateField(node, 'history');
      const anonymous = p['anonymous'] === true;
      // The sample's double-blind form: \maketitle between \title and \author hides the names and affiliations (l.105-106);
      // \maketitle then empties \@author (l.288) and the \author after it is stored for nothing.
      const head = [...(articleType !== '' ? [`\\articletype{${articleType}}`] : []), `\\title{${content.trim()}}`];
      const front = anonymous
        ? [...head, ...(history !== '' ? [`\\received{${history}}`] : []), '\\maketitle', ...author]
        : [...head, ...author, ...(history !== '' ? [`\\received{${history}}`] : []), '\\maketitle'];
      // The environments the class defines after the title (l.493-526). The sample sets the keywords after the abstract (l.50-56),
      // and the abbreviations right after it (l.143); a title way stands before the abstract node, so here they precede it.
      return `${[
        ...front,
        ...env('keywords', templateList(node, 'keywords').join(param(p, 'keywordSeparator', '; '))),
        ...env('abbreviations', templateField(node, 'abbreviations', '; ')),
        ...env('amscode', templateField(node, 'amsCodes', '; ')),
        ...env('jelcode', templateField(node, 'jelCodes', '; ')),
        ...env('pacscode', templateField(node, 'pacsCodes', '; ')),
      ].join('\n')}\n\n`;
    },
  };
};

export default realize;
