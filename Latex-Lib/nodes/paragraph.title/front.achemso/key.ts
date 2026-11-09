import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS } from './presets.ts';

export default defineKey(
  minimal({
    id: 'front.achemso',
    node: 'paragraph/title',
    description:
      "achemso's (ACS journals) title block, all in the preamble because every command is preamble-only: one \\author per author, \\email (with \\phone and \\fax) after each corresponding author, the author's first affiliation as \\affiliation[short]{department, name, address} and further ones as \\alsoaffiliation[short]{…}, \\title[short title]{…}, \\abbreviations{…} and \\keywords{…}. The class runs \\maketitle itself at \\begin{document}; nothing goes in the body.",
    writes: '\\author{…} \\email{…} \\phone{…} \\fax{…} \\affiliation[…]{…} \\alsoaffiliation[…]{…} \\title[…]{…} \\abbreviations{…} \\keywords{…}',
    ctan: ['achemso'],
    features: ['class-styled', 'centered'],
    // author.orcid is not printed (achemso has no command for it); a per-author alternative address (\altaffiliation) has no title field and is dropped.
    fields: [
      'author.email',
      'affiliation.name',
      'affiliation.department',
      'affiliation.address',
      'templateSpecific.shortTitle',
      'templateSpecific.correspondingAuthor',
      'templateSpecific.correspondingPhone',
      'templateSpecific.correspondingFax',
      'templateSpecific.abbreviations',
      'templateSpecific.keywords',
    ],
    presets: PRESETS,
    // The class's own \maketitle (appended to \document, l.1823) prints what this way declares, so the way owns it; the profile
    // leaves cmd:\maketitle out on purpose (a body \maketitle prints nothing), so the way does not require it.
    claims: ['maketitle'],
    requires: ['cmd:\\affiliation', 'cmd:\\alsoaffiliation', 'cmd:\\email', 'cmd:\\phone', 'cmd:\\fax', 'cmd:\\abbreviations', 'cmd:\\keywords'],
    only: ['class.achemso'],
    // Typeset ok on ZeroTeX-NG (2026-11-07, class-examples typeset-dir): under achemso[journal=jacsat,manuscript=article] with the sample, and
    // with email=true,abbreviations=true,keywords=true and \phone, \fax, \abbreviations given: 1 page, no error, no class warning.
    targetEngine: 'yes',
  }),
);

