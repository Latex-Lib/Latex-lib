/**
 * xref.class-native: the class's own reference commands, which print the
 * target's name themselves.
 * - elegantpaper: \figref{label} and \tabref{label}, a bold "Figure n" or
 *   "Table n" (elegantpaper.cls l.255-256; elegantpaper-en.tex l.69-70).
 * - jmlr (PMLR): \figureref, \tableref, \sectionref, \equationref,
 *   \algorithmref, \theoremref, \lemmaref, ... \appendixref, \partref
 *   (jmlr.dtx l.1860-2004; pmlr-sample.tex l.145-181).
 * - cleveref, loaded by the class or its style, never by the way: \cref{label}
 *   (\Cref by the preset), the name taken from cleveref's own \crefname table
 *   (eccv.sty l.249-255 loads [capitalize]{cleveref} at \AtEndPreamble; mdpi.cls
 *   l.481 [capitalise,noabbrev]{cleveref}, with its \crefname table l.389-414,
 *   at begindocument/before l.511-522). Both profiles refuse a way's own
 *   cleveref load, so xref.cleveref cannot serve them.
 * A kind the class has no command for (a proposition under jmlr, a section
 * under elegantpaper) falls back to the kernel's name~\ref{label}, as
 * xref.kernel prints it; with no name, \ref{label} alone.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, labelKey, param, textOf } from '../../protocol.ts';
import { refNameOf } from '../node.ts';
import key from './key.ts';
import { ELEGANTPAPER, JMLR, kindOf } from './kinds.ts';

const VOCABULARIES: { readonly [name: string]: { readonly [kind: string]: string } } = { elegantpaper: ELEGANTPAPER, jmlr: JMLR };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const vocabulary = param(p, 'vocabulary', 'elegantpaper');
  return {
    preamble: () => ({}),
    emit: (node) => {
      const label = labelKey(textOf(node));
      if (vocabulary === 'cleveref') return `\\${param(p, 'cref', 'cref')}{${label}}`;
      const name = refNameOf(node);
      const command = VOCABULARIES[vocabulary]?.[kindOf(name)];
      if (command !== undefined) return `${command}{${label}}`;
      // The name is plain text from the node's attrs, escaped as xref.kernel escapes it.
      return `${name === '' ? '' : `${escapeText(name)}~`}\\ref{${label}}`;
    },
  };
};

export default realize;
