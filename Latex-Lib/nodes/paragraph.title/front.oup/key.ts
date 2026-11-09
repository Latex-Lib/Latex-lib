import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.oup',
    node: 'paragraph/title',
    description:
      "Oxford University Press (oup-authoring-template) title block, in the body before \\maketitle: the paper's \\firstpage, \\vol, \\issue, \\pubyear, \\copyrightyear and \\DOI when given, \\title[short]{…} (always with the short title, which the running head needs), one \\author[1,2,$\\ast$]{name\\ORCID{…}} per author with affiliation numbers and a star for the corresponding author, one \\address[n]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}} per affiliation, \\corresp[$\\ast$]{Corresponding author. e-mail}, the \\received, \\revised and \\accepted dates, \\keywords{…} and \\keywords[Abbreviations]{…}, \\otherabstract[heading]{…} and the key messages in \\boxedtext.",
    writes:
      '\\firstpage{…} \\vol{…} \\issue{…} \\pubyear{…} \\copyrightyear{…} \\DOI{…} \\title[…]{…} \\author[…]{… \\ORCID{…}} \\address[…]{\\orgdiv{…}, \\orgname{…}, \\orgaddress{…}} \\corresp[$\\ast$]{…} \\received{…}{…}{…} \\revised{…}{…}{…} \\accepted{…}{…}{…} \\keywords{…} \\keywords[…]{…} \\otherabstract[…]{…} \\boxedtext{…}{\\begin{itemize} \\item … \\end{itemize}} \\maketitle',
    ctan: ['oup-authoring-template'],
    features: ['class-styled'],
    params: {
      abbreviationsHeading: { type: 'string', default: 'Abbreviations', description: "the label of the second keyword list (templateSpecific.abbreviations), \\keywords[<label>]{…} (the sample's 'Abbreviations', tex l.115)" },
      otherAbstractHeading: { type: 'string', default: 'Additional Abstract', description: "the heading of \\otherabstract when the paper gives none (templateSpecific.otherAbstractHeading): the sample's 'Additional Abstract' (tex l.117); a journal's 'Lay Summary' or 'Graphical Abstract'" },
      keyMessagesHeading: { type: 'string', default: 'Key Messages', description: "the heading of the boxed key messages, \\boxedtext{<heading>}{…} (the sample's 'Key Messages', tex l.121)" },
    },
    fields: [
      'author.orcid',
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.keywords',
      'templateSpecific.abbreviations',
      'templateSpecific.received',
      'templateSpecific.revised',
      'templateSpecific.accepted',
      'templateSpecific.firstPage',
      'templateSpecific.volume',
      'templateSpecific.issue',
      'templateSpecific.pubYear',
      'templateSpecific.copyrightYear',
      'templateSpecific.doi',
      'templateSpecific.otherAbstract',
      'templateSpecific.otherAbstractHeading',
      'templateSpecific.keyMessages',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (cls l.1339), which prints the abstract \abstract{…} stored before it (l.1205, 1637).
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\address', 'cmd:\\corresp', 'cmd:\\keywords', 'cmd:\\otherabstract'],
    only: ['class.oup-authoring-template'],
    // Untested in the target engine as a whole: under webpdf,contemporary,large the class's preloaded mathrsfs asks for rsfs10 and
    // rsfs5, whose metrics ZeroTeX-NG cannot load ("Font U/rsfs/m/n/12.045=rsfs10 … not loadable", 30 errors at the first
    // \section, with or without this way: Latex-Template-Examples/_results/class.oup-authoring-template.log l.1319-1429). With that
    // font family mapped to cmsy10 in the probe's preamble only, the title sample and a fuller one (dates, abbreviations, other
    // abstract, key messages, the paper's metadata, a third author with no institute) typeset with no error (ZeroTeX-NG, 2026-11-07); without the empty
    // \@journaltitle, \@pubyear, \@copyrightyear, \@abstract and \societylogo the way supplies, the same probe stopped at
    // "Undefined control sequence" five times (\@abstract at \maketitle, the others at the first page's shipout).
    targetEngine: 'untested',
  }),
);
