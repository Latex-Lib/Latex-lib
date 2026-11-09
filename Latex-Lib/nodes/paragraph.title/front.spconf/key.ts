import { defineKey } from '../../../schema/key.ts';
import { minimal } from '../../../schema/minimal.ts';
import { PRESETS, PROFILE, TEMPLATE } from './presets.ts';

export default defineKey({
  ...minimal({
    id: 'front.spconf',
    node: 'paragraph/title',
    description:
      "The ICASSP/ICIP title block of the IEEE Signal Processing Society's spconf.sty: \\title{…}, then the authors as spconf's \\maketitle takes them (never \\author): one \\name{…} with an \\address{…} of School \\\\ Department \\\\ Address lines, the kit's \\twoauthors{names}{address}{names}{address} for two affiliation groups, or one \\name with superscript affiliation numbers and an \\address listing each numbered affiliation; the funding note as \\thanks (\\sthanks in \\twoauthors); then \\maketitle, and the keywords in spconf's keywords environment (Index Terms) right after the abstract through the env/abstract/after hook. spconf (class.icassp) only.",
    writes: '\\title{…} \\name{…\\thanks{…}} \\address{… \\\\ …} | \\twoauthors{…\\sthanks{…}}{… \\\\ …}{…}{… \\\\ …} \\AddToHook{env/abstract/after}{\\begin{keywords}…\\end{keywords}} \\maketitle',
    ctan: ['latex-base'],
    features: ['class-styled', 'centered'],
    params: {
      groups: {
        type: 'enum',
        values: ['auto', 'one', 'two', 'superscript'],
        default: 'auto',
        description:
          "how the authors are laid out: by the paper's affiliation groups (one group: \\name and \\address; two: \\twoauthors; more: superscript numbers), always one \\name and \\address, always \\twoauthors (the first group left, every later author right; one group falls back to \\name and \\address), or always superscript numbers",
      },
      emails: { type: 'enum', values: ['none', 'address'], default: 'none', description: "the authors' e-mails: not printed (the kit prints none), or as the last line of their address" },
    },
    // templateSpecific.funding is the kit's \thanks note (main.tex l.73, "Thanks to the XYZ agency for funding"); the schema has
    // no per-author note (the research's author.thanks), so a per-author note is not printed. No ORCID: spconf has no place for one.
    fields: ['author.email', 'affiliation.name', 'affiliation.department', 'affiliation.address', 'templateSpecific.funding', 'templateSpecific.keywords'],
    presets: PRESETS,
    // It runs spconf's own \maketitle, which prints \@name and \@address.
    claims: ['maketitle'],
    requires: ['cmd:\\maketitle', 'cmd:\\name', 'cmd:\\address', 'env:keywords'],
    requiresWhen: [{ when: { groups: ['auto', 'two'] }, requires: ['cmd:\\twoauthors', 'cmd:\\sthanks'] }],
    only: ['class.icassp'],
    // spconf.sty is not in this checkout (classes/icassp.ts names testing-pipeline/settings/classes/files/spconf.sty, which
    // is missing, and it is not on CTAN), so no preset was typeset.
    targetEngine: 'untested',
  }),
  evidence: [
    { kind: 'source', file: TEMPLATE, line: '65-86, 90, 101-103' },
    { kind: 'source', file: PROFILE, line: '3-41 (spconf.sty l.145-172 \\maketitle, \\name, \\address; l.181-190 \\sthanks, \\twoauthors; l.205-215 abstract, keywords)' },
  ],
});
