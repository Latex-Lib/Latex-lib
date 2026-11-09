import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const EAPJ = 'emulateapj.cls (MiKTeX package emulateapj, version February 19, 2025)';
const EXAMPLE = 'Latex Related Research/Latex-Template-Examples/class.emulateapj/main.tex';

export default defineKey({
  ...minimal({
    id: 'front.emulateapj',
    node: 'paragraph/title',
    description:
      "emulateapj's ApJ title block (the IOP-era two-column look on revtex4): the running heads \\shorttitle{…} and \\shortauthors{…} in the preamble; in the body \\title{…}, every author in one \\author{A\\altaffilmark{1}, B\\altaffilmark{2,3}, and C} with numbered marks, the affiliation they share as \\affil{…}, each further affiliation and each e-mail as a numbered \\altaffiltext{n}{…}, and \\keywords{… --- …} (the class's Subject headings). No \\maketitle: the class's first \\section prints the title block, so an abstract written after the title still goes in it; or one author at a time, \\author{…} \\affil{…}, and \\maketitle where the title stands.",
    writes: '\\shorttitle{…} \\shortauthors{…}; \\title{…} \\author{…\\altaffilmark{1}, …\\altaffilmark{2,3}, and …} \\affil{…} \\altaffiltext{1}{…} \\keywords{… --- …}',
    ctan: ['emulateapj'],
    features: ['class-styled', 'centered'],
    params: {
      affiliations: {
        type: 'enum',
        values: ['affil-marks', 'per-author'],
        default: 'affil-marks',
        description:
          "the class sample's form: all authors in one \\author, the affiliation they all share as \\affil and the others (and the e-mails) as numbered \\altaffilmark/\\altaffiltext notes; or one \\author{…} per author followed by an \\affil{…} per affiliation of theirs (the e-mails still as notes)",
      },
      maketitle: {
        type: 'enum',
        values: ['first-section', 'here'],
        default: 'first-section',
        description:
          "where the title block prints: at the first \\section, which runs \\maketitle itself (emulateapj.cls l.655-662), so an abstract or keywords given after the title are still printed in it; or \\maketitle right after the title's lines (a document with no \\section prints no title otherwise)",
      },
    },
    // The title fields it prints besides the title and the names: no ORCID (the class has no tag for it), no date (the slug
    // line \slugcomment is the class's own draft line, a template constant).
    fields: ['author.email', 'affiliation.department', 'affiliation.name', 'affiliation.address', 'templateSpecific.shortTitle', 'templateSpecific.runningAuthor', 'templateSpecific.keywords'],
    presets: PRESETS,
    // It is the document's one \maketitle: printed by the class's first \section (first-section) or written here.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\affil', 'cmd:\\altaffilmark', 'cmd:\\altaffiltext', 'cmd:\\shorttitle', 'cmd:\\shortauthors', 'cmd:\\keywords'],
    only: ['class.emulateapj'],
    // Each preset typeset under \documentclass{emulateapj} on ZeroTeX-NG (2026-11-07): ok, one page, the title block, both
    // affiliation forms, the notes and the Subject headings line as the class sets them.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: EAPJ, line: '370-371 (\\shorttitle, \\shortauthors), 455-465 (\\affiliation, \\affil, \\altaffilmark), 655-662 (the first \\section calls \\maketitle)' },
    { kind: 'source', file: EXAMPLE, line: '90-117 (\\shorttitle, \\shortauthors, \\title, one \\author with \\altaffilmark, \\affil, \\altaffiltext, abstract, \\keywords, \\maketitle)' },
    { kind: 'compile', reproducer: "\\documentclass{emulateapj} \\begin{document} \\title{A Title} \\author{A One} \\affil{…} \\keywords{a --- b} Some text, no \\section. \\end{document}: ok, but the page has no title block (\\maketitle never ran); with a \\section, or \\maketitle written, the title prints (ZeroTeX-NG, 2026-11-07)" },
    { kind: 'compile', reproducer: "\\keywords is \\aftermaketitle@chk{\\keywords}\\gdef\\@keywords{#1} and \\altaffiltext adds to \\alt@affil@toks (\\meaning, emulateapj under ZeroTeX-NG, 2026-11-07): both are stored for \\maketitle and must come before it" },
  ],
});
