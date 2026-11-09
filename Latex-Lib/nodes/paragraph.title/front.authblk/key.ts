import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const ASCELIKE_SOURCE = { kind: 'compile', reproducer: '\\documentclass[Journal]{ascelike} \\typeout{\\meaning\\KeyWords \\meaning\\NameTag \\meaning\\affil}: \\KeyWords is \\long macro:#1->\\par \\noindent … \\KeyWordName : \\normalfont #1, \\NameTag \\long macro:#1-> … \\renewcommand {\\@oddfoot }{… \\thepage \\hfill #1}, \\affil authblk\'s (ZeroTeX-NG, 2026-11-07); the log loads /texmf/tex/latex/preprint/authblk.sty from the class' } as const;

export default defineKey(
  minimal({
    id: 'front.authblk',
    node: 'paragraph/title',
    description:
      "authblk's author blocks: one \\author[1,2]{…} per author with the numbers of its affiliations and one \\affil[n]{…} per affiliation (unnumbered when there is only one), then \\maketitle, which sets the affiliations as blocks under the authors. Under article it loads authblk (with max6 in the preset); under ascelike, which loads authblk itself, it loads nothing, may add each author's email to their first affiliation (\". Email: …\"), prints the keywords with the class's \\KeyWords{…; …} right after the abstract, and the name tag with \\NameTag{…}.",
    // Under article the preamble also loads authblk (\\usepackage[max6]{authblk} in the preset); ascelike loads it itself.
    writes: '\\title{…} \\author[1]{…} \\author[1,2]{…} \\affil[1]{…[. Email: …]} \\affil[2]{…} \\date{…} \\maketitle [\\KeyWords{…; …}]',
    ctan: ['authblk'],
    features: ['centered'],
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.keywords', 'templateSpecific.nameTag'],
    params: {
      authblk: {
        type: 'enum',
        values: ['load', 'max6', 'class'],
        default: 'load',
        compat: true,
        description: "how authblk comes in: \\usepackage{authblk}, \\usepackage[max6]{authblk} (affiliations in blocks up to six authors), or not at all because the class loads it (ascelike)",
      },
      emails: { type: 'enum', values: ['none', 'in-affil'], default: 'none', description: "the authors' emails: none, or after each author's first affiliation, \". Email: …\" (the ASCE manuscript form)" },
      keywords: {
        type: 'enum',
        values: ['none', 'after-abstract', 'after-title'],
        default: 'none',
        description: "templateSpecific.keywords in ascelike's \\KeyWords{…; …}: not at all, right after the next abstract (a one-shot env/abstract/after hook, where the class example has it), or right after \\maketitle (a paper with no abstract)",
      },
      nameTag: { type: 'boolean', default: false, description: "templateSpecific.nameTag in ascelike's \\NameTag{…} in the preamble (the page foot's left text, beside the page number)" },
    },
    presets: PRESETS,
    loads: [
      { pkg: 'authblk', when: { authblk: 'load' } },
      { pkg: 'authblk', options: ['max6'], when: { authblk: 'max6' } },
    ],
    // It runs the class's own \maketitle, which authblk has redefined.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle'],
    requiresWhen: [
      { when: { authblk: 'class' }, requires: ['cmd:\\affil'] },
      { when: { keywords: ['after-abstract', 'after-title'] }, requires: ['cmd:\\KeyWords'] },
      { when: { nameTag: true }, requires: ['cmd:\\NameTag'] },
    ],
    // A class built on article takes it too (as `only` reads); ascelike is listed for its own forms below.
    only: ['class.article', 'class.ascelike'],
    onlyWhen: [
      {
        when: { authblk: 'class' },
        classes: ['class.ascelike'],
        reason: 'the class must load authblk itself, as ascelike does; elsewhere \\author[1]{…} and \\affil are undefined or the kernel\'s',
        evidence: [ASCELIKE_SOURCE],
      },
      {
        when: { keywords: ['after-abstract', 'after-title'] },
        classes: ['class.ascelike'],
        reason: '\\KeyWords is ascelike\'s own command',
        evidence: [ASCELIKE_SOURCE],
      },
      {
        when: { nameTag: true },
        classes: ['class.ascelike'],
        reason: '\\NameTag is ascelike\'s own command',
        evidence: [ASCELIKE_SOURCE],
      },
    ],
    deny: [
      {
        class: 'class.ascelike',
        unless: { authblk: 'class' },
        reason: 'ascelike loads authblk itself, with no options: a second \\usepackage[max6]{authblk} stops at "Option clash for package authblk", and a plain one does nothing',
        evidence: [ASCELIKE_SOURCE, { kind: 'compile', reproducer: '\\documentclass[Journal]{ascelike} \\usepackage[max6]{authblk}: "LaTeX Error: Option clash for package authblk." (ZeroTeX-NG, 2026-11-07)' }],
      },
    ],
    targetEngine: 'yes',
  }),
);
