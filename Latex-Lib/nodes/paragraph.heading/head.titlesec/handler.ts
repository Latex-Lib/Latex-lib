/**
 * head.titlesec: \titleformat{\<level>}[shape]{format}{label}{sep}{before}[after]
 * and \titlespacing{\<level>}{left}{before}{after} for the heading's level,
 * then the kernel command. The manual's shapes, \filcenter and \filleft for
 * alignment, \titlerule for rules, the *n spacing shorthand.
 * CTAN: https://ctan.org/pkg/titlesec (sections 3.1 to 3.6)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorOf, DEPTHS, headingCommand, levelOf, numberingLines, sizeOf, stepUp, type Level } from '../node.ts';
import key from './key.ts';

const ALIGN: { readonly [align: string]: string } = { left: '', center: '\\filcenter', right: '\\filleft' };
/** The spacing presets: before and after for chapters and parts, then for the other levels. */
const SPACING: { readonly [name: string]: { readonly top: readonly [string, string]; readonly section: readonly [string, string] } } = {
  compact: { top: ['0pt', '20pt'], section: ['*2', '*1'] },
  airy: { top: ['50pt', '40pt'], section: ['*5', '*3'] },
};

export const formatLines = (p: { readonly [name: string]: unknown }, level: Level): string[] => {
  const top = level === 'part' || level === 'chapter';
  const runIn = param(p, 'runIn', 'paragraph');
  const runs = !top && runIn !== 'none' && (DEPTHS[level] ?? 0) >= (DEPTHS[runIn] ?? 99);
  const shape = top ? param(p, 'chapterShape', 'display') : runs ? 'runin' : param(p, 'shape', 'hang');
  const display = shape === 'display' || shape === 'frame';
  const size = sizeOf(param(p, 'scale', 'kernel'), level);
  const rule = param(p, 'rule', 'none');
  const ruled = !runs && rule !== 'none';
  const ruleLine = `\\titlerule[${param(p, 'ruleWidth', '.4pt')}]`;
  const format = `${rule === 'above-below' && !runs ? `${ruleLine}\\vspace{1ex}` : ''}${param(p, 'font')}${size}${colorOf(p)}${runs ? '' : ALIGN[param(p, 'align', 'left')] ?? ''}`;
  const name = level === 'chapter' ? '\\chaptertitlename\\ ' : level === 'part' ? '\\partname\\ ' : '';
  const label = { none: '', number: `${display ? name : ''}\\the${level}`, 'number-dot': `${display ? name : ''}\\the${level}.` }[param(p, 'label', 'number')] ?? `\\the${level}`;
  // Display shapes put the label on a line of its own, the kernel's 20pt above the title.
  const sep = display ? '20pt' : param(p, 'sep', '1em');
  const before = `${display ? stepUp(size) : ''}${p['uppercase'] === true ? '\\MakeUppercase' : ''}`;
  // \MakeUppercase leaves alone the arguments of the commands on its list: a colour name upper-cased is undefined (`BLACK').
  // …and a citation's key: upper-cased it is another key, and BibTeX stops on the case mismatch (no .bbl: d33064ffc71c687afc7f9, article.A).
  // (The host now does this for every document, keepCitationCase; the way's list stays for its own \titleformat lines.)
  const keepCase = p['uppercase'] === true ? ['textcolor', 'colorbox', 'color', 'citep', 'citet', 'citealp', 'citeauthor', 'parencite', 'textcite', 'autocite', 'footcite', 'supercite', 'citeA', 'citeNP', 'nocite'].map((c) => `\\AddToNoCaseChangeList{\\${c}}`) : [];
  // The after-code in braces: titlesec reads [after] up to its first ], so a bare [\titlerule[.4pt]] leaves a ] in the preamble ("Missing \begin{document}", result 836726857771).
  const lines = [...keepCase, `\\titleformat{\\${level}}[${shape}]{${format}}{${label}}{${sep}}{${before}}${ruled ? `[{${ruleLine}}]` : ''}`];
  const spacing = param(p, 'spacing', 'class');
  // Custom spacing is for the section levels; chapters and parts keep titlesec's 50pt and 40pt.
  if (spacing !== 'class' && !(spacing === 'custom' && top)) {
    const preset = SPACING[spacing];
    const [above, below] = preset === undefined ? [param(p, 'before'), param(p, 'after')] : top ? preset.top : preset.section;
    lines.push(`\\titlespacing${p['indentAfter'] === true ? '' : '*'}{\\${level}}{${param(p, 'left', '0pt')}}{${above}}{${runs ? '1em' : below}}`);
  }
  const brk = param(p, 'sectionBreak', 'none');
  if (level === 'section' && brk !== 'none') lines.push(`\\newcommand{\\sectionbreak}{\\${brk}}`);
  return lines;
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const packages = ['\\usepackage{titlesec}', ...(colorOf(p) === '' ? [] : ['\\usepackage{xcolor}'])];
  return {
    preamble: (_params, _parentType, node) => (node === undefined ? { packages } : { packages, declarations: [...numberingLines(p, levelOf(node)), ...formatLines(p, levelOf(node))] }),
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
