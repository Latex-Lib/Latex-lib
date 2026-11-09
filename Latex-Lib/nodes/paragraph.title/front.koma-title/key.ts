import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.koma-title',
    node: 'paragraph/title',
    description:
      "KOMA-Script's title block: \\subject above the title, \\subtitle under it (the paper's own or the template's), \\titlehead at the top, \\publishers at the foot, then \\title, \\author, \\date and \\maketitle; titlepage=true or false, the title's font by \\addtokomafont{title}; on title pages a half-title (\\extratitle), the back of the title page (\\uppertitleback, \\lowertitleback) and a \\dedication; each author's affiliation and e-mail on lines under the name or in a \\thanks. KOMA classes only (scrartcl, scrreprt, scrbook). 13 templates.",
    writes:
      '\\maketitle; \\titlehead{…} \\subject{…} \\title{…} \\author{… \\and …} \\date{…} \\subtitle{…} \\publishers{…} \\extratitle{…} \\uppertitleback{…} \\lowertitleback{…} \\dedication{…}',
    ctan: ['koma-script'],
    features: ['subject-line', 'sans-serif', 'centered'],
    params: {
      subject: { type: 'string', default: '', description: "a line above the title (\\subject); ''" },
      subtitle: { type: 'string', default: '', description: "a line under the title (\\subtitle); ''" },
      titlehead: { type: 'string', default: '', description: "text at the head of the title (\\titlehead); ''" },
      publishers: { type: 'string', default: '', description: "a line at the foot (\\publishers); ''" },
      titlePage: { type: 'enum', values: ['class', 'true', 'false'], default: 'class', description: 'a title page of its own, or the title at the head of the first page (titlepage=)' },
      titleFont: { type: 'tex', default: '', description: "added to the title's font (\\addtokomafont{title}); ''" },
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the kernel prints today's when there is none), \\today explicitly, or none (\\date{})" },
      extratitle: { type: 'tex', default: '', description: "a half-title page before the title page (\\extratitle), a template constant; printed only on title pages; ''" },
      uppertitleback: { type: 'tex', default: '', description: "the top of the title page's back: a publisher or warranty note (\\uppertitleback); printed only on title pages; ''" },
      lowertitleback: { type: 'tex', default: '', description: "the foot of the title page's back: a copyright or colophon (\\lowertitleback); printed only on title pages; ''" },
      authorNotes: {
        type: 'enum',
        values: ['none', 'lines', 'thanks'],
        default: 'none',
        description: "each author's affiliations and e-mail: not printed, on lines under the name (\\author{Name\\\\ \\small …\\\\ \\small \\texttt{…}}), or in a \\thanks footnote",
      },
    },
    // The subtitle and dedication change per paper, so they are template fields; the subtitle parameter stays as the template's constant.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.subtitle', 'templateSpecific.dedication'],
    presets: PRESETS,
    // It runs the class's own \maketitle, which prints what the class keeps for it (a revtex4-2 or amsart abstract).
    claims: ['maketitle'],
    requires: [
      'cmd:\\maketitle',
    ],
    only: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
    // Every preset typesets under scrartcl, scrreprt and scrbook on ZeroTeX-NG (2026-11-07), on the title sample with a
    // templateSpecific subtitle and dedication. scrartcl prints the half-title, title backs and dedication only with titlepage=true.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'koma-script', section: 'CTAN package page', url: 'https://ctan.org/pkg/koma-script' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-title.dtx', line: '225-270 (\\extratitle, \\titlehead, \\subject, \\subtitle, \\publishers, \\uppertitleback, \\lowertitleback, \\dedication), 444-520 (printed on title pages)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/doc/scrguide-body.tex', line: '32-45' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0240-ksp-thesis/demo/full/content/front/titlepage.tex', line: '5-51' },
  ],
});
