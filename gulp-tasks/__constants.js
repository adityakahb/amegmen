const deletePaths = ['dist', 'coverage'];
const devTSPath = ['./src/**/*.ts', '!./src/**/*.test.ts'];
const globalCSSPath = ['./src/styles/**/*.scss', '!./src/styles/include/**/*.scss'];
const lintingScriptsPath = ['./src/**/*.ts', '!./src/**/*.test.ts'];

export { deletePaths, devTSPath, globalCSSPath, lintingScriptsPath };
