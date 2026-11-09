import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const CLS = 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournal2019.cls';
const TEMPLATE = 'Latex Related Research/Latex-lib-main/Source/0040-agu/April 16 2019/agujournaltemplate.tex';

export default defineKey({
  ...minimal({
    id: 'front.agu',
    node: 'paragraph/title',
    description:
      "AGU's journal title block (agujournal2019, agujournal2025), typeset where the title stands with no \\maketitle: \\title{…}, one \\authors{…} line naming every author with their affiliation numbers (\\affil{1,2}) and 'and' before the last, one \\affiliation{n}{…} per affiliation, \\correspondingauthor{name}{email}, and the Key Points list (\\begin{keypoints} \\item … \\end{keypoints}).",
    // agujournal2019's \title, \authors and \affiliation typeset their argument at once (l.578-586), so everything goes in the body,
    // where the title stands; its \maketitle is empty (agujournal2025 l.822) and the profile forbids it.
    writes: '\\title{…} \\authors{…\\affil{1}, … and …\\affil{1,2}} \\affiliation{1}{…} \\affiliation{2}{…} \\correspondingauthor{…}{…} \\begin{keypoints} \\item … \\end{keypoints}',
    ctan: [],
    features: ['class-styled', 'centered'],
    params: {
      andWord: { type: 'string', default: 'and', description: "the word before the last author in \\authors{…} (the template's 'A, B, and C')" },
    },
    // The author's email only through the corresponding author; no ORCID (the class has no ORCID tag) and no date (it prints none).
    // A per-author \thanks note (the template's current addresses) has no field in Flouest's title records and is not written.
    fields: ['author.email', 'affiliation.department', 'affiliation.name', 'affiliation.address', 'templateSpecific.correspondingAuthor', 'templateSpecific.keyPoints'],
    presets: PRESETS,
    // It stands in for \maketitle, which the class leaves empty: the one title block of the document.
    claims: ['maketitle'],
    requires: ['cmd:\\authors', 'cmd:\\affil', 'cmd:\\affiliation', 'cmd:\\correspondingauthor', 'env:keypoints'],
    only: ['class.agu'],
    // Typeset with agujournal2019.cls beside main.tex (ZeroTeX-NG, 2026-11-07); the profile's agujournal2025.cls is not in this
    // checkout (no agu setting in testing-pipeline/settings/classes), so the target class itself is unmeasured.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'source', file: CLS, line: '578-580 (\\title typesets at once), 582 (\\authors), 583 (\\affil), 584-586 (\\affiliation), 587-590 (\\correspondingauthor), 599-601 (keypoints)' },
    { kind: 'source', file: TEMPLATE, line: '81-142' },
    { kind: 'source', file: 'Latex-Lib/classes/agu.ts', line: 'forbids.names cmd:\\maketitle (agujournal2025 l.822, 1376-1380)' },
  ],
});
