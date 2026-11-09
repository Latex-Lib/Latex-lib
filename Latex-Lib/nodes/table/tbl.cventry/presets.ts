/**
 * tbl.cventry's presets, each from the moderncv templates that write that entry command (the research's Solution files, and the
 * official template's source lines).
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const template = (line: string) => ({ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/template.tex', line }) as const;
const cls = (line: string) => ({ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0196-moderncv/moderncv.cls', line }) as const;

export const PRESETS = {
  auto: {
    description:
      "One moderncv entry per body row, the command chosen by the table's column count: \\cvlistitem for one column, \\cvitem for two, \\cvitemwithcomment for three, \\cvdoubleitem for four, \\cventry for five or more; header rows dropped.",
    features: ['class-styled'],
    params: {},
    evidence: [solution('0196-moderncv', '41'), solution('0410-moderncv-cv-and-cover-letter', '40-42'), template('137-179, 235-242'), cls('566-588')],
  },
  cventry: {
    description:
      'Every body row a dated \\cventry: years in the hints column, then the title in bold, the institution, the city and the grade on one line, the description below in small type; the last cell is always the description, the cells before it fill years, title, institution, city and grade in order, and extra cells join the description.',
    writes: '\\cventry{…}{…}{…}{…}{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cventry' },
    evidence: [solution('0196-moderncv', '41'), solution('0410-moderncv-cv-and-cover-letter', '40'), template('137-138, 165-167')],
  },
  cvitem: {
    description: 'Every body row a \\cvitem: the first cell as the hint on the left, the rest as the text beside it (label and text rows: skills, interests, a thesis).',
    writes: '\\cvitem{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cvitem' },
    evidence: [solution('0196-moderncv', '41'), solution('0410-moderncv-cv-and-cover-letter', '41'), template('141-143, 235-237')],
  },
  cvitemwithcomment: {
    description: 'Every body row a \\cvitemwithcomment: the hint, the value, and a comment set flush right in small italics (languages and their levels).',
    writes: '\\cvitemwithcomment{…}{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cvitemwithcomment' },
    evidence: [solution('0196-moderncv', '41'), solution('0410-moderncv-cv-and-cover-letter', '42'), template('170-173')],
  },
  cvdoubleitem: {
    description: 'Every body row a \\cvdoubleitem: two hint and text pairs side by side (computer skills by category).',
    writes: '\\cvdoubleitem{…}{…}{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cvdoubleitem' },
    evidence: [solution('0196-moderncv', '41'), template('176-178')],
  },
  cvtripleitem: {
    description: 'Every body row a \\cvtripleitem: three hint and text pairs side by side.',
    writes: '\\cvtripleitem{…}{…}{…}{…}{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cvtripleitem' },
    evidence: [solution('0196-moderncv', '41'), template('179')],
  },
  'skill-matrix': {
    description:
      "moderncv's skill matrix: its legend of the five levels (\\cvskilllegend*), the header row as \\cvskillhead (its Level, Skill, Years and Comment labels from the header cells), then every body row a \\cvskillentry with category, a 0-5 rating drawn as glyphs, skill, years and comment; a row that opens a category starred, with the rule above it.",
    writes: '\\cvskilllegend*[1em]{} \\cvskillhead[…][…][…][…][…] \\cvskillentry*{…}{…}{…}{…}{…} \\cvskillentry{…}{…}{…}{…}{…}',
    features: ['class-styled'],
    params: { entry: 'cvskillentry', skillLegend: true },
    evidence: [solution('0196-moderncv', '43'), template('206, 220, 226-230')],
  },
} as const satisfies { readonly [name: string]: Preset };
