/**
 * code.class-env: a code block in an environment its class or kit defines for code, by `env`:
 * - jss (jss.cls l.203-210): fancyvrb's Verbatim under the journal's names, \begin{CodeChunk} \begin{CodeInput} … \end{CodeInput}
 *   \end{CodeChunk} (CodeInput slanted; Code upright; Sinput and Scode, the Sweave pair, in Schunk); escapes are dropped, as in
 *   any Verbatim without commandchars (code.verbatim's fancyvrb form);
 * - ltxdoc (doc.dtx l.490-512, 558-611): doc's \begin{macrocode} … %    \end{macrocode}, closed by exactly '%' and four spaces
 *   (doc looks for that string, not the command), or macrocode* with visible spaces; optionally inside \begin{macro}{\name} or
 *   \begin{environment}{name}, whose argument is the code block's caption and which prints it in the margin and indexes it,
 *   after an \mbox{} (doc.dtx l.573-576: without text before macrocode the marginal label is misplaced); escapes are dropped;
 * - aaai (anonymous-submission-latex-2026.tex l.21-33, 672-686): the ruled 'Listing n' float the template sets up, its caption in
 *   the header between rules, the code in listings' lstlisting under the template's \lstset; escapes between (*@ and @*).
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { codeText, labelOf, listingsLanguage, plainCaption } from '../node.ts';
import key from './key.ts';

const JSS = new Set(['CodeInput', 'Code', 'Sinput', 'Scode']);

/**
 * The caption as doc's macro or environment name: the emitted caption is LaTeX text, so a typed \foo arrives as
 * \textbackslash{}foo and is turned back. A macro name is one or more control sequences, comma-separated (doc v3, doc.dtx
 * l.580-584); an environment name is letters, perhaps starred. Anything else gives '' (no wrap).
 */
const docName = (caption: string, wrap: string): string => {
  const raw = caption.trim().replace(/\\textbackslash(\{\}|\s)/gu, '\\');
  if (wrap === 'macro') return /^\\[A-Za-z@]+(\s*,\s*\\[A-Za-z@]+)*$/u.test(raw) ? raw : '';
  if (wrap === 'environment') return /^[A-Za-z@]+\*?$/u.test(raw) ? raw : '';
  return '';
};

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const env = param(p, 'env', 'CodeInput');
  const wrap = param(p, 'wrap', 'chunk');
  const placement = param(p, 'placement', 'tb') === '' ? 'tb' : param(p, 'placement', 'tb');
  return {
    // aaai: the template's own set-up, word for word (l.21-33). float's \floatstyle and \newfloat come through algorithm.sty, as
    // in the template, which loads algorithm and never float: the AAAI instructions list float as forbidden (l.46).
    preamble: () =>
      env === 'listing'
        ? {
            packages: ['\\usepackage{algorithm}', '\\usepackage{listings}', '\\usepackage{caption}'],
            declarations: [
              '\\DeclareCaptionStyle{ruled}{labelfont=normalfont,labelsep=colon,strut=off}',
              `\\lstset{basicstyle={\\footnotesize\\ttfamily},${p['lineNumbers'] === false ? '' : 'numbers=left,numberstyle=\\footnotesize,xleftmargin=2em,'}aboveskip=0pt,belowskip=0pt,showstringspaces=false,tabsize=2,breaklines=true}`,
              `\\floatstyle{ruled}\n\\newfloat{listing}{${placement}}{lst}{}\n\\floatname{listing}{Listing}`,
            ],
          }
        : {},
    emit: (node, content, context) => {
      const caption = context !== undefined && context.trim() !== '' ? context.trim() : '';
      if (env === 'listing') {
        const lang = listingsLanguage(node);
        const label = labelOf(node);
        // The label only after a caption: without one, \label would take the counter of the section around the float.
        const head = caption === '' ? '' : `\n\\caption{${caption}}${label === '' ? '' : `\n\\label{${label}}`}`;
        const options = [...(lang === undefined ? [] : [`language=${lang}`]), 'escapeinside={(*@}{@*)}'];
        // As code.listings: an @ TeX expands inside an escape is \string@ (listings reads escapes with @ active).
        const code = codeText(content, (latex) => `(*@${latex.replaceAll('@', '\\string@')}@*)`);
        return `\\begin{listing}[${placement}]${head}\n\\begin{lstlisting}[${options.join(', ')}]\n${code}\n\\end{lstlisting}\n\\end{listing}\n\n`;
      }
      const code = codeText(content, () => '');
      if (env === 'macrocode') {
        const inner = p['showSpaces'] === true ? 'macrocode*' : 'macrocode';
        const block = `\\begin{${inner}}\n${code}\n%    \\end{${inner}}\n`;
        const name = docName(caption, wrap);
        if (name === '') return `${block}${plainCaption(context)}\n`;
        return `\\begin{${wrap}}{${name}}\\mbox{}\n${block}\\end{${wrap}}\n\n`;
      }
      if (!JSS.has(env)) return '';
      const chunk = wrap !== 'chunk' ? '' : env === 'Sinput' || env === 'Scode' ? 'Schunk' : 'CodeChunk';
      const block = `\\begin{${env}}\n${code}\n\\end{${env}}\n`;
      return `${chunk === '' ? block : `\\begin{${chunk}}\n${block}\\end{${chunk}}\n`}${plainCaption(context)}\n`;
    },
  };
};

export default realize;
