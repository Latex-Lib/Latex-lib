/**
 * Static checks on the emitted LaTeX (ARCHITECTURE.md section 3, `ci/`;
 * BATCHES.md "Writing a handler"), so the emission mistakes the runs found
 * most often are caught before anything compiles. No TeX runs and no Chrome
 * starts.
 *
 *   npm run compat -- ci/lint.ts [--classes article] [--setups A] [--depth 2] [--size 64] [--strict] [--out <file>] [--tex <dir>]
 *   npm run compat -- ci/lint.ts --file <a.tex,b.tex or a folder> [--classes article] [--strict]
 *
 * It emits the solo cells of each picked class setting and setup (article
 * with A unless picked): one branch each, so a finding names its way exactly.
 * Each way is alone in two solo branches, marked and unmarked, so the report
 * counts ways as well as branches. It emits the matrix documents too, filed
 * as `run` files them (so a store that has been through it has nothing left
 * to file), for the preamble checks, where branches filed together can
 * clash. The library's ways are always loaded, as smoke.ts loads them: the
 * filing goes into the store, so it must be the matrix's own. The checks:
 *
 * 1. `options`: a package loaded twice in the preamble (`\usepackage` or
 *    `\RequirePackage`) where a later load asks for an option the first did
 *    not give. That is LaTeX's "Option clash"; a later load with fewer
 *    options is not one, so it is not reported. A load inside
 *    `\@ifpackageloaded{<same package>}` runs only when nothing loaded the
 *    package before it: it is then the first load, and after one it is skipped.
 * 2. `forbidden`: a package the class profile refuses (`latexLibClasses`:
 *    its load tests' `forbids.technical`, and the packages that conflict with
 *    one the class loads itself) loaded under that class. `Host.fits` keeps
 *    branches whose ways load one out of the cell; this finds what fits does
 *    not see: an adapt's loads, a `\RequirePackage` in a handler's code, a
 *    class setting's or General's own lines.
 * 3. `balance`: braces unbalanced anywhere, or `\begin`/`\end` unbalanced in
 *    the text (from `\begin{document}`: the preamble defines environments in
 *    halves, as `\newenvironment` and `\AtEndEnvironment` do). Comments and
 *    verbatim-like environments and arguments (`\verb`, `\lstinline`, `\url`'s)
 *    are skipped, and so are character codes (`` `{ ``) and `\iffalse{\fi`.
 *    Such a command being named takes no argument there (`\let\url\relax`,
 *    `\newcommand{\code}{\lstinline}`, `\renewcommand{\href}[2]{#2}`).
 * 4. `paragraph`: a blank line, or `\par`, anywhere inside an argument of a
 *    command that cannot take one: `\part`, `\chapter`, `\section` to
 *    `\subparagraph` (starred, with optional arguments), `\caption`,
 *    `\captionof`, `\label`, `\ref`, `\cite`, `\url`, `\texorpdfstring`. TeX
 *    stops at "Paragraph ended before ... was complete", or later when the
 *    text is read back from the table of contents. Only the text is read: in
 *    the preamble those names are being defined or styled. A finding is on
 *    the line the argument opens; the break's own line is in its message.
 *
 * A solo finding goes to the solo branch's way (its leaf node and variant). A
 * preamble finding goes to the branches whose preamble lines hold it
 * (`Emitted.preamble`), and to the ways among them that load the package; one
 * on lines no branch put there (the class setting's, General's fixed lines) is
 * the document's. A cell's findings count once per check and line (and
 * package, or paragraph break). The report is markdown, per check and way, each finding
 * with its line and a snippet: `--out`, by default `out/lint-<class>.<setup>.md`
 * (with several pairs, `--out` gets `.<class>.<setup>` before its extension).
 * `--tex <dir>` also writes each solo cell with a finding as `.tex`, to read
 * the line in its document. `--file` lints given files with every check
 * instead, under the first picked class setting, and prints the findings.
 * It exits 1 only with `--strict` and a finding.
 *
 * With a brace missing, check 4 is skipped for that cell: an argument then
 * runs on to wherever its group happens to close.
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, extname, join } from 'node:path';

import { canonical, documentCells, fileBranches, packBranches, soloBranches, type BranchSpec, type Emitted, type JudgedJob } from 'compat-core';

import { latexLibClasses, latexLibWays } from '../host-flouest/src/latexLib.ts';
import { loadSubject } from '../host-flouest/src/subject.ts';
import { flag, numberOption, openWorkspace, option, underName } from '../host-flouest/src/workspace.ts';

type Check = 'options' | 'forbidden' | 'balance' | 'paragraph';

const TITLES: { readonly [check in Check]: string } = {
  options: 'A package loaded twice with clashing options',
  forbidden: 'A package the class refuses',
  balance: 'Unbalanced braces or environments',
  paragraph: 'A paragraph break in an argument that cannot take one',
};

const CHECKS = Object.keys(TITLES) as Check[];

/**
 * What one check found on one line. `pkg`: the package a preamble finding is about, to find the ways that load it. `at`: the
 * line of what was found when the finding is shown on another (a paragraph break, shown where its argument opens).
 */
