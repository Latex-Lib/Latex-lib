import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.titlepage-env',
    node: 'paragraph/title',
    description:
      "A title page laid out by hand in the kernel's titlepage environment (or memoir's titlingpage): the title in its font, the authors and the date under it, centred or flush left; rules round the title, space above it, \\vfill to push the authors and date to the foot. A template may add its own rows from the title's fields: lines over the title (the institution, the kind of document, a degree line), the subtitle, the affiliations, labelled lines under the authors (Supervisor: …, Student No. …), and a Chinese thesis cover's labelled underlined rows (作者姓名：\\underline{\\makebox[8cm][c]{…}}). 143 templates.",
    writes: '\\begin{titlepage} \\centering {\\Huge\\bfseries …\\par} \\vspace{2em} {\\Large … \\\\ …\\par} \\vspace{1em} {\\large …\\par} \\end{titlepage}',
    ctan: ['latex-base', 'memoir'],
    features: ['title-page', 'centered', 'ruled', 'sans-serif', 'bold-head'],
    params: {
      align: { type: 'enum', values: ['center', 'left'], default: 'center', description: 'the page centred or flush left' },
      titleFont: { type: 'tex', default: '\\Huge\\bfseries', description: "the title's font" },
      authorFont: { type: 'tex', default: '\\Large', description: "the authors' font" },
      dateFont: { type: 'tex', default: '\\large', description: "the date's font" },
      rules: { type: 'boolean', default: false, description: 'a rule the width of the line above and below the title' },
      topSpace: { type: 'string', default: '', description: "space above the title (\\vspace*{0.3\\textheight}); ''" },
      spread: { type: 'boolean', default: false, description: 'the authors and date pushed to the foot of the page (\\vfill)' },
      // The template's own rows (each default prints nothing, so the presets above print as they did).
      env: { type: 'enum', values: ['titlepage', 'titlingpage'], default: 'titlepage', description: "the kernel's titlepage environment, or memoir's titlingpage (memoir has no titlepage)" },
      above: { type: 'string', default: '', description: "the fields over the title, one line each, separated by ; (templateSpecific names, or authors, date, affiliation, affiliation.name|department|address): 'institution; documentType'" },
      aboveFont: { type: 'tex', default: '\\Large', description: "the font of the lines over the title" },
      aboveSpace: { type: 'dimen', default: '2em', description: 'the space between the lines over the title and the title' },
      subtitle: { type: 'boolean', default: false, description: 'templateSpecific.subtitle under the title' },
      subtitleFont: { type: 'tex', default: '\\Large', description: "the subtitle's font" },
      people: { type: 'boolean', default: true, description: "the authors' line and the date line (false when the rows print them)" },
      affiliations: { type: 'boolean', default: false, description: "each affiliation, 'department, name, address', under the authors" },
      affiliationFont: { type: 'tex', default: '\\small', description: "the affiliations' font" },
      below: { type: 'string', default: '', description: "labelled lines under the authors, 'Label=field' separated by ; ('Supervisor=supervisor; Student No.=studentId'); a field alone prints no label" },
      belowFont: { type: 'tex', default: '\\large', description: 'the font of the lines under the authors' },
      labelSep: { type: 'string', default: ': ', description: "what follows a label in the lines under the authors" },
      rows: { type: 'string', default: '', description: "a thesis cover's rows, 'Label=field' separated by ;, each 'Label：\\underline{\\makebox[ruleWidth][c]{value}}'; a row whose value is empty is left out" },
      rowFont: { type: 'tex', default: '\\LARGE', description: "the rows' font" },
      rowSep: { type: 'string', default: ': ', description: "what follows a row's label ('：', the full-width colon, on a Chinese cover)" },
      ruleWidth: { type: 'dimen', default: '8cm', description: "the width of a row's underlined value" },
    },
    fields: [
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.subtitle',
      'templateSpecific.institution',
      'templateSpecific.documentType',
      'templateSpecific.degree',
      'templateSpecific.degreeLine',
      'templateSpecific.supervisor',
      'templateSpecific.supervisorRank',
      'templateSpecific.studentId',
      'templateSpecific.major',
      'templateSpecific.grade',
      'templateSpecific.researchArea',
      'templateSpecific.place',
    ],
    presets: PRESETS,
    requiresWhen: [{ when: { env: 'titlingpage' }, requires: ['env:titlingpage'] }],
    onlyWhen: [
      {
        when: { env: 'titlingpage' },
        classes: ['class.memoir'],
        reason: "titlingpage is memoir's environment (memoir.dtx l.8459-8467, with its empty page style); the kernel classes have none",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '8459-8467' }],
      },
      {
        // The full-width colon and the Chinese labels need ctex's CJK fonts; under a Latin class the glyphs are missing.
        when: { rowSep: '：' },
        classes: ['class.ctexart', 'class.ctexrep', 'class.ctexbook'],
        reason: "a Chinese thesis cover (full-width colon, Chinese labels) needs ctex's CJK fonts, which the ctex classes load",
        evidence: [
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0578-monetjoe-latex-paper-templates/finalversion.tex', line: '3 (ctexbook), 69-76 (the rows)' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0987-twtstudio-tjuthesislatextemplate/Thesis/tjumain.tex', line: '8 (ctexbook)' },
        ],
      },
    ],
    deny: [
      {
        class: 'class.memoir',
        reason: 'memoir (v3.8.4b) has no titlepage environment (its own is titlingpage): "Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"',
        unless: { env: 'titlingpage' },
        evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/aa470edce5b4 (the copy's memoir.A run: l.39 \\begin{titlepage}; all 22 front.titlepage-env branches under memoir.A fail so, none under article.A, book.A, report.A or scrreprt.A)" }],
      },
      {
        class: 'class.siamart',
        reason: 'siamart251216 has no titlepage environment (only \\if@titlepage): "Environment titlepage undefined" at \\begin{titlepage}, as under memoir',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/siamart251216.cls', line: '75-76, 178, 201 (\\if@titlepage and notitlepage; no titlepage environment)' }],
      },
      {
        // b29 (B3B-6): profiles rarely list env:titlepage (aistats, icassp and 25 more pass with it unlisted), so a `requires`
        // would deny where it passes; these two are measured.
        class: 'class.frontiers',
        reason: 'FrontiersinHarvard is a standalone class (it loads no class, l.1-40) with no titlepage environment: "Environment titlepage undefined"',
        evidence: [{ kind: 'compile', cell: 'GitHub run b28-e9f730a, frontiers.A: all 14 not-denied front.titlepage-env branches fail so (e.g. document d7fa5029e0b9da4328c6d)' }],
      },
      {
        class: 'class.agu',
        reason: "agujournal2025's manuscript branch is a class of its own with no titlepage environment: \"Environment titlepage undefined\"",
        evidence: [{ kind: 'compile', cell: 'GitHub run b28-e9f730a, agu.A: 11 front.titlepage-env branches fail so (e.g. document d28ea196a0edf0bff0530)' }],
      },
      {
        class: 'class.oup-authoring-template',
        reason: 'oup-authoring-template is a standalone class (not built on article) with no titlepage environment: "Environment titlepage undefined" at \\begin{titlepage}, as under memoir',
        evidence: [{ kind: 'compile', cell: 'GitHub run b12-5bdc624, oup-authoring-template.A: front.titlepage-env 14 of 14 branches fail so' }],
      },
      // class-examples (2026-11-06): the classes with no titlepage environment, read from every profile without a base (a class
      // built on one inherits its rules) and the class files there are. The others define it: article and its kin, amsart
      // (amsart.cls l.866), IEEEtran (l.2448-2450), jlreq (l.5478), revtex4-2 (\let@environment, l.3142), aastex701 (l.5749),
      // mnras (l.1004-1006), quantumarticle (l.664), ecai (its profile), tikzposter (it loads extarticle); beamer's \titlepage
      // command serves \begin{titlepage}, and its class-examples sample compiled. iopart's file is not in the repository: unread.
      {
        class: 'class.letter',
        reason: 'the kernel letter class (letter.cls 2024/08/12 v1.3c) defines letter, description, verse, quotation and quote but no titlepage environment: "Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"',
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.letter.sample.log (2026-11-06), "! LaTeX Error: Environment titlepage undefined." at l.39 \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}." at l.47; the template\'s own build stopped so at l.91' },
          { kind: 'source', file: 'letter.cls (LaTeX base, 2024/08/12 v1.3c)', line: '172, 341-362 (its environments: letter, description, verse, quotation, quote; no titlepage)' },
        ],
      },
      {
        class: 'class.scrlttr2',
        reason: 'KOMA-Script\'s letter class scrlttr2 (v3.49.2) has, as the kernel letter, no titlepage environment: "Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"',
        evidence: [{ kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.scrlttr2.sample.log (2026-11-06), "! LaTeX Error: Environment titlepage undefined." at l.36 \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}." at l.45 (scrlttr2 2026/02/02 v3.49.2)' }],
      },
      {
        class: 'class.moderncv',
        reason: 'moderncv (v2.6.1) loads no class and defines no titlepage environment: "Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"',
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.moderncv.sample.log (2026-11-06), "! LaTeX Error: Environment titlepage undefined." at l.35 \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}." at l.44' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/moderncv.cls', line: '13 (2026-06-24 v2.6.1; no \\LoadClass and no titlepage anywhere in the file)' },
        ],
      },
      {
        class: 'class.minimal',
        reason: 'the kernel minimal class sets a page size and \\normalsize only (minimal.cls 2001/05/25): no titlepage environment ("Environment titlepage undefined" at \\begin{titlepage}, then "\\begin{document} ended by \\end{titlepage}"), nor the \\Huge, \\Large and \\large of the title\'s fonts',
        evidence: [
          { kind: 'compile', cell: 'class-examples: Latex Related Research/Latex-Template-Examples/_results/class.minimal.sample.log (2026-11-06), "! LaTeX Error: Environment titlepage undefined." at l.47 \\begin{titlepage}, "Undefined control sequence" at l.50 {\\Huge, l.53 {\\Large, l.55 {\\large, then "\\begin{document} ended by \\end{titlepage}." at l.56' },
          { kind: 'source', file: 'minimal.cls (LaTeX base, 2001/05/25)', line: '34 (\\ProvidesClass{minimal}; no titlepage anywhere in the file)' },
        ],
      },
    ],
    // ZeroTeX-NG, 2026-11-07: the four presets above under article, fields under article, book, report and ctexrep, thesis-cover
    // under ctexart, ctexrep and ctexbook, titlingpage under memoir: all typeset (scratchpad build/work/front.beamer-title+front.titlepage-env).
    targetEngine: 'yes',
  }),
);
