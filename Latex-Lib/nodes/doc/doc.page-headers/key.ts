import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const SRC = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;
const EXAMPLE = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line }) as const;

export default defineKey({
  ...minimal({
    id: 'doc.page-headers',
    node: 'doc',
    description:
      "Running heads and footers, the template's constants, through each class family's own interface: KOMA's scrlayer-scrpage (\\clearpairofpagestyles, \\ihead, \\chead, \\ohead, \\ifoot, \\cfoot, \\ofoot, \\pagestyle{scrheadings}) under scrartcl, scrreprt and scrbook; fancyhdr (\\pagestyle{fancy}, \\fancyhf{}, \\fancyhead[L|C|R], \\fancyfoot[L|C|R], \\headrulewidth) on an article; memoir's page styles (\\pagestyle{ruled}) or one of the template's own (\\makepagestyle, \\makeoddhead …); jlreq's \\NewPageStyle; exam's \\pagestyle{headandfoot} with \\runningheader and \\footer; or \\pagestyle{empty} (USENIX camera-ready, no page numbers). A per-paper text names \\LatexLibShortTitle or \\LatexLibRunningAuthor, \\providecommand-ed empty for a title way to define.",
    writes:
      '\\usepackage{scrlayer-scrpage} \\clearpairofpagestyles \\ihead{…} \\ohead{…} \\cfoot{…} \\pagestyle{scrheadings} | \\usepackage{fancyhdr} \\pagestyle{fancy} \\fancyhf{} \\fancyhead[…]{…} \\fancyfoot[…]{…} | \\pagestyle{ruled} | \\makepagestyle{…} \\makeoddhead{…}{…}{…}{…} \\pagestyle{…} | \\NewPageStyle{…}{…} \\pagestyle{…} | \\pagestyle{headandfoot} \\runningheader{…}{…}{…} \\footer{…}{…}{…} | \\pagestyle{empty}',
    ctan: ['koma-script', 'fancyhdr', 'memoir', 'jlreq', 'exam'],
    features: ['class-styled'],
    params: {
      form: { type: 'enum', values: ['class', 'koma', 'fancyhdr', 'memoir', 'jlreq', 'exam', 'empty'], default: 'class', compat: true, description: "whose interface: none (the class's own heads, nothing printed), KOMA's scrlayer-scrpage, fancyhdr, memoir's page styles, jlreq's \\NewPageStyle, exam's headandfoot, or no heads at all (\\pagestyle{empty})" },
      headLeft: { type: 'tex', default: '', description: "the head's left slot (KOMA: inner; memoir: mirrored on even pages); ''" },
      headCenter: { type: 'tex', default: '', description: "the head's centre slot; ''" },
      headRight: { type: 'tex', default: '', description: "the head's right slot (KOMA: outer); ''" },
      footLeft: { type: 'tex', default: '', description: "the foot's left slot; ''" },
      footCenter: { type: 'tex', default: '', description: "the foot's centre slot; ''" },
      footRight: { type: 'tex', default: '', description: "the foot's right slot; ''" },
      headRule: { type: 'dimen', default: '', description: "the rule under the head: a thickness, 0pt for none, '' for the interface's default" },
      footRule: { type: 'dimen', default: '', description: "the rule over the foot: a thickness, 0pt for none, '' for the interface's default" },
      headFont: { type: 'tex', default: '', description: "the head's font (KOMA: \\addtokomafont{pagehead}; jlreq: running_head_font); ''" },
      automark: { type: 'boolean', default: false, description: "KOMA: scrlayer-scrpage's automark option, so \\headmark follows the headings" },
      plainToo: { type: 'boolean', default: false, description: 'KOMA: the slots shown on plain pages too (\\ihead*{…})' },
      headHeight: { type: 'dimen', default: '', description: "fancyhdr: the head's height (\\setlength{\\headheight}{…}); ''" },
      memoirStyle: {
        type: 'enum',
        values: ['custom', 'empty', 'plain', 'headings', 'myheadings', 'simple', 'ruled', 'Ruled', 'companion'],
        default: 'custom',
        description: "memoir: one of its page styles, or custom: the template's own built from the slots (\\makepagestyle)",
      },
      styleName: { type: 'string', default: 'running', description: "the name of the template's own page style (memoir's custom, jlreq's)" },
      uppercaseHeads: { type: 'boolean', default: true, description: 'memoir: marks in capitals, as the class sets them; false prints \\nouppercaseheads' },
      runningHead: { type: 'tex', default: '', description: "jlreq: the running head's text (odd_running_head); ''" },
      runningHeadPosition: { type: 'string', default: '', description: "jlreq: where the running head stands (running_head_position=top-center …); ''" },
      nombrePosition: { type: 'string', default: '', description: "jlreq: where the page number stands (nombre_position=bottom-center …); ''" },
      nombreFont: { type: 'tex', default: '', description: "jlreq: the page number's font (nombre_font); ''" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'scrlayer-scrpage', when: { form: 'koma' } },
      { pkg: 'fancyhdr', when: { form: 'fancyhdr' } },
    ],
    requiresWhen: [
      { when: { form: 'memoir' }, requires: ['cmd:\\makepagestyle'] },
      { when: { form: 'jlreq' }, requires: ['cmd:\\NewPageStyle'] },
      { when: { form: 'exam' }, requires: ['cmd:\\runningheader'] },
    ],
    only: ['class.scrartcl', 'class.scrbook', 'class.scrreprt', 'class.article', 'class.memoir', 'class.jlreq', 'class.exam', 'class.usenix'],
    onlyWhen: [
      {
        when: { form: 'koma' },
        classes: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
        reason: "scrlayer-scrpage is KOMA's own page-style package; the KOMA classes warn that fancyhdr is not recommended with them",
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/KOMA_Scrartcl.md', line: '155-158' }, SRC('0020-koma-script/scrlayer-scrpage.dtx', '2255-2343, 2471')],
      },
      {
        when: { form: 'fancyhdr' },
        classes: ['class.article'],
        reason: "fancyhdr is the running-head package of the standard article; memoir, the KOMA classes, jlreq and exam have their own page-style interfaces, and a venue class sets its own heads",
        evidence: [SRC('0050-laboratory-notebook-daily-entry/main.tex', '7-10'), SRC('0017-hit-report/main.tex', '9-11')],
      },
      {
        when: { form: 'memoir' },
        classes: ['class.memoir'],
        reason: 'the page styles simple, ruled, Ruled and companion and \\makepagestyle, \\makeoddhead … are memoir\'s own commands',
        evidence: [SRC('0185-memhfixc/memoir.dtx', '6072 (\\makeevenhead), 6538 (\\makepagestyle), 7317 (ruled)')],
      },
      {
        when: { form: 'jlreq' },
        classes: ['class.jlreq'],
        reason: "\\NewPageStyle with running_head_position, odd_running_head and nombre_position is jlreq's own page-style interface",
        evidence: [SRC('0529-jlreq/jlreq.cls', '4934 (\\DeclarePageStyle), 5208-5223 (\\NewPageStyle)')],
      },
      {
        when: { form: 'exam' },
        classes: ['class.exam'],
        reason: "headandfoot, \\runningheader and \\footer are the exam class's own page style and commands",
        evidence: [EXAMPLE('class.exam/main.tex', '48-53')],
      },
      {
        when: { form: 'empty' },
        classes: ['class.usenix'],
        reason: "USENIX's camera-ready papers carry no page numbers, and the style's own \\pagestyle{empty} line is commented out, so the template prints it",
        evidence: [{ kind: 'requirement', file: 'Template/template-requirement/USENIX.md', line: '32, 123' }],
      },
    ],
    // Typeset ok on ZeroTeX-NG (2026-11-07): koma under scrartcl, scrreprt and scrbook; fancyhdr and fancyhdr-short-title under article;
    // memoir and memoir-custom under memoir; exam under exam (and \footrule with footRule set); empty under article. Not run under
    // their classes: jlreq (jlreq.cls stops while loading under XeTeX, "Undefined control sequence. l.493 \epTeXinputencoding": the
    // class wants pLaTeX, upLaTeX or LuaLaTeX, and its profile's targetEngine is 'no') and usenix's empty (usenix2019_v3.sty is in
    // neither the mirror nor the class files). So 'untested'.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'manual', of: 'koma-script', section: 'scrlayer-scrpage', url: 'https://ctan.org/pkg/koma-script' },
    { kind: 'manual', of: 'fancyhdr', section: 'CTAN package page', url: 'https://ctan.org/pkg/fancyhdr' },
    SRC('0370-aremju-latex-template/main.tex', '84-92'),
    SRC('0050-laboratory-notebook-daily-entry/main.tex', '7-10'),
    SRC('0185-memhfixc/memoir.dtx', '6538-7413'),
    EXAMPLE('class.jlreq/main.tex', '47-54'),
    EXAMPLE('class.exam/main.tex', '48-53'),
    { kind: 'requirement', file: 'Template/template-requirement/USENIX.md', line: '32, 123' },
  ],
});
