/**
 * code.class-env's presets: one class's code environment each (jss, ltxdoc's doc, the AAAI kit).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const JSS_CLS = 'Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls';
const DOC_DTX = 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/doc.dtx';
const AAAI_TEX = 'Latex Related Research/Latex-lib-main/Source/0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex';

export const PRESETS = {
  'jss-input': {
    description: "The Journal of Statistical Software's input chunk: \\begin{CodeChunk} \\begin{CodeInput} … \\end{CodeInput} \\end{CodeChunk}, the code verbatim in slanted typewriter type (fancyvrb's Verbatim with fontshape=sl).",
    features: ['class-styled', 'captioned'],
    params: {},
    evidence: [{ kind: 'source', file: JSS_CLS, line: '203-210 (\\DefineVerbatimEnvironment{CodeInput}{Verbatim}{fontshape=sl}, \\newenvironment{CodeChunk}{}{})' }],
  },
  'jss-code': {
    description: "jss's Code environment: code verbatim in upright typewriter type, outside a chunk (a code block that is not an input/output pair).",
    writes: '\\begin{Code} … \\end{Code}',
    features: ['class-styled', 'captioned'],
    params: { env: 'Code', wrap: 'none' },
    evidence: [{ kind: 'source', file: JSS_CLS, line: '207 (\\DefineVerbatimEnvironment{Code}{Verbatim}{})' }],
  },
  'jss-sweave': {
    description: "jss's Sweave input: \\begin{Schunk} \\begin{Sinput} … \\end{Sinput} \\end{Schunk}, slanted typewriter type, as Sweave writes R input.",
    writes: '\\begin{Schunk} \\begin{Sinput} … \\end{Sinput} \\end{Schunk}',
    features: ['class-styled', 'captioned'],
    params: { env: 'Sinput' },
    evidence: [{ kind: 'source', file: JSS_CLS, line: '203-206 (Sinput, Soutput, Scode, Schunk)' }],
  },
  macrocode: {
    description: "doc's macrocode (ltxdoc): the code as a block of numbered, indexed code lines, \\begin{macrocode} … closed by '%    \\end{macrocode}' (a percent sign and exactly four spaces).",
    writes: '\\begin{macrocode} … %    \\end{macrocode}',
    features: ['class-styled', 'line-numbers'],
    params: { env: 'macrocode', wrap: 'none' },
    evidence: [{ kind: 'source', file: DOC_DTX, line: '490-512' }, solution('0390-titling', '38-39')],
  },
  'macrocode-macro': {
    description: "doc's macro environment around macrocode (ltxdoc): \\begin{macro}{\\name} prints the macro's name (the code block's caption) in the margin and indexes it, then the code lines; the way every .dtx documents a macro's definition.",
    writes: '\\begin{macro}{\\…}\\mbox{} \\begin{macrocode} … %    \\end{macrocode} \\end{macro}',
    features: ['class-styled', 'line-numbers', 'margin-note'],
    params: { env: 'macrocode', wrap: 'macro' },
    evidence: [{ kind: 'source', file: DOC_DTX, line: '558-576' }, solution('0390-titling', '38-39')],
  },
  'macrocode-environment': {
    description: "doc's environment environment around macrocode (ltxdoc): \\begin{environment}{name} prints the environment's name (the caption) in the margin and indexes it, then the code lines that define it.",
    writes: '\\begin{environment}{…}\\mbox{} \\begin{macrocode} … %    \\end{macrocode} \\end{environment}',
    features: ['class-styled', 'line-numbers', 'margin-note'],
    params: { env: 'macrocode', wrap: 'environment' },
    evidence: [{ kind: 'source', file: DOC_DTX, line: '611-615' }],
  },
  'aaai-listing': {
    description:
      "AAAI's listing: a ruled 'Listing n' float at the top or bottom of the page, its caption left in the header between rules (labelsep colon, upright label), the code in lstlisting in footnote-size typewriter type with line numbers inside the column (xleftmargin 2em), as the AAAI author kit sets it up.",
    writes:
      '\\DeclareCaptionStyle{ruled}{…} \\lstset{…} \\floatstyle{ruled} \\newfloat{listing}{tb}{lst}{} \\floatname{listing}{Listing}; \\begin{listing}[tb] \\caption{…} \\label{…} \\begin{lstlisting}[language=…, escapeinside={(*@}{@*)}] … \\end{lstlisting} \\end{listing}',
    features: ['floating', 'ruled', 'captioned', 'line-numbers', 'syntax-highlighting', 'escape-latex'],
    params: { env: 'listing' },
    evidence: [solution('0703-aaai', '67, 70'), { kind: 'source', file: AAAI_TEX, line: '21-33, 672-686' }],
  },
} as const satisfies { readonly [name: string]: Preset };