type Finding = { readonly check: Check; readonly line: number; readonly message: string; readonly pkg?: string; readonly at?: number };

// ---- Reading the LaTeX ----

/** Environments whose body TeX does not read as LaTeX. */
const VERBATIM = ['verbatim', 'verbatim*', 'Verbatim', 'Verbatim*', 'BVerbatim', 'LVerbatim', 'lstlisting', 'minted', 'comment', 'filecontents', 'filecontents*'];

/** Those, and the ones the document declares verbatim-like (`\lstnewenvironment{x}`, `\newminted{python}` as `pythoncode`). */
const verbatimLike = (latex: string): Set<string> => {
  const names = new Set(VERBATIM);
  for (const m of latex.matchAll(/\\(?:lstnewenvironment|DefineVerbatimEnvironment|RecustomVerbatimEnvironment|newtcblisting|renewtcblisting|NewTCBListing|excludecomment)\*?\s*\{([^{}]+)\}/g)) names.add((m[1] ?? '').trim());
  for (const m of latex.matchAll(/\\newminted\s*(?:\[([^\]]*)\])?\s*\{([^{}]+)\}/g)) {
    const name = m[1]?.trim() || `${(m[2] ?? '').trim()}code`;
    names.add(name);
    names.add(`${name}*`);
  }
  return names;
};

/** Commands whose argument TeX reads verbatim, or as a URL in which `%` and `#` are characters. */
const INLINE = new Set(['verb', 'Verb', 'lstinline', 'mintinline', 'url', 'nolinkurl', 'href']);

/**
 * What stands before a command that is being named, not used: `\newcommand{\url}`, `\def\section`, `\let\url`, and the
 * second name of `\let\myurl\url` or `\let\myurl=\url`. Such a command takes no argument there.
 */
