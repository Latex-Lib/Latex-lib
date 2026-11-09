/**
 * xref.class-native's presets, one per class vocabulary: elegantpaper's \figref and \tabref, jmlr's \…ref commands,
 * and \cref through the cleveref that eccv's style and mdpi's class load themselves.
 */
import type { Preset } from '../../../schema/params.ts';
import { solution } from '../../evidence.ts';

const source = (file: string, line: string) => ({ kind: 'source', file, line }) as const;
const SOURCE = 'Latex Related Research/Latex-lib-main/Source';
const requirement = (file: string, line: string) => ({ kind: 'requirement', file: `Template/template-requirement/${file}.md`, line }) as const;

export const PRESETS = {
  elegantpaper: {
    description:
      "elegantpaper's own \\figref{label} and \\tabref{label}: a bold 'Figure n' or 'Table n', the name printed by the class; any other target as Name~\\ref{label}.",
    writes: '\\figref{…} \\tabref{…}; …~\\ref{…}',
    features: ['named-refs', 'class-styled', 'linked'],
    params: { vocabulary: 'elegantpaper' },
    evidence: [
      source(`${SOURCE}/0188-elegantpaper/elegantpaper.cls`, '255-256'),
      source(`${SOURCE}/0188-elegantpaper/elegantpaper-en.tex`, '69-70'),
      solution('0188-elegantpaper', '23'),
      solution('0188-elegantpaper', '80'),
    ],
  },
  jmlr: {
    description:
      "jmlr's (PMLR's) own \\figureref, \\tableref, \\sectionref, \\equationref ('Equation (n)'), \\algorithmref, \\theoremref, \\lemmaref, ... \\appendixref: the class prints the name; a kind it has no command for as Name~\\ref{label}.",
    writes: '\\figureref{…} \\tableref{…} \\sectionref{…} \\equationref{…} \\algorithmref{…} \\theoremref{…} …; …~\\ref{…}',
    features: ['named-refs', 'class-styled', 'linked'],
    params: { vocabulary: 'jmlr' },
    evidence: [
      source(`${SOURCE}/0662-jmlr/jmlr.dtx`, '1860-2004'),
      source(`${SOURCE}/0662-jmlr/pmlr-sample.tex`, '145-181'),
      solution('0662-jmlr', '23'),
      solution('0662-jmlr', '67'),
    ],
  },
  'class-cleveref': {
    description:
      "\\cref{label} through the cleveref the class or its style loads itself, capitalised (eccv.sty's [capitalize] at \\AtEndPreamble, mdpi's [capitalise,noabbrev] at \\begin{document}): no package loaded, the node's name dropped for cleveref's own.",
    writes: '\\cref{…}',
    features: ['named-refs', 'capitalised'],
    params: { vocabulary: 'cleveref' },
    evidence: [
      source('Latex-Lib/classes/eccv.ts', '19-23'),
      source('eccv.sty (commit 791fe5b)', '249-255'),
      source('testing-pipeline/settings/classes/files/Definitions/mdpi.cls', '389-414, 481, 511-522'),
      solution('0894-mdpi', '57'),
      requirement('ECCV', '75'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
