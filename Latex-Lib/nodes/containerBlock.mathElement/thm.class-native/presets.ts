/**
 * thm.class-native's presets: the class's own environments, as they are, and a kind the class lacks declared with the
 * class's own commands (elsarticle's and cas's \newdefinition, siamart's \newsiamthm and \newsiamremark, llncs's
 * \spnewtheorem), styles (sn-jnl's and OUP's thmstyle*), counter (spie's and jmlr's one theorem counter), setters (jmlr's \\theorembodyfont and the like) or names (mdpi's
 * capitalised ones).
 */
import type { Preset } from '../../../schema/params.ts';

const solution = (file: string, lines: string) => ({ kind: 'solution', file: `Solution/${file}.md`, lines }) as const;
const requirement = (file: string, line: string) => ({ kind: 'requirement', file: `Template/template-requirement/${file}.md`, line }) as const;
const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;

export const PRESETS = {
  native: {
    description: "The class's own theorem environments with its own style and numbering; a kind the class lacks is declared with \\newtheorem, which takes the class's current style.",
    features: ['class-styled', 'numbered'],
    params: {},
    evidence: [solution('0019-stylish-article', '38'), solution('0151-siam-siamonline', '53'), solution('0093-foiltex', '52'), solution('0743-ieeetran-journal', '74')],
  },
  elsarticle: {
    description: "elsarticle's own commands: theorem-like kinds with \\newtheorem (bold head, italic body), definitions, examples and remarks with \\newdefinition (upright body).",
    writes: '\\begin{definition}[{…}] … \\end{definition}; \\@ifundefined{definition}{\\ifdefined\\newdefinition\\newdefinition{definition}{Definition}\\else…\\fi}{}',
    features: ['class-styled', 'numbered', 'bold-head', 'italic-body', 'upright-body'],
    params: { uprightCommand: '\\newdefinition' },
    evidence: [solution('0107-elsarticle', '53'), { kind: 'requirement', file: 'Template/template-requirement/Elsarticle.md', line: '113' }],
  },
  cas: {
    description:
      "Elsevier's CAS classes (cas-sc, cas-dc): theorem-like kinds with \\newtheorem (bold 'Theorem 1.' head, italic body), definitions, examples and remarks with cas-common's \\newdefinition (upright body), and an unnumbered proof with its \\newproof (small-caps head, roman body) where none is defined.",
    writes:
      '\\begin{theorem}[{…}] … \\end{theorem}; \\@ifundefined{definition}{\\ifdefined\\newdefinition\\newdefinition{definition}{Definition}\\else…\\fi}{}; \\@ifundefined{proof}{\\ifdefined\\newproof\\newproof{proof}{Proof}\\fi}{}',
    features: ['class-styled', 'numbered', 'bold-head', 'italic-body', 'upright-body'],
    params: { uprightCommand: '\\newdefinition', proofCommand: '\\newproof' },
    evidence: [
      requirement('Elsevier_CAS_DC', '121'),
      requirement('Elsevier_CAS_SC', '88'),
      source('Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty', '2541-2627 (\\newdefinition, its upright head, \\newproof)'),
    ],
  },
  siam: {
    description:
      "siamart's own commands for a kind it lacks: \\newsiamthm for theorem-like kinds (small-caps head, italic body) and \\newsiamremark for definitions, examples and remarks (italic head, roman body), both on the class's one theorem counter, each with its \\crefname, as SIAM's ex_shared.tex declares remark, hypothesis and claim.",
    writes:
      '\\begin{remark}[{…}] … \\end{remark}; \\@ifundefined{remark}{\\ifdefined\\newsiamremark\\newsiamremark{remark}{Remark}\\else…\\fi\\ifdefined\\crefname\\crefname{remark}{Remark}{Remarks}\\fi}{}; \\newsiamthm{property}{Property}',
    features: ['class-styled', 'numbered', 'shared-counter', 'smallcaps-head', 'italic-head', 'italic-body', 'upright-body'],
    params: { plainCommand: '\\newsiamthm', uprightCommand: '\\newsiamremark', crefNames: true },
    evidence: [
      solution('0186-siam-siamart', '56'),
      requirement('SIAM_Siamart', '117'),
      source('testing-pipeline/settings/classes/files/siamart251216.cls', '1483-1507 (\\newsiamthm, \\newsiamremark)'),
      source('Latex Related Research/Latex-lib-main/Source/0186-siam-siamart/ex_shared.tex', '23-28 (\\newsiamremark, \\newsiamthm, \\crefname)'),
    ],
  },
  llncs: {
    description:
      "llncs's own \\spnewtheorem for a kind the class lacks (llncs and eccv predefine every statement kind), with the head and body fonts after the name: bold head and italic body for theorem-like kinds, italic head and roman body for definitions, examples and remarks, as llncs gives its own.",
    writes: '\\begin{lemma}[{…}] … \\end{lemma}; \\@ifundefined{lemma}{\\ifdefined\\spnewtheorem\\spnewtheorem{lemma}{Lemma}{\\bfseries}{\\itshape}\\else…\\fi}{}',
    features: ['class-styled', 'numbered', 'bold-head', 'italic-body'],
    params: { plainCommand: '\\spnewtheorem', uprightCommand: '\\spnewtheorem', plainFonts: '{\\bfseries}{\\itshape}', uprightFonts: '{\\itshape}{\\rmfamily}' },
    evidence: [solution('0712-llncs', '61'), source('Latex Related Research/Latex-lib-main/Source/0712-llncs/llncs.cls', '1040-1183 (\\spnewtheorem and the predefined kinds with their fonts)')],
  },
  thmstyle: {
    description:
      "The theorem styles sn-jnl and OUP's authoring template define (the classes declare no statement of their own): theorem, lemma, corollary, proposition and property under thmstyleone on the theorem's counter, example and remark under thmstyletwo, definition under thmstylethree, each with \\newtheorem.",
    writes: '\\theoremstyle{thmstyleone}\\newtheorem{theorem}{Theorem} \\theoremstyle{thmstyleone}\\newtheorem{proposition}[theorem]{Proposition} \\theoremstyle{thmstyletwo}\\newtheorem{example}{Example} \\theoremstyle{thmstylethree}\\newtheorem{definition}{Definition}; \\begin{theorem}[{…}] … \\end{theorem}',
    features: ['class-styled', 'numbered', 'shared-counter'],
    params: { theoremStyles: 'thmstyle', theoremCounter: 'plain' },
    evidence: [
      requirement('Springer_Nature_SN_Jnl', '75'),
      solution('0914-oup-authoring-template', '55'),
      source('Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', '2639-2692 (thmstyleone, thmstyletwo, thmstylethree, thmstylefour)'),
    ],
  },
  shared: {
    description:
      "The class's own environments on its one theorem counter (spie's theorem, lemma and definition; jmlr's theorem and the kinds numbered with it): a kind the class lacks is declared with \\newtheorem on the theorem's counter, so it numbers with them.",
    writes: '\\begin{theorem}[{…}] … \\end{theorem}; \\@ifundefined{corollary}{\\newtheorem{corollary}[theorem]{Corollary}}{}',
    features: ['class-styled', 'numbered', 'shared-counter'],
    params: { theoremCounter: 'all' },
    evidence: [
      source('spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', '328-334 (proof; theorem, lemma and definition on one counter)'),
      solution('0662-jmlr', '53'),
      source('Latex Related Research/Latex-lib-main/Source/0662-jmlr/jmlr.dtx', '2766-2858 (the predefined kinds, [theorem])'),
    ],
  },
  jmlr: {
    description:
      "jmlr's (and pmlr's) one theorem counter with the class's own style setters, as PMLR's sample declares its extra kind: a kind the class lacks (property) is declared with \\newtheorem on the theorem's counter after \\theorembodyfont{\\upshape}, \\theoremheaderfont{\\scshape}, \\theorempostheader{:} and \\theoremsep{\\newline} (small-caps 'Property 1:' head, upright body on the next line), which are put back afterwards; the class's own kinds keep their bold head and italic body.",
    writes:
      '\\begin{theorem}[{…}] … \\end{theorem}; \\@ifundefined{property}{\\theorembodyfont{\\upshape}\\theoremheaderfont{\\scshape}\\theorempostheader{:}\\theoremsep{\\newline}\\newtheorem{property}[theorem]{Property}}{}',
    features: ['class-styled', 'numbered', 'shared-counter', 'smallcaps-head', 'upright-body'],
    params: { theoremCounter: 'all', theoremSetters: 'jmlr', bodyFont: '\\upshape', headerFont: '\\scshape', postHeader: ':', separator: '\\newline' },
    evidence: [
      source('Latex Related Research/Latex-lib-main/Source/0662-jmlr/pmlr-sample.tex', '22-26 (\\theorembodyfont, \\theoremheaderfont, \\theorempostheader, \\theoremsep, then \\newtheorem*{note}{Note})'),
      source('Latex Related Research/Latex-lib-main/Source/0662-jmlr/jmlr.dtx', '2590-2686 (the setters, and \\newtheorem recording them for the kind)'),
      solution('0662-jmlr', '53'),
    ],
  },
  mdpi: {
    description: "mdpi's capitalised environments (Theorem, Lemma, Definition, Remark, ... each on its own counter in the class's mdpi style): a statement prints as \\begin{Theorem}[{…}] … \\end{Theorem}.",
    writes: '\\begin{Theorem}[{…}] … \\end{Theorem}; \\@ifundefined{Theorem}{\\newtheorem{Theorem}{Theorem}}{}',
    features: ['class-styled', 'numbered', 'bold-head', 'italic-body'],
    params: { capitalise: true },
    evidence: [solution('0894-mdpi', '77'), source('testing-pipeline/settings/classes/files/Definitions/mdpi.cls', '230-309 (\\theoremstyle{mdpi} and the fourteen \\newtheorem{Name}[counter]{Name})')],
  },
} as const satisfies { readonly [name: string]: Preset };
