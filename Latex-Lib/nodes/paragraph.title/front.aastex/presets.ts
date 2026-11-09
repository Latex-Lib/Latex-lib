/**
 * front.aastex's preset, from AASTeX 7.0.1's class and its sample article.
 */
import type { Preset } from '../../../schema/params.ts';

export const PRESETS = {
  aastex: {
    description:
      "AASTeX 7's front matter: \\author[orcid=…] with one \\affiliation per institute and an \\email each, the corresponding author's e-mail shown (\\email[show]) with \\correspondingauthor, running heads, dates and \\keywords joined by ---, printed by the class at its first \\section.",
    features: ['class-styled', 'centered'],
    params: {},
    evidence: [
      { kind: 'source', file: 'testing-pipeline/settings/classes/files/aastex701.cls', line: '2308-2324 (\\keywords, \\received, \\revised, \\accepted, \\published), 7201-7204 (\\shorttitle, \\shortauthors), 7328-7395 (\\title, \\affiliation, the affiliation and e-mail errors), 7583-7594 (the first \\section runs \\maketitle), 12436-12441 (every author needs \\affiliation and \\email), 13320-13380 (\\correspondingauthor, \\email[show], \\collaboration), 13751 (\\uat)' },
      { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0563-aastex/aastex701-sample.tex', line: '85-237 (\\shorttitle, dates, \\author[orcid=…], \\affiliation, \\email[show], \\collaboration{all}{…}, \\keywords after the abstract)' },
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
