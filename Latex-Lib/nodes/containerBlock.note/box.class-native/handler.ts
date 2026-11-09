/**
 * box.class-native: the note in the class's own box environment, with no package.
 * - beamer (and ctexbeamer): \begin{block}{title} … \end{block}, or alertblock or exampleblock, picked by the note's tone
 *   (info block, warning alertblock, tip exampleblock) or fixed; the theme draws them (beamerbaselocalstructure.sty l.107-135).
 * - oup-authoring-template: \begin{boxtext}[title] … \end{boxtext}, the class's numbered "Box n" between two 6pc half rules
 *   (oup-authoring-template.cls l.3079-3129); the tone is ignored.
 * - memoir: \begin{framed} … \end{framed}, \begin{shaded} or \begin{leftbar}, the framed package's environments memoir defines
 *   itself (memoir.dtx l.30894-30906; its \EmulatedPackage{framed} is commented out, l.33774), the title in bold on its own line;
 *   \FrameSep and \FrameRule in the preamble, and shaded's shadecolor (xcolor), which memoir leaves to the user.
 * CTAN: https://ctan.org/pkg/beamer, https://ctan.org/pkg/memoir
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization, Subject } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { titled, titleOf, toneName } from '../node.ts';
import key from './key.ts';

/** beamer's block for each tone: the theme's alerted colours for a warning, its example colours for a tip. */
const BEAMER_BY_TONE = { info: 'block', warning: 'alertblock', tip: 'exampleblock' } as const;
const BEAMER = new Set(['tone', 'block', 'alertblock', 'exampleblock']);
const MEMOIR = new Set(['framed', 'shaded', 'leftbar']);

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const env = param(p, 'env', 'tone');
  const withTitle = p['title'] !== false;
  const environment = (node: Subject): string => (env === 'tone' ? BEAMER_BY_TONE[toneName(node)] : env);
  return {
    preamble: () => {
      if (!MEMOIR.has(env)) return {};
      // memoir's \FrameSep (framed's \fboxsep, and shaded's) and \FrameRule (framed's \fboxrule), memoir.dtx l.30442-30443.
      const declarations = [
        ...(param(p, 'frameSep') === '' ? [] : [`\\setlength{\\FrameSep}{${param(p, 'frameSep')}}`]),
        ...(env === 'framed' && param(p, 'frameRule') !== '' ? [`\\setlength{\\FrameRule}{${param(p, 'frameRule')}}`] : []),
        // shaded draws \colorbox{shadecolor} (l.30899): memoir loads no colour package and defines no shadecolor.
        ...(env === 'shaded' ? [`\\colorlet{shadecolor}{${param(p, 'shade', 'black!10')}}`] : []),
      ];
      return { ...(env === 'shaded' ? { packages: ['\\usepackage{xcolor}'] } : {}), ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content) => {
      const body = content.trim() || '\\mbox{}';
      const title = withTitle ? titleOf(node) : '';
      if (BEAMER.has(env)) return `\\begin{${environment(node)}}{${title}}\n${body}\n\\end{${environment(node)}}\n\n`;
      // The brackets always printed: without them a body opening with [ would be read as the title.
      // boxtext sets its text with \leftskip and \rightskip 8pt and draws its closing half rule in \hbox to\hsize within them
      // (cls l.3122-3125), so every box ends on "Overfull \hbox (16.0pt too wide)" (probe, ZeroTeX-NG, 2026-11-07); the skips are
      // put back to 0pt after the text's last paragraph, which leaves the rule where the class draws it, flush with the measure.
      if (env === 'boxtext') return `\\begin{boxtext}[${title}]\n${body}\n\\par\\leftskip0pt\\rightskip0pt\n\\end{boxtext}\n\n`;
      return `\\begin{${env}}\n${withTitle ? titled(node, content) : body}\n\\end{${env}}\n\n`;
    },
  };
};

export default realize;
