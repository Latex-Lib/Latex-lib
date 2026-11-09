import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.moderncv',
    node: 'paragraph/title',
    description:
      "moderncv's CV head (moderncv class): the personal data in the preamble, \\name{first}{last}, \\born, \\address{street}{city}{country}, \\phone[mobile|fixed|fax]{…}, \\email, \\homepage, \\social[github|linkedin|orcid…]{…}, \\extrainfo, \\photo[height][frame]{file} and \\quote, then \\title{subtitle} and \\makecvtitle where the title stands; for a title that names a recipient, a cover letter's head instead: \\recipient{…}{…}, \\date, \\subject, \\opening, \\closing, \\signature, \\postscript, \\enclosure and \\makelettertitle, closed by \\makeletterclosing at the end of the document. The look comes from the template's \\moderncvstyle.",
    writes:
      '\\name{…}{…} \\born{…} \\address{…}{…}{…} \\phone[…]{…} \\email{…} \\homepage{…} \\social[…]{…} \\extrainfo{…} \\photo[…][…]{…} \\quote{…}; \\title{…} \\makecvtitle | \\recipient{…}{…} \\date{…} \\subject{…} \\opening{…} \\closing{…} \\signature{…}{…} \\postscript{…} \\enclosure{…} \\makelettertitle; \\AtEndDocument{\\makeletterclosing}',
    ctan: ['moderncv'],
    features: ['class-styled'],
    params: {
      photoHeight: { type: 'dimen', default: '64pt', description: "the photo's height, \\photo's first optional argument (the class's default)" },
      photoFrame: { type: 'dimen', default: '0.4pt', description: "the photo frame's thickness, \\photo's second optional argument (0pt for none; the class's default)" },
      signatureScale: { type: 'string', default: '1', description: "the signature image's scale, \\signature's first argument (\\includegraphics[scale=…])" },
      opening: { type: 'tex', default: 'Dear Sir or Madam,', description: "a letter's \\opening when the paper gives none (templateSpecific.opening): the template's" },
      closing: { type: 'tex', default: 'Yours faithfully,', description: "a letter's \\closing when the paper gives none (templateSpecific.closing): the template's" },
    },
    fields: [
      'author.email',
      'author.orcid',
      'affiliation.address',
      'templateSpecific.address',
      'templateSpecific.phone',
      'templateSpecific.homepage',
      'templateSpecific.social',
      'templateSpecific.born',
      'templateSpecific.extrainfo',
      'templateSpecific.photo',
      'templateSpecific.quote',
      'templateSpecific.recipientName',
      'templateSpecific.recipientAddress',
      'templateSpecific.subject',
      'templateSpecific.opening',
      'templateSpecific.closing',
      'templateSpecific.signature',
      'templateSpecific.postscript',
      'templateSpecific.enclosure',
    ],
    presets: PRESETS,
    // moderncv has no \maketitle (classes/moderncv.ts): \makecvtitle and \makelettertitle are its title blocks, and they print
    // nothing the class holds for them, so the way claims nothing.
    requires: ['cmd:\\makecvtitle', 'cmd:\\name', 'cmd:\\makelettertitle'],
    only: ['class.moderncv'],
    // Typeset ok under moderncv 2.6.1 (ZeroTeX-NG, 2026-11-07) with the classic, casual and contemporary styles (contemporary after its
    // \moderncvcolor, as the template orders them): the CV head on the title sample, one with no subtitle and typed phones,
    // socials and an http homepage, one with a photo and a quote, and a cover letter with every letter field.
    targetEngine: 'yes',
  }),
);
