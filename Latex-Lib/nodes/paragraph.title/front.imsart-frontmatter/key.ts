import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.imsart-frontmatter',
    node: 'paragraph/title',
    description:
      "The Institute of Mathematical Statistics' imsart front matter (Annals of Statistics, aos): \\begin{frontmatter} with \\title and \\runtitle, the aug environment of \\author[A]{\\fnms{given}~\\snm{surname}\\ead[label=e1]{email}\\orcid{…}} and one \\address[A]{\\orgdiv{department},\\orgname{organisation}\\printead[presep={,\\ }]{e1}} per author, the MSC2020 keyword environment with \\kwd[Primary ] and \\kwd[; secondary ] codes and the keyword environment of \\kwd's; \\end{frontmatter} prints it. imsart only.",
    writes:
      '\\begin{frontmatter} \\title{…} \\runtitle{…} \\begin{aug} \\author[A]{\\fnms{…}~\\snm{…}\\ead[label=e1]{…}\\orcid{…}} \\and \\author[…]{…} \\address[A]{\\orgdiv{…},\\orgname{…}\\printead[presep={,\\ }]{e1}} \\end{aug} \\begin{keyword}[class=MSC2020] \\kwd[Primary ]{…} \\kwd[; secondary ]{…} \\end{keyword} \\begin{keyword} \\kwd{…} \\end{keyword} \\end{frontmatter}',
    // imsart is the IMS's own distribution (aos-template.tex, imsart.cls, imsart.sty), not in the engine's package mirror: \documentclass[aos]{imsart}
    // stops at "File `imsart.cls' not found" (ZeroTeX-NG, 2026-11-07), and its files are not in testing-pipeline/settings/classes/files.
    ctan: [],
    features: ['class-styled'],
    // One address per author, with the division and the organisation only (the AoS page; template l.73-80): an author's further
    // affiliations and the postal address (affiliation.address) are not printed. The corresponding author belongs in the
    // Acknowledgments (template l.73-80), so it is not printed here. The running title is shortTitle (the title when none).
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'templateSpecific.shortTitle',
      'templateSpecific.keywords',
      'templateSpecific.mscPrimary',
      'templateSpecific.mscSecondary',
    ],
    presets: PRESETS,
    // \end{frontmatter} prints the front matter, title, authors, the abstract and keywords imsart keeps in its boxes (imsart.sty
    // l.1944-1988, 2222-2252, 2426-2452): it does \maketitle's work, which nothing else may then do.
    claims: ['maketitle'],
    requires: ['env:frontmatter', 'env:aug', 'env:keyword', 'cmd:\\runtitle', 'cmd:\\address'],
    only: ['class.imsart'],
    // Untested: the class files are not here (see ctan above), so the macro names are aos-template.tex's as the requirement
    // document cites them, not checked against imsart.sty.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'requirement', file: 'Template/template-requirement/IMS_Imsart.md', line: '58-60, 74-75, 141, 144' },
    { kind: 'source', file: 'Latex-Lib/classes/imsart.ts', line: '19-20' },
  ],
});
