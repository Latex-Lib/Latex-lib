/**
 * doc.style-mode's presets: each conference style's mode as its own author kit switches it (the commented alternatives of the
 * kit's load line, or its mode declaration), with the kit's placeholders.
 */
import type { Preset } from '../../../schema/params.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';
const KITS = `${SRC}/0031-nhatkhangcs-overleaf-comments/examples`;
const EX = 'Latex Related Research/Latex-Template-Examples';

export const PRESETS = {
  cvpr: {
    description: "CVPR/ICCV review copy: the review option passed to cvpr.sty (anonymous, line ruler, page numbers, 'CONFIDENTIAL REVIEW COPY' with the paper ID), and the kit's \\paperID, \\confName and \\confYear.",
    writes: '\\PassOptionsToPackage{review}{cvpr} \\def\\paperID{…} \\def\\confName{…} \\def\\confYear{…}',
    features: ['class-styled'],
    params: { venue: 'cvpr', mode: 'review', paperId: '*****', conferenceName: 'CVPR', conferenceYear: '2027' },
    evidence: [
      { kind: 'source', file: `${KITS}/cvpr/cvpr.sty`, line: '53-63 (the review, rebuttal and pagenumbers options)' },
      { kind: 'source', file: `${EX}/class.cvpr/main.tex`, line: '43-45 (\\usepackage[review]{cvpr}), 81-83 (\\def\\paperID, \\confName, \\confYear)' },
    ],
  },
  iclr: {
    description: 'ICLR camera-ready or preprint: \\iclrfinalcopy, which shows the authors and the final notice.',
    writes: '\\iclrfinalcopy',
    features: ['class-styled'],
    params: { venue: 'iclr', mode: 'final' },
    evidence: [
      { kind: 'source', file: `${KITS}/iclr/iclr2027_conference.sty`, line: '28-31 (\\newif\\ificlrfinal, \\def\\iclrfinalcopy{\\iclrfinaltrue})' },
      { kind: 'source', file: `${EX}/class.iclr/main.tex`, line: '5, 50 (\\iclrfinalcopy)' },
    ],
  },
  icml: {
    description: "ICML camera-ready: the accepted option passed to icml2026.sty, which shows the authors and prints the 'Proceedings of the … International Conference on Machine Learning' notice.",
    writes: '\\PassOptionsToPackage{accepted}{icml2026}',
    features: ['class-styled'],
    params: { venue: 'icml', mode: 'final' },
    evidence: [
      { kind: 'source', file: `${SRC}/0461-icml/icml2026.sty`, line: '128-177 (the accepted and preprint options)' },
      { kind: 'source', file: `${EX}/class.icml/main.tex`, line: '21-25' },
    ],
  },
  neurips: {
    description: "NeurIPS camera-ready in the main track: the main and final options passed to neurips_2026.sty (authors shown, no line numbers, the track's notice).",
    writes: '\\PassOptionsToPackage{main,final}{neurips_2026}',
    features: ['class-styled'],
    params: { venue: 'neurips', mode: 'final', track: 'main' },
    evidence: [
      { kind: 'source', file: `${SRC}/0506-neurips/neurips_2026.sty`, line: '24-95 (final, nonatbib, preprint and the track options)' },
      { kind: 'source', file: `${SRC}/0506-neurips/neurips_2026.tex`, line: '10-30 (the commented loads, \\usepackage[main, final]{neurips_2026})' },
    ],
  },
  aaai: {
    description: "AAAI anonymous submission: the submission option passed to aaai2027.sty (authors hidden, the review copyright text).",
    writes: '\\PassOptionsToPackage{submission}{aaai2027} \\copyrightyear{…}',
    features: ['class-styled'],
    params: { venue: 'aaai', mode: 'review' },
    evidence: [{ kind: 'source', file: `${KITS}/aaai/aaai2027.sty`, line: '25-50 (submission, draft, preprint, ccby), 93-94 (\\copyrighttext, \\copyrightyear)' }],
  },
  acl: {
    description: "*ACL review copy: the review option passed to acl.sty (anonymous, line numbers, page numbers); \\titlebox when the title block needs more room.",
    writes: '\\PassOptionsToPackage{review}{acl} \\setlength\\titlebox{…}',
    features: ['class-styled'],
    params: { venue: 'acl', mode: 'review' },
    evidence: [
      { kind: 'source', file: `${KITS}/arr/acl.sty`, line: '10-29 (final, review, preprint), 107-110 (\\titlebox)' },
      { kind: 'source', file: `${EX}/class.acl/main.tex`, line: '12, 62' },
    ],
  },
  eccv: {
    description: "ECCV review copy: review, year and ID passed to eccv.sty (anonymous, the line ruler and the paper ID).",
    writes: '\\PassOptionsToPackage{review,year=…,ID=…}{eccv}',
    features: ['class-styled'],
    params: { venue: 'eccv', mode: 'review', conferenceYear: '2026', paperId: '*****' },
    evidence: [
      { kind: 'source', file: `${EX}/class.eccv/main.tex`, line: '11-13 (\\usepackage[review,year=2026,ID=*****]{eccv})' },
      { kind: 'source', file: 'Latex-Lib/classes/eccv.ts', line: '8-12' },
    ],
  },
  bmvc: {
    description: "BMVC review copy: \\bmvcreviewcopy{paper ID} in the preamble (the year and the ID in place of the authors, the review ruler).",
    writes: '\\bmvcreviewcopy{…}',
    features: ['class-styled'],
    params: { venue: 'bmvc', mode: 'review', paperId: '??' },
    evidence: [
      { kind: 'requirement', file: 'Template/template-requirement/BMVC.md', line: '42-44' },
      { kind: 'source', file: `${EX}/class.bmvc/main.tex`, line: '13 (% \\bmvcreviewcopy{??})' },
    ],
  },
  icassp: {
    description: "ICASSP/spconf's paper settings: \\ninept, the nine-point text the kit asks for, and the optional \\copyrightnotice{…} and \\toappear{…} lines at the foot of the first page.",
    writes: '\\ninept \\copyrightnotice{…} \\toappear{…}',
    features: ['class-styled'],
    params: { venue: 'icassp', ninept: true },
    evidence: [
      { kind: 'source', file: `${EX}/class.icassp/main.tex`, line: '35 (\\usepackage{spconf}), 88 (\\ninept)' },
      { kind: 'source', file: 'Latex-Lib/classes/icassp.ts', line: '26, 41 (spconf.sty l.143, 216-218: \\ninept, \\copyrightnotice, \\toappear)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
