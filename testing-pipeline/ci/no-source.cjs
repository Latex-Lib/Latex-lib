// Preloaded into every Node process a public run starts for the host (NODE_OPTIONS=--require, compat.yml): a
// crash prints the error's message and its frames by file name, never a source line (Node quotes one above a
// fatal error's stack) nor the folders around the file. The host bundles code that is not public, and a run's
// log is (testing-pipeline/ARCHITECTURE.md section 7, `ci/`).
'use strict';
const fail = (error) => {
  const head = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  const frames = (error && typeof error.stack === 'string' ? error.stack.split('\n') : [])
    .filter((line) => /^\s+at /.test(line))
    .map((line) => line.replace(/(?<=[\s(])(?:file:\/\/)?(?:[A-Za-z]:)?[\\/][^\s()]*[\\/]([^\\/\s()]+:\d+(?::\d+)?)/g, '$1'));
  process.stderr.write(`${[head, ...frames].join('\n')}\n`);
  process.exit(1);
};
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);
