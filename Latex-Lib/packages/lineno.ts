import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

/**
 * lineno: line numbers in the margin (\linenumbers), and its linenomath and linenomath* environments, which keep the numbering
 * going through a display (math.linenomath, for AGU's journals). Classes that preload it: aa (through linenoaa), aastex.
 */
export default definePackage({
  id: "lineno",
  description: "lineno: line numbers in the margin, \\linenumbers, and the linenomath and linenomath* environments that number a display's lines.",
  options: {
    "left": "numbers in the left margin",
    "right": "numbers in the right margin",
    "switch": "numbers in the outer margin, alternating",
    "switch*": "numbers in the inner margin, alternating",
    "pagewise": "numbering restarts on every page",
    "running": "numbering runs through the document",
    "modulo": "only every fifth line numbered",
    "mathlines": "the lines of displays numbered too",
    "displaymath": "the kernel's displays wrapped in linenomath",
    "columnwise": "numbering by column in two-column pages",
    "edtable": "the edtable environment",
    "nolinenumbers": "the commands defined, numbering off",
  },
  exclusive: [["left", "right", "switch", "switch*"], ["pagewise", "running"]],
  loadOrder: [],
  defines: ["env:linenomath", "env:linenomath*", "cmd:\\linenumbers"],
  targetEngine: 'yes',
  evidence: [ctan("lineno")],
});
