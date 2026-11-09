/**
 * doc.page-headers (doc): running heads and footers, the template's constants, in the preamble through each class
 * family's own interface:
 * - koma: \usepackage[automark,headsepline]{scrlayer-scrpage}, \clearpairofpagestyles, \ihead, \chead, \ohead, \ifoot,
 *   \cfoot, \ofoot (starred for plain pages too), \addtokomafont{pagehead}, \pagestyle{scrheadings}
 *   (scrlayer-scrpage.dtx l.2255-2343, 2471; 0370-aremju-latex-template/main.tex l.84-92);
 * - fancyhdr: \pagestyle{fancy}, \fancyhf{}, \fancyhead[L|C|R], \fancyfoot[L|C|R], \headrulewidth, \footrulewidth,
 *   \headheight (0050-laboratory-notebook-daily-entry/main.tex l.7-10);
 * - memoir: one of its page styles, or the template's own: \makepagestyle, \makeevenhead … \makeoddfoot (even pages
 *   mirrored, so left is inner), \makeheadrule, \makefootrule (memoir.dtx l.6072-6210, 6538), \nouppercaseheads;
 * - jlreq: \NewPageStyle{name}{running_head_position=…, odd_running_head={…}, nombre_position=…} (jlreq.cls l.5208);
 * - exam: \pagestyle{headandfoot}, \runningheader, \runningheadrule, \footer, \footrule (class.exam/main.tex l.48-53); the
 *   first page's header is the title way's (front.exam-cover);
 * - empty: \pagestyle{empty} (USENIX camera-ready);
 * - class (the default): nothing, the class's own heads.
 * A per-paper text in a slot names \LatexLibShortTitle or \LatexLibRunningAuthor, \providecommand-ed empty here so a title
 * way can define them from templateSpecific.shortTitle and templateSpecific.runningAuthor. No body line.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { PreambleRequirement, Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

const SLOTS = ['headLeft', 'headCenter', 'headRight', 'footLeft', 'footCenter', 'footRight'] as const;
const HOOKS = ['\\LatexLibShortTitle', '\\LatexLibRunningAuthor'] as const;

/** A thickness that draws no rule. */
const zero = (dimen: string): boolean => /^-?0*(\.0*)?\s*([a-z]{2})?$/u.test(dimen.trim());

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const v = (name: string): string => param(p, name);
  const headRule = v('headRule');
  const footRule = v('footRule');

  const koma = (): PreambleRequirement => {
    const options = [...(p['automark'] === true ? ['automark'] : []), ...(headRule !== '' && !zero(headRule) ? ['headsepline'] : []), ...(footRule !== '' && !zero(footRule) ? ['footsepline'] : [])];
    const star = p['plainToo'] === true ? '*' : '';
    const commands = [['headLeft', 'ihead'], ['headCenter', 'chead'], ['headRight', 'ohead'], ['footLeft', 'ifoot'], ['footCenter', 'cfoot'], ['footRight', 'ofoot']] as const;
    return {
      packages: [`\\usepackage${options.length === 0 ? '' : `[${options.join(',')}]`}{scrlayer-scrpage}`],
      declarations: [
        '\\clearpairofpagestyles',
        ...commands.filter(([n]) => v(n) !== '').map(([n, c]) => `\\${c}${star}{${v(n)}}`),
        ...(v('headFont') === '' ? [] : [`\\addtokomafont{pagehead}{${v('headFont')}}`]),
        '\\pagestyle{scrheadings}',
      ],
    };
  };

  const fancyhdr = (): PreambleRequirement => {
    const at = [['headLeft', 'fancyhead', 'L'], ['headCenter', 'fancyhead', 'C'], ['headRight', 'fancyhead', 'R'], ['footLeft', 'fancyfoot', 'L'], ['footCenter', 'fancyfoot', 'C'], ['footRight', 'fancyfoot', 'R']] as const;
    return {
      packages: ['\\usepackage{fancyhdr}'],
      declarations: [
        '\\pagestyle{fancy}',
        '\\fancyhf{}',
        ...at.filter(([n]) => v(n) !== '').map(([n, c, where]) => `\\${c}[${where}]{${v(n)}}`),
        ...(headRule === '' ? [] : [`\\renewcommand{\\headrulewidth}{${headRule}}`]),
        ...(footRule === '' ? [] : [`\\renewcommand{\\footrulewidth}{${footRule}}`]),
        ...(v('headHeight') === '' ? [] : [`\\setlength{\\headheight}{${v('headHeight')}}`]),
      ],
    };
  };

  const memoir = (): PreambleRequirement => {
    const style = v('memoirStyle') || 'custom';
    const caps = p['uppercaseHeads'] === false ? ['\\nouppercaseheads'] : [];
    if (style !== 'custom') return { declarations: [`\\pagestyle{${style}}`, ...caps] };
    const n = v('styleName') || 'running';
    const [hl, hc, hr, fl, fc, fr] = SLOTS.map(v);
    return {
      declarations: [
        `\\makepagestyle{${n}}`,
        // Even pages mirrored, so the left slot stands on the inner side, as KOMA's \ihead.
        `\\makeevenhead{${n}}{${hr}}{${hc}}{${hl}}`,
        `\\makeoddhead{${n}}{${hl}}{${hc}}{${hr}}`,
        `\\makeevenfoot{${n}}{${fr}}{${fc}}{${fl}}`,
        `\\makeoddfoot{${n}}{${fl}}{${fc}}{${fr}}`,
        ...(headRule === '' ? [] : [`\\makeheadrule{${n}}{\\textwidth}{${headRule}}`]),
        ...(footRule === '' ? [] : [`\\makefootrule{${n}}{\\textwidth}{${footRule}}{\\footruleskip}`]),
        ...caps,
        `\\pagestyle{${n}}`,
      ],
    };
  };

  const jlreq = (): PreambleRequirement => {
    const n = v('styleName') || 'running';
    const keys = [
      ...(v('runningHeadPosition') === '' ? [] : [`running_head_position=${v('runningHeadPosition')}`]),
      ...(v('headFont') === '' ? [] : [`running_head_font=${v('headFont')}`]),
      ...(v('runningHead') === '' ? [] : [`odd_running_head={${v('runningHead')}}`]),
      ...(v('nombrePosition') === '' ? [] : [`nombre_position=${v('nombrePosition')}`]),
      ...(v('nombreFont') === '' ? [] : [`nombre_font=${v('nombreFont')}`]),
    ];
    return { declarations: [`\\NewPageStyle{${n}}{${keys.join(', ')}}`, `\\pagestyle{${n}}`] };
  };

  const exam = (): PreambleRequirement => {
    const [hl, hc, hr, fl, fc, fr] = SLOTS.map(v);
    return {
      declarations: [
        '\\pagestyle{headandfoot}',
        ...(hl === '' && hc === '' && hr === '' ? [] : [`\\runningheader{${hl}}{${hc}}{${hr}}`]),
        ...(headRule !== '' && !zero(headRule) ? ['\\runningheadrule'] : []),
        // \footer sets the first page's footer and the running one alike.
        ...(fl === '' && fc === '' && fr === '' ? [] : [`\\footer{${fl}}{${fc}}{${fr}}`]),
        ...(footRule !== '' && !zero(footRule) ? ['\\footrule'] : []),
      ],
    };
  };

  return {
    preamble: () => {
      const form = v('form') || 'class';
      if (form === 'class') return {};
      const out: PreambleRequirement =
        form === 'koma' ? koma() : form === 'fancyhdr' ? fancyhdr() : form === 'memoir' ? memoir() : form === 'jlreq' ? jlreq() : form === 'exam' ? exam() : { declarations: ['\\pagestyle{empty}'] };
      const texts = [...SLOTS, 'runningHead'].map(v).join(' ');
      const hooks = HOOKS.filter((h) => new RegExp(`${h.replace(/\\/gu, '\\\\')}(?![A-Za-z@])`, 'u').test(texts)).map((h) => `\\providecommand{${h}}{}`);
      return { ...out, declarations: [...hooks, ...(out.declarations ?? [])] };
    },
    emit: () => '',
  };
};

export default realize;
