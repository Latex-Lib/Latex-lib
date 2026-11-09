import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.inst-institute',
    node: 'paragraph/title',
    description:
      "The LNCS-style title block of llncs, ECCV (llncs with eccv.sty), EasyChair and A&A (aa): the authors in one \\author joined by \\and, each with \\inst{1,2} pointing into one \\institute whose entries are joined by \\and, e-mails under their institute (\\email) or after the author's \\inst (aa, with \\corrauth for the corresponding author), an \\orcidID per author (llncs, eccv), \\titlerunning and \\authorrunning for the running heads (always under EasyChair), \\subtitle, a \\thanks note on the title, then \\maketitle; keywords at the abstract's end joined by \\and (llncs) or stored as \\keywords{a -- b} for aa's \\maketitle, with aa's received/accepted date line, \\offprints, \\headnote and \\dedication.",
    // Body; preamble. The keyword line is the llncs preset's; the other presets give their own skeleton.
    writes:
      '\\title{…\\thanks{…}} \\subtitle{…} \\titlerunning{…} \\author{…\\inst{…}\\orcidID{…} \\and …\\inst{…,…}} \\authorrunning{…} \\institute{… \\email{…} \\and …} \\maketitle; \\AddToHook{env/abstract/end}{\\keywords{… \\and …}}',
    ctan: ['llncs', 'easychair'],
    features: ['class-styled', 'centered'],
    params: {
      emails: {
        type: 'enum',
        values: ['institute', 'author', 'none'],
        default: 'institute',
        description:
          "where the authors' e-mails go: under their (first) institute's entry, \\email{…} after a line break (llncs, eccv, easychair), after the author's \\inst in \\author (aa), or nowhere",
      },
      orcid: { type: 'enum', values: ['orcidID', 'none'], default: 'orcidID', description: "each author's ORCID as llncs's \\orcidID{…} after the \\inst, or none (aa asks for none; easychair has no \\orcidID)" },
      corresponding: {
        type: 'enum',
        values: ['none', 'corrauth', 'offprints'],
        default: 'none',
        description:
          "the corresponding author (templateSpecific.correspondingAuthor, an author's e-mail or name): no mark, aa's \\corrauth{e-mail} in place of that author's \\email, or aa's \\offprints{…} line (templateSpecific.offprints, else the author's name)",
      },
      runningHeads: {
        type: 'enum',
        values: ['given', 'always', 'none'],
        default: 'given',
        description:
          "\\titlerunning{…} and \\authorrunning{…}: each when its templateSpecific field (shortTitle, runningAuthor) is given, always (the title and 'A and B' or 'A et al.' when not given: EasyChair rejects a paper without them), or never",
      },
      keywords: {
        type: 'enum',
        values: ['abstract-end', 'stored', 'none'],
        default: 'abstract-end',
        description:
          "templateSpecific.keywords: llncs's \\keywords{a \\and b} at the end of the abstract environment (a kernel env/abstract/end hook in the preamble), aa's \\keywords{a -- b} stored before \\maketitle, which prints it, or none",
      },
      subtitle: { type: 'boolean', default: true, description: "templateSpecific.subtitle as \\subtitle{…} when given (llncs and aa have it; easychair has none)" },
      date: {
        type: 'enum',
        values: ['none', 'received'],
        default: 'none',
        description: "no date line (llncs and easychair print none), or aa's \\date{Received …; accepted …} from templateSpecific.received and .accepted when either is given",
      },
      frontNotes: { type: 'boolean', default: false, description: "aa's \\headnote{…} and \\dedication{…} from templateSpecific.headnote and .dedication when given" },
    },
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.runningAuthor',
      'templateSpecific.subtitle',
      'templateSpecific.titleNote',
      'templateSpecific.keywords',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.received',
      'templateSpecific.accepted',
      'templateSpecific.offprints',
      'templateSpecific.headnote',
      'templateSpecific.dedication',
    ],
    presets: PRESETS,
    // It runs the class's own \maketitle (llncs, easychair and aa restyle it and print the \institute list under the authors).
    claims: ['maketitle'],
    requires: ['cmd:\\institute', 'cmd:\\inst', 'cmd:\\maketitle'],
    // What only some of the four classes give: llncs's \orcidID (llncs.cls l.895; eccv inherits it; easychair.cls and aa.cls have
    // none), \keywords (llncs.cls l.906 provides it at \begin{document}; aa.cls l.861; easychair.cls has none), aa's \corrauth
    // (aa.cls l.812), \offprints (l.898), \headnote and \dedication (l.980, 983), and \subtitle (llncs.cls l.915, aa.cls l.747; not easychair).
    requiresWhen: [
      { when: { orcid: 'orcidID' }, requires: ['cmd:\\orcidID'] },
      { when: { keywords: ['abstract-end', 'stored'] }, requires: ['cmd:\\keywords'] },
      { when: { corresponding: 'corrauth' }, requires: ['cmd:\\corrauth'] },
      { when: { corresponding: 'offprints' }, requires: ['cmd:\\offprints'] },
      { when: { subtitle: true }, requires: ['cmd:\\subtitle'] },
      { when: { frontNotes: true }, requires: ['cmd:\\headnote', 'cmd:\\dedication'] },
    ],
    only: ['class.llncs', 'class.eccv', 'class.easychair', 'class.aa'],
    // Typeset ok on ZeroTeX-NG (2026-11-07), each preset under its class on the title sample, a fuller one (subtitle, title note,
    // dates, notes) and one with an author with no institute or e-mail: llncs[runningheads] (llncs, eccv), aa (aa, aa-offprints, with
    // abs.class-native's command abstract) and easychair (its class file copied from Source/0497-easychair: the mirror has no
    // easychair.cls). eccv.sty is not in the repository, so the eccv preset ran on llncs alone: untested under class.eccv itself.
    targetEngine: 'yes',
  }),
);
