/**
 * front.author-blocks (paragraph/title). The kernel's \title, \author, \date and \maketitle with each author's
 * affiliations, e-mail and notes printed in the author block: as \\ lines under the name (article, report, cvpr, the
 * \And/\AND blocks of iclr, colm, neurips and acl), in \thanks (article, extarticle, jlreq, proc), or after the name on
 * one line (JACoW); with an optional subtitle and title note in \title, and the keywords as a run-in line at the
 * abstract's end, through the kernel's environment hook.
 * CTAN: https://ctan.org/pkg/latex-base
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { templateField, templateList, titleLinesWith } from '../node.ts';
import { authorBlock } from './blocks.ts';
import key from './key.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  const flag = (name: string): boolean => p[name] === true;
  return {
    // \url for the e-mails needs url.sty (the kernel has no \url); every other form is the kernel's.
    preamble: () => (param(p, 'emailForm', 'texttt') === 'url' && param(p, 'emailAt', 'line') !== 'none' ? { packages: ['\\usepackage{url}'] } : {}),
    // In the body, just before \maketitle, as front.maketitle and front.class-native write it (their comment gives why: revtex4-2 and
    // aastex701 clear the title at \begin{document}; the kernel's \title, \author and \date only store their text until \maketitle).
    emit: (node, content) => {
      const titleFont = param(p, 'titleFont', '');
      const subtitle = param(p, 'subtitle', 'none') === 'line' ? templateField(node, 'subtitle') : '';
      const titleNote = flag('titleNote') ? templateField(node, 'titleNote') : '';
      const title = `\\title{${titleFont === '' ? '' : `${titleFont} `}${content.trim()}${subtitle === '' ? '' : ` \\\\ {${param(p, 'subtitleFont', '\\large')} ${subtitle}}`}${titleNote === '' ? '' : `\\thanks{${titleNote}}`}}`;
      const author = authorBlock(node, {
        affiliationForm: param(p, 'affiliationForm', 'lines'),
        affiliationLines: param(p, 'affiliationLines', 'split'),
        emailAt: param(p, 'emailAt', 'line'),
        emailForm: param(p, 'emailForm', 'texttt'),
        emailCompress: flag('emailCompress'),
        orcidAt: param(p, 'orcidAt', 'none'),
        correspondingNote: param(p, 'correspondingNote', ''),
        grouping: param(p, 'grouping', 'per-author'),
        nameJoin: param(p, 'nameJoin', 'and'),
        nameFont: param(p, 'nameFont', ''),
        detailsFont: param(p, 'detailsFont', ''),
        separator: param(p, 'separator', 'and'),
        perLine: typeof p['perLine'] === 'number' ? p['perLine'] : 0,
        degreeLine: flag('degreeLine'),
      });
      const date = titleLinesWith(node, content, param(p, 'date', 'given')).filter((l) => l.startsWith('\\date{'));
      const paperID = flag('paperID') ? templateField(node, 'paperID') : '';
      const maintainer = flag('maintainedBy') ? templateField(node, 'maintainedBy') : '';
      // The keywords (templateSpecific.keywords, owner's decision) as a run-in line: at the end of the next abstract, after it, or
      // after the title. \AddToHookNext fires once, on the abstract that follows \maketitle (latex.ltx's env/<name>/end and
      // /after hooks); class.article's example sets the line inside its abstract (main.tex l.124-125).
      const at = param(p, 'keywordsAt', 'none');
      const keywords = at === 'none' ? '' : templateList(node, 'keywords').join(param(p, 'keywordsJoin', '; '));
      const classLabel = param(p, 'classificationLabel', '');
      const classification = keywords !== '' && classLabel !== '' ? templateField(node, 'classification') : '';
      const run = keywords === '' ? '' : `\\par\\noindent\\textbf{${param(p, 'keywordsLabel', 'Keywords:')}} ${keywords}${classification === '' ? '' : `\\par\\noindent\\textbf{${classLabel}} ${classification}`}`;
      const hook = run !== '' && at !== 'after-title' ? `\\AddToHookNext{env/abstract/${at === 'after-abstract' ? 'after' : 'end'}}{${run}}` : '';
      const before = [
        title,
        ...(author === '' ? [] : [`\\author{${author}}`]),
        ...date,
        ...(paperID === '' ? [] : [`\\def\\paperID{${paperID}}`]),
        ...(maintainer === '' ? [] : [`\\MaintainedBy{${maintainer}}`]),
        ...(hook === '' ? [] : [hook]),
      ];
      // proc's \copyrightspace (proc.dtx l.128-132, 407-415) reserves the first column's copyright box after the title's notes.
      const after = [...(flag('copyrightSpace') ? ['\\copyrightspace'] : []), ...(run !== '' && at === 'after-title' ? [run] : [])];
      return `${[...before, '\\maketitle', ...after].join('\n')}\n\n`;
    },
  };
};

export default realize;
