import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.titlepage-env',
    node: 'paragraph/title',
    description:
      "A title page laid out by hand in the kernel's titlepage environment: the title in its font, the authors and the date under it, centred or flush left; rules round the title, space above it, \\vfill to push the authors and date to the foot. 143 templates.",
    ctan: ['latex-base'],
    features: ['title-page', 'centered', 'ruled', 'sans-serif', 'bold-head'],
    params: {
      align: { type: 'enum', values: ['center', 'left'], default: 'center', description: 'the page centred or flush left' },
      titleFont: { type: 'tex', default: '\\Huge\\bfseries', description: "the title's font" },
      authorFont: { type: 'tex', default: '\\Large', description: "the authors' font" },
      dateFont: { type: 'tex', default: '\\large', description: "the date's font" },
      rules: { type: 'boolean', default: false, description: 'a rule the width of the line above and below the title' },
      topSpace: { type: 'string', default: '', description: "space above the title (\\vspace*{0.3\\textheight}); ''" },
      spread: { type: 'boolean', default: false, description: 'the authors and date pushed to the foot of the page (\\vfill)' },
    },
    presets: PRESETS,
    deny: [
      {
        class: 'class.memoir',
        reason: 'memoir (v3.8.4b) has no titlepage environment (its own is titlingpage): "Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"',
        evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/aa470edce5b4 (the copy's memoir.A run: l.39 \\begin{titlepage}; all 22 front.titlepage-env branches under memoir.A fail so, none under article.A, book.A, report.A or scrreprt.A)" }],
      },
      {
        class: 'class.siamart',
        reason: 'siamart251216 has no titlepage environment (only \\if@titlepage): "Environment titlepage undefined" at \\begin{titlepage}, as under memoir',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/siamart251216.cls', line: '75-76, 178, 201 (\\if@titlepage and notitlepage; no titlepage environment)' }],
      },
      {
        class: 'class.oup-authoring-template',
        reason: 'oup-authoring-template is a standalone class (not built on article) with no titlepage environment: "Environment titlepage undefined" at \\begin{titlepage}, as under memoir',
        evidence: [{ kind: 'compile', cell: 'GitHub run b12-5bdc624, oup-authoring-template.A: front.titlepage-env 14 of 14 branches fail so' }],
      },
    ],
    zerotex: 'untested',
  }),
);
