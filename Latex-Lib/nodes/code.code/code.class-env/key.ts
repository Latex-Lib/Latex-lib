import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const JSS_CLS = 'Latex Related Research/Latex-lib-main/Source/0623-jss/jss.cls';
const DOC_DTX = 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/doc.dtx';
const AAAI_TEX = 'Latex Related Research/Latex-lib-main/Source/0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex';

export default defineKey(
  minimal({
    id: 'code.class-env',
    node: 'code/code',
    description:
      "A code block in the code environment its class or author kit defines: the Journal of Statistical Software's (jss) \\begin{CodeChunk}\\begin{CodeInput} … \\end{CodeInput}\\end{CodeChunk}, Code, or Sweave's Sinput in Schunk; ltxdoc's (doc package) \\begin{macrocode} … %    \\end{macrocode}, optionally in \\begin{macro}{\\name} or \\begin{environment}{name} with the name in the margin; or AAAI's ruled 'Listing n' float, \\begin{listing}[tb]\\caption{…}\\begin{lstlisting} … \\end{lstlisting}\\end{listing}, with the kit's \\lstset and \\newfloat set-up.",
    writes: '\\begin{CodeChunk} \\begin{CodeInput} … \\end{CodeInput} \\end{CodeChunk} \\begin{center}…\\end{center}',
    ctan: ['fancyvrb', 'doc', 'listings', 'float'],
    features: ['class-styled', 'captioned', 'line-numbers', 'margin-note', 'floating', 'ruled', 'syntax-highlighting', 'escape-latex'],
    params: {
      env: {
        type: 'enum',
        values: ['CodeInput', 'Code', 'Sinput', 'Scode', 'macrocode', 'listing'],
        default: 'CodeInput',
        compat: true,
        description: "the environment: jss's CodeInput, Code, Sinput or Scode; doc's macrocode (ltxdoc); AAAI's listing float",
      },
      wrap: {
        type: 'enum',
        values: ['chunk', 'none', 'macro', 'environment'],
        default: 'chunk',
        compat: true,
        description: "around it: jss's CodeChunk (Schunk for Sinput and Scode) or nothing; doc's macro or environment environment, named by the caption, or nothing; ignored by the AAAI listing",
      },
      showSpaces: { type: 'boolean', default: false, description: 'macrocode: spaces shown as ␣ (macrocode*)' },
      placement: { type: 'string', default: 'tb', description: "AAAI listing: the float's placement" },
      lineNumbers: { type: 'boolean', default: true, description: "AAAI listing: line numbers at the left inside the column (the kit's numbers=left, numberstyle, xleftmargin=2em line)" },
    },
    presets: PRESETS,
    // The AAAI listing's set-up. float's \floatstyle and \newfloat come through algorithm.sty, as in the kit, which loads
    // algorithm and lists float as forbidden (l.18, 46); caption gives \DeclareCaptionStyle (the kit loads it, l.12).
    loads: [
      { pkg: 'algorithm', when: { env: 'listing' } },
      { pkg: 'listings', when: { env: 'listing' } },
      { pkg: 'caption', when: { env: 'listing' } },
    ],
    defines: [{ name: 'env:listing', when: { env: 'listing' } }],
    requires: ['env:{env}'],
    requiresWhen: [
      { when: { env: ['CodeInput', 'Code'], wrap: 'chunk' }, requires: ['env:CodeChunk'] },
      { when: { env: ['Sinput', 'Scode'], wrap: 'chunk' }, requires: ['env:Schunk'] },
      { when: { env: 'macrocode', wrap: 'macro' }, requires: ['env:macro'] },
      { when: { env: 'macrocode', wrap: 'environment' }, requires: ['env:environment'] },
    ],
    only: ['class.jss', 'class.ltxdoc', 'class.aaai'],
    onlyWhen: [
      {
        when: { env: ['CodeInput', 'Code', 'Sinput', 'Scode'] },
        classes: ['class.jss'],
        reason: 'jss.cls defines its code environments itself with fancyvrb (\\DefineVerbatimEnvironment, l.203-210); no other profile defines them, so elsewhere they stop at "Environment CodeInput undefined"',
        evidence: [{ kind: 'source', file: JSS_CLS, line: '203-210' }],
      },
      {
        when: { env: 'macrocode' },
        classes: ['class.ltxdoc'],
        reason: "macrocode, macro and environment are the doc package's, which ltxdoc loads (its profile preloads doc); elsewhere \"Environment macrocode undefined\"",
        evidence: [{ kind: 'source', file: DOC_DTX, line: '490-512, 558-615' }],
      },
      {
        when: { env: 'listing' },
        classes: ['class.aaai'],
        reason: "the ruled listing float and its \\lstset are the AAAI author kit's set-up (the kit's own preamble, l.21-33), which AAAI's instructions require for listings (l.672-674); under another class it is a new float named listing that the class does not ask for",
        evidence: [{ kind: 'source', file: AAAI_TEX, line: '21-33, 672-686' }],
      },
    ],
    // Verbatim (fancyvrb, doc's macrocode, lstlisting): not where its body is read as an argument (code.listings' key says where).
    needs: { verbatim: true, argument: false },
    // The listing is a float besides: it needs a place that takes floats.
    needsWhen: [{ when: { env: 'listing' }, needs: { floats: true } }],
    // Typeset ok on ZeroTeX-NG (2026-11-07, Latex-Lib builder probe), every preset: jss-input, jss-code and jss-sweave under
    // [article]{jss} (jss.cls from Source/0623-jss, the profile's digest 2be72971…); macrocode, macrocode-macro (\foo in the margin),
    // macrocode-environment (and macrocode*) under ltxdoc, each closed by its '%    \end{macrocode}' line; aaai-listing under
    // article with \usepackage[submission]{aaai2026} (the kit in Source/0703-aaai; the profile pins aaai2027.sty, not in this
    // checkout), 'Listing 1: Hello' between rules, numbered line, the escape printed bold, \ref resolved.
    targetEngine: 'yes',
  }),
);
