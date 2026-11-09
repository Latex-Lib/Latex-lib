/**
 * front.ams-topmatter's presets, one per AMS class, each from the class's own template (amscls doc/) and amsclass.dtx.
 * amsaddr's two forms (\usepackage{amsaddr}, [foot]) are not here: the library has no facts for amsaddr in packages/.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const DOC = 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/doc';
const DTX = 'Latex Related Research/Latex-lib-main/Source/0260-amsproc/amsclass.dtx';

export const PRESETS = {
  amsart: {
    description:
      "amsart's top matter: \\title[short]{…}, each \\author followed by one \\address per affiliation and its \\email, \\subjclass[2020]{…}, \\keywords{…}, \\date, \\dedicatory, \\commby, \\contrib, \\translator and \\pagespan, then \\maketitle; the addresses print at the end of the article.",
    features: ['class-styled', 'centered'],
    params: { tags: 'amsart' },
    evidence: [
      { kind: 'source', file: `${DOC}/amsart-template.tex`, line: '54-83' },
      { kind: 'source', file: DTX, line: '1266-1298 (\\title, \\author), 1319 (\\contrib), 1363-1366 (\\address, \\email), 1490-1511 (\\dedicatory, \\keywords, \\subjclass, \\commby), 1815 (\\pagespan)' },
      { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsart.md', line: '41-48' },
    ],
  },
  amsproc: {
    description:
      "amsproc's top matter: as amsart's, with no \\commby (amsart's alone): \\title, each \\author with its \\address and \\email, \\subjclass, \\keywords, \\date, \\dedicatory, \\contrib, \\translator, \\pagespan, then \\maketitle.",
    writes: '\\title[…]{…} \\author[…]{…} \\address{…} \\email{…} \\thanks{…} \\subjclass[2020]{…} \\keywords{…} \\date{…} \\dedicatory{…} \\contrib[…]{…} \\translator{…} \\pagespan{…}{…} \\maketitle',
    features: ['class-styled', 'centered'],
    params: { tags: 'amsproc' },
    evidence: [
      { kind: 'source', file: `${DOC}/amsproc-template.tex`, line: '54-83' },
      { kind: 'source', file: DTX, line: '1319 and 1814-1819 (\\contrib, \\pagespan: amsart|amsproc), 1511 (\\commby: amsart only)' },
      solution('0260-amsproc', '30-37'),
    ],
  },
  amsbook: {
    description:
      "amsbook's top matter: \\frontmatter first (roman page numbers), then \\title, each \\author with its \\address and \\email, \\subjclass, \\keywords, \\date, \\dedicatory and \\translator, and \\maketitle, which sets the title page and its verso; no \\commby, \\contrib or \\pagespan (amsart's and amsproc's).",
    writes: '\\frontmatter \\title[…]{…} \\author[…]{…} \\address{…} \\email{…} \\thanks{…} \\subjclass[2020]{…} \\keywords{…} \\date{…} \\dedicatory{…} \\translator{…} \\maketitle',
    features: ['class-styled', 'title-page'],
    params: { tags: 'amsbook', frontmatter: true },
    evidence: [
      { kind: 'source', file: `${DOC}/amsbook-template.tex`, line: '66-105' },
      { kind: 'source', file: DTX, line: '2815-2821 (\\frontmatter: amsbook only), 3881-3942 (amsbook \\maketitle and verso)' },
      { kind: 'requirement', file: 'Template/template-requirement/AMS_Amsbook.md', line: '47-53' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
