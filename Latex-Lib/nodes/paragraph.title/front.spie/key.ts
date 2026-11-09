import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS, TEMPLATE } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.spie',
    node: 'paragraph/title',
    description:
      "SPIE proceedings' title block (spie): \\title{…}, one \\author{…} with each name's \\supit{a,b} affiliation letters, \\skiplinehalf and the affiliations each after its \\supit letter separated by ; \\\\, the \\authorinfo{…} first-page footnote (\"Further author information: (Send correspondence to …)\" and each author's e-mail), then \\maketitle; the \\keywords{…} printed right after the abstract through the env/abstract/after hook, or under the title. spie only.",
    writes: '\\title{…} \\author{…\\supit{…}, and …\\supit{…} \\skiplinehalf \\supit{…}…; \\\\ \\supit{…}…} \\authorinfo{…} \\AddToHook{env/abstract/after}{\\keywords{…}} \\maketitle',
    ctan: ['spie'],
    features: ['class-styled'],
    params: {
      keywords: { type: 'enum', values: ['after-abstract', 'after-title'], default: 'after-abstract', description: "where the keywords print: right after the abstract (the kernel's env/abstract/after hook), as SPIE asks, or right after \\maketitle, for a paper with no abstract" },
    },
    // templateSpecific.authorInfo, when given, is the \authorinfo text as it stands (telephone numbers and the like); else it is
    // made from correspondingAuthor (a name or an email) and the authors' emails. No ORCID: spie has no place for one.
    fields: [
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'author.email',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.authorInfo',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle, which sets the \authorinfo footnote.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\authorinfo', 'cmd:\\keywords', 'cmd:\\supit', 'cmd:\\skiplinehalf'],
    only: ['class.spie'],
    // Both presets typeset under spie on ZeroTeX-NG (2026-11-07): the sample (two authors, two affiliations, the \authorinfo
    // footnote) with an abstract after \maketitle (keywords after it), and keywords-after-title with no abstract.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'manual', of: 'spie', section: 'CTAN package page', url: 'https://ctan.org/pkg/spie' },
    { kind: 'source', file: 'spie.cls (spie 2007/04/14 v3.25, MiKTeX snapshot 9766)', line: '176 (\\authorinfo), 295 (\\keywords)' },
    { kind: 'source', file: TEMPLATE, line: '93-103, 109-119' },
    {
      kind: 'compile',
      reproducer:
        '\\documentclass{spie} \\typeout{\\meaning\\supit} \\typeout{\\meaning\\skiplinehalf}: "macro:#1->\\raisebox {0.8ex}{\\small \\it #1}\\hspace {0.05em}" and "macro:->\\medskip \\\\"; \\authorinfo "macro:#1->\\gdef \\@authorinfo {#1}"; \\begin{abstract} is \\section*{ABSTRACT} (ZeroTeX-NG, 2026-11-07)',
    },
  ],
});
