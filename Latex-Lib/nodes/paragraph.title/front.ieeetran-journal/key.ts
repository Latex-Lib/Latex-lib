import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

const DIR = 'Latex Related Research/Latex-lib-main/Source/0743-ieeetran-journal/IEEEtran';

export default defineKey({
  ...minimal({
    id: 'front.ieeetran-journal',
    node: 'paragraph/title',
    description:
      "IEEEtran's journal title block (IEEE Transactions and journals, and the Computer Society's journal format): \\title, one \\author with the names joined \"A,~B, and~C\", each followed by its IEEE grade in \\IEEEmembership{Member,~IEEE}, then the affiliations as \\thanks footnotes (\"A is with the Department…, Institution, City (e-mail: …).\") or, under compsoc, one \\IEEEcompsocitemizethanks of \\IEEEcompsocthanksitem's, the funding, corresponding author and \"Manuscript received…\" notes; \\markboth running heads, \\IEEEpubid, \\maketitle; the index terms in IEEEkeywords after the abstract (or in the compsoc title area), and the authors' IEEEbiography at the end of the paper.",
    writes:
      '\\title{…} \\author{…,~\\IEEEmembership{…,} and~…,~\\IEEEmembership{…}\\thanks{… is with the …, … (e-mail: …).}\\thanks{…}\\thanks{Corresponding author: … (e-mail: …).}\\thanks{Manuscript received …}} \\markboth{…}{… \\MakeLowercase{\\textit{et al.}}: …} \\IEEEpubid{…} \\AddToHookNext{env/abstract/after}{\\begin{IEEEkeywords} … \\end{IEEEkeywords}} \\maketitle; \\AtEndDocument{\\begin{IEEEbiography}[{\\includegraphics[…]{…}}]{…} … \\end{IEEEbiography} \\begin{IEEEbiographynophoto}{…} … \\end{IEEEbiographynophoto}}',
    ctan: ['ieeetran'],
    features: ['class-styled', 'centered'],
    params: {
      thanks: { type: 'enum', values: ['plain', 'compsoc'], default: 'plain', description: "the affiliations as one \\thanks each (IEEE journals, bare_jrnl.tex) or as one \\IEEEcompsocitemizethanks list of \\IEEEcompsocthanksitem's with the e-mails on their own line (Computer Society journals, bare_jrnl_compsoc.tex)" },
      keywords: { type: 'enum', values: ['after-abstract', 'index-text'], default: 'after-abstract', description: "the index terms (IEEEkeywords) right after the abstract, or, for the compsoc journal format, in the title area under the authors (\\LatexLibIndexTerms, which abs.ieee-indextext adds to its \\IEEEtitleabstractindextext)" },
      biographies: { type: 'enum', values: ['end', 'none'], default: 'end', description: "the authors' biographies (templateSpecific.biographies) at the end of the paper, as IEEEbiography with the photo or IEEEbiographynophoto, or none" },
    },
    // The title fields it prints besides the title and the names. An author's IEEE grade and biography have no field in Flouest's
    // author records: each is a templateSpecific list naming its author (records.ts), as front.acmart's author notes are.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.memberships',
      'templateSpecific.biographies',
      'templateSpecific.keywords',
      'templateSpecific.funding',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.received',
      'templateSpecific.journalHead',
      'templateSpecific.runningAuthor',
      'templateSpecific.shortTitle',
      'templateSpecific.pubid',
    ],
    presets: PRESETS,
    // graphicx only for a biography's photo (IEEEtran loads no graphics package).
    loads: [{ pkg: 'graphicx', when: { biographies: 'end' } }],
    // It defines the one-shot macro that prints the index terms after the abstract.
    defines: [{ name: 'cmd:\\LatexLibIEEEKeywords', when: { keywords: 'after-abstract' } }, { name: 'cmd:\\LatexLibIndexTerms', when: { keywords: 'index-text' } }],
    // It runs the class's own \maketitle.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\IEEEmembership', 'cmd:\\IEEEpubid', 'env:IEEEkeywords'],
    requiresWhen: [
      { when: { thanks: 'compsoc' }, requires: ['cmd:\\IEEEcompsocitemizethanks', 'cmd:\\IEEEcompsocthanksitem'] },
      { when: { keywords: 'index-text' }, requires: ['cmd:\\IEEEtitleabstractindextext'] },
      { when: { biographies: 'end' }, requires: ['env:IEEEbiography', 'env:IEEEbiographynophoto'] },
    ],
    only: ['class.ieeetran', 'class.ieeetran-compsoc'],
    onlyWhen: [
      {
        when: { keywords: 'index-text' },
        classes: ['class.ieeetran-compsoc'],
        reason:
          "IEEEtran prints \\IEEEtitleabstractindextext's text in the title area only in the compsoc and transmag journal formats (IEEEtran.cls l.4815-4836); in the plain journal format only \\IEEEdisplaynontitleabstractindextext prints it (l.5232-5249), so the index terms would be lost",
        evidence: [{ kind: 'source', file: `${DIR}/IEEEtran.cls`, line: '4805-4836 (\\@maketitle: the title-area box only under compsoc, transmag, peerreviewca), 5226-5249 (\\IEEEtitleabstractindextext, \\IEEEdisplaynontitleabstractindextext)' }],
      },
    ],
    deny: [
      {
        class: 'class.ieeeaccess',
        reason:
          "ieeeaccess-latexlib.cls is built on IEEEtran but replaces its title block: \\author only stores its text, \\IEEEmembership prints \"(grade)\", \\thanks notes are not printed, and \\maketitle prints the abstract and keywords boxes, which must be filled before it, and \\@doi, which only \\doi sets (l.601-613, 733-787, 794). front.ieeeaccess writes its title block",
        evidence: [{ kind: 'source', file: 'Template/templates/ieee-access/files/ieeeaccess.cls', line: '601-613 (\\history, \\doi, \\title, \\author, \\address), 615-649 (abstract and keywords boxes 99 and 88), 733-787 (\\@maketitle, \\maketitle), 794 (\\IEEEmembership)' }],
      },
      {
        class: 'class.ieeeconf-ras',
        reason:
          "ieeeconf (V1.6b) is IEEEtran's conference format: \\IEEEmembership and the biographies are locked out (they print nothing but a warning), and it has no IEEEkeywords environment (only keywords), so the journal title block loses its grades and stops at \\begin{IEEEkeywords}",
        evidence: [{ kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0223-ieee-ieeeconf/ieeeconf.cls', line: '3386 (\\IEEEmembership), 4566 (locked out in conference mode), 3809-3818 (keywords, no IEEEkeywords)' }],
      },
    ],
    // Typeset under IEEEtran [journal] and [journal,compsoc] (MiKTeX ieeetran, V1.8b) on ZeroTeX-NG, 2026-11-07.
    targetEngine: 'yes',
  }),
  evidence: [
    { kind: 'source', file: `${DIR}/bare_jrnl.tex`, line: '361-379, 403-404, 418-425, 435-442, 683-698' },
    { kind: 'source', file: `${DIR}/bare_jrnl_compsoc.tex`, line: '402-412, 435-436, 473-485, 753-768' },
    { kind: 'source', file: `${DIR}/IEEEtran.cls`, line: '4360 (\\markboth), 4525 (\\IEEEmembership), 4725-4731 (\\and only warns outside conference mode), 4899-4911 (\\IEEEcompsocitemizethanks), 5226-5249 (\\IEEEtitleabstractindextext), 5286-5297 (IEEEkeywords), 5991-6082 (IEEEbiography, IEEEbiographynophoto), 6146-6153 (\\IEEEpubid)' },
    { kind: 'requirement', file: 'Template/template-requirement/IEEEtran_Journal.md', line: '50-55' },
    { kind: 'manual', of: 'ieeetran', section: 'IEEEtran_HOWTO: the title page, membership, \\thanks, \\markboth, biographies', url: 'https://ctan.org/pkg/ieeetran' },
  ],
});
