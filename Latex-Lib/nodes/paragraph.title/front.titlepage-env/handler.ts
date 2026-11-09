/**
 * front.titlepage-env: a title page laid out by hand in the kernel's
 * titlepage environment (or memoir's titlingpage): the title in its font, the
 * authors and the date under it; rules round the title, space above it, \vfill
 * to push the rest to the foot; centred or flush left. A template may add rows
 * of its own: lines over the title (the institution, the kind of document),
 * the subtitle, the affiliations, labelled lines under the authors (the
 * supervisor, the student number), and a Chinese thesis cover's labelled,
 * underlined rows.
 * CTAN: https://ctan.org/pkg/latex-base (titlepage), https://ctan.org/pkg/memoir (titlingpage)
 */
import { withDefaults } from '../../../schema/params.ts';
import type { Realization } from '../../../schema/realization.ts';
import { param } from '../../protocol.ts';
import { peopleOf } from '../node.ts';
import key from './key.ts';
import { entries, fieldValue } from './rows.ts';

export const realize = (given: { readonly [name: string]: unknown } = {}): Realization => {
  const p = withDefaults(key.params, given as never) as { readonly [name: string]: unknown };
  return {
    preamble: () => ({}),
    emit: (node, content) => {
      const { authors, date } = peopleOf(node);
      const env = param(p, 'env', 'titlepage') === 'titlingpage' ? 'titlingpage' : 'titlepage';
      const rule = p['rules'] === true ? ['\\rule{\\linewidth}{0.4pt}\\par'] : [];
      const people = p['people'] !== false;

      // Over the title: each named templateSpecific field in its own line (Source/0226-princeton-senior-thesis-title-page-start
      // l.1: "Senior Thesis", the department; Latex-Template-Examples/class.ctexrep/main.tex l.130-133: the university, the report type).
      const above = entries(param(p, 'above'))
        .map((e) => fieldValue(node, e.field, ', '))
        .filter((v) => v !== '')
        .map((v) => `{${param(p, 'aboveFont', '\\Large')} ${v}\\par}`);
      const subtitle = p['subtitle'] === true ? fieldValue(node, 'subtitle', ', ') : '';
      // Each affiliation, "department, name, address", under the authors.
      const affiliations = p['affiliations'] === true ? fieldValue(node, 'affiliation', '\\\\ ') : '';
      // Under the authors: "Label: value" lines (class.ctexrep/main.tex l.138: "Supervisor: Prof. Placeholder Name \\ School of …").
      const below = entries(param(p, 'below'))
        .map((e) => ({ label: e.label, value: fieldValue(node, e.field, ', ') }))
        .filter((e) => e.value !== '')
        .map((e) => `${e.label === '' ? '' : `${e.label}${param(p, 'labelSep', ': ')}`}${e.value}`);
      // A thesis cover's rows: "label：\underline{\makebox[8cm][c]{value}}", one a line (Source/0578-monetjoe-latex-paper-templates/
      // finalversion.tex l.39, 69-76; Source/0987-twtstudio-tjuthesislatextemplate/Thesis/setup/format.tex l.268-306).
      const rows = entries(param(p, 'rows'))
        .map((e) => ({ label: e.label, value: fieldValue(node, e.field, '、') }))
        .filter((e) => e.value !== '')
        .map((e) => `${e.label}${param(p, 'rowSep', '：')}\\underline{\\makebox[${param(p, 'ruleWidth', '8cm')}][c]{${e.value}}}`);

      const lines = [
        `\\begin{${env}}`,
        param(p, 'align', 'center') === 'left' ? '\\raggedright' : '\\centering',
        ...(param(p, 'topSpace') === '' ? [] : [`\\vspace*{${param(p, 'topSpace')}}`]),
        ...(above.length === 0 ? [] : [...above, `\\vspace{${param(p, 'aboveSpace', '2em')}}`]),
        ...rule,
        `{${param(p, 'titleFont', '\\Huge\\bfseries')} ${content.trim()}\\par}`,
        ...rule,
        ...(subtitle === '' ? [] : ['\\vspace{0.5em}', `{${param(p, 'subtitleFont', '\\Large')} ${subtitle}\\par}`]),
        ...(p['spread'] === true ? ['\\vfill'] : ['\\vspace{2em}']),
        ...(!people || authors.length === 0 ? [] : [`{${param(p, 'authorFont', '\\Large')} ${authors.join(' \\\\ ')}\\par}`]),
        ...(affiliations === '' ? [] : ['\\vspace{0.5em}', `{${param(p, 'affiliationFont', '\\small')} ${affiliations}\\par}`]),
        ...(below.length === 0 ? [] : ['\\vspace{1em}', `{${param(p, 'belowFont', '\\large')} ${below.join(' \\\\ ')}\\par}`]),
        ...(rows.length === 0 ? [] : ['\\vspace{1em}', `{${param(p, 'rowFont', '\\LARGE')} ${rows.join('\\\\\n')}\\par}`]),
        ...(!people || date === '' ? [] : ['\\vspace{1em}', `{${param(p, 'dateFont', '\\large')} ${date}\\par}`]),
        `\\end{${env}}`,
      ];
      return `${lines.join('\n')}\n\n`;
    },
  };
};

export default realize;
