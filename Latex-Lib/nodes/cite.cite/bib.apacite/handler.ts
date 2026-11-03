/**
 * bib.apacite (cite/cite): apacite's citation commands: \cite{key} (Knuth, 1984), \citeA{key} Knuth (1984), \citeNP without parentheses.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param, textOf } from '../../protocol.ts';
import key from './key.ts';

/** natbib's command for an apacite citation command natbibapa leaves undefined. */
const NATBIB_FORM: { readonly [command: string]: string } = { citeA: '\\citet', citeNP: '\\citealp' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const command = param(p, 'command', 'cite');
  return {
    // \MakeUppercase (a titlesec heading format, a class's running heads) upper-cases the argument of a command not on its
    // no-case-change list, as it did \textcolor{black} (head.titlesec): \citeA{ref-theme-knuth} would cite REF-THEME-KNUTH.
    // apacite's natbibapa option (its list's natbib-commands preset) leaves \citeA and \citeNP undefined (apacite.dtx l.5803-5810,
    // l.6219-6785: "Undefined control sequence \protect\citeA", batch-4 staging probe 83d0ead94f8e); natbib's \citet and \citealp print
    // the same APA forms. At \begin{document}, after apacite's own definitions, so without natbibapa nothing changes.
    preamble: () => ({ declarations: [`\\AddToNoCaseChangeList{\\${command}}`, ...(NATBIB_FORM[command] === undefined ? [] : [`\\AtBeginDocument{\\providecommand{\\${command}}{${NATBIB_FORM[command]}}}`])] }),
    // \protect: apacite's \cite, \citeA and \citeNP are fragile (\cite -> \def\BCAY…). Unprotected in a moving argument they
    // break: titling's \thetitle ("Illegal parameter number in definition of \thetitle", 135d052ad377, article.A) and a
    // \MakeUppercase heading ("Use of \@citeA doesn't match its definition", 66f4683aeaed, article.A). In text \protect is \relax.
    emit: (node) => (textOf(node) === '' ? '' : `\\protect\\${command}{${textOf(node)}}`),
  };
};

export default realize;
