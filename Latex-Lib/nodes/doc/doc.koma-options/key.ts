import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const KOMA_CLASS = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-basics.dtx', line: '4095 (\\KOMAoptions)' } as const;
const SW = ['class', 'true', 'false'] as const;

export default defineKey({
  ...minimal({
    id: 'doc.koma-options',
    node: 'doc',
    description:
      "KOMA-Script's own set-up after the class line, the template's constants: one \\KOMAoptions{…} holding only the options that differ from the class default (DIV, BCOR, parskip, open, captions, bibliography, listof, abstract, headsepline, footsepline, headinclude, footinclude; for a scrlttr2 letter fromalign, fromrule, fromphone, fromemail, fromurl, fromlogo, foldmarks, enlargefirstpage), then \\setkomafont or \\addtokomafont for the elements the template restyles (caption, captionlabel, pagehead, pagenumber, labelinglabel; a letter's fromname and subject). KOMA classes only: scrartcl, scrreprt, scrbook, scrlttr2.",
    writes: '\\KOMAoptions{…=…, …} \\setkomafont{…}{…} \\addtokomafont{…}{…}',
    ctan: ['koma-script'],
    features: ['class-styled'],
    params: {
      form: { type: 'enum', values: ['document', 'letter'], default: 'document', description: "which option set: a document class's (scrartcl, scrreprt, scrbook) or a scrlttr2 letter's" },
      DIV: { type: 'string', default: '', description: "the type area's divisor (DIV=12, calc, classic); '' keeps the class's" },
      BCOR: { type: 'dimen', default: '', description: "the binding correction (BCOR=8mm); '' keeps none" },
      parskip: { type: 'enum', values: ['class', 'false', 'half', 'half-', 'full', 'full-'], default: 'class', description: 'the paragraph skip (parskip=)' },
      open: { type: 'enum', values: ['class', 'right', 'any', 'left'], default: 'class', description: 'where chapters open (open=): scrbook and scrreprt only' },
      captions: { type: 'enum', values: ['class', 'tableheading', 'tablesignature'], default: 'class', description: "table captions' placement (captions=)" },
      bibliography: { type: 'enum', values: ['class', 'totoc', 'totocnumbered', 'nottotoc', 'leveldown'], default: 'class', description: 'the bibliography in the contents (bibliography=)' },
      listof: { type: 'enum', values: ['class', 'totoc', 'totocnumbered', 'leveldown', 'flat'], default: 'class', description: 'the lists of figures and tables (listof=)' },
      abstract: { type: 'enum', values: SW, default: 'class', description: "KOMA's abstract heading (abstract=): scrartcl and scrreprt only" },
      headsepline: { type: 'enum', values: SW, default: 'class', description: 'a rule under the running head (headsepline=)' },
      footsepline: { type: 'enum', values: SW, default: 'class', description: 'a rule over the running foot (footsepline=)' },
      headinclude: { type: 'enum', values: SW, default: 'class', description: 'the head counted in the type area (headinclude=)' },
      footinclude: { type: 'enum', values: SW, default: 'class', description: 'the foot counted in the type area (footinclude=)' },
      fromalign: { type: 'enum', values: ['class', 'left', 'center', 'right', 'locationleft', 'locationright', 'false'], default: 'class', description: "a letter's sender head alignment (fromalign=)" },
      fromrule: { type: 'enum', values: ['class', 'false', 'aftername', 'afteraddress'], default: 'class', description: "a rule in a letter's sender head (fromrule=)" },
      fromphone: { type: 'enum', values: SW, default: 'class', description: "the sender's phone in a letter's head (fromphone=)" },
      fromemail: { type: 'enum', values: SW, default: 'class', description: "the sender's e-mail in a letter's head (fromemail=)" },
      fromurl: { type: 'enum', values: SW, default: 'class', description: "the sender's URL in a letter's head (fromurl=)" },
      fromlogo: { type: 'enum', values: SW, default: 'class', description: "the sender's logo in a letter's head (fromlogo=)" },
      foldmarks: { type: 'enum', values: SW, default: 'class', description: "a letter's fold marks (foldmarks=)" },
      enlargefirstpage: { type: 'enum', values: SW, default: 'class', description: "a letter's first page enlarged (enlargefirstpage=)" },
      options: { type: 'tex', default: '', description: "further key=value options as the template writes them, added to the \\KOMAoptions list; ''" },
      fontMode: { type: 'enum', values: ['set', 'add'], default: 'set', description: 'replace an element\'s font (\\setkomafont) or add to it (\\addtokomafont)' },
      captionFont: { type: 'tex', default: '', description: "the caption element's font; ''" },
      captionLabelFont: { type: 'tex', default: '', description: "the captionlabel element's font; ''" },
      pageheadFont: { type: 'tex', default: '', description: "the pagehead element's font (the running head and foot); ''" },
      pagenumberFont: { type: 'tex', default: '', description: "the pagenumber element's font; ''" },
      labelinglabelFont: { type: 'tex', default: '', description: "the labeling list's label font (labelinglabel); ''" },
      fromnameFont: { type: 'tex', default: '', description: "a letter's sender name font (fromname); ''" },
      subjectFont: { type: 'tex', default: '', description: "a letter's subject font (subject); ''" },
    },
    presets: PRESETS,
    requires: ['cmd:\\KOMAoptions'],
    only: ['class.scrartcl', 'class.scrbook', 'class.scrreprt', 'class.scrlttr2'],
    onlyWhen: [
      {
        when: { form: 'document' },
        classes: ['class.scrartcl', 'class.scrbook', 'class.scrreprt'],
        reason: "the document options (captions, bibliography, listof, headsepline …) are the document classes'; scrlttr2 has its own option set",
        evidence: [{ kind: 'manual', of: 'koma-script', section: 'scrguide, part I (scrartcl, scrreprt, scrbook) and chapter 4 (scrlttr2)', url: 'https://ctan.org/pkg/koma-script' }],
      },
      {
        when: { form: 'letter' },
        classes: ['class.scrlttr2'],
        reason: 'the letter options (fromalign, fromrule, fromphone, foldmarks …) and the fromname and subject elements exist only in scrlttr2',
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0688-alexeyabel-latex-briefvorlage-din-5008/Latex-Briefvorlage.tex', line: '6-36' }],
      },
      {
        when: { open: ['right', 'any', 'left'] },
        classes: ['class.scrbook', 'class.scrreprt'],
        reason: "scrartcl has no chapters and no open option: \\KOMAoptions{open=right} stops at \"Package scrbase Error: unknown option `open=right'\"",
        evidence: [{ kind: 'compile', reproducer: "\\documentclass{scrartcl} \\KOMAoptions{open=right}: \"Package scrbase Error: unknown option `open=right'\" (ZeroTeX-NG, 2026-11-07)" }],
      },
      {
        when: { abstract: ['true', 'false'] },
        classes: ['class.scrartcl', 'class.scrreprt'],
        reason: "scrbook has no abstract, and no abstract option: \\KOMAoptions{abstract=true} stops at \"Package scrbase Error: unknown option `abstract=true'\"",
        evidence: [{ kind: 'compile', reproducer: "\\documentclass{scrbook} \\KOMAoptions{abstract=true}: \"Package scrbase Error: unknown option `abstract=true'\" (ZeroTeX-NG, 2026-11-07)" }],
      },
    ],
    // Every preset typeset ok under its class on ZeroTeX-NG (2026-11-07): scrartcl, scrbook, scrreprt and scrlttr2 (a letter with
    // \opening and \closing).
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'koma-script', section: 'CTAN package page', url: 'https://ctan.org/pkg/koma-script' },
    KOMA_CLASS,
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-fonts.dtx', line: '1733 (\\setkomafont)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0800-valentjn-thesis-arxiv/tex/preamble/settings/komaTextArea.tex', line: '6-19' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0306-martinx3-educationorganization-hbrs-late/aussehen/hbrs-inf.sty', line: '54-89' },
  ],
});
