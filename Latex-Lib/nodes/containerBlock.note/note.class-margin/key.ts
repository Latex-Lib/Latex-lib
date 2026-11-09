import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { solution } from '../../evidence.ts';
import { PRESETS } from './presets.ts';

const TUFTE_SOURCE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0793-xtufte/latex/xtufte-common.def', line: '1000-1016 (\\sidenote, \\marginnote[offset] on \\marginpar)' } as const;
const KOMA_SOURCE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-miscellaneous.dtx', line: '641-643 (\\newcommand\\marginline[1]{\\marginpar[{\\raggedleft #1}]{\\raggedright #1}})' } as const;
const JLREQ_SOURCE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0529-jlreq/jlreq.cls', line: '3879-3946 (\\sidenote, only when sidenote_length > 0pt; number and symbol forms), 355, 412 (sidenote_length, default 0pt)' } as const;

export default defineKey(
  minimal({
    id: 'note.class-margin',
    node: 'containerBlock/note',
    description:
      "The class's own margin note, with no package, the title in bold on its first line: Tufte's \\marginnote[offset]{…} or numbered \\sidenote[][offset]{…} (tufte-handout, tufte-book), KOMA-Script's \\marginline{…}, ragged towards the text in either margin (scrartcl, scrbook, scrreprt), or jlreq's \\sidenote{…}, numbered, or \\sidenote{keyword}{…} (under the class option sidenote_length).",
    writes: '\\marginnote[…]{{\\bfseries …\\par} …} | \\sidenote{{\\bfseries …\\par} …} | \\marginline{{\\bfseries …\\par} …}',
    ctan: ['tufte-latex', 'koma-script', 'jlreq'],
    features: ['margin-note', 'class-styled', 'numbered'],
    params: {
      form: {
        type: 'enum',
        values: ['marginnote', 'sidenote', 'marginline', 'jlreq'],
        default: 'marginnote',
        compat: true,
        description: "the class's command: Tufte's \\marginnote (unnumbered) or \\sidenote (numbered), KOMA-Script's \\marginline, or jlreq's \\sidenote",
      },
      title: { type: 'boolean', default: true, description: "the note's title in bold on its first line (jlreq's keyword form takes it as the keyword)" },
      offset: { type: 'dimen', default: '', description: "Tufte: the note's vertical offset (\\marginnote[offset], \\sidenote[][offset]); ''" },
      jlreqType: { type: 'enum', values: ['number', 'symbol'], default: 'number', description: "jlreq: a numbered side note, or the keyword form, \\sidenote{keyword}{…} after \\jlreqsetup{sidenote_type=symbol}" },
    },
    presets: PRESETS,
    loads: [],
    requiresWhen: [
      { when: { form: 'marginnote' }, requires: ['cmd:\\marginnote'] },
      { when: { form: 'sidenote' }, requires: ['cmd:\\sidenote'] },
      { when: { form: 'marginline' }, requires: ['cmd:\\marginline'] },
      { when: { form: 'jlreq' }, requires: ['cmd:\\sidenote'] },
    ],
    only: ['class.tufte-handout', 'class.tufte-book', 'class.scrartcl', 'class.scrbook', 'class.scrreprt', 'class.jlreq'],
    onlyWhen: [
      {
        when: { form: ['marginnote', 'sidenote'] },
        classes: ['class.tufte-handout', 'class.tufte-book'],
        reason: "\\marginnote[offset]{…} and \\sidenote[number][offset]{…} are the Tufte classes' own (xtufte-common.def l.1000-1016); elsewhere they are undefined, or the marginnote and sidenotes packages' different commands (note.marginnote, note.sidenotes)",
        evidence: [TUFTE_SOURCE, solution('0793-xtufte', '23, 65')],
      },
      {
        when: { form: 'marginline' },
        classes: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
        reason: 'KOMA-Script\'s classes define \\marginline (scrkernel-miscellaneous.dtx l.641-643); elsewhere "Undefined control sequence"',
        evidence: [KOMA_SOURCE, solution('0020-koma-script', '35, 72')],
      },
      {
        when: { form: 'jlreq' },
        classes: ['class.jlreq'],
        reason: "jlreq's \\sidenote (jlreq.cls l.3879-3946) takes the footnote counter, or a keyword in its symbol form; tufte's and the sidenotes package's are other commands",
        evidence: [JLREQ_SOURCE, solution('0529-jlreq', '24')],
      },
    ],
    // Every form is a \marginpar (tufte's \marginnote and \sidenote, KOMA's \marginline, jlreq's \@sidenotetext): a float, set in
    // a box in the margin that never breaks, so it needs outer paragraph mode (no float or box above), as note.marginpar.
    // \marginline sets its argument twice, once for each margin (scrkernel-miscellaneous.dtx l.642), so a footnote anchor in it
    // would step its counter twice: footnotes are not given below that form.
    gives: { floats: false, breakable: false, boxDepth: 1 },
    givesWhen: [{ when: { form: 'marginline' }, gives: { footnotes: false } }],
    needs: { floats: true, argument: false },
    // Typeset ok (ZeroTeX-NG, 2026-11-07) under tufte-handout and tufte-book ([nols], marginnote and sidenote, with and without an
    // offset) and under scrartcl, scrbook and scrreprt (marginline). jlreq is untested: its profile's targetEngine is 'no' (it is
    // written for LuaTeX and pLaTeX, not XeTeX), and its \sidenote exists only under the class option sidenote_length.
    targetEngine: 'untested',
  }),
);
