/**
 * front.cas's presets: the one CAS title block (cas-sc and cas-dc share cas-common.sty), its subtitle in each of the
 * three \title modes the guide offers for it.
 */
import type { Preset } from '../../../schema/params.ts';

const SOURCE = 'Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/sty/cas/cas-common.sty';
const TEMPLATE = { kind: 'source', file: 'Latex Related Research/Latex-lib-main/Source/0920-sylvainhalle-papershell/Source/tpl/cas/preamble.tpl', line: '57-102' } as const;

export const PRESETS = {
  cas: {
    description:
      "Elsevier CAS's title block: \\shorttitle and \\shortauthors, \\title[mode=title], \\author[affiliations]{name}[orcid=…] with \\cormark, \\ead and \\credit, keyed \\affiliation[n]{organization=…, addressline=…}, \\cortext, the highlights and the keywords box with \\sep, then \\maketitle; a subtitle as \\title[mode=sub]; the email footnote labelled \"Email address:\" in words (the class's nologo key in the preamble).",
    features: ['class-styled'],
    params: {},
    evidence: [
      TEMPLATE,
      { kind: 'source', file: SOURCE, line: '146-170 (\\title[mode]), 234 (\\cormark), 308 (\\ead), 587 (\\cortext), 895 (\\author), 1252 (\\affiliation), 1572-1623 (highlights, \\MSC, \\JEL, \\PACS, keywords), 2390-2394 (\\shortauthors, \\shorttitle)' },
      { kind: 'requirement', file: 'Template/template-requirement/Elsevier_CAS_DC.md', line: '64-101' },
    ],
  },
  'alt-subtitle': {
    description: 'The CAS title block with the subtitle set as an alternative title, \\title[mode=alt]: \\large, black.',
    writes: '\\shorttitle{…} \\shortauthors{…} \\title[mode=title]{…} \\title[mode=alt]{…} \\csgdef{casprelimstitle}{…} \\author[…]{…}[orcid=…] \\cormark[1] \\ead{…} \\affiliation[…]{organization={…}, addressline={…}} \\cortext[1]{…} \\begin{keywords} … \\sep … \\end{keywords} \\maketitle; \\ExplSyntaxOn\\keys_set:nn{stm/mktitle}{nologo}\\ExplSyntaxOff',
    features: ['class-styled'],
    params: { subtitleMode: 'alt' },
    evidence: [{ kind: 'source', file: SOURCE, line: '64-75 (mode / alt)' }],
  },
  'trans-subtitle': {
    description: 'The CAS title block with the subtitle set as a translated title, \\title[mode=trans]: \\normalsize, grey.',
    writes: '\\shorttitle{…} \\shortauthors{…} \\title[mode=title]{…} \\title[mode=trans]{…} \\csgdef{casprelimstitle}{…} \\author[…]{…}[orcid=…] \\cormark[1] \\ead{…} \\affiliation[…]{organization={…}, addressline={…}} \\cortext[1]{…} \\begin{keywords} … \\sep … \\end{keywords} \\maketitle; \\ExplSyntaxOn\\keys_set:nn{stm/mktitle}{nologo}\\ExplSyntaxOff',
    features: ['class-styled'],
    params: { subtitleMode: 'trans' },
    evidence: [{ kind: 'source', file: SOURCE, line: '87-98 (mode / trans)' }],
  },
  'email-icons': {
    description:
      "The CAS title block with Elsevier's envelope icon before the email addresses, as the class prints them by default; the template's bundle must carry thumbnails/cas-email.jpeg, which the engine's els-cas-templates install does not.",
    writes:
      '\\shorttitle{…} \\shortauthors{…} \\title[mode=title]{…} \\author[…]{…}[orcid=…] \\cormark[1] \\ead{…} \\affiliation[…]{organization={…}, addressline={…}} \\cortext[1]{…} \\begin{keywords} … \\sep … \\end{keywords} \\maketitle',
    features: ['class-styled', 'icon'],
    params: { emailLabel: 'icon' },
    evidence: [{ kind: 'source', file: SOURCE, line: '372-392 (\\printemails: \\includegraphics[height=8pt]{thumbnails/cas-email.jpeg} unless nologo)' }],
  },
} as const satisfies { readonly [name: string]: Preset };
