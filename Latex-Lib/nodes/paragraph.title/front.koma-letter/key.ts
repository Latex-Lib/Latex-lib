import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.koma-letter',
    node: 'paragraph/title',
    description:
      "KOMA-Script's letter class (scrlttr2): the sender (fromname, fromaddress from the first affiliation, fromphone, fromemail, fromurl), place, the reference fields (yourref, myref, customer), the subject (the title's text), the date and the signature as \\setkomavar lines in the preamble; \\begin{letter}{recipient} and \\opening{salutation} where the title stands; \\closing, \\ps, \\encl, \\cc and \\end{letter} from \\AtEndDocument, after the body. scrlttr2 only.",
    // Preamble lines, then the body at the title.
    writes:
      '\\KOMAoptions{fromphone=true,fromemail=true,fromurl=true} \\setkomavar{fromname}{…} \\setkomavar{fromaddress}{… \\\\ …} \\setkomavar{fromphone}{…} \\setkomavar{fromemail}{…} \\setkomavar{fromurl}{…} \\setkomavar{place}{…} \\setkomavar{yourref}{…} \\setkomavar{myref}{…} \\setkomavar{customer}{…} \\setkomavar{subject}{…} \\setkomavar{date}{…} \\setkomavar{signature}{…} \\AtEndDocument{\\closing{…} \\ps{…} \\encl{…} \\cc{…} \\end{letter}}; \\begin{letter}{… \\\\ …} \\opening{…}',
    ctan: ['koma-script'],
    features: ['class-styled', 'subject-line'],
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.recipient',
      'templateSpecific.opening',
      'templateSpecific.closing',
      'templateSpecific.signature',
      'templateSpecific.phone',
      'templateSpecific.url',
      'templateSpecific.place',
      'templateSpecific.yourRef',
      'templateSpecific.myRef',
      'templateSpecific.customer',
      'templateSpecific.ps',
      'templateSpecific.enclosures',
      'templateSpecific.cc',
    ],
    params: {
      opening: { type: 'string', default: '', description: "the template's salutation (\\opening{…}) when the paper sets none (templateSpecific.opening); ''" },
      closing: { type: 'string', default: '', description: "the template's closing phrase (\\closing{…}) when the paper sets none (templateSpecific.closing); ''" },
    },
    presets: PRESETS,
    // It stands in the title's place, as every title way does; scrlttr2 has no \maketitle, so nothing is held for one.
    claims: ['maketitle'],
    requires: ['env:letter', 'cmd:\\opening', 'cmd:\\closing', 'cmd:\\setkomavar'],
    only: ['class.scrlttr2'],
    // Typeset on ZeroTeX-NG under scrlttr2 (class-examples' typeset-dir, 2026-11-07): every preset, with the sample title and
    // with every field filled.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'compile', reproducer: '\\documentclass{scrlttr2} and [paper=a4,fontsize=11pt,parskip=half]{scrlttr2}, each preset, the sample title (no recipient) and one with every field (phone, URL, place, yourref, myref, customer, signature, ps, enclosures, cc, no date): \\end{letter} from \\AtEndDocument closes the letter after a body paragraph, a list and another paragraph; 1 page each (ZeroTeX-NG, class-examples typeset-dir, 2026-11-07)' },
    { kind: 'manual', of: 'koma-script', section: 'CTAN package page', url: 'https://ctan.org/pkg/koma-script' },
    {
      kind: 'source',
      file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-notepaper.dtx',
      line: '4175 (letter), 4557 (\\opening), 4632 (\\closing), 4740, 4761, 4791 (\\ps, \\cc, \\encl), 4836-4847 and 5101-5123 (the komavars)',
    },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0020-koma-script/scrkernel-variables.dtx', line: '173 (\\setkomavar)' },
    { kind: 'source', file: 'tex/latex/base/latex.ltx (2026-06-01, TinyTeX)', line: '15472-15476 (\\enddocument runs the enddocument hook before \\@checkend{document}), 19194 (\\AtEndDocument)' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0402-german-service-invoice/main.tex', line: '15-22, 34-36, 56-57' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0719-pandoc-din-5008-letter/main.tex', line: '17-28, 43-67' },
  ],
});
