import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.letter',
    node: 'paragraph/title',
    description:
      "The standard letter class's frame for a letter: the sender's \\name, \\signature, \\address (department, institution, address lines), \\location and \\telephone and the \\date in the preamble; \\begin{letter}{recipient} and \\opening{salutation} where the title stands; \\closing, \\ps, \\encl, \\cc and \\end{letter} from \\AtEndDocument, after the body. The kernel letter class only; the title's text is dropped, or set in bold before \\opening.",
    // Preamble lines, then the body at the title.
    writes:
      '\\name{…} \\signature{…} \\address{… \\\\ …} \\location{…} \\telephone{…} \\date{…} \\AtEndDocument{\\closing{…} \\ps{…} \\encl{…} \\cc{…} \\end{letter}}; \\begin{letter}{… \\\\ …} \\opening{…}',
    ctan: ['latex-base'],
    features: ['class-styled'],
    fields: [
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.recipient',
      'templateSpecific.salutation',
      'templateSpecific.closing',
      'templateSpecific.signature',
      'templateSpecific.postscript',
      'templateSpecific.enclosures',
      'templateSpecific.cc',
      'templateSpecific.location',
      'templateSpecific.telephone',
    ],
    params: {
      subject: { type: 'enum', values: ['none', 'before-opening'], default: 'none', description: "the title's text: not printed (the letter class has no subject line), or in bold between the recipient and \\opening" },
      salutation: { type: 'string', default: '', description: "the template's salutation (\\opening{…}) when the paper sets none (templateSpecific.salutation); ''" },
      closing: { type: 'string', default: '', description: "the template's closing phrase (\\closing{…}) when the paper sets none (templateSpecific.closing); ''" },
    },
    presets: PRESETS,
    // It stands in the title's place, as every title way does; letter has no \maketitle, so nothing is held for one.
    claims: ['maketitle'],
    requires: ['env:letter', 'cmd:\\opening', 'cmd:\\closing', 'cmd:\\signature'],
    only: ['class.letter'],
    // Typeset on ZeroTeX-NG under letter (class-examples' typeset-dir, 2026-11-07): every preset, with the sample title and
    // with every field filled.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'compile', reproducer: '\\documentclass{letter} and [a4paper,11pt]{letter}, each preset, the sample title and one with every field (recipient, signature, postscript, enclosures, cc, location, telephone, no date): \\end{letter} from \\AtEndDocument closes the letter after a body paragraph, a list and another paragraph; 1 page each (ZeroTeX-NG, class-examples typeset-dir, 2026-11-07)' },
    { kind: 'manual', of: 'latex-base', section: 'CTAN package page', url: 'https://ctan.org/pkg/latex-base' },
    {
      kind: 'source',
      file: 'tex/latex/base/letter.cls (2024/08/12 v1.3c, TinyTeX)',
      line: '153-162 (\\name, \\signature, \\address, \\location, \\telephone), 172-189 (letter; the recipient split at its first \\\\), 221-244 (\\opening, \\closing), 246-256 (\\cc, \\encl, \\ps)',
    },
    { kind: 'source', file: 'tex/latex/base/latex.ltx (2026-06-01, TinyTeX)', line: '15472-15476 (\\enddocument runs the enddocument hook before \\@checkend{document}), 19194 (\\AtEndDocument)' },
    { kind: 'requirement', file: 'Template/template-requirement/Letter.md', line: '63-75, 168-186' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0366-simpletexcv/cover_letter.tex', line: '49, 62, 92-104, 124-129' },
  ],
});
