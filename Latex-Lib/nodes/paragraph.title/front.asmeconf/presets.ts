/**
 * front.asmeconf's presets: the class's two author layouts (asmeconf-template.tex l.148-196; examples/asmeconf-authorgrid-example.tex).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0909-asmeconf';

export const PRESETS = {
  inline: {
    description:
      "asmeconf's inline title block, ASME's current style: the names in one centred line, each with its affiliation's number, a dagger for joint first authors and an asterisk for the corresponding author (footnoted with the email), the numbered addresses below.",
    features: ['class-styled', 'centered', 'sans-serif'],
    params: {},
    evidence: [solution('0909-asmeconf', '23, 53'), { kind: 'source', file: `${SOURCE}/asmeconf-template.tex`, line: '148-196' }, { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '2040-2141 (inline \\SetAuthors, \\SetAffiliation, \\affil)' }],
  },
  grid: {
    description:
      "asmeconf's traditional grid of author blocks, three to a row, each name in bold over its own address; for a document whose class line gives asmeconf's grid option (without it the same lines print the inline block).",
    writes: '\\PaperNo{…} \\title{…} \\SetAuthors{…\\affil{…}\\JointFirstAuthor\\CorrespondingAuthor{…}, {…, …}\\affil{…}} \\SetAffiliation{…}{… \\\\ …} \\maketitle \\versionfootnote{…} \\keywords{…}',
    features: ['class-styled', 'centered', 'sans-serif'],
    params: { authorBlock: 'grid' },
    evidence: [{ kind: 'source', file: `${SOURCE}/examples/asmeconf-authorgrid-example.tex`, line: '168-183, 522-525' }, { kind: 'source', file: `${SOURCE}/asmeconf.cls`, line: '245-246, 1808-2038 (option grid; the grid \\SetAuthors and \\SetAffiliation)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
