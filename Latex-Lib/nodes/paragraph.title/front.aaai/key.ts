import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.aaai',
    node: 'paragraph/title',
    description:
      "AAAI's own title block (aaai2027.sty, the AAAI conference style on article): \\title{…\\thanks{…}}, \\author with the authors joined by commas (never \\and), each marked \\equalcontrib or \\corresponding and numbered \\textsuperscript{\\rm 1,\\rm 2} by affiliation, \\affiliations{…} with the numbered affiliations and a closing line of the authors' e-mails, then the style's \\maketitle, which spans both columns. aaai only.",
    writes: '\\title{…\\thanks{…}} \\author{…\\equalcontrib\\textsuperscript{\\rm 1,\\rm 2}, …\\corresponding\\textsuperscript{\\rm 2}} \\affiliations{\\textsuperscript{\\rm 1}…\\\\ \\textsuperscript{\\rm 2}…\\\\ …@…, …@…} \\maketitle',
    // aaai2027.sty is not on CTAN (AAAI's AuthorKit27): its evidence is the style source and the kit's instructions below.
    ctan: [],
    features: ['class-styled'],
    params: {
      lineBreakEvery: { type: 'number', default: 0, description: 'a \\\\ after every n-th author in \\author, after its comma (0: never; the style centres the list and wraps it itself)' },
    },
    // The e-mails close \affiliations; each affiliation's department, name and address are its line (or lines, when there is
    // one); \equalcontrib marks the authors listed in templateSpecific.equalContrib and \corresponding the one in
    // templateSpecific.correspondingAuthor (by name or email); templateSpecific.thanks is the title's \thanks.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.equalContrib', 'templateSpecific.correspondingAuthor', 'templateSpecific.thanks'],
    presets: PRESETS,
    // It runs the style's own \maketitle (aaai2027.sty l.98-127: \twocolumn[\@maketitle]).
    claims: ['maketitle'],
    // \equalcontrib and \corresponding are not required: the style defines them only inside \@maketitle (l.139-155, 179-195),
    // where the \author text is set, so a profile cannot list them as the class's commands.
    requires: ['cmd:\\maketitle', 'cmd:\\affiliations'],
    only: ['class.aaai'],
    // The pinned aaai2027.sty (2027/10/21) that classes/aaai.ts cites is not in testing-pipeline/settings/classes/files/ here,
    // and the style is not on CTAN, so the form is not typeset against it. It typeset on an older copy (the compile evidence
    // below), which is not the profile's pinned file.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'solution', file: 'Solution/0703-aaai.md', lines: '25, 49-50' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0703-aaai/AnonymousSubmission/LaTeX/anonymous-submission-latex-2026.tex', line: '94-166, 483-523' },
    { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0031-nhatkhangcs-overleaf-comments/examples/aaai/aaai2027.sty (2027/05/04)', line: '98-206' },
    { kind: 'source', file: 'Latex-Lib/classes/aaai.ts', line: '26, 39 (defines and vocabulary \\affiliations)' },
    { kind: 'compile', reproducer: "\\documentclass[letterpaper]{article} \\RequirePackage{iftex}\\renewcommand\\RequirePDFTeX{} \\usepackage{aaai2027} (the 2027/05/04 copy in Source/0031-…/examples/aaai) \\begin{document} and both presets' emit on the title sample and on four authors with equalContrib, correspondingAuthor and thanks: ok, 1 page, the marks as footnotes † ‡ and the e-mail line under the affiliations (ZeroTeX-NG, 2026-11-07)" },
  ],
});
