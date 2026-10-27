export default {
  // Type check the whole project: tsc needs the full program, not a subset of files,
  // so this returns a command that runs without the staged file list appended.
  '**/*.(ts|tsx)': () => 'tsc --noEmit',

  // Lint and format scripts
  '**/*.(ts|tsx|js|jsx|mjs)': ['eslint --fix --no-warn-ignored', 'prettier --write'],

  // Format styles, markup and config files
  '**/*.(scss|css|md|json|yml|yaml)': ['prettier --write'],
};
