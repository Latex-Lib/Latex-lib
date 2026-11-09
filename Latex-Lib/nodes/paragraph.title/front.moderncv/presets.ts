/**
 * front.moderncv's preset, from moderncv's own template (CV and cover letter) and 0410's CV and cover letter.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SRC = 'Latex Related Research/Latex-lib-main/Source';

export const PRESETS = {
  moderncv: {
    description:
      "moderncv's head: the CV holder's name, address, phones, e-mail, homepage, social accounts (the ORCID among them), photo and quote as personal data, printed by \\makecvtitle in the style the template chose; or, for a title that names a recipient, a cover letter's head with \\makelettertitle and its closing at the end.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SRC}/0196-moderncv/template.tex`, line: '56-116 (personal data), 134 (\\makecvtitle), 275-283 (letter fields, \\makelettertitle), 295 (\\makeletterclosing)' },
      { kind: 'source', file: `${SRC}/0196-moderncv/moderncv.cls`, line: '104-121 (hyperref setup from \\@firstname, \\@lastname, \\@title), 221-337 (\\name … \\social), 500-501 (\\photo, \\quote), 551-555 (\\makecvtitle), 810-841 (letter fields, \\makelettertitle, \\makeletterclosing)' },
      { kind: 'source', file: `${SRC}/0410-moderncv-cv-and-cover-letter/cover_letter.tex`, line: '12-28, 45 (a letter alone)' },
      solution('0196-moderncv', 'title block'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
