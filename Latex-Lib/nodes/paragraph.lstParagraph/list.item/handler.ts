/**
 * list.item (paragraph/lstParagraph). A list item: the line Flouest's list ways read, \<level>[label] text, the level from the item's indent; the list prints it as \item[label] text.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { escapeText, field } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: (_params, _parentType, node, content) => ({}),
    emit: (node, content, context, parentType) => `\\${Math.max(0, Math.floor(Number(node.attrs?.['indent'] ?? 0)) || 0) + 1}${field(node, 'description') === '' ? '' : `[{${escapeText(field(node, 'description'))}}]`} ${content.trim()}\n`,
  };
};

export default realize;
