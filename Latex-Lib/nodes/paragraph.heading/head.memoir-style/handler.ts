/**
 * head.memoir-style: memoir's own heading interface. \chapterstyle{…};
 * \set<level>headstyle{…} with \setbefore<level>skip and \setafter<level>skip
 * for sections down to subparagraphs; \chaptitlefont and \parttitlefont for
 * the top levels; \hangsecnum; \setsecnumdepth for the numbering depth.
 * CTAN: https://ctan.org/pkg/memoir
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { colorOf, headingCommand, levelOf, numberingLines, sizeOf, stepUp, type Level } from '../node.ts';
import key from './key.ts';

const SHORT: { readonly [level: string]: string } = { section: 'sec', subsection: 'subsec', subsubsection: 'subsubsec', paragraph: 'para', subparagraph: 'subpara' };

/** The chapter styles whose \printchapternum uses graphicx's \resizebox (memoir.dtx, veelo and pedersen). */
const GRAPHICX_STYLES: readonly string[] = ['veelo', 'pedersen'];

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const styleLines = (level: Level): string[] => {
    const scale = param(p, 'scale', 'class');
    const restyled = param(p, 'font') !== '' || scale !== 'class' || colorOf(p) !== '';
    const size = sizeOf(scale, level);
    const look = `${param(p, 'font')}${level === 'chapter' || level === 'part' ? stepUp(size) : size}${colorOf(p)}`;
    const [before, after] = [param(p, 'beforeSkip'), param(p, 'afterSkip')];
    if (level === 'chapter' || level === 'part') {
      return [
        ...(restyled ? [`\\renewcommand{\\${level === 'chapter' ? 'chap' : 'part'}titlefont}{${look}}`] : []),
        ...(level === 'chapter' && before !== '' ? [`\\setlength{\\beforechapskip}{${before}}`] : []),
        ...(level === 'chapter' && after !== '' ? [`\\setlength{\\afterchapskip}{${after}}`] : []),
      ];
    }
    const short = SHORT[level] ?? 'sec';
    return [
      ...(restyled ? [`\\set${short}headstyle{${look}}`] : []),
      ...(before === '' ? [] : [`\\setbefore${short}skip{${before}}`]),
      ...(after === '' ? [] : [`\\setafter${short}skip{${after}}`]),
    ];
  };
  return {
    preamble: (_params, _parentType, node) => {
      // veelo's and pedersen's \printchapternum use \resizebox (memoir.dtx: "requires the graphicx package"): a memoir document with
      // no box or figure that loads graphicx stopped at "Undefined control sequence \resizebox" at its first \chapter.
      const packages = [...(colorOf(p) === '' ? [] : ['\\usepackage{xcolor}']), ...(GRAPHICX_STYLES.includes(param(p, 'chapterStyle', 'class')) ? ['\\usepackage{graphicx}'] : [])];
      if (node === undefined) return packages.length === 0 ? {} : { packages };
      const level = levelOf(node);
      const depth = param(p, 'numberDepth', 'class');
      const declarations = [
        ...numberingLines({ ...p, numberDepth: 'class' }, level),
        ...(depth === 'class' ? [] : [`\\setsecnumdepth{${depth}}`]),
        ...(param(p, 'chapterStyle', 'class') === 'class' ? [] : [`\\chapterstyle{${param(p, 'chapterStyle')}}`]),
        ...(p['hangNumbers'] === true ? ['\\hangsecnum'] : []),
        ...styleLines(level),
      ];
      return { ...(packages.length === 0 ? {} : { packages }), ...(declarations.length === 0 ? {} : { declarations }) };
    },
    emit: (node, content) => headingCommand(node, content),
  };
};

export default realize;
