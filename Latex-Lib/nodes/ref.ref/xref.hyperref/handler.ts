/**
 * xref.hyperref: \autoref{label}, the target's kind and number linked;
 * \nameref{label} for its title; \hyperref[label]{text} when the node gives
 * its own name.
 * CTAN: https://ctan.org/pkg/hyperref
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, labelKey, param, textOf } from '../../protocol.ts';
import { refNameOf } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({ packages: ['\\usepackage{hyperref}'] }),
    emit: (node, _content, _context, _parentType, location) => {
      const label = labelKey(textOf(node));
      const command = param(p, 'command', 'autoref');
      if (refNameOf(node) === '' || command !== 'autoref') return `\\${command}{${label}}`;
      // The name escaped as General's ref.ts does. In a statement's header note, read as `[note]`, \hyperref's own `[label]` would end
      // the note at its `]`, so there the name and \ref print side by side, as General prints them.
      const name = escapeText(refNameOf(node));
      return location?.enclosingSpecialStructure === 'headerNote' ? `${name}~\\ref{${label}}` : `\\hyperref[${label}]{${name}}`;
    },
  };
};

export default realize;
