/**
 * front.koma-title's presets, each from the templates that use it (`node seed.ts front --rows`).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SCRGUIDE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/doc/scrguide-body.tex', line: '32-45' } as const;
const KSP = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0240-ksp-thesis/demo/full/content/front/titlepage.tex', line: '5-51' } as const;

export const PRESETS = {
  'subject-subtitle': {
    description: "KOMA's title block with a subject above the title and a subtitle under it (\\subject, \\subtitle), then \\maketitle.",
    features: ['subject-line', 'sans-serif', 'centered'],
    params: { subject: 'Report', subtitle: 'Subtitle' },
    evidence: [solution('0020-koma-script', '48'), solution('0231-tecosaur-bmc', '63'), solution('0582-biblatex-juradiss', '49')],
  },
  publishers: {
    description: 'A subtitle and a publisher line at the foot of the title (\\subtitle, \\publishers).',
    features: ['sans-serif', 'centered'],
    params: { subtitle: 'Subtitle', publishers: 'Publisher' },
    evidence: [solution('0777-qrbill', '50'), solution('0240-ksp-thesis', '70')],
  },
  'in-page': {
    description: 'The title block at the head of the first page instead of a title page of its own (\\KOMAoptions{titlepage=false}).',
    writes: '\\maketitle; \\KOMAoptions{titlepage=false} \\title{…} \\author{…} \\date{…}',
    features: ['sans-serif', 'centered'],
    params: { titlePage: 'false' },
    evidence: [solution('0279-musuos', '49')],
  },
  'roman-title': {
    description: "The title in the roman family instead of KOMA's sans-serif (\\addtokomafont{title}{\\rmfamily}).",
    writes: '\\maketitle; \\addtokomafont{title}{…} \\title{…} \\author{…} \\date{…}',
    features: ['centered'],
    params: { titleFont: '\\rmfamily' },
    evidence: [solution('0146-extsizes', '34'), solution('0173-uni-titlepage', '40')],
  },
  'title-pages': {
    description:
      "KOMA's title pages under scrartcl (titlepage=true): a half-title page (\\extratitle), the title page with each author's affiliation and e-mail under the name, the back of the title page (\\uppertitleback, \\lowertitleback) and the paper's dedication.",
    writes:
      '\\maketitle; \\KOMAoptions{titlepage=true} \\title{…} \\author{…\\\\ \\small …\\\\ \\small \\texttt{…} \\and …} \\date{…} \\extratitle{…} \\uppertitleback{…} \\lowertitleback{…} \\dedication{…}',
    features: ['title-page', 'sans-serif', 'centered'],
    params: { titlePage: 'true', extratitle: '\\centering\\Huge Title', uppertitleback: 'Publisher note', lowertitleback: 'Copyright', authorNotes: 'lines' },
    evidence: [SCRGUIDE, KSP],
  },
  'book-title-pages': {
    description:
      "KOMA's title pages as scrbook and scrreprt print them by default: a half-title, a subject line, the title page with the authors' affiliations and e-mails under their names, a publisher line, the title back and the dedication.",
    writes:
      '\\maketitle; \\subject{…} \\title{…} \\author{…\\\\ \\small …\\\\ \\small \\texttt{…} \\and …} \\date{…} \\publishers{…} \\extratitle{…} \\uppertitleback{…} \\lowertitleback{…} \\dedication{…}',
    features: ['title-page', 'subject-line', 'sans-serif', 'centered'],
    params: { subject: 'Thesis', publishers: 'Publisher', extratitle: '\\centering\\Huge Title', uppertitleback: 'Publisher note', lowertitleback: 'Copyright', authorNotes: 'lines' },
    evidence: [SCRGUIDE, KSP],
  },
  'author-thanks': {
    description: "KOMA's title block with each author's affiliations and e-mail in a \\thanks footnote on the name.",
    writes: '\\maketitle; \\title{…} \\author{…\\thanks{…. \\texttt{…}} \\and …} \\date{…}',
    features: ['sans-serif', 'centered'],
    params: { authorNotes: 'thanks' },
    // KOMA's \maketitle lets \footnote be \thanks in the title and prints \@thanks (scrkernel-title.dtx l.309-315, 440, 490); the
    // per-author e-mail in \author is extsizes' manual's (Source/0146-extsizes/extsizes.tex l.24).
    evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-title.dtx', line: '309-315, 440, 490' }, { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0146-extsizes/extsizes.tex', line: '24' }],
  },
} as const satisfies { readonly [name: string]: Preset };
