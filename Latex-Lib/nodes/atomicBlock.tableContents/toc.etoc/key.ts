import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { CONTENTS } from '../node.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'toc.etoc',
    node: 'atomicBlock/tableContents',
    description:
      "etoc: \\tableofcontents, or \\localtableofcontents for the current division's own entries; \\etocsetnexttocdepth for the next list's depth. 35 templates.",
    ctan: ['etoc'],
    features: ['local-contents', 'flat-contents', 'lists-of-floats'],
    params: {
      scope: { type: 'enum', values: ['document', 'local'], default: 'document', description: "the whole document's contents, or the current division's (\\localtableofcontents)" },
      nextDepth: { type: 'enum', values: ['none', 'part', 'chapter', 'section', 'subsection', 'subsubsection'], default: 'none', description: 'the next contents listed down to this level (\\etocsetnexttocdepth)' },
      ...CONTENTS,
    },
    presets: PRESETS,
    loads: [
      { pkg: 'etoc' },
    ],
    requires: [
      'cmd:\\tableofcontents',
    ],
    deny: [
      { class: 'class.amsart', reason: "etoc's \\tableofcontents under amsart (whose own \\@starttoc replaces the kernel's) errors right after \\openout of main.toc: 'Missing control sequence inserted', then, in amsart.A, 'Incomplete \\iffalse; all text was ignored' and an emergency stop, so every later branch of the document fails. A single \\tableofcontents is enough, with or without \\etocsetnexttocdepth; \\localtableofcontents compiled, but etoc once loaded turns every other \\tableofcontents of the document into its own, so the whole way is denied", evidence: [{ kind: 'compile', cell: 'GitHub run r3-7771790, document d446a893cc8bb1a2ed5a3 (the only amsart document holding etoc): amsart.A 23 of 41 branches fail from l.387 (toc.etoc@sections-only, @full, @local among them); amsart.B toc.etoc@sections-only (l.387) and @full (plain \\tableofcontents, l.389) fail with the same error' }, { kind: 'compile', cell: 'b24 GitHub probe, amsart.A: ERRORS-etoc-onetoc (etoc and one \\tableofcontents) stops at l.387 exactly as ERRORS-etoc-old (the run document); ERRORS-etoc-new (etoc lines removed, the kernel \\tableofcontents kept) compiles with no error, 11 pages' }] },
      { class: 'class.beamer', reason: "beamer's \\tableofcontents only reads the .toc file inside a frame", evidence: [{ kind: 'requirement', file: 'Template/template-requirement/Beamer.md', line: '61' }] },
      { class: 'class.revtex4-2', reason: 'etoc loads multicol itself, and revtex4-2 stops at \\begin{document}: "Class revtex4-2 Error: The multicol package cannot be used with revtex4-2."', evidence: [{ kind: 'compile', cell: 'testing-pipeline/out/results/24dfac633b65 (revtex4-2-aps.A run: etoc.sty reads multicol.sty, error at l.116 \\begin{document})' }] },
      { class: 'class.aastex', reason: 'etoc loads multicol itself, and aastex701 stops at \\begin{document}: "The multicol package cannot be used with aastex701", then \\stop', evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '6068-6071, 202-207' }, { kind: 'compile', cell: 'testing-pipeline/out/results/24dfac633b65 (the revtex4-2 analogue: etoc.sty reads multicol.sty, error at \\begin{document})' }] },
    ],
    zerotex: 'untested',
  }),
);
