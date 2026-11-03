/**
 * toc.tocloft: the contents restyled by tocloft's hooks: \cftsecleader with
 * \cftdotfill{\cftdotsep} for dot leaders, \cftsecfont and \cftsecpagefont,
 * \cftsecaftersnumb after the number, \cfttoctitlefont and
 * \cftaftertoctitle for the title; then \tableofcontents.
 * CTAN: https://ctan.org/pkg/tocloft
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { contentsBody, contentsDeclarations } from '../node.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const set = (name: string, command: string): string[] => (param(p, name) === '' ? [] : [`\\renewcommand{\\${command}}{${param(p, name)}}`]);
  const declarations = [
    // revtex4-2 names its titles \tocname, \lofname and \lotname and never defines \contentsname, \listfigurename and
    // \listtablename, which tocloft's titles expand to ('Undefined control sequence' at \tableofcontents, revtex4-2-aps.A
    // 3d707dcbcd68 l.320-330). Nor does it define \if@restonecol, which tocloft's \@cfttocfinish names inside
    // \if@cfthaschapter (tocloft.sty 3.0c l.112-115): with no \chapter TeX skips that branch, an undefined \if is no
    // conditional while it skips, so the inner \fi closes the outer test and the last one is "Extra \fi" (batch-5 staging
    // probe). A class that has them keeps its own; the \csname test needs no \makeatletter, and skips no conditional.
    '\\providecommand{\\contentsname}{\\tocname}',
    '\\providecommand{\\listfigurename}{\\lofname}',
    '\\providecommand{\\listtablename}{\\lotname}',
    '\\expandafter\\ifx\\csname if@restonecol\\endcsname\\relax\\expandafter\\newif\\csname if@restonecol\\endcsname\\fi',
    ...contentsDeclarations(p),
    ...(param(p, 'leaders', 'sections') === 'sections' ? ['\\renewcommand{\\cftsecleader}{\\cftdotfill{\\cftdotsep}}'] : param(p, 'leaders') === 'all' ? ['\\renewcommand{\\cftsecleader}{\\cftdotfill{\\cftdotsep}}', '\\renewcommand{\\cftsubsecleader}{\\cftdotfill{\\cftdotsep}}'] : []),
    ...set('sectionFont', 'cftsecfont'),
    ...set('pageFont', 'cftsecpagefont'),
    ...set('afterNumber', 'cftsecaftersnumb'),
    ...set('titleFont', 'cfttoctitlefont'),
    ...set('titleAfter', 'cftaftertoctitle'),
  ];
  return {
    preamble: () => ({ packages: ['\\usepackage{tocloft}'], declarations }),
    emit: () => contentsBody(p),
  };
};

export default realize;
