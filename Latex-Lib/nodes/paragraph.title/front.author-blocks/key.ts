import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const way = minimal({
  id: 'front.author-blocks',
  node: 'paragraph/title',
  description:
    "The kernel title block with the authors' details printed: \\title, \\author, \\date and \\maketitle, where each author (or group of authors sharing affiliations) has its department, institution, address and e-mail as \\\\ lines under the name, in a \\thanks footnote, or after the name on one line, and the authors are joined by \\and, by the \\And/\\AND blocks of iclr, colm, neurips and acl, or by line breaks (JACoW). It can add a subtitle line and a \\thanks note in \\title, a corresponding-author note, cvpr's \\paperID, ltxdoc's \\MaintainedBy, proc's \\copyrightspace, and the keywords as a bold run-in line at the abstract's end. For article, report, book, the extsizes and ctex classes, memoir, jlreq, ltxdoc, proc, jacow, cvpr, iclr, colm, neurips, acl and usenix.",
  writes:
    '\\title{…[ \\\\ {\\large …}][\\thanks{…}]} \\author{…\\thanks{…} \\\\ … \\\\ \\texttt{…} \\and|\\And|\\AND …} \\date{…} [\\def\\paperID{…}] [\\MaintainedBy{…}] [\\AddToHookNext{env/abstract/end}{\\par\\noindent\\textbf{Keywords:} …}] \\maketitle [\\copyrightspace]',
  ctan: ['latex-base'],
  features: ['centered'],
  fields: [
    'author.email',
    'author.orcid',
    'affiliation.name',
    'affiliation.department',
    'affiliation.address',
    'templateSpecific.subtitle',
    'templateSpecific.titleNote',
    'templateSpecific.keywords',
    'templateSpecific.classification',
    'templateSpecific.correspondingAuthor',
    'templateSpecific.degreeLine',
    'templateSpecific.paperID',
    'templateSpecific.maintainedBy',
  ],
  // A per-author note (cvpr's and neurips' "Equal contribution" \thanks) is not a title field and has no single templateSpecific
  // value, so it is not printed; the corresponding-author note covers the one per-author note the schema can name.
  params: {
    affiliationForm: { type: 'enum', values: ['lines', 'thanks', 'inline', 'none'], default: 'lines', description: "where each author's affiliations go: \\\\ lines under the name, a \\thanks footnote, after the names on the same line (JACoW, with the authors grouped by first affiliation), or nowhere" },
    affiliationLines: { type: 'enum', values: ['split', 'joined'], default: 'split', description: 'with lines: department, institution and address one line each, or on one line joined by commas' },
    detailsFont: { type: 'tex', default: '', description: 'a font switch before each detail line (\\small, \\normalsize), or none' },
    emailAt: { type: 'enum', values: ['line', 'thanks', 'none'], default: 'line', description: "where each author's e-mail goes: a \\\\ line after the affiliation lines, the \\thanks note, or nowhere" },
    emailForm: { type: 'enum', values: ['texttt', 'tt-small', 'url', 'plain'], default: 'texttt', description: 'how an e-mail is set: \\texttt{…}, {\\tt\\small …} (cvpr), \\url{…} (loads url), or plain text' },
    emailCompress: { type: 'boolean', default: false, description: "a group's e-mails that share one domain written once, as \\{a,b\\}@domain (the iclr and cvpr kits)" },
    orcidAt: { type: 'enum', values: ['none', 'line', 'thanks'], default: 'none', description: "the author's ORCID iD as 'ORCID: …': nowhere, a \\\\ line, or in the \\thanks note" },
    correspondingNote: { type: 'tex', default: '', description: "a note (e.g. 'Corresponding author.') added to the \\thanks of the author whose e-mail or name is templateSpecific.correspondingAuthor; empty prints none" },
    grouping: { type: 'enum', values: ['per-author', 'shared', 'firstAffiliation'], default: 'per-author', description: 'one block per author, consecutive authors with the same affiliations in one block, or every author grouped by their first affiliation' },
    nameJoin: { type: 'enum', values: ['and', 'comma-amp', 'qquad', 'comma'], default: 'and', description: "how names in one block are joined: ' and ', 'A, B \\& C', \\qquad, or commas" },
    nameFont: { type: 'tex', default: '', description: 'a font switch each name is set in, as {\\rm …} (usenix), or none' },
    separator: { type: 'enum', values: ['and', 'And-AND', 'newline'], default: 'and', compat: true, description: "between blocks: the kernel's \\and, the style's \\And with \\AND after every perLine blocks (iclr, colm, neurips, acl), or a \\\\ line break (JACoW)" },
    perLine: { type: 'number', default: 0, description: 'with And-AND: \\AND, a forced new line, after every this many blocks; 0 never' },
    titleFont: { type: 'tex', default: '', description: 'a font switch at the start of \\title (usenix: \\Large \\bf), or none' },
    subtitle: { type: 'enum', values: ['none', 'line'], default: 'none', description: 'templateSpecific.subtitle as a second line inside \\title, or not printed' },
    subtitleFont: { type: 'tex', default: '\\large', description: "the subtitle line's font switch (\\large, \\Large, ctex's \\zihao{-3})" },
    titleNote: { type: 'boolean', default: false, description: 'templateSpecific.titleNote as a \\thanks on the title (a funding or version note)' },
    degreeLine: { type: 'boolean', default: false, description: "templateSpecific.degreeLine as a line under the first block's names (memoir's thesis statement)" },
    date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date, \\today explicitly, or none (\\date{})" },
    keywordsAt: { type: 'enum', values: ['none', 'inside-abstract', 'after-abstract', 'after-title'], default: 'none', description: "templateSpecific.keywords as a bold run-in line: not printed, at the end of the next abstract, right after it (\\AddToHookNext env/abstract/end or /after), or right after \\maketitle" },
    keywordsLabel: { type: 'tex', default: 'Keywords:', description: "the keywords line's bold label" },
    keywordsJoin: { type: 'string', default: '; ', description: 'what joins the keywords' },
    classificationLabel: { type: 'tex', default: '', description: "with keywords: a second run-in line, this bold label then templateSpecific.classification (e.g. 'JEL codes:'); empty prints none" },
    paperID: { type: 'boolean', default: false, compat: true, description: "\\def\\paperID{templateSpecific.paperID}, which cvpr's review copy prints" },
    maintainedBy: { type: 'boolean', default: false, compat: true, description: "\\MaintainedBy{templateSpecific.maintainedBy}, ltxdoc's boxed maintainer note" },
    copyrightSpace: { type: 'boolean', default: false, compat: true, description: "\\copyrightspace after \\maketitle: proc's and jacow's blank copyright box at the foot of the first column" },
  },
  presets: PRESETS,
  // \url only when the e-mails are set with it.
  loads: [{ pkg: 'url', when: { emailForm: 'url', emailAt: ['line', 'thanks'] } }],
  // It runs the class's own \maketitle, which prints what the class keeps for it.
  claims: ['maketitle'],
  requires: ['cmd:\\maketitle'],
  requiresWhen: [
    { when: { separator: 'And-AND' }, requires: ['cmd:\\And', 'cmd:\\AND'] },
    { when: { copyrightSpace: true }, requires: ['cmd:\\copyrightspace'] },
    { when: { maintainedBy: true }, requires: ['cmd:\\MaintainedBy'] },
  ],
  only: [
    'class.article',
    'class.extarticle',
    'class.extbook',
    'class.extreport',
    'class.report',
    'class.book',
    'class.ctexart',
    'class.ctexrep',
    'class.memoir',
    'class.jlreq',
    'class.ltxdoc',
    'class.proc',
    'class.jacow',
    'class.cvpr',
    'class.iclr',
    'class.colm',
    'class.neurips',
    'class.acl',
    'class.usenix',
  ],
  onlyWhen: [
    {
      // The thanks-jlreq preset's label キーワード： and separator ， are Japanese: only jlreq's fonts have them (batch 4 round 1:
      // num.unnumbered@tju's CJK heading lost every glyph under the Latin classes).
      when: { keywordsLabel: 'キーワード：' },
      classes: ['class.jlreq'],
      reason: "the Japanese keywords label キーワード： needs CJK glyphs, which jlreq's fonts give and a Latin class's Latin Modern lacks (\"Missing character\")",
      evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.jlreq/main.tex', line: '119-120 (キーワード： inside the abstract)' }],
    },
    {
      when: { separator: 'And-AND' },
      classes: ['class.iclr', 'class.colm', 'class.neurips', 'class.acl'],
      reason: "\\And and \\AND exist only where the style's \\@maketitle defines them as breaks between its author tabulars; under the kernel's \\maketitle they are undefined",
      evidence: [
        { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0031-nhatkhangcs-overleaf-comments/examples/iclr/iclr2027_conference.sty', line: '89-99' },
        { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0506-neurips/neurips_2026.sty', line: '344-351' },
        { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0031-nhatkhangcs-overleaf-comments/examples/arr/acl.sty', line: '154-159' },
        { kind: 'source', file: 'Latex-Lib/classes/colm.ts', line: '26, 41 (colm2026_conference.sty l.114-116)' },
      ],
    },
    {
      when: { copyrightSpace: true },
      classes: ['class.proc', 'class.jacow'],
      reason: '\\copyrightspace is defined by proc (and kept by jacow) only',
      evidence: [
        { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/proc.dtx', line: '407-415' },
        { kind: 'source', file: 'Latex-Lib/classes/jacow.ts', line: '38, 47' },
      ],
    },
    {
      when: { maintainedBy: true },
      classes: ['class.ltxdoc'],
      reason: '\\MaintainedBy is ltxdoc\'s own command, printed by its \\@maketitle',
      evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/ltxdoc.dtx', line: '598-611, 614-638' }],
    },
    {
      when: { paperID: true },
      classes: ['class.cvpr'],
      reason: "only cvpr's review copy prints \\paperID",
      evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0031-nhatkhangcs-overleaf-comments/examples/cvpr/cvpr.sty', line: '279-308' }],
    },
  ],
  // Typeset on ZeroTeX-NG (2026-11-07), each preset under its class on the title sample with a third author: article (thanks with
  // subtitle, title note, ORCID, corresponding note and classification; lines with \url e-mails, shared grouping and keywords
  // after the title; keywords after the abstract with \{a,b\}@domain), extarticle, extbook, extreport, report, book, ctexart
  // (\zihao{-3} subtitle), ctexrep, memoir, ltxdoc (\MaintainedBy), proc (\copyrightspace), jacow (inline, \copyrightspace;
  // the one long author line runs 35pt over, as a JACoW author line too long for the page does), and iclr2027_conference.sty
  // [\iclrfinalcopy], neurips_2026.sty [main,final], acl.sty [final] and cvpr.sty (review and final), copied from the research's
  // Source kits. Not run: jlreq (the class does not run on XeTeX: its profile's targetEngine is 'no'), colm and usenix (no style
  // file here).
  targetEngine: 'yes',
});

export default defineKey({
  ...way,
  evidence: [
    ...way.evidence,
    { kind: 'source', file: 'Latex Related Research/Latex-Template-Examples/class.article/main.tex', line: '110-125' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0042-jankapunkt-master-thesis/simple/main.tex', line: '218-226' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0577-latex-base-dev/proc.dtx', line: '128-132, 407-415' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0596-iclr/iclr2026_conference.tex', line: '18-44' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0506-neurips/neurips_2026.tex', line: '64-111' },
    {
      kind: 'compile',
      reproducer:
        'each preset on the title sample, in the body before \\maketitle with an abstract after it, under article, extarticle, extbook, extreport, report, book, ctexart, ctexrep, memoir, ltxdoc, proc, jacow, and article with iclr2027_conference.sty, neurips_2026.sty, acl.sty and cvpr.sty: all ok (ZeroTeX-NG, 2026-11-07)',
    },
  ],
});
