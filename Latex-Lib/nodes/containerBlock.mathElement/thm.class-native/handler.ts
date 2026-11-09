/**
 * thm.class-native: each kind by the class's own environment. A kind the
 * class does not define (acmart has no remark, as its guide shows how to add)
 * is declared with the class's own command only if still undefined:
 * `\newtheorem` as the class has it, or, for upright kinds, the command the
 * preset names (elsarticle's `\newdefinition`), where the class has it, else
 * `\newtheorem`: amsart has no `\newdefinition` (the copy's amsart.A run,
 * cell c44cd196a35f3a8775a42). Under aa, whose `\newtheorem` takes the head
 * and body fonts after the title, `\newtheorem` gives them (`AA_FONTS`).
 *
 * The class's own declaration vocabulary, each part off by default so the
 * native and elsarticle presets print what they always printed:
 * - `plainCommand` for the plain kinds (siamart's `\newsiamthm`, llncs's `\spnewtheorem`), guarded like
 *   `uprightCommand`; an upright kind with no `uprightCommand` takes it too. `plainFonts` and `uprightFonts` follow
 *   the name, for a command that takes the head and body fonts there (`\spnewtheorem{note}{Note}{\itshape}{\rmfamily}`,
 *   llncs.cls l.1040-1047).
 * - `theoremStyles: 'thmstyle'`: the styles sn-jnl and OUP define and their templates declare with (thmstyleone for
 *   the plain kinds, thmstyletwo for example and remark, thmstylethree for definition: oup-authoring-template.tex
 *   l.50-60, oup-authoring-template.cls l.2639-2692; Springer_Nature_SN_Jnl.md l.75).
 * - `theoremCounter`: a kind the class lacks counts on the theorem's counter (`\newtheorem{corollary}[theorem]{…}`),
 *   the plain kinds only (OUP's proposition, tex l.54) or every kind (spie's one counter, jmlr's); the theorem is
 *   declared first, in its own entry, if the class lacks it too. A command that shares the counter by itself
 *   (`\newsiamthm`) is used with `own`.
 * - `crefNames`: `\crefname` for a kind declared, as siamart's own ex_shared.tex does (l.23-28).
 * - `proofCommand`: a proof environment declared with it if the class lacks one (cas-common.sty's `\newproof`,
 *   l.2588-2627). Flouest's statement has no proof kind: the environment is for a template's own LaTeX.
 * - `capitalise`: mdpi's environments are capitalised (`\begin{Theorem}`, mdpi.cls l.255-309).
 * - `theoremSetters: 'jmlr'`: jmlrutils' `\theorembodyfont`, `\theoremheaderfont`, `\theorempostheader` and `\theoremsep`
 *   (jmlr.dtx l.2590-2640) set before the declaration, as PMLR's sample does (pmlr-sample.tex l.22-26), and put back after
 *   it: jmlr's `\newtheorem` copies them into the kind (`\cslet{jmlr@thm@#1@body@font}`, l.2679-2686), so only the
 *   declared kind takes them and a later declaration (the template's own) starts from the class's values again.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { amsStyleOf, displayName, type Element, elementOf, statementIn, text } from '../statement.ts';
import key from './key.ts';

/**
 * aa redefines \newtheorem to take the head and body fonts after the title and an optional counter (\aa@newtheorem, aa.cls
 * l.1524-1593; A&A's guide, AandA.md l.83), and predefines every kind but property (l.1625-1637). The standard
 * \newtheorem{property}{Property} then read \makeatother and the next declaration's first token as the fonts (under the
 * elsarticle preset, the \fi of its \ifdefined), and the preamble broke. Where \aa@newtheorem exists, a kind gets the fonts aa
 * gives its own kinds of that style (lemma's, definition's, remark's); elsewhere the line is the standard one.
 */
const AA_FONTS: { readonly [style: string]: string } = { plain: '{\\bfseries}{\\itshape}', definition: '{\\bfseries}{\\rmfamily}', remark: '{\\itshape}{\\rmfamily}' };

/** sn-jnl's and OUP's styles by kind, as their templates declare them (oup-authoring-template.tex l.50-60). */
const THMSTYLE = (element: Element): string => (element === 'definition' ? 'thmstylethree' : element === 'example' || element === 'remark' ? 'thmstyletwo' : 'thmstyleone');

