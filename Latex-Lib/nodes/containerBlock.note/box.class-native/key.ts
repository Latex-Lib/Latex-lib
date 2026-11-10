import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { solution } from '../../evidence.ts';
import { PRESETS } from './presets.ts';

const BEAMER_SOURCE = { kind: 'source', file: 'beamerbaselocalstructure.sty (beamer, TeX Live / MiKTeX)', line: '107-135 (\\newenvironment<>{block}[1], {alertblock}[1], {exampleblock}[1])' } as const;
const OUP_SOURCE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template/oup-authoring-template.cls', line: '3079-3129 (\\newenvironment{boxtext}[1][])' } as const;
const MEMOIR_SOURCE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0185-memhfixc/memoir.dtx', line: '30894-30906 (\\newenvironment{framed}, {shaded}, {leftbar}); 30426 (floats, footnotes, marginpars lost inside)' } as const;

export default defineKey(
  minimal({
    id: 'box.class-native',
    node: 'containerBlock/note',
    description:
      "The class's own box for a note, with no package: beamer's (and ctexbeamer's) theme-drawn \\begin{block}{title} … \\end{block}, alertblock for a warning and exampleblock for a tip; oup-authoring-template's numbered \\begin{boxtext}[title] … \\end{boxtext} ('Box n' between half rules); memoir's own framed, shaded or leftbar environment (the framed package's, defined by the class) with the title in bold.",
    writes: '\\begin{block|alertblock|exampleblock}{…} … \\end{block} | \\begin{boxtext}[…] … \\end{boxtext} | \\begin{framed|shaded|leftbar} {\\bfseries …\\par} … \\end{framed}',
    ctan: ['beamer', 'memoir'],
    features: ['class-styled', 'title-bar', 'numbered', 'ruled', 'framed', 'background', 'left-rule', 'breakable'],
    params: {
      env: {
        type: 'enum',
        values: ['tone', 'block', 'alertblock', 'exampleblock', 'boxtext', 'framed', 'shaded', 'leftbar'],
        default: 'tone',
        compat: true,
        description:
          "the class's environment: beamer's block picked by the note's tone (info block, warning alertblock, tip exampleblock) or one of the three fixed; oup-authoring-template's boxtext; memoir's framed, shaded or leftbar",
      },
      title: { type: 'boolean', default: true, description: "the note's title: beamer's block title, boxtext's title after 'Box n', or a bold line above memoir's frame's text" },
      frameSep: { type: 'dimen', default: '', description: "memoir: \\FrameSep, the space between the frame (or shade) and the text; '' keeps memoir's (3\\fboxsep)" },
      frameRule: { type: 'dimen', default: '', description: "memoir's framed: \\FrameRule, the frame's line width; '' keeps \\fboxrule" },
      shade: { type: 'color', default: 'black!10', description: "memoir's shaded: shadecolor, the back colour (\\colorlet{shadecolor}{…}, xcolor)" },
    },
    presets: PRESETS,
    loads: [{ pkg: 'xcolor', when: { env: 'shaded' } }],
    requiresWhen: [
      { when: { env: 'tone' }, requires: ['env:block', 'env:alertblock', 'env:exampleblock'] },
      { when: { env: 'block' }, requires: ['env:block'] },
      { when: { env: 'alertblock' }, requires: ['env:alertblock'] },
      { when: { env: 'exampleblock' }, requires: ['env:exampleblock'] },
      { when: { env: 'boxtext' }, requires: ['env:boxtext'] },
      { when: { env: 'framed' }, requires: ['env:framed'] },
      { when: { env: 'shaded' }, requires: ['env:shaded'] },
      { when: { env: 'leftbar' }, requires: ['env:leftbar'] },
    ],
    // ctexbeamer is built on beamer (its profile's base), and is listed since its decks use the same blocks.
    only: ['class.beamer', 'class.ctexbeamer', 'class.oup-authoring-template', 'class.memoir'],
    onlyWhen: [
      {
        when: { env: ['tone', 'block', 'alertblock', 'exampleblock'] },
        classes: ['class.beamer', 'class.ctexbeamer'],
        reason: 'block, alertblock and exampleblock are beamer\'s environments (beamerbaselocalstructure.sty l.107-135); elsewhere "Environment block undefined"',
        evidence: [BEAMER_SOURCE, solution('0418-beamertheme-csh', '23, 33'), solution('0918-beamertheme-mirage', '50')],
      },
      {
        when: { env: 'boxtext' },
        classes: ['class.oup-authoring-template'],
        reason: 'boxtext is oup-authoring-template\'s own environment (cls l.3079-3129); elsewhere "Environment boxtext undefined"',
        evidence: [OUP_SOURCE, solution('0914-oup-authoring-template', '74')],
      },
      {
        when: { env: ['framed', 'shaded', 'leftbar'] },
        classes: ['class.memoir'],
        reason: "memoir defines framed, shaded and leftbar itself (memoir.dtx l.30894-30906); another class needs the framed package for them, which this way does not load",
        evidence: [MEMOIR_SOURCE],
      },
    ],
    // beamer: the block's body is set in a beamercolorbox (beamerinnerthemedefault.sty l.401), on a frame, which does not break.
    // memoir's MakeFramed splits across pages, but floats, footnotes and marginpars inside it are lost (memoir.dtx l.30426,
    // copied from framed.sty l.59). oup's boxtext is a paragraph environment (\leftskip, \rightskip) with its own footnote style
    // and \figure made \Figure (cls l.3082-3115): nothing is taken from its children.
    givesWhen: [
      { when: { env: ['tone', 'block', 'alertblock', 'exampleblock'] }, gives: { floats: false, breakable: false, boxDepth: 1 } },
      { when: { env: ['framed', 'shaded', 'leftbar'] }, gives: { floats: false, footnotes: false, boxDepth: 1 } },
    ],
    // batch 4 round 1 (OVF-VWCOL): memoir's framed, shaded and leftbar (\MakeFramed) and beamer's blocks (a beamercolorbox) are as
    // wide as \linewidth: below cols.vwcol, which fits only paragraph lines to its columns, they come out at the full width, as
    // box.mdframed's and box.awesomebox's blocks do (both need paragraph): 78 of the 79 not-denied branches directly below vwcol
    // fail (memoir framed 17 of 18, shaded 20 of 20, leftbar 18 of 18; beamer by-tone, block and alert 8 of 8 each), e.g. memoir.A
    // d4f914c5621b232043bde result 194893d39f, l.108 and l.115, 170.5pt (half the text width). oup's boxtext only sets \leftskip
    // and \rightskip on its paragraphs, so it needs nothing.
    needsWhen: [{ when: { env: ['tone', 'block', 'alertblock', 'exampleblock', 'framed', 'shaded', 'leftbar'] }, needs: { paragraph: true } }],
    // Every preset typeset ok under its class (ZeroTeX-NG, 2026-11-07), notes of each tone with a two-paragraph body: beamer and
    // ctexbeamer (beamer-by-tone, beamer-block, beamer-alert and an untitled exampleblock, each in a frame); memoir (framed,
    // shaded, leftbar, and framed and shaded with \FrameSep, \FrameRule and a shade given); oup-authoring-template under
    // [webpdf,contemporary,large] (oup, titled and untitled), with the journal metadata its running head reads (\journaltitle,
    // \pubyear, \copyrightyear, \vol, \issue, \societylogo, as front.oup supplies) and the class's .cls beside it. No overfull box.
    targetEngine: 'yes',
  }),
);
