/**
 * front.emulateapj's presets, from emulateapj's sample paper (Latex-Template-Examples/class.emulateapj/main.tex) and the class source.
 */
import type { Preset } from '../../../schema/params.ts';

const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.emulateapj/main.tex';

export const PRESETS = {
  'affil-marks': {
    description:
      "ApJ's title block as emulateapj's sample writes it: one \\author line with each author's \\altaffilmark numbers and ', and' before the last, the shared affiliation as \\affil, the other affiliations and the e-mails as numbered \\altaffiltext notes, the Subject headings (\\keywords, joined by ---) and the running heads; the first \\section prints it all.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [{ kind: 'source', file: EXAMPLE, line: '90-117' }],
  },
  'per-author': {
    description: "ApJ's title block with one \\author per author, each followed by an \\affil per affiliation of theirs (shared ones repeated), e-mails as numbered \\altaffiltext notes; the first \\section prints it.",
    writes: '\\shorttitle{…} \\shortauthors{…}; \\title{…} \\author{…\\altaffilmark{1}} \\affil{…} \\author{…\\altaffilmark{2}} \\affil{…} \\affil{…} \\altaffiltext{1}{…} \\keywords{… --- …}',
    features: ['class-styled', 'centered'],
    params: { affiliations: 'per-author' },
    evidence: [{ kind: 'source', file: 'emulateapj.cls (MiKTeX package emulateapj, version February 19, 2025)', line: '455-460 (\\affiliation and \\affil call revtex\'s \\move@AU\\move@AF: an \\affil belongs to the \\author before it)' }],
  },
  'title-here': {
    description: "ApJ's title block in the sample's affiliation form, with \\maketitle written right after it, for a paper with no \\section (the class prints the title block at the first one) and no abstract.",
    writes: '\\shorttitle{…} \\shortauthors{…}; \\title{…} \\author{…\\altaffilmark{1}, … and …} \\affil{…} \\altaffiltext{1}{…} \\keywords{… --- …} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { maketitle: 'here' },
    evidence: [{ kind: 'source', file: EXAMPLE, line: '117 (\\maketitle after the title, abstract and keywords)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
