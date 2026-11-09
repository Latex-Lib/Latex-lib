/**
 * doc.class-setup (doc): a class's own set-up commands, the template's constants, in the preamble, one line per
 * parameter set and only the chosen form's: memoir's layout and spacing (memoir.dtx l.4634, 4705, 5513, 7687-7772),
 * jlreq's \jlreqsetup (preamble only, jlreq.cls l.437-445), ctex's \ctexset, achemso's \SectionNumbersOn/Off and
 * \setkeys{acs} (achemso.dtx l.313-338, 1955-1968), sn-jnl's \unnumbered, SPIE's \baselinestretch, page style and first
 * page, Tufte-LaTeX's \setsidenotefont and siblings (tufte-common.def), JACoW's title block skips, letter's
 * \longindentation, \makelabels, page style and names (letter.cls l.163-220), elsarticle's \newpageafter, \keywordtitle,
 * \myfooter (elsarticle.dtx l.808-861, 1093-1101), exam's answer key and points, ltxdoc's index and change history (doc.dtx).
 * Prints nothing at the defaults. ltxdoc's \PrintChanges and \PrintIndex belong at the document's end, so they go into
 * \AtEndDocument from the preamble: a Flouest template carries preamble lines only.
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const v = (name: string): string => param(p, name);
  const on = (name: string): boolean => p[name] === true;
  /** `line` when the parameter is set (not '' or class). */
  const when = (name: string, line: (value: string) => string): string[] => (v(name) === '' || v(name) === 'class' ? [] : [line(v(name))]);

  const forms: { readonly [form: string]: () => string[] } = {
    memoir: () => {
      const trimmed = v('trimHeight') !== '' && v('trimWidth') !== '' ? [`\\settrimmedsize{${v('trimHeight')}}{${v('trimWidth')}}{*}`] : [];
      const lr = v('spine') !== '' || v('edge') !== '' ? [`\\setlrmarginsandblock{${v('spine') || '*'}}{${v('edge') || '*'}}{*}`] : [];
      const ul = v('upper') !== '' || v('lower') !== '' ? [`\\setulmarginsandblock{${v('upper') || '*'}}{${v('lower') || '*'}}{*}`] : [];
      const layout = [...trimmed, ...lr, ...ul];
      const spacing = { single: '\\SingleSpacing', onehalf: '\\OnehalfSpacing', double: '\\DoubleSpacing' }[v('spacing')];
      return [...layout, ...(layout.length === 0 ? [] : ['\\checkandfixthelayout']), ...(spacing === undefined ? [] : [spacing])];
    },
    jlreq: () => when('jlreqSettings', (s) => `\\jlreqsetup{${s}}`),
    ctex: () => {
      const keys = [...when('ctexToday', (t) => `today=${t}`), ...when('contentsName', (n) => `contentsname={${n}}`), ...when('ctexKeys', (k) => k)];
      return keys.length === 0 ? [] : [`\\ctexset{${keys.join(', ')}}`];
    },
    achemso: () => [...when('sectionNumbers', (s) => (s === 'on' ? '\\SectionNumbersOn' : '\\SectionNumbersOff')), ...when('acsKeys', (k) => `\\setkeys{acs}{${k}}`)],
    'sn-jnl': () => (p['numbered'] === false ? ['\\unnumbered'] : []),
    spie: () => [...when('baselineStretch', (s) => `\\renewcommand{\\baselinestretch}{${s}}`), ...when('pageStyle', (s) => `\\pagestyle{${s}}`), ...when('firstPage', (n) => `\\setcounter{page}{${n}}`)],
    tufte: () => [
      ...when('sidenoteFont', (f) => `\\setsidenotefont{${f}}`),
      ...when('marginnoteFont', (f) => `\\setmarginnotefont{${f}}`),
      ...when('captionFont', (f) => `\\setcaptionfont{${f}}`),
      ...when('citationFont', (f) => `\\setcitationfont{${f}}`),
    ],
    jacow: () => [
      ...when('titleblockStartSkip', (d) => `\\setlength{\\titleblockstartskip}{${d}}`),
      ...when('titleblockMiddleSkip', (d) => `\\setlength{\\titleblockmiddleskip}{${d}}`),
      ...when('titleblockEndSkip', (d) => `\\setlength{\\titleblockendskip}{${d}}`),
    ],
    letter: () => [
      ...when('longIndentation', (d) => `\\setlength{\\longindentation}{${d}}`),
      // \makelabels is \@onlypreamble (letter.cls l.163-171).
      ...(on('makelabels') ? ['\\makelabels'] : []),
      ...when('pageStyle', (s) => `\\pagestyle{${s}}`),
      ...when('ccName', (n) => `\\renewcommand*{\\ccname}{${n}}`),
      ...when('enclName', (n) => `\\renewcommand*{\\enclname}{${n}}`),
    ],
    elsarticle: () => [
      ...(v('newpageafter') === 'none' || v('newpageafter') === '' ? [] : [`\\newpageafter{${v('newpageafter')}}`]),
      ...when('keywordTitle', (t) => `\\keywordtitle{${t}}`),
      ...when('keywordTitleSep', (t) => `\\keywordtitlesep{${t}}`),
      // \myfooter[#1]#2 takes the bracket always (elsarticle.dtx l.1095).
      ...when('footer', (t) => `\\myfooter[${v('footerAlign') || 'C'}]{${t}}`),
      ...when('footerFont', (f) => `\\myfooterfont{${f}}`),
    ],
    exam: () => [
      ...(on('printAnswers') ? ['\\printanswers'] : []),
      ...when('solutionStyle', (s) => `\\${s}solutions`),
      ...when('solutionTitle', (t) => `\\renewcommand{\\solutiontitle}{\\noindent\\textbf{${t}}\\enspace}`),
      ...(v('pointName') === '' && v('pointsName') === '' ? [] : [`\\pointpoints{${v('pointName') || 'point'}}{${v('pointsName') || 'points'}}`]),
      ...when('pointPlacement', (s) => ({ bracketed: '\\bracketedpoints', margin: '\\pointsinmargin', rightmargin: '\\pointsinrightmargin' })[s] ?? ''),
      ...when('questionFormat', (f) => `\\qformat{${f}}`),
      ...when('pointFormat', (f) => `\\pointformat{${f}}`),
    ],
    ltxdoc: () => {
      const end = [...(on('printChanges') ? ['\\PrintChanges'] : []), ...(on('printIndex') ? ['\\PrintIndex'] : [])];
      return [
        ...when('crossrefs', (c) => (c === 'enable' ? '\\EnableCrossrefs' : '\\DisableCrossrefs')),
        ...(v('indexBy') === 'codeline' ? ['\\CodelineIndex'] : v('indexBy') === 'page' ? ['\\PageIndex'] : []),
        ...(on('recordChanges') ? ['\\RecordChanges'] : []),
        ...when('doNotIndex', (l) => `\\DoNotIndex{${l}}`),
        ...(end.length === 0 ? [] : [`\\AtEndDocument{${end.join(' ')}}`]),
      ];
    },
  };

  return {
    preamble: () => {
      const lines = (forms[v('form') || 'memoir'] ?? (() => []))().filter((l) => l !== '');
      return lines.length === 0 ? {} : { declarations: lines };
    },
    emit: () => '',
  };
};

export default realize;