const DEFINING =
  /(?:\\(?:(?:re)?newcommand|providecommand|DeclareRobustCommand|(?:New|Renew|Provide|Declare)DocumentCommand|(?:re)?newrobustcmd|robustify|[gex]?def|let)\*?\s*\{?\s*|\\let\s*\\[A-Za-z@]+\s*=?\s*)$/;

/** Every character but white space as `_`, so lines and blank lines stay where they were. */
const hidden = (text: string): string => text.replace(/\S/g, '_');

/**
 * `latex` the same length and on the same lines, with what is not read as
 * LaTeX hidden: comments as `%`s (so a comment line is not a blank one),
 * verbatim bodies and verbatim-like arguments as `_`s (a URL's braces kept,
 * so its argument can still be checked), and an escaped character (`\{`,
 * `\%`) as `\_`.
 */
const mask = (latex: string): string => {
  const verbatim = verbatimLike(latex);
  const n = latex.length;
  const out: string[] = [];
  let i = 0;
  const keep = (to: number): void => {
    out.push(latex.slice(i, to));
    i = to;
  };
  const hide = (to: number): void => {
    out.push(hidden(latex.slice(i, to)));
    i = to;
  };
  /** Past the `{…}` group that opens at `at`, braces nested. */
  const groupEnd = (at: number): number => {
    let depth = 0;
    for (let k = at; k < n; k++) {
      const c = latex[k];
      if (c === '\\') k++;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) return k + 1;
    }
    return n;
  };
  /** Past an optional `[…]` at `at`, or `at`. */
  const optional = (at: number): number => {
    const k = skipSpaces(latex, at);
    if (latex[k] !== '[') return at;
    const end = latex.indexOf(']', k);
    return end < 0 ? at : end + 1;
  };
  /**
   * A verbatim-like argument at `i`: a `{…}` group, its braces kept, or text between two of one character on one line.
   * `nested`: the group ends at its matching brace (`\url`, `\mintinline`), else at the first `}` (`\lstinline` reads braces as characters).
   */
  const argument = (nested: boolean): void => {
    const k = skipSpaces(latex, i);
    if (latex[k] === '{') {
      const first = latex.indexOf('}', k);
      const end = nested ? groupEnd(k) : first < 0 ? n : first + 1;
      keep(k + 1);
      hide(end - 1);
      keep(end);
      return;
    }
    // `}` ends the group the command sits in, `\` starts the next command, `#` is a macro parameter: none opens `\verb|…|`.
    const delimiter = latex[k];
    if (delimiter === undefined || /[\sA-Za-z}\\#]/.test(delimiter)) return;
    const close = latex.indexOf(delimiter, k + 1);
    const eol = latex.indexOf('\n', k + 1);
    hide(close < 0 || (eol >= 0 && eol < close) ? (eol < 0 ? n : eol) : close + 1);
  };
  while (i < n) {
    const c = latex[i];
    if (c === '%') {
      const eol = latex.indexOf('\n', i);
      const to = eol < 0 ? n : eol;
      out.push('%'.repeat(to - i));
      i = to;
      continue;
    }
    if (c !== '\\') {
      keep(i + 1);
      continue;
    }
    const word = /^\\([A-Za-z@]+)/.exec(latex.slice(i, i + 80));
    if (word === null) {
      // `\{`, `\}`, `\%`, `\\`: one character that opens nothing. A backslash at the end of a line is a control space.
      if (i + 1 >= n || latex[i + 1] === '\n') keep(i + 1);
      else {
        out.push('\\_');
        i += 2;
      }
      continue;
    }
    const name = word[1] ?? '';
    const start = i;
    keep(i + word[0].length);
    // `\providecommand{\url}{\texttt}`, `\newcommand{\code}{\lstinline}`: the command is named there, so what follows is not its argument.
    const named = INLINE.has(name) && (DEFINING.test(latex.slice(Math.max(0, start - 60), start)) || latex[skipSpaces(latex, i)] === '}');
    if (named) continue;
    if (name === 'begin') {
      const env = /^\s*\{([^{}]*)\}/.exec(latex.slice(i, i + 80));
      if (env === null || !verbatim.has((env[1] ?? '').trim())) continue;
      keep(i + env[0].length);
      const end = latex.indexOf(`\\end{${env[1]}}`, i);
      hide(end < 0 ? n : end);
    } else if (INLINE.has(name)) {
      if (latex[i] === '*' && name === 'verb') keep(i + 1);
      if (name !== 'verb') keep(optional(i));
      // \mintinline{language}{code}: the language is read as LaTeX.
      if (name === 'mintinline' && latex[skipSpaces(latex, i)] === '{') keep(groupEnd(skipSpaces(latex, i)));
      argument(!['verb', 'Verb', 'lstinline'].includes(name));
    }
  }
  // A brace written as a character code (`\ifnum0=`{\fi`, in alignment code) or in `\iffalse{\fi` opens no group.
  return out.join('').replace(/`[{}]/g, '`_').replace(/\\iffalse\s*[{}]\s*\\fi/g, (m) => m.replace(/[{}]/g, '_'));
};

const skipSpaces = (text: string, at: number): number => {
  let k = at;
  while (k < text.length && (text[k] === ' ' || text[k] === '\t')) k++;
  return k;
};

/** 1-based line numbers by offset. */
const lineIndex = (text: string): ((at: number) => number) => {
  const starts = [0];
  for (let k = text.indexOf('\n'); k >= 0; k = text.indexOf('\n', k + 1)) starts.push(k + 1);
  return (at) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if ((starts[mid] ?? 0) <= at) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
};

// ---- The checks ----

type Load = { readonly pkg: string; readonly options: readonly string[]; readonly line: number; readonly late: boolean; readonly guarded: boolean };

/** `a, b = c ,d` as `a`, `b=c`, `d`: commas inside braces do not split. */
const optionList = (given: string | undefined): string[] => {
  const options: string[] = [];
  let depth = 0;
  let current = '';
  for (const c of given ?? '') {
    if (c === '{') depth++;
    if (c === '}') depth--;
    if (c === ',' && depth === 0) {
      options.push(current);
      current = '';
    } else current += c;
  }
  options.push(current);
  return options.map((o) => o.replace(/\s+/g, ' ').replace(/\s*=\s*/g, '=').trim()).filter((o) => o !== '');
};

/** Whether `at` is inside a group opened after `start`: the braces between them leave one open. */
const insideAfter = (masked: string, start: number, at: number): boolean => {
  let depth = 0;
  for (let k = start; k < at; k++) {
    if (masked[k] === '{') depth++;
    else if (masked[k] === '}') depth--;
  }
  return depth > 0;
};

/** The preamble's package loads, in the order they run: one deferred to `\AtEndPreamble` or `\AtBeginDocument` after the rest. */
const loadsOf = (masked: string, begin: number, lineOf: (at: number) => number): Load[] => {
  const head = masked.slice(0, begin);
  const loads: Load[] = [];
  for (const m of head.matchAll(/\\(?:usepackage|RequirePackage)\s*(?:\[([^\]]*)\])?\s*\{([^{}]*)\}/g)) {
    const at = m.index ?? 0;
    const before = head.slice(Math.max(0, at - 400), at);
    const offset = Math.max(0, at - 400);
    const late = [...before.matchAll(/\\(?:AtEndPreamble|AtBeginDocument)\s*\{/g)].some((d) => insideAfter(head, offset + (d.index ?? 0), at));
    for (const pkg of optionList(m[2])) {
      const name = pkg.replace(/[^A-Za-z0-9_.@/-]/g, '');
      if (name === '') continue;
      const test = new RegExp(`\\\\(?:@ifpackageloaded|IfPackageLoadedTF|IfPackageLoadedF|IfPackageLoadedT|@ifpackagewith)\\s*\\{\\s*${name.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*\\}`, 'g');
      const guarded = [...before.matchAll(test)].some((g) => insideAfter(head, offset + (g.index ?? 0), at));
      loads.push({ pkg: name, options: optionList(m[1]), line: lineOf(at), late, guarded });
    }
  }
  return [...loads.filter((l) => !l.late), ...loads.filter((l) => l.late)];
};

/** Options given by `\PassOptionsToPackage` before the package's first load, which that load takes too. */
const passedBefore = (masked: string, begin: number, lineOf: (at: number) => number): { readonly pkg: string; readonly options: readonly string[]; readonly line: number }[] =>
  [...masked.slice(0, begin).matchAll(/\\PassOptionsToPackage\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g)].flatMap((m) =>
    optionList(m[2]).map((pkg) => ({ pkg, options: optionList(m[1]), line: lineOf(m.index ?? 0) })),
  );

const optionsCheck = (loads: readonly Load[], passed: ReturnType<typeof passedBefore>): Finding[] => {
  const findings: Finding[] = [];
  const byPackage = new Map<string, Load[]>();
  // A guarded load runs only when nothing loaded the package before it: then it is the first load, else it is skipped.
  for (const load of loads) {
    const list = byPackage.get(load.pkg) ?? [];
    if (!load.guarded || list.length === 0) byPackage.set(load.pkg, [...list, load]);
  }
  for (const [pkg, list] of byPackage) {
    const [first, ...later] = list;
    if (first === undefined || later.length === 0) continue;
    const given = new Set([...first.options, ...passed.filter((p) => p.pkg === pkg && p.line <= first.line).flatMap((p) => p.options)]);
    for (const load of later) {
      const extra = load.options.filter((o) => !given.has(o));
      if (extra.length === 0) continue;
      findings.push({ check: 'options', line: load.line, pkg, message: `${pkg} is loaded at line ${first.line} with [${[...given].join(',')}], then here with [${load.options.join(',')}]: [${extra.join(',')}] is new, so LaTeX stops at "Option clash for package ${pkg}"` });
    }
  }
  return findings;
};

const forbiddenCheck = (loads: readonly Load[], refuses: ReadonlySet<string>, className: string): Finding[] =>
  loads
    .filter((l) => refuses.has(l.pkg))
    .map((l) => ({ check: 'forbidden' as const, line: l.line, pkg: l.pkg, message: `${l.pkg} is loaded under ${className}, whose class profile refuses it (forbids.technical, or a conflict with a package the class loads itself)` }));

const braceCheck = (masked: string, lineOf: (at: number) => number): Finding[] => {
  const findings: Finding[] = [];
  const open: number[] = [];
  for (let k = 0; k < masked.length; k++) {
    const c = masked[k];
    if (c === '{') open.push(k);
    else if (c === '}' && open.pop() === undefined && findings.length < 3) findings.push({ check: 'balance', line: lineOf(k), message: 'this `}` closes no group' });
  }
  // The outermost first: a group left open holds everything after it, so its first line is where to look.
  for (const k of open.slice(0, 3)) findings.push({ check: 'balance', line: lineOf(k), message: 'a group opened on this line is never closed' });
  return findings;
};

const environmentCheck = (masked: string, begin: number, lineOf: (at: number) => number): Finding[] => {
  const findings: Finding[] = [];
  if (begin < 0) return findings;
  const envs: { readonly name: string; readonly at: number }[] = [];
  for (const m of masked.slice(begin).matchAll(/\\(begin|end)\s*\{([^{}]*)\}/g)) {
    const at = begin + (m.index ?? 0);
    const name = (m[2] ?? '').trim();
    if (m[1] === 'begin') {
      envs.push({ name, at });
      continue;
    }
    const depth = envs.map((e) => e.name).lastIndexOf(name);
    if (depth < 0) {
      findings.push({ check: 'balance', line: lineOf(at), message: `\\end{${name}} ends no open environment${envs.length === 0 ? '' : ` (\\begin{${envs[envs.length - 1]?.name}} is open)`}` });
      continue;
    }
    for (const e of envs.splice(depth + 1)) findings.push({ check: 'balance', line: lineOf(e.at), message: `\\begin{${e.name}} is not ended before \\end{${name}} at line ${lineOf(at)}` });
    envs.pop();
    if (name === 'document') return findings;
  }
  for (const e of envs) findings.push({ check: 'balance', line: lineOf(e.at), message: `\\begin{${e.name}} is never ended` });
  return findings;
};

/** The commands whose arguments cannot hold a paragraph, with how many mandatory arguments each takes. */
const NO_PARAGRAPH: { readonly [name: string]: number } = {
  part: 1,
  chapter: 1,
  section: 1,
  subsection: 1,
  subsubsection: 1,
  paragraph: 1,
  subparagraph: 1,
  caption: 1,
  captionof: 2,
  label: 1,
  ref: 1,
  cite: 1,
  url: 1,
  texorpdfstring: 2,
};

/** Past the `{…}` or `[…]` group that opens at `at` in masked text: brackets end only outside braces. */
const argumentEnd = (masked: string, at: number): number => {
  const close = masked[at] === '[' ? ']' : '}';
  let depth = 0;
  for (let k = at; k < masked.length; k++) {
    const c = masked[k];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    if (close === '}' ? depth === 0 : depth === 0 && c === ']') return k + 1;
    if (depth < 0) return -1;
  }
  return -1;
};

const paragraphCheck = (masked: string, begin: number, lineOf: (at: number) => number): Finding[] => {
  if (begin < 0) return [];
  const findings: Finding[] = [];
  const names = Object.keys(NO_PARAGRAPH).join('|');
  for (const m of masked.slice(begin).matchAll(new RegExp(`\\\\(${names})(?![A-Za-z@])`, 'g'))) {
    const name = m[1] ?? '';
    const at = begin + (m.index ?? 0);
    // Being defined, not used: `\renewcommand\section{…}`, `\def\section{…}`.
    if (DEFINING.test(masked.slice(Math.max(0, at - 60), at))) continue;
    let k = at + m[0].length;
    if (masked[k] === '*') k++;
    let mandatory = 0;
    while (mandatory < (NO_PARAGRAPH[name] ?? 1)) {
      // Spaces and one line end may stand between a command and its arguments; a blank line there is itself the argument, which is rare.
      let next = skipSpaces(masked, k);
      if (masked[next] === '\n') next = skipSpaces(masked, next + 1);
      const c = masked[next];
      if (c !== '{' && c !== '[') break;
      const end = argumentEnd(masked, next);
      if (end < 0) break;
      const text = masked.slice(next, end);
      const blank = /\n[ \t]*\n/.exec(text);
      const par = /\\par(?![A-Za-z@])/.exec(text);
      // The finding is on the line the argument opens, so its snippet shows the command; the break's own line is in the message.
      const at = blank !== null ? lineOf(next + blank.index + 1) : par !== null ? lineOf(next + par.index) : undefined;
      if (at !== undefined) findings.push({ check: 'paragraph', line: lineOf(next), at, message: `${blank !== null ? 'a blank line' : '\\par'} (line ${at}) inside \\${name}'s argument` });
      if (c === '{') mandatory++;
      k = end;
    }
  }
  return findings;
};

/**
 * Every check on one emitted cell; `full` false runs only the preamble's. `preambleEnd`: the last line before the
 * `\begin{document}` that is read (not one in a comment or a verbatim body), or the last line when there is none.
 */
const lint = (latex: string, refuses: ReadonlySet<string>, className: string, full: boolean): { readonly findings: Finding[]; readonly preambleEnd: number } => {
  const masked = mask(latex);
  const lineOf = lineIndex(latex);
  const begin = masked.indexOf('\\begin{document}');
  const loads = loadsOf(masked, begin < 0 ? masked.length : begin, lineOf);
  const passed = passedBefore(masked, begin < 0 ? masked.length : begin, lineOf);
  const preamble = [...optionsCheck(loads, passed), ...forbiddenCheck(loads, refuses, className)];
  const braces = full ? braceCheck(masked, lineOf) : [];
  // With a brace missing, an argument runs on to wherever its group happens to close: what it then holds says nothing.
  const all = full ? [...preamble, ...braces, ...environmentCheck(masked, begin, lineOf), ...(braces.length > 0 ? [] : paragraphCheck(masked, begin, lineOf))] : preamble;
  // One mistake can be found twice: `\section{\texorpdfstring{a<blank>b}{c}}` has one break in two arguments opened on one
  // line. Two breaks, or two packages, on one line stay two findings: each is its own mistake, and a package finds its own ways.
  const seen = new Set<string>();
  const findings = all.filter((f) => {
    const key = `${f.check} ${f.line} ${f.pkg ?? ''} ${f.at ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { findings, preambleEnd: begin < 0 ? lineOf(latex.length) : lineOf(begin) - 1 };
};

// ---- Who a finding belongs to ----

/** A branch's leaf as its way: node, way, and the variant's compat params and flags when it has any. */
const leafOf = (branch: BranchSpec): string => {
  const leaf = branch.path.at(-1);
  if (leaf === undefined) return '(no leaf)';
  const { compat, flags } = leaf.variant;
  const params = { ...compat, ...flags };
  return `${leaf.node} · ${leaf.variant.way}${Object.keys(params).length === 0 ? '' : ` ${canonical(params)}`}`;
};

const presetOf = (branch: BranchSpec): string | undefined => {
  const preset = branch.path.at(-1)?.member['preset'];
  return typeof preset === 'string' ? preset : undefined;
};

/** A markdown code span that holds any backticks the text has. */
const code = (text: string): string => {
  const longest = Math.max(0, ...[...text.matchAll(/`+/g)].map((m) => m[0].length));
  const fence = '`'.repeat(longest + 1);
  return `${fence}${longest > 0 ? ' ' : ''}${text}${longest > 0 ? ' ' : ''}${fence}`;
};

const snippetAt = (latex: string, line: number): string => {
  const text = (latex.split('\n')[line - 1] ?? '').trim();
  return text.length > 160 ? `${text.slice(0, 157)}...` : text;
};

type Example = { readonly where: string; readonly line: number; readonly message: string; readonly snippet: string };
type Group = { count: number; readonly units: Set<string>; readonly presets: Set<string>; readonly examples: Example[] };

const EXAMPLES = 3;

const add = (groups: Map<string, Group>, key: string, unit: string, example: Example, preset?: string): void => {
  const group = groups.get(key) ?? { count: 0, units: new Set<string>(), presets: new Set<string>(), examples: [] };
  group.count++;
  group.units.add(unit);
  if (preset !== undefined) group.presets.add(preset);
  if (group.examples.length < EXAMPLES) group.examples.push(example);
  groups.set(key, group);
};

type PairReport = {
  solo: number;
  matrix: number;
  /** Per check: findings by way (solo) and by the ways whose lines hold them (matrix). */
  readonly solos: Map<Check, Map<string, Group>>;
  readonly matrices: Map<Check, Map<string, Group>>;
};

const newReport = (): PairReport => ({ solo: 0, matrix: 0, solos: new Map(CHECKS.map((c) => [c, new Map()])), matrices: new Map(CHECKS.map((c) => [c, new Map()])) });

// ---- The run ----

type Classes = Awaited<ReturnType<typeof latexLibClasses>>;

const ws = openWorkspace({ classes: ['article'], setups: ['A'] });
try {
  const classes = await latexLibClasses(ws);
  const files = option('file');
  const total = files === undefined ? await lintCells(classes) : lintFiles(files.split(','), classes);
  if (flag('strict') && total > 0) process.exitCode = 1;
} finally {
  await ws.close();
}

/**
 * `--file a.tex,b.tex`: those files instead of the emitted cells (a folder: its `.tex` files, as `--tex` writes them), every
 * check, under the first picked class setting: a reproducer, or a document edited by hand. Findings are printed, not written.
 */
function lintFiles(given: readonly string[], classes: Classes): number {
  const setting = ws.classSettings[0];
  // The host keys a class's facts by the setting when a profile has its id (a style on article, eccv on llncs), else by
  // the documentclass name.
  const refuses = new Set(classes.get(setting === undefined ? '' : classes.has(setting.id) ? setting.id : setting.class)?.refuses ?? []);
  const files = given.flatMap((f) => (statSync(f).isDirectory() ? readdirSync(f).filter((n) => n.endsWith('.tex')).sort().map((n) => join(f, n)) : [f]));
  let found = 0;
  for (const file of files) {
    const latex = readFileSync(file, 'utf8');
    for (const f of lint(latex, refuses, setting?.class ?? '', true).findings) {
      found++;
      console.log(`${file}:${f.line}: ${f.check}: ${f.message}\n    ${snippetAt(latex, f.line)}`);
    }
  }
  console.log(`lint: ${found} finding(s) in ${files.length} file(s)`);
  return found;
}

/** The solo cells and the matrix documents of each picked pair, a report each; the number of findings. */
async function lintCells(classes: Classes): Promise<number> {
  const started = performance.now();
  const depth = numberOption('depth', 2);
  const size = numberOption('size', 64);
  // The library's ways always, as smoke.ts loads them: the filing below writes to the store, and a plan without them is not the one the matrix runs.
  const { host, plan, library } = loadSubject(ws.flouest, depth).withWays(await latexLibWays(ws), classes);
  const ways = new Map(library.all.map((w) => [w.id, w]));
  const rules = host.documentRules();
  const reports = new Map(ws.under.map((u) => [underName(u), newReport()]));
  const refusing = new Map(ws.classSettings.map((s) => [s.id, new Set(classes.get(classes.has(s.id) ? s.id : s.class)?.refuses ?? [])]));
  const texDir = option('tex');
  if (texDir !== undefined) mkdirSync(texDir, { recursive: true });

  /** The ways that put a preamble line there: in each branch whose lines hold it, the ways that load the package, else its leaf. */
  const ownersOf = (emitted: Emitted, branches: ReadonlyMap<string, BranchSpec>, finding: Finding): string => {
    const owners = (emitted.preamble ?? []).filter((s) => s.from <= finding.line && finding.line <= s.to).map((s) => branches.get(s.branch));
    const names = new Set<string>();
    for (const branch of owners) {
      if (branch === undefined) continue;
      const loading = branch.path.filter((step) => finding.pkg !== undefined && (ways.get(step.variant.way)?.loads ?? []).includes(finding.pkg)).map((step) => `${step.node} · ${step.variant.way}`);
      for (const name of loading.length > 0 ? loading : [leafOf(branch)]) names.add(name);
    }
    return names.size === 0 ? "the document's own lines (class setting, General's fixed preamble)" : [...names].sort().join(' + ');
  };

  const take = (job: JudgedJob, branches: ReadonlyMap<string, BranchSpec>, solo: BranchSpec | undefined): void => {
    const report = reports.get(`${job.cell.classSetting}.${job.cell.setup}`);
    if (report === undefined) return;
    const latex = job.emitted.latex;
    const { findings, preambleEnd } = lint(latex, refusing.get(job.cell.classSetting) ?? new Set(), ws.classSettings.find((s) => s.id === job.cell.classSetting)?.class ?? job.cell.classSetting, solo !== undefined);
    if (solo !== undefined) report.solo++;
    else report.matrix++;
    for (const f of findings) {
      const owner = f.pkg !== undefined && f.line <= preambleEnd ? ownersOf(job.emitted, branches, f) : undefined;
      const example = { where: solo === undefined ? `document ${job.cell.document}` : `branch ${solo.id}${solo.marked === true ? ' (marked)' : ''}`, line: f.line, message: f.message, snippet: snippetAt(latex, f.line) };
      if (solo !== undefined) {
        // A preamble line no branch put there is the document's, whichever solo cell shows it.
        const theDocument = owner !== undefined && owner.startsWith("the document's");
        add(report.solos.get(f.check) ?? new Map(), theDocument ? owner : leafOf(solo), solo.id, example, theDocument ? undefined : presetOf(solo));
      } else add(report.matrices.get(f.check) ?? new Map(), owner ?? '(no owner)', job.cell.document, example);
    }
    if (solo !== undefined && findings.length > 0 && texDir !== undefined) writeFileSync(join(texDir, `${job.cell.classSetting}.${job.cell.setup}.${solo.id}.tex`), latex);
  };

  const solos = soloBranches(host.nesting(depth), (node) => host.variants(node, library.ways(node)));
  // Each way is alone in two solo branches, once with the marked runs and once with the escape run, so a way's mistake is usually found twice.
  const soloWays = new Set(solos.map((b) => canonical({ node: b.path.at(-1)?.node, variant: b.path.at(-1)?.variant }))).size;
  for (const branch of solos) {
    for (const d of packBranches([branch], rules, 1)) {
      for (const job of documentCells(host, d, ws.classSettings, ws.setups, ws.classFiles)) take(job, new Map([[branch.id, branch]]), branch);
    }
  }
  // The same filing as runMatrix (src/matrix.ts) and ci/prepare.ts.
  const filing = fileBranches(ws.store, plan.branches, rules, { size, requires: (branch) => host.requires(branch), claims: (branch) => host.claims(branch) });
  for (const d of filing.documents) {
    const branches = new Map(d.document.paths.map((b) => [b.id, b]));
    for (const job of documentCells(host, d.document, ws.classSettings, ws.setups, ws.classFiles)) take(job, branches, undefined);
  }

  let total = 0;
  for (const u of ws.under) {
    const name = underName(u);
    const report = reports.get(name);
    if (report === undefined) continue;
    const given = option('out');
    const out = given === undefined ? join(ws.config.out, `lint-${name}.md`) : ws.under.length === 1 ? given : `${given.slice(0, given.length - extname(given).length)}.${name}${extname(given)}`;
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, markdown(name, report, solos.length, soloWays, filing.documents.length));
    const counts = CHECKS.map((c) => {
      const solo = sum(report.solos.get(c));
      const matrix = sum(report.matrices.get(c));
      total += solo + matrix;
      return `${c} ${solo}+${matrix}`;
    });
    console.log(`lint ${name}: ${report.solo} solo and ${report.matrix} matrix cells; findings (solo+matrix): ${counts.join(', ')}; ${out}`);
  }
  console.log(`lint: ${solos.length} solo branches (${soloWays} ways, each marked and unmarked), ${filing.documents.length} documents (${filing.filed.length} newly filed), in ${((performance.now() - started) / 1000).toFixed(0)} s`);
  return total;
}

