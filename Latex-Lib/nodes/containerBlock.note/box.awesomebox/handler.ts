/**
 * box.awesomebox: the note as an admonition block. The named blocks
 * (noteblock, tipblock, warningblock, cautionblock, importantblock), or
 * \begin{awesomeblock}[vrulecolor][hrule][title]{vrulewidth}{icon}{iconcolor}
 * for one of its own; \aweboxleftmargin and \aweboxcontentwidth for the
 * columns. Needs fontawesome5. awesomebox sets the block as a tabular a line
 * wide after `\noindent`, so a head still waiting there (a statement's above
 * it) is first set on its own line (`\LatexLibHeadOwnLine`, protocol.ts):
 * beside the block it ran past the line by its width (run 41584963423: 2,620
 * not-denied branches failed on that alone). [F3]
 * CTAN: https://ctan.org/pkg/awesomebox (sections 3 to 5)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { HEAD_OWN_LINE, headOwnLine, param } from '../../protocol.ts';
import { colorFor, keepingFootnotes, titled, titleOf, toneDefinition, toneName } from '../node.ts';
import key from './key.ts';

const BY_TONE = { info: 'note', tip: 'tip', warning: 'warning' } as const;
const HRULE: { readonly [h: string]: string } = { none: '', short: '\\abShortLine', long: '\\abLongLine' };

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const block = param(p, 'block', 'tone');
  const colors = [param(p, 'ruleColor'), param(p, 'iconColor')];
  const lengths = [
    ...(param(p, 'leftMargin') === '' ? [] : [`\\setlength{\\aweboxleftmargin}{${param(p, 'leftMargin')}}`, `\\setlength{\\aweboxcontentwidth}{\\dimexpr\\linewidth-${param(p, 'leftMargin')}\\relax}`]),
  ];
  return {
    preamble: (_params, _parentType, node) => {
      const tone = block === 'custom' ? toneDefinition(colors, node) : [];
      const declarations = [...lengths, ...tone, HEAD_OWN_LINE];
      return { packages: ['\\usepackage{awesomebox}', ...(tone.length === 0 ? [] : ['\\usepackage{xcolor}'])], ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content) => {
      if (block === 'custom') {
        const title = titleOf(node);
        // A footnote in the block (a tabular cell) reaches the page's foot: footnotehyper's \savenotes around it (b22 OV2-alt).
        // Merge (b22): the waiting head goes first, on its own line, outside MARGIN-4's \savenotes scope (RUNIN-1 [F3] + OV2-alt).
        return headOwnLine(keepingFootnotes(content, `\\begin{awesomeblock}[${colorFor(param(p, 'ruleColor', 'black'), node)}][${HRULE[param(p, 'hrule', 'none')] ?? ''}][${title === '' ? '' : `\\textbf{${title}}`}]{${param(p, 'ruleWidth', '2pt')}}{${param(p, 'icon', '\\faInfoCircle')}}{${colorFor(param(p, 'iconColor', 'black'), node)}}\n${content.trim() || '\\mbox{}'}\n\\end{awesomeblock}\n\n`));
      }
      const env = `${block === 'tone' ? BY_TONE[toneName(node)] : block}block`;
      return headOwnLine(keepingFootnotes(content, `\\begin{${env}}\n${titled(node, content)}\n\\end{${env}}\n\n`));
    },
  };
};

export default realize;
