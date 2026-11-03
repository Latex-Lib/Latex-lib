import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "footmisc",
  description: "footmisc: the footnotes' layout by options (hang, flushmargin, para, side, bottom, perpage, symbol, stable, multiple, norule …), \\footnotemargin for hanging marks.",
  options: {"hang": "marks hang in the margin, the text aligned after them", "flushmargin": "marks flush with the margin", "para": "a page's footnotes in one paragraph", "side": "footnotes in the margin", "ragged": "footnote text ragged right", "perpage": "numbers restart on every page", "symbol": "symbol marks", "symbol*": "symbol marks, doubled when they run out", "bottom": "footnotes at the page bottom, under floats", "marginal": "marks in the margin", "norule": "no rule above the footnotes", "stable": "footnotes safe in moving arguments", "multiple": "several marks at one place separated", "belowfloats": "footnotes below bottom floats"},
  exclusive: [["symbol", "symbol*"]],
  loadOrder: [],
  defines: [],
  zerotex: 'untested',
  evidence: [ctan("footmisc"), { kind: 'manual', of: "footmisc", section: "package options (para, perpage, stable, multiple, symbol, bottom, hang, flushmargin, norule)", url: 'https://ctan.org/pkg/footmisc' }],
});
