/**
 * thm.class-native: each kind by the class's own environment. A kind the
 * class does not define (acmart has no remark, as its guide shows how to add)
 * is declared with the class's own command only if still undefined:
 * `\newtheorem` as the class has it, or, for upright kinds, the command the
 * preset names (elsarticle's `\newdefinition`), where the class has it, else
 * `\newtheorem`: amsart has no `\newdefinition` (the copy's amsart.A run,
 * cell c44cd196a35f3a8775a42). Under aa, whose `\newtheorem` takes the head
 * and body fonts after the title, `\newtheorem` gives them (`AA_FONTS`).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { amsStyleOf, displayName, elementOf, statementIn, text } from '../statement.ts';
import key from './key.ts';

/**
 * aa redefines \newtheorem to take the head and body fonts after the title and an optional counter (\aa@newtheorem, aa.cls
 * l.1524-1593; A&A's guide, AandA.md l.83), and predefines every kind but property (l.1625-1637). The standard
 * \newtheorem{property}{Property} then read \makeatother and the next declaration's first token as the fonts (under the
 * elsarticle preset, the \fi of its \ifdefined), and the preamble broke. Where \aa@newtheorem exists, a kind gets the fonts aa
 * gives its own kinds of that style (lemma's, definition's, remark's); elsewhere the line is the standard one.
 */
const AA_FONTS: { readonly [style: string]: string } = { plain: '{\\bfseries}{\\itshape}', definition: '{\\bfseries}{\\rmfamily}', remark: '{\\itshape}{\\rmfamily}' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const upright = text(withDefaults(key.params, given as never), 'uprightCommand', '');
  return {
    preamble: (_p, _parent, node) => {
      if (node === undefined) return {};
      const element = elementOf(node);
      const declare = (command: string): string => `${command}{${element}}{${displayName(element)}}`;
      const theorem = `\\ifdefined\\aa@newtheorem${declare('\\newtheorem')}${AA_FONTS[amsStyleOf(element)] ?? AA_FONTS['plain']}\\else${declare('\\newtheorem')}\\fi`;
      const declaration = upright !== '' && amsStyleOf(element) !== 'plain' ? `\\ifdefined${upright}${declare(upright)}\\else${theorem}\\fi` : theorem;
      return { declarations: [`\\makeatletter\n\\@ifundefined{${element}}{${declaration}}{}\n\\makeatother`] };
    },
    emit: (node, content, note) => statementIn(elementOf(node), node, content, note),
  };
};

export default realize;
