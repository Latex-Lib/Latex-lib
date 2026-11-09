/**
 * doc.acm-rights (doc). The acmart family's rights and venue block, in the order ACM's samples give it (samples.dtx l.65-101):
 * \setcopyright, \setcctype, \copyrightyear, \acmYear, then the journal or the conference, \acmBooktitle, \acmISBN and
 * \settopmatter. Every command only sets a key or a macro (acmart.dtx l.5058-5130, 5542, 5600, 5856, 6176-6191, 6433), so the
 * preamble is where the samples put them. Values are the template's own LaTeX and print as given; an empty one prints nothing.
 * The paper's own values (\acmDOI, \acmVolume, \acmNumber, \acmArticle, \acmMonth, \acmSubmissionID) are front.acmart's, from
 * the title's templateSpecific fields, in the body; a \setcopyright or \copyrightyear the paper gives there wins over this one.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

const set = (command: string, value: string): string[] => (value === '' ? [] : [`${command}{${value}}`]);

export const lines = (p: { readonly [name: string]: unknown }): string[] => {
  const v = (name: string): string => param(p, name);
  const aamas = param(p, 'form', 'acmart') === 'aamas';
  const venue = param(p, 'venue', 'none');
  const conference =
    venue === 'proceedings' && v('conferenceName') !== ''
      ? [`\\acmConference${v('conferenceShort') === '' ? '' : `[${v('conferenceShort')}]`}{${v('conferenceName')}}{${v('conferenceDate')}}{${v('conferenceVenue')}}${aamas ? `{${v('conferenceEditors')}}` : ''}`]
      : [];
  return [
    ...set('\\setcopyright', v('copyright')),
    ...(v('ccType') === '' ? [] : [`\\setcctype${v('ccVersion') === '' ? '' : `[${v('ccVersion')}]`}{${v('ccType')}}`]),
    ...set('\\copyrightyear', v('copyrightYear')),
    ...set('\\acmYear', v('acmYear')),
    ...(venue === 'journal' ? set('\\acmJournal', v('journal')) : []),
    ...conference,
    ...(venue === 'proceedings' ? set('\\acmBooktitle', v('booktitle')) : []),
    // AAMAS's block writes \acmDOI{} and \acmISBN{} empty ("do not change!", class.aamas/main.tex l.60-63), which clears the
    // class's sample values; the paper's DOI, from front.acmart in the body, comes later and wins.
    ...(aamas ? ['\\acmDOI{}', `\\acmISBN{${v('isbn')}}`] : set('\\acmISBN', v('isbn'))),
    ...set('\\settopmatter', v('topmatter')),
    // The sample clears the heads right after \begin{document} (class.aamas/main.tex l.87-92); a template carries preamble
    // lines only, so at the same place through \AtBeginDocument. acmart loads fancyhdr itself (acmart.dtx l.7869).
    ...(p['clearHeads'] === true ? ['\\AtBeginDocument{\\pagestyle{fancy}\\fancyhead{}}'] : []),
  ];
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const declarations = lines(p);
  return {
    preamble: () => (declarations.length === 0 ? {} : { declarations }),
    // A document-level way prints nothing in the body.
    emit: () => '',
  };
};

export default realize;
