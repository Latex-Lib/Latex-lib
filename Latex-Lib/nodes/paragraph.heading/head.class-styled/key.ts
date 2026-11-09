import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { solution } from '../../evidence.ts';
import { PRESETS } from './presets.ts';

const LEVEL_VALUES = ['every', 'part', 'chapter', 'section', 'subsection', 'subsubsection', 'paragraph', 'subparagraph'] as const;

export default defineKey(
  minimal({
    id: 'head.class-styled',
    node: 'paragraph/heading',
    description:
      "A class's own heading interface in the preamble, then the kernel commands: ctex's \\ctexset{section={format=…, name={第,节}, number=\\chinese{section}, beforeskip=…, afterskip=…}} (ctexart, ctexrep, ctexbook), jlreq's \\ModifyHeading{section}{font={…}, indent=…, after_label_space=…}, or KOMA-Script's \\RedeclareSectionCommand[beforeskip=…, afterskip=…, font=…]{section} with \\addchap, \\addsec for unnumbered headings that stay in the contents and \\minisec for a free-standing head (scrartcl, scrreprt, scrbook).",
    writes:
      '\\section[…]{…} \\label{…}; \\ctexset{…={format=…,name={…,…},number=…,beforeskip=…,afterskip=…}} | \\ModifyHeading{…}{font={…},indent=…,after_label_space=…} | \\RedeclareSectionCommand[beforeskip=…,afterskip=…,font=…]{…} \\addchap{…} \\addsec{…} \\minisec{…}',
    ctan: ['ctex', 'jlreq', 'koma-script'],
    features: ['class-styled', 'centered', 'chapter-opening', 'bold-head', 'sans-serif', 'compact-spacing', 'in-contents', 'numbered'],
    params: {
      interface: {
        type: 'enum',
        values: ['ctex', 'jlreq', 'koma'],
        default: 'ctex',
        compat: true,
        description: "the class's heading interface: ctex's \\ctexset (ctexart, ctexrep, ctexbook), jlreq's \\ModifyHeading, KOMA-Script's \\RedeclareSectionCommand",
      },
      level: { type: 'enum', values: LEVEL_VALUES, default: 'every', description: "the level restyled ('every': whatever level each heading is at); a heading at another level keeps the class's look" },
      format: { type: 'tex', default: '', description: "font, size and alignment of the level's heads (ctex format=, jlreq font=, KOMA font=); '' keeps the class's" },
      beforeSkip: { type: 'string', default: '', description: "space before the level's heads (ctex and KOMA beforeskip=, jlreq before_space=); '' keeps the class's" },
      afterSkip: { type: 'string', default: '', description: "space after the level's heads (ctex and KOMA afterskip=, jlreq after_space=); '' keeps the class's" },
      indent: { type: 'string', default: '', description: "the heads' indent (indent= in all three); '' keeps the class's" },
      name: { type: 'string', default: '', description: "ctex only: the words before and after the number, comma-separated (name={第,章}); '' keeps ctex's" },
      number: { type: 'tex', default: '', description: "ctex only: how the number prints (number=\\chinese{section}, \\arabic{chapter}); '' keeps ctex's" },
      afterName: { type: 'tex', default: '', description: "ctex only: what follows the number and its words (aftername=\\quad); '' keeps ctex's" },
      afterLabelSpace: { type: 'string', default: '', description: "jlreq only: the space between the number and the title (after_label_space=); '' keeps jlreq's" },
      runIn: { type: 'enum', values: ['class', 'true', 'false'], default: 'class', description: "KOMA only: a run-in head or one on its own line (runin=); class keeps KOMA's (by the sign of afterskip)" },
      unnumberedInContents: {
        type: 'boolean',
        default: false,
        description: 'KOMA only: an unnumbered part, chapter or section is \\addpart, \\addchap or \\addsec, which still enter the contents and the running head, not \\section*',
      },
      minisecLevel: {
        type: 'enum',
        values: ['none', 'subsubsection', 'paragraph', 'subparagraph'],
        default: 'none',
        description: "KOMA only: headings at this level print as \\minisec{…}, a free-standing head with no number and no contents line; 'none' prints none",
      },
    },
    presets: PRESETS,
    requires: [
      'counter:{kind}',
    ],
    // Each interface is the class's own command: no package is loaded, and each needs the class that defines it.
    requiresWhen: [
      { when: { interface: 'ctex' }, requires: ['cmd:\\ctexset'] },
      { when: { interface: 'jlreq' }, requires: ['cmd:\\ModifyHeading'] },
      { when: { interface: 'koma' }, requires: ['cmd:\\RedeclareSectionCommand'] },
      // \addchap is KOMA's too, but only where there are chapters (scrreprt, scrbook), where the profiles define it; a chapter-level heading
      // already needs counter:chapter, which scrartcl lacks.
      { when: { interface: 'koma', unnumberedInContents: true }, requires: ['cmd:\\addsec'] },
      { when: { interface: 'koma', minisecLevel: ['subsubsection', 'paragraph', 'subparagraph'] }, requires: ['cmd:\\minisec'] },
    ],
    only: ['class.ctexart', 'class.ctexrep', 'class.ctexbook', 'class.jlreq', 'class.scrartcl', 'class.scrbook', 'class.scrreprt'],
    onlyWhen: [
      {
        when: { interface: 'ctex' },
        classes: ['class.ctexart', 'class.ctexrep', 'class.ctexbook'],
        reason: "\\ctexset is ctex's own interface, defined by the ctex classes (their heading option is on); elsewhere \"Undefined control sequence\"",
        evidence: [
          { kind: 'manual', of: 'ctex', section: 'heading settings (\\ctexset)', url: 'https://ctan.org/pkg/ctex' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0677-cqjtuthesis/tex/cqjtuthesis.cls', line: '35 (\\LoadClass{ctexbook}), 171-179' },
        ],
      },
      {
        when: { interface: 'jlreq' },
        classes: ['class.jlreq'],
        reason: "\\ModifyHeading is jlreq's own command (jlreq.cls l.3286), for headings it builds with \\DeclareBlockHeading rather than \\@startsection",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0529-jlreq/jlreq.cls', line: '3286-3311' }, solution('0529-jlreq', '24')],
      },
      {
        when: { interface: 'koma' },
        classes: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
        reason: "\\RedeclareSectionCommand, \\addsec, \\addchap and \\minisec are KOMA-Script's (scrkernel-sections), defined by its classes",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-sections.dtx', line: '3085, 5697, 6151, 6191' }],
      },
    ],
    // Below cols.vwcol a heading comes out at the full text width (172.7pt over in a 0.5 column): 0 of 561 library headings there pass but
    // head.sectsty@smallcaps's \subparagraph (55 of 59), run-in titles that never print (their footnote sibling's sentinel is missing).
    // Copy batch-3b, 5 pairs; e.g. d165d94f2adcdc3093699 result 82adbd1a35 l.150, an unmarked \section* 172.7pt over.
    needs: { paragraph: true },
    // Typeset ok on ZeroTeX-NG (2026-11-07), each preset's preamble line and a body of chapters, sections (numbered and not), a
    // subsection and a paragraph-level head: ctex under ctexbook and ctexrep, ctex-section under ctexart and ctexbook (第1章 printed as
    // \CTEXthechapter), koma under scrbook, scrreprt and scrartcl (\addchap, \addsec[…], \minisec), koma-section under scrartcl and
    // scrreprt. The jlreq preset is not typeset: jlreq runs on pLaTeX, upLaTeX and LuaLaTeX, not XeTeX (its profile is targetEngine 'no',
    // so the resolver refuses it there whatever this says).
    targetEngine: 'yes',
  }),
);
