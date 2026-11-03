import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "todonotes",
  description: "todonotes: coloured margin and inline notes.",
  options: {"disable": "every \\todo hidden", "obeyDraft": "notes only with the draft class option", "obeyFinal": "notes hidden with the final class option", "colorinlistoftodos": "list entries marked in the note's colour", "prependcaption": "the caption printed before the note", "loadshadowlibrary": "loads TikZ's shadows library", "shadow": "every note with a shadow", "dvistyle": "for DVI output", "english": "English names", "french": "French names", "german": "German names", "ngerman": "new German names", "italian": "Italian names", "portuguese": "Portuguese names", "spanish": "Spanish names", "swedish": "Swedish names"},
  exclusive: [["obeyDraft", "obeyFinal"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("todonotes"), { kind: 'manual', of: "todonotes", section: "1.2 Package options; 1.3 \\todo options", url: 'https://ctan.org/pkg/todonotes' }],
});