/** jmlrutils' setters, each with the internal macro it sets (jmlr.dtx l.2596-2637), by the parameter that gives its value. */
const JMLR_SETTERS = [
  ['bodyFont', '\\theorembodyfont', '\\@theorembodyfont'],
  ['headerFont', '\\theoremheaderfont', '\\@theoremheaderfont'],
  ['postHeader', '\\theorempostheader', '\\@theorempostheader'],
  ['separator', '\\theoremsep', '\\@theoremsep'],
] as const;

const plural = (element: Element): string => (element === 'property' ? 'Properties' : `${displayName(element)}s`);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const params = withDefaults(key.params, given as never);
  const upright = text(params, 'uprightCommand', '');
  const plain = text(params, 'plainCommand', '');
  const plainFonts = text(params, 'plainFonts', '');
  const uprightFonts = text(params, 'uprightFonts', '');
  const proof = text(params, 'proofCommand', '');
  const thmstyle = params['theoremStyles'] === 'thmstyle';
  const counter = text(params, 'theoremCounter', 'own');
  const crefNames = params['crefNames'] === true;
  const capitalise = params['capitalise'] === true;
  // Each setter given: saved (\LatexLib@jsa to \LatexLib@jsd), set, and put back after the declaration.
  const setters = params['theoremSetters'] === 'jmlr' ? JMLR_SETTERS.map(([name, command, macro], i) => ({ value: text(params, name, ''), command, macro, save: `\\LatexLib@js${'abcd'[i]}` })).filter((s) => s.value !== '') : [];
  const setUp = setters.map((s) => `\\let${s.save}${s.macro}${s.command}{${s.value}}`).join('');
  const putBack = setters.map((s) => `\\let${s.macro}${s.save}`).join('');
  const environment = (element: Element): string => (capitalise ? displayName(element) : element);
  const shares = (element: Element): boolean => element !== 'theorem' && (counter === 'all' || (counter === 'plain' && amsStyleOf(element) === 'plain'));

  /** One kind's guarded declaration, on its own counter or (`shared`) on the theorem's. */
  const declarationOf = (element: Element, shared: boolean): string => {
    const env = environment(element);
    const name = displayName(element);
    const on = shared ? `[${environment('theorem')}]` : '';
    const declare = (command: string, fonts = ''): string => `${command}{${env}}${on}{${name}}${fonts}`;
    // aa's \newtheorem takes its counter after the fonts: the aa branch keeps its own counter.
    const theorem = `\\ifdefined\\aa@newtheorem\\newtheorem{${env}}{${name}}${AA_FONTS[amsStyleOf(element)] ?? AA_FONTS['plain']}\\else${declare('\\newtheorem')}\\fi`;
    const plainDeclaration = plain !== '' ? `\\ifdefined${plain}${declare(plain, plainFonts)}\\else${theorem}\\fi` : theorem;
    const declaration = upright !== '' && amsStyleOf(element) !== 'plain' ? `\\ifdefined${upright}${declare(upright, uprightFonts)}\\else${theorem}\\fi` : plainDeclaration;
    const style = thmstyle ? `\\theoremstyle{${THMSTYLE(element)}}` : '';
    const cref = crefNames ? `\\ifdefined\\crefname\\crefname{${env}}{${name}}{${plural(element)}}\\fi` : '';
    return `\\makeatletter\n\\@ifundefined{${env}}{${style}${setUp}${declaration}${putBack}${cref}}{}\n\\makeatother`;
  };

  return {
    preamble: (_p, _parent, node) => {
      if (node === undefined) return {};
      const element = elementOf(node);
      const kinds = shares(element) ? [declarationOf('theorem', false), declarationOf(element, true)] : [declarationOf(element, false)];
      const proofs = proof !== '' ? [`\\makeatletter\n\\@ifundefined{proof}{\\ifdefined${proof}${proof}{proof}{Proof}\\fi}{}\n\\makeatother`] : [];
      return { declarations: [...kinds, ...proofs] };
    },
    emit: (node, content, note) => statementIn(environment(elementOf(node)), node, content, note),
  };
};

export default realize;
