/**
 * paragraph/title's ways: way id to handler. A handler turns its parameters (a preset) into Flouest's `Realization`.
 */
import type { Realization } from '../../schema/realization.ts';
import way0 from './front.maketitle/handler.ts';
import way1 from './front.titling/handler.ts';
import way2 from './front.titlepage-env/handler.ts';
import way3 from './front.koma-title/handler.ts';
import way4 from './front.class-native/handler.ts';
import way5 from './front.aaai/handler.ts';
import way6 from './front.aastex/handler.ts';
import way7 from './front.achemso/handler.ts';
import way8 from './front.acmart/handler.ts';
import way9 from './front.agu/handler.ts';
import way10 from './front.aistats/handler.ts';
import way11 from './front.ams-topmatter/handler.ts';
import way12 from './front.apa7/handler.ts';
import way13 from './front.asmeconf/handler.ts';
import way14 from './front.asmejour/handler.ts';
import way15 from './front.authblk/handler.ts';
import way16 from './front.author-blocks/handler.ts';
import way17 from './front.beamer-title/handler.ts';
import way18 from './front.bmvc/handler.ts';
import way19 from './front.cas/handler.ts';
import way20 from './front.center-block/handler.ts';
import way21 from './front.copernicus/handler.ts';
import way22 from './front.corl/handler.ts';
import way23 from './front.ecai-frontmatter/handler.ts';
import way24 from './front.elegantpaper/handler.ts';
import way25 from './front.elsarticle-frontmatter/handler.ts';
import way26 from './front.emulateapj/handler.ts';
import way27 from './front.exam-cover/handler.ts';
import way28 from './front.frontiers/handler.ts';
import way29 from './front.icml/handler.ts';
import way30 from './front.ieeeaccess/handler.ts';
import way31 from './front.ieeetran-blocks/handler.ts';
import way32 from './front.ieeetran-journal/handler.ts';
import way33 from './front.ijcai/handler.ts';
import way34 from './front.imsart-frontmatter/handler.ts';
import way35 from './front.inst-institute/handler.ts';
import way36 from './front.interact/handler.ts';
import way37 from './front.iopart/handler.ts';
import way38 from './front.iopjournal/handler.ts';
import way39 from './front.jmlr/handler.ts';
import way40 from './front.jss/handler.ts';
import way41 from './front.koma-letter/handler.ts';
import way42 from './front.letter/handler.ts';
import way43 from './front.lipics/handler.ts';
import way44 from './front.mdpi/handler.ts';
import way45 from './front.mnras/handler.ts';
import way46 from './front.moderncv/handler.ts';
import way47 from './front.oup/handler.ts';
import way48 from './front.revtex/handler.ts';
import way49 from './front.siam/handler.ts';
import way50 from './front.sn-jnl/handler.ts';
import way51 from './front.spconf/handler.ts';
import way52 from './front.spie/handler.ts';
import way53 from './front.tikzposter/handler.ts';
import way54 from './front.tufte/handler.ts';
import way55 from './front.ut-thesis/handler.ts';

export type Handler = (params?: { readonly [name: string]: unknown }) => Realization;

export const HANDLERS: { readonly [way: string]: Handler } = {
  'front.maketitle': way0,
  'front.titling': way1,
  'front.titlepage-env': way2,
  'front.koma-title': way3,
  'front.class-native': way4,
  'front.aaai': way5,
  'front.aastex': way6,
  'front.achemso': way7,
  'front.acmart': way8,
  'front.agu': way9,
  'front.aistats': way10,
  'front.ams-topmatter': way11,
  'front.apa7': way12,
  'front.asmeconf': way13,
  'front.asmejour': way14,
  'front.authblk': way15,
  'front.author-blocks': way16,
  'front.beamer-title': way17,
  'front.bmvc': way18,
  'front.cas': way19,
  'front.center-block': way20,
  'front.copernicus': way21,
  'front.corl': way22,
  'front.ecai-frontmatter': way23,
  'front.elegantpaper': way24,
  'front.elsarticle-frontmatter': way25,
  'front.emulateapj': way26,
  'front.exam-cover': way27,
  'front.frontiers': way28,
  'front.icml': way29,
  'front.ieeeaccess': way30,
  'front.ieeetran-blocks': way31,
  'front.ieeetran-journal': way32,
  'front.ijcai': way33,
  'front.imsart-frontmatter': way34,
  'front.inst-institute': way35,
  'front.interact': way36,
  'front.iopart': way37,
  'front.iopjournal': way38,
  'front.jmlr': way39,
  'front.jss': way40,
  'front.koma-letter': way41,
  'front.letter': way42,
  'front.lipics': way43,
  'front.mdpi': way44,
  'front.mnras': way45,
  'front.moderncv': way46,
  'front.oup': way47,
  'front.revtex': way48,
  'front.siam': way49,
  'front.sn-jnl': way50,
  'front.spconf': way51,
  'front.spie': way52,
  'front.tikzposter': way53,
  'front.tufte': way54,
  'front.ut-thesis': way55,
};