function sum(groups: ReadonlyMap<string, Group> | undefined): number {
  return [...(groups?.values() ?? [])].reduce((n, g) => n + g.count, 0);
}

function markdown(name: string, report: PairReport, solos: number, ways: number, documents: number): string {
  const lines: string[] = [
    `# Lint: ${name}`,
    '',
    `Static checks on the emitted LaTeX, nothing compiled (\`ci/lint.ts\`): ${report.solo} solo cells of ${solos} solo branches (one branch each: ${ways} ways, each alone once with the marked runs and once with the escape run, so a way's mistake usually counts in two branches), and the preamble checks on ${report.matrix} cells of ${documents} matrix documents.`,
    '',
    '| Check | Solo findings | Ways | Matrix findings | Documents |',
    '|---|---:|---:|---:|---:|',
    ...CHECKS.map((c) => {
      const solo = report.solos.get(c) ?? new Map<string, Group>();
      const matrix = report.matrices.get(c) ?? new Map<string, Group>();
      const docs = new Set([...matrix.values()].flatMap((g) => [...g.units]));
      return `| ${c}: ${TITLES[c]} | ${sum(solo)} | ${solo.size} | ${c === 'options' || c === 'forbidden' ? sum(matrix) : '-'} | ${c === 'options' || c === 'forbidden' ? docs.size : '-'} |`;
    }),
    '',
  ];
  const section = (groups: ReadonlyMap<string, Group>, unit: string): void => {
    for (const [key, g] of [...groups].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))) {
      lines.push(`### ${key}`, '', `${g.count} finding(s) in ${g.units.size} ${unit}(s)${g.presets.size === 0 ? '' : `; presets ${[...g.presets].sort().join(', ')}`}.`, '');
      for (const e of g.examples) lines.push(`- ${e.where}, line ${e.line}: ${e.message}`, `  ${code(e.snippet)}`);
      if (g.count > g.examples.length) lines.push(`- and ${g.count - g.examples.length} more`);
      lines.push('');
    }
  };
  CHECKS.forEach((c, i) => {
    const solo = report.solos.get(c) ?? new Map<string, Group>();
    const matrix = report.matrices.get(c) ?? new Map<string, Group>();
    lines.push(`## ${i + 1}. ${c}: ${TITLES[c]}`, '');
    if (solo.size === 0 && matrix.size === 0) lines.push('None.', '');
    if (solo.size > 0) {
      lines.push('Solo cells, by way:', '');
      section(solo, 'branch');
    }
    if (matrix.size > 0) {
      lines.push('Matrix documents, by the ways whose preamble lines hold it:', '');
      section(matrix, 'document');
    }
  });
  return `${lines.join('\n')}\n`;
}
