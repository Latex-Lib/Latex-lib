import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.titling',
    node: 'paragraph/title',
    description:
      'titling: \\maketitle restyled by its hooks, \\pretitle and \\posttitle around the title, \\preauthor and \\postauthor around the authors, \\predate and \\postdate around the date; \\droptitle to move the block; alone on its page in titlingpage, centred by \\maketitlehooka and \\maketitlehookd. 29 templates.',
    ctan: ['titling'],
    features: ['centered', 'flush-right', 'sans-serif', 'bold-head', 'title-page'],
    params: {
      align: { type: 'enum', values: ['center', 'left', 'right'], default: 'center', description: 'the title and authors centred, flush left or flush right' },
      titleFont: { type: 'tex', default: '\\LARGE', description: "the title's font (in \\pretitle)" },
      authorFont: { type: 'tex', default: '\\large', description: "the authors' font (in \\preauthor)" },
      dateFont: { type: 'tex', default: '\\large', description: "the date's font (in \\predate)" },
      dateAlign: { type: 'enum', values: ['same', 'center', 'left', 'right'], default: 'same', description: 'the date aligned as the title, or its own way' },
      gap: { type: 'dimen', default: '0.5em', description: 'space under the title (in \\posttitle)' },
      drop: { type: 'dimen', default: '', description: "the block moved down, or up when negative (\\droptitle); ''" },
      page: { type: 'boolean', default: false, description: 'the title block alone on its page, centred vertically (titlingpage, \\maketitlehooka, \\maketitlehookd)' },
      date: { type: 'enum', values: ['given', 'today', 'none'], default: 'given', description: "the date line: the node's date (the kernel prints today's when there is none), \\today explicitly, or none (\\date{})" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'titling' },
    ],
    requires: [
      'cmd:\\maketitle',
    ],
    deny: [
      {
        class: 'class.beamer',
        reason: 'titling tests \\if@titlepage while it loads, which beamer does not define: "Undefined control sequence. l.35 \\if@titlepage"',
        evidence: [{ kind: 'compile', cell: "c4b5506b4d0ec0808cab2 (the copy's beamer.A run: front.titling@centered with General's citation, one branch)" }],
      },
      {
        class: 'class.revtex4-2',
        reason: 'titling tests \\if@titlepage while it loads, which revtex4-2 does not define: "Undefined control sequence. \\if@titlepage"',
        evidence: [{ kind: 'compile', cell: "c8c52bb2795234c3906f5 (the copy's revtex4-2-aps.A run: 17 of the documents stopping at \\if@titlepage hold front.titling)" }],
      },
      {
        class: 'class.aastex',
        reason: 'titling.sty tests \\if@titlepage while it loads, which aastex701 does not define (it loads no article and copies revtex4-2\'s front matter, with its own \\titlepage@sw): "Undefined control sequence … \\if@titlepage", then "Extra \\fi", as under revtex4-2',
        evidence: [{ kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '5575-5577 (\\titlepage@sw; no \\newif\\if@titlepage and no \\LoadClass in the class)' }, { kind: 'compile', cell: "c8c52bb2795234c3906f5 (the revtex4-2 analogue: 17 of the documents stopping at \\if@titlepage hold front.titling)" }],
      },
      {
        class: 'class.elsarticle',
        reason: "elsarticle's \\@author is a one-argument macro (elsarticle.dtx l.318, l.341), and titling's \\@maketitle runs {\\@bspreauthor \\@author \\@bspostauthor}: \\@author takes \\@bspostauthor as its argument, so the center and tabular \\preauthor opens never close (\"Not allowed in LR mode\", \"Missing } inserted\", \"Missing \\endgroup inserted\" at \\maketitle)",
        evidence: [
          { kind: 'compile', cell: "testing-pipeline/out/results/b85f2ec7bfba (the copy's elsarticle-preprint.A run, document d642921f1dd3feffef36f l.30: front.titling passes 0 of 17 branches in each of elsarticle-5p.A, elsarticle-preprint.A and elsarticle-preprint.B, against 22 of 22 in article.A)" },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0107-elsarticle/elsarticle.dtx', line: '318, 341' },
        ],
      },
      {
        class: 'class.aa',
        reason: "aa's \\title stores the title in \\aa@title and never sets \\@title (aa.cls l.745-746), and titling's \\maketitle prints {\\@bspretitle \\@title \\@bsposttitle} (titling.sty l.129, l.172), so it stops at \"LaTeX Error: No \\title given\"",
        evidence: [
          { kind: 'source', file: 'testing-pipeline/settings/classes/files/aa.cls', line: '745-746' },
          { kind: 'compile', cell: 'GitHub run 41584963423 results/d1d376383e3f (aa.A, d1f07ecc134879a8a1a46, l.28 \\maketitle: front.titling passes 0 of 5 under aa.A, F105 13 branches)' },
        ],
      },
    ],
    zerotex: 'untested',
  }),
);
