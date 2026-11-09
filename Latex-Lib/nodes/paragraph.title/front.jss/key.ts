import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.jss',
    node: 'paragraph/title',
    description:
      "The Journal of Statistical Software's (jss.cls) title block, all in the preamble because the class runs \\maketitle itself at \\begin{document}: \\author{name\\\\affiliation \\And …} (a new row with \\AND), \\Plainauthor{…}, \\title{…}, \\Plaintitle{…}, \\Shorttitle{…}, \\Keywords{…} and \\Plainkeywords{…}, \\Address{…} with each author's department, institution, address and e-mail (printed at the end of the article), and the masthead's \\Volume, \\Year, \\Month, \\Issue, \\Submitdate, \\Acceptdate and \\DOI. Nothing goes in the body.",
    writes:
      '\\author{…\\\\… \\And …\\\\…} \\Plainauthor{…} \\title{…\\thanks{…}} \\Plaintitle{…} \\Shorttitle{…} \\Keywords{…} \\Plainkeywords{…} \\Address{…\\\\…\\\\E-mail: \\email{…}\\\\URL: \\url{…}} \\Volume{…} \\Year{…} \\Month{…} \\Issue{…} \\Submitdate{…} \\Acceptdate{…} \\DOI{…}',
    // jss.cls is the journal's own class (Source/0623-jss), not on CTAN: the preset carries the evidence.
    ctan: [],
    features: ['class-styled', 'centered'],
    params: {
      authorsPerRow: { type: 'number', default: 3, description: 'how many \\And-joined author cells stand in a row before \\AND starts the next (jss.cls l.340-345)' },
    },
    // author.orcid is not printed (the class has no place for it). templateSpecific.authorUrl is the first author's web page in \Address.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.plainTitle',
      'templateSpecific.keywords',
      'templateSpecific.authorUrl',
      'templateSpecific.titleNote',
      'templateSpecific.volume',
      'templateSpecific.year',
      'templateSpecific.month',
      'templateSpecific.issue',
      'templateSpecific.submitted',
      'templateSpecific.accepted',
      'templateSpecific.doi',
    ],
    presets: PRESETS,
    // The class's own \maketitle (begindocument/end, jss.cls l.471) prints what this way declares, so the way owns it; the profile
    // leaves cmd:\maketitle out on purpose (it is \relax after it runs, l.325), so the way does not require it (as front.achemso).
    claims: ['maketitle'],
    // jss.cls l.81-94 (\Address ... \Plainkeywords), l.108 (\DOI), l.479 (\email).
    requires: [
      'cmd:\\Plainauthor',
      'cmd:\\Plaintitle',
      'cmd:\\Shorttitle',
      'cmd:\\Keywords',
      'cmd:\\Plainkeywords',
      'cmd:\\Address',
      'cmd:\\email',
      'cmd:\\Volume',
      'cmd:\\Year',
      'cmd:\\Month',
      'cmd:\\Issue',
      'cmd:\\Submitdate',
      'cmd:\\Acceptdate',
      'cmd:\\DOI',
    ],
    only: ['class.jss'],
    // Typeset ok on ZeroTeX-NG (2026-11-07, class-examples typeset-dir, jss.cls v3.6 with jss.bst and jsslogo.jpg beside it):
    // \documentclass[article]{jss} with the sample and \Abstract, and with four authors (\AND row), a \thanks note, escaped
    // keywords (\&, \%, \{…\}), a URL with ~, _, % and #, and every masthead value: 2 pages, no error, no warning.
    targetEngine: 'yes',
  }),
);
