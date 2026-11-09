import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'para.ieee-parstart',
    node: 'paragraph/paragraph',
    description:
      "IEEEtran's drop cap: the document's first body paragraph opens with \\IEEEPARstart{T}{his} …, a two-line initial letter and the rest of the first word in capitals (small capitals under compsoc), or IEEE Access's \\PARstart alias; once per document, by a TeX flag. Every other paragraph prints as a plain kernel paragraph, indented by \\hspace* for each indent step.",
    writes: '\\IEEEPARstart{…}{…} …',
    ctan: ['ieeetran'],
    features: ['class-styled'],
    params: {
      command: { type: 'enum', values: ['IEEEPARstart', 'PARstart'], default: 'IEEEPARstart', description: "the drop cap's command: IEEEtran's \\IEEEPARstart, or IEEE Access's \\PARstart alias" },
      indentStep: { type: 'dimen', default: '1.5em', description: "one step of the node's indent (\\hspace*), as para.kernel" },
    },
    presets: PRESETS,
    // IEEEtran defines \IEEEPARstart (IEEEtran.cls l.5863); ieeeaccess.cls keeps it and adds \PARstart (l.1098-1099).
    requires: ['cmd:\\IEEEPARstart'],
    requiresWhen: [{ when: { command: 'PARstart' }, requires: ['cmd:\\PARstart'] }],
    only: ['class.ieeetran', 'class.ieeetran-compsoc', 'class.ieeeaccess'],
    onlyWhen: [
      {
        when: { command: 'PARstart' },
        classes: ['class.ieeeaccess'],
        reason: "\\PARstart is IEEE Access's alias of \\IEEEPARstart (ieeeaccess.cls l.1098-1099); IEEEtran.cls V1.8b defines only \\IEEEPARstart, so under IEEEtran \\PARstart stops at \"Undefined control sequence\"",
        evidence: [
          { kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '1098-1099' },
          { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran/IEEEtran.cls', line: '5863 (\\def\\IEEEPARstart; no \\PARstart in the class)' },
        ],
      },
    ],
    // Typeset ok on ZeroTeX-NG (XeTeX) under IEEEtran [journal], [journal,compsoc] and ieeeaccess (the template's class files,
    // spotcolor replaced by the cmyk accessblue as the pipeline's ieeeaccess-latexlib copy does): four body paragraphs, the
    // drop cap on the first only, an indent step and a one-letter first word on the others (build work para.ieee-parstart).
    targetEngine: 'yes',
  }),
);
