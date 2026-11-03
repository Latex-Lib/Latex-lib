import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'toc.tocloft',
    node: 'atomicBlock/tableContents',
    description:
      'tocloft: the contents restyled by its hooks, \\cftsecleader as \\cftdotfill{\\cftdotsep} for dot leaders, \\cftsecfont, \\cftsecpagefont, \\cftsecaftersnumb, \\cfttoctitlefont and \\cftaftertoctitle for the title; then \\tableofcontents. Under revtex4-2, which names its titles \\tocname, \\lofname and \\lotname and has no \\if@restonecol, it gives \\contentsname, \\listfigurename and \\listtablename from them and defines the conditional. 55 templates.',
    ctan: ['tocloft'],
    features: ['dot-leaders', 'centered', 'bold-head', 'lists-of-floats'],
    params: {
      leaders: { type: 'enum', values: ['sections', 'all', 'none'], default: 'sections', description: 'dot leaders for sections, for sections and subsections, or none added' },
      sectionFont: { type: 'tex', default: '', description: "section entries' font (\\cftsecfont); ''" },
      pageFont: { type: 'tex', default: '', description: "their page numbers' font (\\cftsecpagefont); ''" },
      afterNumber: { type: 'tex', default: '', description: "after each section number (\\cftsecaftersnumb); ''" },
      titleFont: { type: 'tex', default: '', description: "the title's font (\\cfttoctitlefont, \\hfill to centre); ''" },
      titleAfter: { type: 'tex', default: '', description: "after the title (\\cftaftertoctitle); ''" },
      ...CONTENTS,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'tocloft' },
    ],
    requires: [
      'cmd:\\tableofcontents',
    ],
    deny: [
      { class: 'class.scrartcl', reason: 'KOMA-Script objects to tocloft (it warns when loaded) and styles its contents itself (toc.koma)', evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrartcl.A.json' }] },
      { class: 'class.scrbook', reason: 'KOMA-Script objects to tocloft (it warns when loaded) and styles its contents itself (toc.koma)', evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrartcl.A.json' }] },
      { class: 'class.scrreprt', reason: 'KOMA-Script objects to tocloft (it warns when loaded) and styles its contents itself (toc.koma)', evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/scrartcl.A.json' }] },
      { class: 'class.beamer', reason: "beamer's \\tableofcontents only reads the .toc file inside a frame and prints no heading", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '61' }] },
      { class: 'class.memoir', reason: "memoir emulates tocloft (\\usepackage{tocloft} loads nothing: 'Package tocloft emulated by memoir') and names its contents hooks itself (\\cftsection…, \\printtoctitle), so \\cftsecleader, \\cftsecfont, \\cftsecaftersnumb, \\cfttoctitlefont and \\cftaftertoctitle stopped at 'Command … undefined'", evidence: [{ kind: 'compile', cell: "testing-pipeline/out/results/18ec9bcb521b (the copy's memoir.A run, document d67d3f07ec13a9432d0ec: all three presets, l.103-107)" }, { kind: 'compile', cell: "testing-pipeline/out/results/58cae68ecb04 (the copy's memoir.B run, the same document)" }] },
      // Batch 6 (R5b) gives revtex4-2 the three names and \if@restonecol in the handler; whether those lines also serve aastex701 is
      // untested (no aastex pair has run), so this deny stays.
      { class: 'class.aastex', reason: "tocloft's titles are \\contentsname, \\listfigurename and \\listtablename, which aastex701 lacks (its contents title is \\tocname), and its \\@cfttocfinish names \\if@restonecol, which aastex701 lacks too (\\twocolumn is undefined there): \\tableofcontents stops at 'Undefined control sequence', then 'Extra \\fi', as under revtex4-2", evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '6657, 4178' }, { kind: 'compile', cell: 'testing-pipeline/out/profiles/aastex.A.json (lacks cmd:contentsname)' }, { kind: 'compile', cell: 'testing-pipeline/out/results/3d707dcbcd68 (the revtex4-2 analogue: \\cfttoctitlename ->\\contentsname undefined)' }] },
      { class: 'class.mnras', reason: "mnras lacks \\contentsname (its \\tableofcontents prints a fixed CONTENTS heading), which tocloft's \\cfttoctitlename expands to, so \\tableofcontents stops at 'Undefined control sequence'", evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/profiles/mnras.A.json (lacks cmd:contentsname)' }, { kind: 'requirement', file: 'Template/template-requirement/MNRAS.md', line: '152' }] },
    ],
    zerotex: 'yes',
  }),
);
