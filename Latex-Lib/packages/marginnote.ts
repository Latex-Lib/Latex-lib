import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: "marginnote",
  description: "marginnote: margin notes that are not floats.",
  options: {"fulladjust": "the note adjusted to the line's height and depth", "heightadjust": "adjusted to the line's height only", "depthadjust": "adjusted to the line's depth only", "noadjust": "not adjusted", "parboxrestore": "a reduced \\@parboxrestore restores \\par in notes", "noparboxrestore": "nothing restored (the default)"},
  exclusive: [["fulladjust", "heightadjust", "depthadjust", "noadjust"], ["parboxrestore", "noparboxrestore"]],
  loadOrder: [],
  defines: [],
  zerotex: 'yes',
  evidence: [ctan("marginnote"), { kind: 'manual', of: "marginnote", section: "1 How to Use marginnote Package", url: 'https://ctan.org/pkg/marginnote' }],
});
