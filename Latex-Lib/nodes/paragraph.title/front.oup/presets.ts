/**
 * front.oup's preset, from the OUP authoring template's sample article and class (v1.5 2026/07/14).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

export const SRC = 'Latex Related Research/Latex-lib-main/Source/0914-oup-authoring-template';

export const PRESETS = {
  oup: {
    description:
      "The OUP title block as the sample writes it: \\title with its short title, \\author[1,$\\ast$]{… \\ORCID{…}} with affiliation numbers and the corresponding author's star, numbered \\address lines tagged \\orgdiv, \\orgname and \\orgaddress, \\corresp with a mailto link, the received, revised and accepted dates, \\keywords and \\keywords[Abbreviations], \\otherabstract and the boxed key messages, then \\maketitle.",
    features: ['class-styled'],
    params: {},
    evidence: [
      { kind: 'source', file: `${SRC}/oup-authoring-template.tex`, line: '76-130 (\\firstpage, \\title[…]{…}, \\author[marks]{…\\ORCID{…}}, \\address[n]{\\orgdiv …}, \\corresp, dates, \\keywords, \\otherabstract, \\boxedtext, \\maketitle)' },
      { kind: 'source', file: `${SRC}/oup-authoring-template.cls`, line: '1147-1167 (\\title, \\author), 1201-1203 (dates), 1229-1251 (\\keywords, \\otherabstract), 1281-1326 (\\boxedtext, \\orgdiv, \\address, \\corresp), 1339-1388 (\\maketitle), 3021-3029 (\\ORCID)' },
      solution('0914-oup-authoring-template', 'title block, ORCID mark, keywords, other abstract and key-messages box rows'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
