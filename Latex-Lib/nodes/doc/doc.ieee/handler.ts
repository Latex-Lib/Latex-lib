/**
 * doc.ieee (doc). IEEE's preamble switches, each a template's choice, printed after the class:
 * - \IEEEoverridecommandlockouts (IEEEtran.cls l.6230-6289; ieeeconf.cls l.4570-4580): in conference mode IEEEtran makes \thanks,
 *   \IEEEPARstart, \IEEEpubid, \IEEEmembership and the biographies swallow their text; the switch restores them (a funding \thanks).
 * - \overrideIEEEmargins (ieeeconf.cls l.1188-1212): ieeeconf's wider binding margin, the printer's requirement (root.tex l.12).
 * - IEEE Access's end-of-document mark: \EOD added to the enddocument hook under its own label, ordered before the class's own
 *   \AtEndDocument check (labelled with the class file's name), which stops with "You have not used the command \EOD" unless \EOD
 *   has run (ieeeaccess.cls l.992, 1076-1086). The mark then starts its own line after the last paragraph, where the template ends
 *   that paragraph with it (starter.tex l.359); Flouest's document has no place to write it there.
 * Every line is a preamble declaration; the body gets nothing. With the defaults it prints nothing.
 * CTAN: https://ctan.org/pkg/ieeetran
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const label = param(p, 'classLabel', 'ieeeaccess-latexlib').trim();
  const lines = [
    ...(p['overrideLockouts'] === true ? ['\\IEEEoverridecommandlockouts'] : []),
    ...(p['overrideMargins'] === true ? ['\\overrideIEEEmargins'] : []),
    ...(p['endMark'] === true ? ['\\AddToHook{enddocument}[latexlib/eod]{\\EOD}', `\\DeclareHookRule{enddocument}{latexlib/eod}{before}{${label}}`] : []),
  ];
  return {
    preamble: () => (lines.length === 0 ? {} : { declarations: lines }),
    emit: () => '',
  };
};

export default realize;
