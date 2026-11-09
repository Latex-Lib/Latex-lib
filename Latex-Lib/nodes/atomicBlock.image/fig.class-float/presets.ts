/**
 * fig.class-float's presets, one per class form, each from the template or class source that writes it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  scheme: {
    description: "A chemistry scheme in the class's own float kind, \\begin{scheme} … \\end{scheme}, numbered and captioned \"Scheme 1\" apart from figures (achemso; mdpi declares it too).",
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'kind', floatKind: 'scheme' },
    evidence: [
      { kind: 'source', file: `${SRC}/0528-achemso/achemso.dtx`, line: '1833-1838 (\\newfloat{scheme}{htbp}{los}, chart, graph), 1865-1869 (floats centred)' },
      { kind: 'source', file: `${SRC}/0528-achemso/achemso-demo.tex`, line: '205-222 (\\begin{scheme} … \\caption{An example scheme} \\label{sch:example} \\end{scheme})' },
      solution('0528-achemso', '44'),
    ],
  },
  chart: {
    description: "A chart in the class's own float kind, \\begin{chart} … \\end{chart}, captioned \"Chart 1\" (achemso, mdpi).",
    writes: '\\begin{chart} \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{chart}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'kind', floatKind: 'chart' },
    evidence: [{ kind: 'source', file: `${SRC}/0528-achemso/achemso.dtx`, line: '1835-1836 (\\newfloat{chart}{htbp}{loc}, \\floatname{chart}{Chart})' }],
  },
  graph: {
    description: "A graph in the class's own float kind, \\begin{graph} … \\end{graph}, captioned \"Graph 1\" (achemso, mdpi).",
    writes: '\\begin{graph} \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{graph}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'kind', floatKind: 'graph' },
    evidence: [{ kind: 'source', file: `${SRC}/0528-achemso/achemso.dtx`, line: '1837-1838 (\\newfloat{graph}{htbp}{loh}, \\floatname{graph}{Graph})' }],
  },
  'side-caption': {
    description: "A&A's side caption: a figure across both columns, \\sidecaption before the graphic, the caption set beside it when 5cm of the line are left and below it otherwise.",
    writes: '\\begin{figure*} \\sidecaption \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{figure*}',
    features: ['floating', 'captioned', 'scaled', 'side-caption', 'full-width', 'class-styled'],
    params: { form: 'sidecaption', span: true, center: false },
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '392-395 (\\aa@figgap 12pt, \\aa@sidecaptionminwidth 5cm), 1656-1705 (\\def\\sidecaption#1\\caption)' },
      solution('0411-aanda', '23'),
    ],
  },
  floatconts: {
    description: "jmlr's float layout: \\begin{figure}[htbp] \\floatconts{label}{\\caption{…}}{\\includegraphics…} \\end{figure}, the class centring the contents and placing the caption.",
    writes: '\\begin{figure}[htbp] \\floatconts {…} {\\caption{…}} {\\includegraphics[width=…]{…}} \\end{figure}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'floatconts' },
    evidence: [
      { kind: 'source', file: `${SRC}/0662-jmlr/jmlr.dtx`, line: '2022-2035 (\\floatconts, \\tableconts, \\figureconts)' },
      { kind: 'source', file: `${SRC}/0662-jmlr/pmlr-sample.tex`, line: '243-250, 414-422 (\\floatconts in every table and figure)' },
      solution('0662-jmlr', '23'),
    ],
  },
  'fit-figure': {
    description: "APA's figure: the number and title above, then the class's \\fitfigure{file}, the image at the line's width unless taller than the text block.",
    writes: '\\begin{figure} \\caption{…} \\label{…} \\fitfigure{…} \\end{figure}',
    features: ['floating', 'captioned', 'class-styled'],
    params: { form: 'fitfigure' },
    evidence: [
      { kind: 'compile', reproducer: "\\documentclass[man,natbib,floatsintext,nofontenc]{apa7} \\typeout{\\meaning\\fitfigure}: \\fitfigure is \\@protected@testopt with default 0.5, its body [#1]#2 -> \\sbox\\gr@box{\\includegraphics[width=\\linewidth]{#2}} … \\ifdim\\gr@boxheight>\\textheight \\centerline{\\includegraphics[height=#1\\textheight]{#2}}\\else\\usebox\\gr@box\\fi (apa7 2022/07/25 v2.16, ZeroTeX-NG, 2026-11-07); a figure with \\caption then \\fitfigure{figures/plot.png} typesets" },
    ],
  },
  'access-figure': {
    description: "IEEE Access's \\Figure[t!](topskip=0pt, botskip=0pt, midskip=0pt)[width=…]{file}{caption}: the class sets a figure, or a figure* when the image is a column wide or more, with its own skips.",
    writes: '\\Figure[t!](topskip=0pt, botskip=0pt, midskip=0pt)[width=…]{…}{…\\label{…}}',
    features: ['floating', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'access-figure' },
    evidence: [
      { kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '416-458 (figkeys, \\Figure[#1](#2)[#3]{#4}{#5}: figure or figure* by width)' },
      { kind: 'requirement', file: 'Template/template-requirement/IEEE_Access.md', line: '160-161' },
    ],
  },
  turnpage: {
    description: "REVTeX's landscape figure: \\begin{turnpage} around the figure float, which the class sets at \\textheight and turns on its side (revtex4-2, aastex).",
    writes: '\\begin{turnpage} \\begin{figure} \\centering \\includegraphics[width=…]{…} \\caption{…} \\label{…} \\end{figure} \\end{turnpage}',
    features: ['floating', 'rotated', 'centered', 'captioned', 'scaled', 'class-styled'],
    params: { form: 'turnpage' },
    evidence: [
      { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/tex/latex/revtex/revtex4-2.cls`, line: '4210-4216 (\\newenvironment{turnpage})' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '3876 (\\newenvironment{turnpage})' },
      { kind: 'source', file: `${SRC}/0908-aip-conference-proceedings/doc/latex/revtex/sample/aps/apstemplate.tex`, line: '113-120, 145-155' },
    ],
  },
  'wide-adjustwidth': {
    description: "MDPI's wide figure: \\begin{figure}[H] with the graphic in \\begin{adjustwidth}{-\\extralength}{0cm}, reaching into the page's left column, the caption below.",
    writes: '\\begin{figure}[H] \\begin{adjustwidth}{-\\extralength}{0cm} \\centering \\includegraphics[width=…]{…} \\end{adjustwidth} \\caption{…} \\label{…} \\end{figure}',
    features: ['here', 'centered', 'captioned', 'scaled', 'full-width', 'class-styled'],
    params: { form: 'adjustwidth' },
    evidence: [
      { kind: 'source', file: `${SRC}/0894-mdpi/template.tex`, line: '242-257 (wide figure in adjustwidth{-\\extralength}{0cm})' },
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/Definitions/mdpi.cls', line: '64 (changepage), 1579-1580 (\\extralength 4.61cm)' },
      solution('0894-mdpi', '33'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
