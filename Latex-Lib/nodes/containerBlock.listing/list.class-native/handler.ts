/**
 * list.class-native: a list in the class's own list environments, nested by the items' indent as list.kernel nests the kernel's
 * (`nested`, node.ts). Which environment each level gets depends on the class's form (`form`):
 * - apa7: a first-level enumerate is APAenumerate (1. run into the paragraph), an itemize APAitemize (apa7.cls l.739-785). The
 *   levels below are the kernel's: APAenumerate starts \usecounter{APAenum} at each level, so a nested APAenumerate would reset
 *   the counter its parent goes on counting from (a parent's next item after three nested ones would be 4). APAenumerate sets
 *   \labelsep to 0pt, which a kernel enumerate below it inherited ("1.Nested", apa7, ZeroTeX-NG, 2026-11-07), so that one is
 *   opened in a group with article's .5em again; the group closes with it, so the APAenumerate's own items keep their 0pt. With
 *   `seriation`, an
 *   enumerate is the class's in-sentence seriation, \begin{seriate} \item … \end{seriate}, printed (a) (b) (c): its \item takes
 *   no label and holds no list, so every level is one of its items and an item's own label leads its text. It is written for a
 *   sentence: its \@esphack sets \spacefactor from what \@bsphack saved in horizontal mode, so begun between paragraphs it stopped
 *   at "Bad space factor (0)" at \end{seriate} (apa7, ZeroTeX-NG, 2026-11-07); \leavevmode starts the list's own paragraph first.
 * - jacow: Itemize, Enumerate and Description at every level, the class's compact lists (\begin{itemize}[nosep] and so on over
 *   the enumitem it loads, jacow.cls l.319-322).
 * - jmlr: an enumerate is enumerate* at every level (its levels share the enumi counter, jmlr.dtx l.2493-2509) unless
 *   `sharedCounter` is false; a description is altdescription{<widest label>} at every level, its indent from the widest label
 *   (jmlr.dtx l.2518-2531): `widestLabel`, or the longest label among the items.
 * - cas: the kernel's environment names, with cas-common.sty's own label syntax on the first level: an enumerate's label pattern
 *   (\begin{enumerate}[a)], 1, a, A, i, I standing for the counter, l.2491-2520) and an itemize's bullet (\begin{itemize}[--],
 *   l.2524-2534). No package: enumitem's [label=…] is read as a pattern and garbled (Elsevier_CAS_DC.md:153-156).
 * - imsart: a first-level enumerate is the class's longlist, labelled (i), (ii) (imsart.sty l.3292-3316); the rest the kernel's.
 * In a measure under 2in a list indents at most a fifth of it (`NARROW_LISTS`, OVL-3).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { NARROW_LISTS, nested, styleOf, type ListStyle } from '../node.ts';
import key from './key.ts';

type Form = 'apa7' | 'jacow' | 'jmlr' | 'cas' | 'imsart';

/** An item line as list.item writes it: `\<level>[{label}] text` or `\<level>[label] text`. */
const ITEM = /^\s*\\(\d{1,2})(?:\[\{(.*)\}\]|\[([^\]]*)\])?(?:\s+(.*))?$/u;

/** The longest item label in the list, for altdescription's argument. */
const widestOf = (content: string): string =>
  content
    .split('\n')
    .map((line) => ITEM.exec(line))
    .map((m) => (m === null ? '' : (m[2] ?? m[3] ?? '').trim()))
    .reduce((a, b) => (b.length > a.length ? b : a), '');

/** apa7's seriation: every item, at any level, one \item of seriate, its own label before its text. */
const seriate = (content: string): string => {
  const lines = content
    .trim()
    .split('\n')
    .map((line) => {
      const m = ITEM.exec(line);
      if (m === null || Number(m[1]) < 1) return line;
      const label = (m[2] ?? m[3] ?? '').trim();
      const text = (m[4] ?? '').trim();
      return `\\item ${[label, text].filter((t) => t !== '').join(' ') || '\\strut'}`;
    })
    .filter((line) => line.trim() !== '');
  return `\\leavevmode\\begin{seriate}\n${lines.join('\n')}\n\\end{seriate}\n\n`;
};

/** The environment a level opens: its name, and what follows \begin{name} (an argument or an optional argument). */
type Env = { readonly name: string; readonly after: string; readonly group?: string };

const envOf = (form: Form, style: ListStyle, level: number, p: { readonly [name: string]: unknown }, widest: string): Env => {
  const text = (name: string): string => (typeof p[name] === 'string' ? (p[name] as string).trim() : '');
  switch (form) {
    case 'apa7':
      if (level === 1 && style === 'enumerate') return { name: 'APAenumerate', after: '' };
      if (level === 1 && style === 'itemize') return { name: 'APAitemize', after: '' };
      if (level === 2 && style === 'enumerate') return { name: style, after: '', group: '\\labelsep.5em\\relax' };
      return { name: style, after: '' };
    case 'jacow':
      return { name: style === 'enumerate' ? 'Enumerate' : style === 'description' ? 'Description' : 'Itemize', after: '' };
    case 'jmlr':
      if (style === 'enumerate' && p['sharedCounter'] !== false) return { name: 'enumerate*', after: '' };
      if (style === 'description') return { name: 'altdescription', after: `{${text('widestLabel') || widest}}` };
      return { name: style, after: '' };
    case 'cas':
      if (level === 1 && style === 'enumerate' && text('pattern') !== '') return { name: 'enumerate', after: `[${text('pattern')}]` };
      if (level === 1 && style === 'itemize' && text('bullet') !== '') return { name: 'itemize', after: `[${text('bullet')}]` };
      return { name: style, after: '' };
    case 'imsart':
      if (level === 1 && style === 'enumerate') return { name: 'longlist', after: '' };
      return { name: style, after: '' };
  }
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const form = (typeof p['form'] === 'string' ? p['form'] : 'jacow') as Form;
  return {
    preamble: () => ({ declarations: [NARROW_LISTS] }),
    emit: (node, content) => {
      const style = styleOf(node);
      if (form === 'apa7' && style === 'enumerate' && p['seriation'] === true) return seriate(content);
      const widest = widestOf(content);
      const opened: Env[] = [];
      return nested(
        content,
        (level) => {
          const env = envOf(form, style, level, p, widest);
          opened[level] = env;
          return `${env.group === undefined ? '' : `{${env.group}`}\\begin{${env.name}}${env.after}`;
        },
        (level) => `\\end{${opened[level]?.name ?? style}}${opened[level]?.group === undefined ? '' : '}'}`,
      );
    },
  };
};

export default realize;
