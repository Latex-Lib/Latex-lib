/**
 * doc.koma-options's presets, each from the templates that use it. Paths are under `Latex Related Research/`.
 */
import type { Preset } from '../../../schema/params.ts';

const SRC = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-lib-main/Source/${file}`, line }) as const;
const EXAMPLE = (file: string, line: string) => ({ kind: 'source', file: `Latex Related Research/Latex-Template-Examples/${file}`, line }) as const;

export const PRESETS = {
  scrartcl: {
    description:
      "An article's KOMA set-up after the class line: a half-line paragraph skip, the bibliography and the lists of floats numbered in the contents, a rule under the running head, KOMA's abstract heading on, and the captions set small (\\KOMAoptions{parskip=half, bibliography=totocnumbered, listof=totoc, headsepline=true, abstract=true} \\setkomafont{caption}{\\small}).",
    features: ['class-styled'],
    params: { form: 'document', parskip: 'half', bibliography: 'totocnumbered', listof: 'totoc', headsepline: 'true', abstract: 'true', captionFont: '\\small' },
    evidence: [
      SRC('0306-martinx3-educationorganization-hbrs-late/aussehen/hbrs-inf.sty', '54 (bibliography=totocnumbered), 57 (listof=totoc), 80 (\\setkomafont{caption}{\\small}), 83 (parskip=half)'),
      SRC('0370-aremju-latex-template/main.tex', '95 (\\KOMAoptions{headsepline=true})'),
      { kind: 'requirement', file: 'Template/template-requirement/KOMA_Scrartcl.md', line: '193-194 (the abstract heading prints only under abstract=true)' },
    ],
  },
  scrbook: {
    description:
      "A book's KOMA set-up: the type area recomputed with DIV=11 and a 12 mm binding correction, chapters opening on right-hand pages, the running head inside the type area, and the bibliography in the contents (\\KOMAoptions{DIV=11, BCOR=12mm, open=right, headinclude=true, bibliography=totoc}).",
    features: ['class-styled'],
    params: { form: 'document', DIV: '11', BCOR: '12mm', open: 'right', headinclude: 'true', bibliography: 'totoc' },
    evidence: [
      EXAMPLE('class.scrbook/main.tex', '10 (open=right, BCOR=12mm, DIV=11, headinclude=true)'),
      SRC('0020-koma-script/doc/scrguide.cls', '114-121 (bibliography=totoc)'),
    ],
  },
  scrreprt: {
    description:
      "A report's KOMA set-up: the type area from DIV=12 and an 8 mm binding correction, the lists of floats one level down, and the labeling list's labels bold (\\KOMAoptions{DIV=12, BCOR=8mm, listof=leveldown} \\setkomafont{labelinglabel}{\\bfseries}).",
    features: ['class-styled'],
    params: { form: 'document', DIV: '12', BCOR: '8mm', listof: 'leveldown', labelinglabelFont: '\\bfseries' },
    evidence: [
      EXAMPLE('class.scrreprt/main.tex', '9 (DIV=12, BCOR=8mm), 29 (\\setkomafont{labelinglabel}{\\bfseries})'),
      SRC('0800-valentjn-thesis-arxiv/tex/preamble/settings/komaTextArea.tex', '6-19 (DIV=12, listof=leveldown)'),
    ],
  },
  scrlttr2: {
    description:
      "A KOMA letter's options: a full-line paragraph skip, the sender's head aligned right with a rule after the name, phone and e-mail in it, no fold marks, a larger first page, and the sender's name and the subject bold sans-serif (\\KOMAoptions{parskip=full, fromalign=right, fromrule=aftername, fromphone=true, fromemail=true, foldmarks=false, enlargefirstpage=true} \\setkomafont{fromname}{…} \\setkomafont{subject}{…}).",
    writes: '\\KOMAoptions{parskip=…, fromalign=…, fromrule=…, fromphone=…, fromemail=…, foldmarks=…, enlargefirstpage=…} \\setkomafont{fromname}{…} \\setkomafont{subject}{…}',
    features: ['class-styled'],
    params: {
      form: 'letter',
      parskip: 'full',
      fromalign: 'right',
      fromrule: 'aftername',
      fromphone: 'true',
      fromemail: 'true',
      foldmarks: 'false',
      enlargefirstpage: 'true',
      fromnameFont: '\\sffamily\\bfseries',
      subjectFont: '\\sffamily\\bfseries',
    },
    evidence: [
      SRC('0688-alexeyabel-latex-briefvorlage-din-5008/Latex-Briefvorlage.tex', '6-36 (parskip=full, fromalign=right, fromphone=true, fromemail=true)'),
      SRC('0719-pandoc-din-5008-letter/main.tex', '3-4 (parskip=half, foldmarks=off, enlargefirstpage=true), 15-16 (\\setkomafont{fromname}, \\setkomafont{subject})'),
      EXAMPLE('class.scrlttr2/main.tex', '37 (fromrule=aftername)'),
    ],
  },
} as const satisfies { readonly [name: string]: Preset };
