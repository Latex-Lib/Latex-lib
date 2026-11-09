import { definePackage } from '../schema/class.ts';
import { ctan } from '../schema/minimal.ts';

export default definePackage({
  id: 'floatrow',
  description: 'floatrow: float layouts by \\floatsetup (caption position, beside captions, float widths), \\ffigbox and \\fcapside; it builds on caption and takes over float\'s \\restylefloat.',
  options: {},
  exclusive: [],
  conflicts: [
    {
      pkg: 'float',
      reason: 'floatrow stops loading when float is already loaded ("Do not use float package with floatrow. The latter will be skipped", floatrow.sty l.33), so \\floatsetup and the rest stay undefined',
      evidence: [{ kind: 'compile', cell: 'cfa80fc0f4de7e2bbec59' }],
    },
  ],
  loadOrder: [],
  defines: ['cmd:\\floatsetup', 'cmd:\\fcapside', 'cmd:\\ffigbox', 'cmd:\\ttabbox'],
  targetEngine: 'untested',
  evidence: [ctan('floatrow')],
});
