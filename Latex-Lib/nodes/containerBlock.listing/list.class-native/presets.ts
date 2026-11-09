/**
 * list.class-native's presets, one per class form, each from the class source or template that shows it.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

/** A file at its lines. */
const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const RESEARCH = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  apa7: {
    description: "apa7's own lists: a numbered list APAenumerate, its 1. 2. run into the paragraph at the paragraph indent, a bullet list APAitemize; nested levels and description lists the kernel's.",
    writes: '\\begin{APAenumerate|APAitemize} \\item … \\begin{enumerate|itemize} \\item … \\end{enumerate|itemize} \\end{APAenumerate|APAitemize}',
    features: ['class-styled', 'numbered'],
    params: { form: 'apa7' },
    evidence: [source('apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', '739-785 (APAenumerate, APAitemize)')],
  },
  'apa7-seriation': {
    description: "apa7's seriation within a sentence: a numbered list as \\begin{seriate} \\item … \\end{seriate}, each item lettered (a), (b), (c) in the running text.",
    writes: '\\begin{seriate} \\item … \\item … \\end{seriate}',
    features: ['class-styled', 'inline-list', 'lettered'],
    params: { form: 'apa7', seriation: true },
    evidence: [
      source('apa7.cls (apa7 2022/07/25 v2.16, MiKTeX snapshot 9766)', '739-785 (\\seriate: \\item prints (\\alph{APAenum}))'),
      source('Latex Related Research/Latex-Template-Examples/class.apa7/main.tex', '105 (seriation written with paralist\'s inparaenum[(a)] for want of the class\'s form)'),
    ],
  },
  jacow: {
    description: "jacow's compact lists: Itemize, Enumerate and Description, the kernel's lists with no space between items (enumitem's nosep), at every level.",
    writes: '\\begin{Itemize|Enumerate|Description} \\item … \\item[…] … \\end{Itemize|Enumerate|Description}',
    features: ['class-styled', 'numbered', 'compact'],
    params: { form: 'jacow' },
    evidence: [source('jacow.cls (jacow 2022/02/02 v2.7, MiKTeX snapshot 9766)', '319-322 (enumitem; Enumerate, Itemize, Description)')],
  },
  jmlr: {
    description: "jmlr's lists: a numbered list enumerate*, whose nested levels count on with one counter (1. 2. 3. at every depth), and a description list altdescription, its label column as wide as the widest label.",
    writes: '\\begin{enumerate*} \\item … \\end{enumerate*} \\begin{altdescription}{…} \\item[…] … \\end{altdescription}',
    features: ['class-styled', 'numbered', 'shared-counter', 'aligned-labels'],
    params: { form: 'jmlr' },
    evidence: [
      source(`${RESEARCH}/0662-jmlr/jmlr.dtx`, '2493-2509 (enumerate*), 2518-2531 (altdescription)'),
      source(`${RESEARCH}/0662-jmlr/pmlr-sample.tex`, '619-635 (enumerate*), 673-676 (altdescription)'),
      solution('0662-jmlr', '47'),
    ],
  },
  'cas-letters': {
    description: "cas's enumerate with its own label pattern: first-level items a), b), c) (\\begin{enumerate}[a)]), read by the class with no package; bullets and descriptions the class's.",
    writes: '\\begin{enumerate}[a)] \\item … \\end{enumerate}',
    features: ['class-styled', 'numbered', 'custom-labels', 'lettered'],
    params: { form: 'cas', pattern: 'a)' },
    evidence: [
      source(`${RESEARCH}/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty`, '2491-2520 (\\enumerate[pattern])'),
      { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '153-156, 243' },
    ],
  },
  'cas-roman': {
    description: "cas's enumerate with first-level items numbered in parenthesised roman numerals, (i), (ii), (iii) (\\begin{enumerate}[(i)]).",
    writes: '\\begin{enumerate}[(i)] \\item … \\end{enumerate}',
    features: ['class-styled', 'numbered', 'custom-labels'],
    params: { form: 'cas', pattern: '(i)' },
    evidence: [
      source(`${RESEARCH}/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty`, '2491-2520 (\\enumerate[pattern])'),
      { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '153-156' },
    ],
  },
  imsart: {
    description: "imsart's longlist for a numbered list, labelled (i), (ii) by the class; nested levels and other lists the kernel's.",
    writes: '\\begin{longlist} \\item … \\end{longlist}',
    features: ['class-styled', 'numbered'],
    params: { form: 'imsart' },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '100 (longlist, imsart.sty:3292-3316), 190 (shown in the sample, not required)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
