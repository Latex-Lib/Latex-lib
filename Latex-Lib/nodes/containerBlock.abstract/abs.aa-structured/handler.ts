/**
 * abs.aa-structured (containerBlock/abstract). Astronomy & Astrophysics' structured abstract, \abstract{context}{aims}{methods}
 * {results}{conclusions} in the preamble, which aa's \maketitle prints under its own run-in headings (aa.cls l.479-483,
 * l.1145-1169). The abstract's paragraphs go to the slots their opening labels name (slots.ts); an abstract that is not
 * structured falls back to the one-argument \abstract{…}, as abs.class-native's command form writes it.
 * Not on CTAN: A&A's macro package (aa.cls, testing-pipeline/settings/classes/files/aa.cls).
 */
import type { Realization } from '../../../schema/realization.ts';
import { CLASS_ABSTRACT_HERE } from '../node.ts';
import { slotsOf } from './slots.ts';

/** The macro holding each slot's text. */
const MACROS = ['\\libAaContext', '\\libAaAims', '\\libAaMethods', '\\libAaResults', '\\libAaConclusions'] as const;

// Each slot is handed to \abstract as a \protected macro, as abs.class-native hands its one argument (its handler's note): aa
// expands every slot at once to count the words (\protected@xdef\aa@abstractwords, aa.cls l.826-833), and a fragile command in
// the text broke there; a \protected macro is left alone and expands where \maketitle prints it. An empty slot stays a literal
// {}: aa leaves out Context and Conclusions only when they are empty (\ifx\aa@abstract@i\longempty, l.1148, 1162), which a macro
// never is. aa's \abstract takes the four further slots only when a brace follows the first (\@ifnextchar\bgroup, l.814-817).
const structured = (slots: readonly string[]): string =>
  slots.map((text, i) => (text === '' ? '' : `\\protected\\def${MACROS[i]}{${text}}`)).join('') +
  `\\abstract${slots.map((text, i) => `{${text === '' ? '' : MACROS[i]}}`).join('')}`;

/** abs.class-native's command form, for an abstract that is not structured. */
const single = (body: string): string => (body === '' ? '\\abstract{}' : `\\protected\\def\\libClassAbstract{${body}}\\abstract{\\libClassAbstract}`);

/**
 * The structured abstract printed where its node stands in a document with no title yet, as CLASS_ABSTRACT_HERE prints the
 * one-argument form under aa (node.ts, b22 O-SN2): aa prints the abstract only in its title block, and a title-less document
 * runs no \maketitle. The lines are aa's own (l.1145-1168: the centred \abstractname, then each slot under its run-in
 * heading, Context and Conclusions only when given), in the title block's margins; the class's copy is then emptied and the
 * structured flag cleared, so a later \maketitle cannot print it again. With a title (aa's \aa@title not empty, l.745-746) it
 * prints nothing and \maketitle prints the abstract. Elsewhere it is \providecommand'd to nothing.
 */
export const AA_STRUCTURED_HERE = String.raw`\makeatletter\providecommand\LatexLibAaStructuredHere{}\@ifclassloaded{aa}{\def\LatexLibAaStructuredHere{\ifx\aa@title\@empty\expandafter\LatexLibAaStructuredPrint\fi}\def\LatexLibAaStructuredPart#1#2{{\noindent\aa@subabstractfont#1. }{\aa@abstractfont\ignorespaces#2\par}}\def\LatexLibAaStructuredPrint{\begingroup\leftskip\aa@headingleftmargin\rightskip\aa@headingrightmargin{\centering\aa@abstractnamefont\abstractname\par}\vspace{\aa@afterabstractnameskip}\ifx\aa@abstract@i\longempty\else\LatexLibAaStructuredPart\aa@subabstractiname\aa@abstract@i\vspace{\aa@aftersubabstractskip}\fi\LatexLibAaStructuredPart\aa@subabstractiiname\aa@abstract@ii\vspace{\aa@aftersubabstractskip}\LatexLibAaStructuredPart\aa@subabstractiiiname\aa@abstract@iii\vspace{\aa@aftersubabstractskip}\LatexLibAaStructuredPart\aa@subabstractivname\aa@abstract@iv\vspace{\aa@aftersubabstractskip}\ifx\aa@abstract@v\longempty\else\LatexLibAaStructuredPart\aa@subabstractvname\aa@abstract@v\fi\vspace{\aa@afterabstractskip}\endgroup\global\let\aa@abstract@i\longempty\global\let\aa@abstract@ii\longempty\global\let\aa@abstract@iii\longempty\global\let\aa@abstract@iv\longempty\global\let\aa@abstract@v\longempty\global\aa@structabstractfalse}}{}\makeatother`;

export const realize = (_given: { readonly [name: string]: unknown } = {}): Realization => ({
  // The preamble's \abstract holds the abstract for \maketitle in any order, as General's title declares its title there.
  preamble: (_params, _parentType, node, content) => {
    if (node === undefined || content === undefined) return {};
    const slots = slotsOf(content);
    return { declarations: slots === undefined ? [single(content.trim()), CLASS_ABSTRACT_HERE] : [structured(slots), AA_STRUCTURED_HERE] };
  },
  emit: (_node, content) => {
    const body = content.trim();
    if (body === '') return '';
    return slotsOf(body) === undefined ? `\\LatexLibClassAbstractHere{${body}}\n\n` : '\\LatexLibAaStructuredHere\n\n';
  },
});

export default realize;
