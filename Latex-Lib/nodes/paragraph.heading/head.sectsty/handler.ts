/**
 * head.sectsty: \allsectionsfont{…} for a look every level shares, or
 * \<level>font{…} per level when the sizes are set; alignment through
 * \raggedright, \centering (with \nohang) or \raggedleft, never on the run-in
 * paragraph levels; \underline last when underlined.
 * CTAN: https://ctan.org/pkg/sectsty (sections 2, 3 and 5)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorOf, headingCommand, levelOf, numberingLines, sizeOf, type Level } from '../node.ts';
import key from './key.ts';

const ALIGN: { readonly [align: string]: string } = { class: '', left: '\\raggedright', center: '\\nohang\\centering', right: '\\raggedleft' };

/**
 * Under scrbook and scrreprt (and scrartcl) sectsty 2002/02/25 v2.0.2 replaces \@part with KOMA-Script 2.5e's of 1998, which
 * calls \@maybeasf after \refstepcounter{part} (sectsty.sty l.556-559, 585-588); KOMA-Script 3 has no \@maybeasf, so every
 * numbered \part of a document that loads sectsty stopped at "Undefined control sequence" (run 41584963423: d6e79a1062349f3243521,
 * scrbook.A result 218929558e l.136, scrartcl.A result 749d501a2f l.147, one branch in each of the six KOMA pairs; the rest of
 * the old \@part still runs). It is given as a no-op where no class defines it.
 */
const MAYBEASF = String.raw`\makeatletter\providecommand*\@maybeasf{}\makeatother`;

/**
 * sectsty accepts only article, report, book and the KOMA classes (sectsty.sty 2002/02/25 v2.0.2 l.277-297, \@ifclassloaded) and
 * stops at its load under any other: "The sectsty package doesn't work with this document class" (GitHub run 41584963423, F13:
 * extarticle.A 856 and extarticle.B 715 branches charged, e.g. d08645e784cb7e3a4898e result 3f939c703ba0). extsizes' extarticle is
 * a class of its own whose sectioning is article.cls's (extarticle.cls 1996/10/08 v1.0 l.301-347: \@part, \@spart and \section …
 * \subparagraph with article's skips and fonts), so sectsty's article branch (l.299-329, l.488-518) gives it back with sectsty's
 * fonts, as under article. So under extarticle, and only while sectsty loads, article is marked as loaded (\ver@article.cls,
 * which \@ifclassloaded reads); the mark goes when sectsty has loaded, so no other package sees it. Under any other class the
 * line does nothing. It must be set before sectsty loads, and a handler's packages load before its declarations (and hold only
 * \usepackage lines of its loads), so it goes before the class line (`beforeDocument`, where the kernel's hooks already work;
 * b22, owner item O-JR3-b).
 */
const EXTARTICLE = String.raw`\AddToHook{package/sectsty/before}{\IfClassLoadedTF{extarticle}{\expandafter\let\csname ver@article.cls\expandafter\endcsname\csname ver@extarticle.cls\endcsname}{}}\AddToHook{package/sectsty/after}{\IfClassLoadedTF{extarticle}{\expandafter\let\csname ver@article.cls\endcsname\relax}{}}`;

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const scale = param(p, 'scale', 'class');
  const look = (level: Level | undefined): string => {
    const runIn = level === 'paragraph' || level === 'subparagraph';
    return `${param(p, 'font')}${level === undefined ? '' : sizeOf(scale, level)}${colorOf(p)}${runIn ? '' : ALIGN[param(p, 'align', 'class')] ?? ''}${p['underline'] === true ? '\\underline' : ''}`;
  };
  const packages = ['\\usepackage{sectsty}', ...(colorOf(p) === '' ? [] : ['\\usepackage{xcolor}'])];
  return {
    preamble: (_params, _parentType, node) => {
      if (node === undefined) return { beforeDocument: [EXTARTICLE], packages };
      const level = levelOf(node);
      const font = scale === 'class' ? `\\allsectionsfont{${look(undefined)}}` : `\\${level}font{${look(level)}}`;
      return { beforeDocument: [EXTARTICLE], packages, declarations: [...numberingLines(p, level), font, MAYBEASF] };
    },
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
