import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

/** Each venue's class (`onlyWhen`) and the class commands its lines use (`requiresWhen`). */
const VENUES = {
  cvpr: { classes: ['class.cvpr'], requires: [] },
  iclr: { classes: ['class.iclr'], requires: ['cmd:\\iclrfinalcopy'] },
  icml: { classes: ['class.icml'], requires: [] },
  neurips: { classes: ['class.neurips'], requires: [] },
  aaai: { classes: ['class.aaai'], requires: ['cmd:\\copyrightyear'] },
  acl: { classes: ['class.acl'], requires: [] },
  eccv: { classes: ['class.eccv'], requires: [] },
  bmvc: { classes: ['class.bmvc'], requires: ['cmd:\\bmvcreviewcopy'] },
  icassp: { classes: ['class.icassp'], requires: ['cmd:\\ninept', 'cmd:\\copyrightnotice', 'cmd:\\toappear'] },
} as const;

export default defineKey(
  minimal({
    id: 'doc.style-mode',
    node: 'doc',
    description:
      "A conference style's mode (review, camera-ready, preprint, rebuttal), as its author kit switches it: options passed to the style before the class line (\\PassOptionsToPackage{review}{cvpr}, {accepted}{icml2026}, {main,final}{neurips_2026}, {submission}{aaai2027}, {review}{acl}, {review,year=…,ID=…}{eccv}), or the style's own declaration (ICLR's \\iclrfinalcopy, BMVC's \\bmvcreviewcopy{ID}, spconf's \\ninept, \\copyrightnotice and \\toappear), with the mode's constants (CVPR's \\paperID, \\confName and \\confYear, AAAI's \\copyrightyear, ACL's \\titlebox).",
    writes:
      '\\PassOptionsToPackage{review}{cvpr} \\def\\confName{…} | \\iclrfinalcopy | \\PassOptionsToPackage{accepted}{icml2026} | \\PassOptionsToPackage{main,final}{neurips_2026} | \\PassOptionsToPackage{submission}{aaai2027} \\copyrightyear{…} | \\PassOptionsToPackage{review}{acl} \\setlength\\titlebox{…} | \\PassOptionsToPackage{review,year=…,ID=…}{eccv} | \\bmvcreviewcopy{…} | \\ninept \\copyrightnotice{…} \\toappear{…}',
    ctan: [],
    features: ['class-styled'],
    params: {
      venue: { type: 'enum', values: ['none', ...Object.keys(VENUES)], default: 'none', compat: true, description: 'the conference style whose mode is set; none prints nothing' },
      mode: {
        type: 'enum',
        values: ['class', 'review', 'final', 'preprint', 'rebuttal'],
        default: 'class',
        compat: true,
        description:
          "the mode: class leaves the style's load as the setting gives it; review is the anonymous copy (cvpr review, aaai submission, acl review, eccv review, bmvc \\bmvcreviewcopy; icml and neurips with no option), final the camera-ready (icml accepted, neurips final, acl final, iclr \\iclrfinalcopy), preprint the arXiv copy (icml, neurips, aaai, acl preprint; cvpr pagenumbers; iclr \\iclrfinalcopy), rebuttal CVPR's rebuttal",
      },
      package: { type: 'string', default: '', description: "the style's file name, when another year's than the default (cvpr, icml2026, neurips_2026, aaai2027, acl, eccv)" },
      paperId: { type: 'string', default: '', description: "the submission's ID: cvpr \\paperID, eccv's ID option, bmvc \\bmvcreviewcopy" },
      conferenceName: { type: 'string', default: '', description: "cvpr's \\confName (CVPR, ICCV, 3DV)" },
      conferenceYear: { type: 'string', default: '', description: "cvpr's \\confYear, eccv's year option" },
      track: { type: 'string', default: '', description: "neurips's track option: main, position, eandd, creativeai, sglblindworkshop, dblblindworkshop, education" },
      copyrightYear: { type: 'string', default: '', description: "aaai's \\copyrightyear" },
      titlebox: { type: 'dimen', default: '', description: "acl's \\titlebox, the room kept for the title block (5cm at least)" },
      ninept: { type: 'boolean', default: false, description: "spconf's \\ninept, the nine-point text" },
      copyrightNotice: { type: 'tex', default: '', description: "spconf's \\copyrightnotice{…} at the foot of the first page" },
      toAppear: { type: 'tex', default: '', description: "spconf's \\toappear{…} at the foot of the first page" },
    },
    presets: PRESETS,
    requiresWhen: Object.entries(VENUES)
      .filter(([, v]) => v.requires.length > 0)
      .map(([venue, v]) => ({ when: { venue }, requires: v.requires })),
    only: Object.values(VENUES).flatMap((v) => v.classes),
    onlyWhen: Object.entries(VENUES).map(([venue, v]) => ({
      when: { venue },
      classes: v.classes,
      reason: `the ${venue} lines name ${venue}'s style or its commands: elsewhere the options go to a package never loaded (LaTeX warns of unused options) or the commands stop at "Undefined control sequence"`,
      evidence: PRESETS[venue as keyof typeof PRESETS].evidence,
    })),
    // Typeset on ZeroTeX-NG (2026-11-07) with the style loaded bare after the class line, as the way expects, and the mode checked in
    // the log: cvpr (review), iclr2027_conference (\iclrfinalcopy), icml2025 (the studio upload; accepted, with package: icml2025),
    // neurips_2026 (main,final), acl over the setting's [final] (review wins) and aaai2027 (submission, with the setting's iftex
    // line): all ok. Not shown: eccv, bmvc2k and spconf, whose files are not here.
    targetEngine: 'yes',
  }),
);
