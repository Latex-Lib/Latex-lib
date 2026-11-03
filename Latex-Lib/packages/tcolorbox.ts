import { definePackage } from '../schema/class.ts';

export default definePackage({
  id: "tcolorbox",
  description: "tcolorbox: coloured, framed boxes; its theorems library declares boxed theorem environments.",
  options: {},
  exclusive: [],
  libraries: ["skins", "breakable", "theorems", "most", "many", "all", "hooks", "xparse", "fitting", "listings", "listingsutf8", "minted", "raster", "vignette", "poster", "magazine", "documentation", "external"],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [],
});
