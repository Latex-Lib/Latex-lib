import { defineClass } from '../schema/class.ts';
import llncs from './llncs.ts';

/**
 * ECCV 2026: eccv.sty and eccvabbrv.sty on Springer's llncs with
 * runningheads, as the eccv setting loads them (`\usepackage{eccv}`,
 * `\usepackage{eccvabbrv}`, then the llncs setting's three lines). Read from
 * the pinned styles (testing-pipeline/settings/classes/files; b2p, not yet
 * measured by the class probe). Everything llncs's profile says holds here
 * (its names, refused packages, `\subparagraph` rule, layout and vocabulary
 * are taken from it), and eccv.sty adds, with no option (the camera-ready
 * version: no geometry, no line numbers):
 * - its own loads (l.43-72): silence, etoolbox, fontenc with T1, lineno with
 *   left and mathlines, xcolor with dvipsnames, amsmath, amssymb, cite, xspace,
 *   url with hyphens, kvoptions, caption with labelfont=bf, font=small and
 *   tableposition=bottom, subcaption with skip=3pt: a way that loads one of
 *   them with another option (xcolor's table, amsmath's fleqn, cite's super)
 *   stops at "Option clash";
 * - cleveref with capitalize at `\AtEndPreamble` (l.249-255), after every
 *   preamble line: a way's own cleveref load comes first and never with the
 *   option capitalize (xref.cleveref gives capitalise, the British name), so
 *   eccv's load stops at "Option clash for package cleveref"; `\cref` works
 *   anyway, from eccv's load;
 * - cite, which biblatex refuses (biblatex.sty l.178: Incompatible package
 *   'cite') and natbib does not work with (natbib.sty l.275-277; acmart's
 *   compile showed natbib and cite stopping every citation).
 * eccvabbrv.sty (l.27-42) defines `\eg`, `\ie`, `\cf`, `\etc`, `\vs`, `\wrt`,
 * `\etal` and the like with `\def`, and eccv.sty `\ECCVyear` and the colour
 * eccvblue.
 */
export default defineClass({
  id: 'class.eccv',
  name: "llncs",
  base: 'class.llncs',
  targetEngine: "yes",
  preloads: [
    ...llncs.preloads,
    {"pkg": "silence"}, {"pkg": "etoolbox"}, {"pkg": "fontenc", "options": ["T1"]}, {"pkg": "lineno", "options": ["left", "mathlines"]},
    {"pkg": "xcolor", "options": ["dvipsnames"]}, {"pkg": "amsmath"}, {"pkg": "amssymb"}, {"pkg": "cite"}, {"pkg": "xspace"},
    {"pkg": "url", "options": ["hyphens"]}, {"pkg": "kvoptions"},
    {"pkg": "caption", "options": ["labelfont=bf", "font=small", "tableposition=bottom"]}, {"pkg": "subcaption", "options": ["skip=3pt"]},
    {"pkg": "cleveref", "options": ["capitalize"]},
  ],
  defines: [
    ...llncs.defines,
    "cmd:\\eccvsetup", "cmd:\\ECCVyear", "cmd:\\fillzeros", "cmd:\\linenomathpatch", "cmd:\\linenomathpatchAMS", "color:eccvblue",
    "cmd:\\onedot", "cmd:\\eg", "cmd:\\Eg", "cmd:\\ie", "cmd:\\Ie", "cmd:\\cf", "cmd:\\Cf", "cmd:\\etc", "cmd:\\vs", "cmd:\\wrt", "cmd:\\dof", "cmd:\\iid", "cmd:\\wolog", "cmd:\\etal",
  "cmd:\\cref", "cmd:\\Cref"],
  options: {},
  forbids: {
    technical: [
      ...llncs.forbids.technical,
      { pkg: "cleveref", reason: "eccv.sty loads cleveref with capitalize at \\AtEndPreamble (l.249-250), after the preamble: a way's earlier cleveref load without the option capitalize (xref.cleveref gives none, or capitalise) makes that load stop at Option clash for package cleveref; \\cref is there anyway", evidence: [{ kind: 'source', file: 'eccv.sty (commit 791fe5b)', line: '249-255' }, { kind: 'source', file: 'Latex-Lib/nodes/ref.ref/xref.cleveref/key.ts', line: '22-25' }] },
      { pkg: "biblatex", reason: "eccv.sty loads cite (l.57), and biblatex stops at Incompatible package 'cite'", evidence: [{ kind: 'source', file: 'eccv.sty (commit 791fe5b)', line: '57' }, { kind: 'source', file: 'biblatex.sty (\\blx@packageincompatibility)', line: '177-178' }] },
      { pkg: "natbib", reason: "eccv.sty loads cite (l.57); natbib warns that cite should not be used with it, and the pair breaks citations (acmart's compile: cite's one-optional \\cite against natbib's two-optional \\@citex scans on to the paragraph's end)", evidence: [{ kind: 'source', file: 'eccv.sty (commit 791fe5b)', line: '57' }, { kind: 'source', file: 'natbib.sty', line: '275-277' }, { kind: 'source', file: 'cite.sty', line: '303-307' }] },
    ],
    policy: [],
    names: llncs.forbids.names,
  },
  layout: llncs.layout,
  files: [
    { path: "eccv.sty", sha256: "07785f87dd4741a761e5064d6752e59dbca308b7999de35df983e70dc0a33d80" },
    { path: "eccvabbrv.sty", sha256: "1c9aba814d428d8d90bfdfde53e3ad8edc9f1db0e5f12e052f713fd5b38e483f" },
  ],
  vocabulary: llncs.vocabulary,
  evidence: [
    ...llncs.evidence,
    { kind: 'source', file: 'eccv.sty (commit 791fe5b, testing-pipeline/settings/classes/files)', line: '43-72 (silence, etoolbox, [T1]{fontenc}, [left,mathlines]{lineno}, [dvipsnames]{xcolor}, amsmath, amssymb, cite, xspace, [hyphens]{url}, caption and subcaption with options), 79 (kvoptions)' },
    { kind: 'source', file: 'eccv.sty', line: '82-88 (review, final, mobile, year, ID), 109-113 (stops unless llncs), 211-238 (review and mobile only: line numbers and geometry)' },
    { kind: 'source', file: 'eccv.sty', line: '94, 145, 166-173, 241 (\\eccvsetup, \\fillzeros, \\linenomathpatch, \\linenomathpatchAMS, \\ECCVyear), 65 (eccvblue)' },
    { kind: 'source', file: 'eccv.sty', line: '249-255 (\\AtEndPreamble{\\usepackage[capitalize]{cleveref}} and \\crefname)' },
    { kind: 'source', file: 'eccvabbrv.sty', line: '25-42 (xspace, \\onedot, \\eg ... \\etal)' },
  ],
});
