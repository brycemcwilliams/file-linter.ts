import chalk from 'chalk';

import { IDirectoryLintResult, IFileLinter, IFileLintRegex, IFileLintResult } from './linter';

const pkg = require("../package.json");

/**
 * @param  {string} fileName
 */
export const toCamelCase = (fileName: string) =>
  fileName
    .replace(/\s(.)/g, (x: string) => x.toUpperCase())
    .replace(/\s/g, "")
    .replace(/\-\-/g, "-") // TODO: Optional replace doubles
    .replace(/^(.)/, (x: string) => x.toLowerCase());

/**
 * @param  {IFileLintRegex} regex
 * @param  {boolean} recursive
 * @param  {boolean} fix
 * @param  {boolean} debug
 * @param  {boolean} silent
 */
export const lint = (
  fileLinter: IFileLinter,
  regex: IFileLintRegex,
  recursive: boolean,
  fix: boolean,
  debug: boolean,
  silent: boolean
) => {
  if (debug) {
    console.log(JSON.stringify({ regex, recursive, fix, debug }, null, 2));
  }
  if (!(typeof regex === "object")) {
    throw new TypeError("Regex values must be of type object");
  }
  const lintedDirectories: IDirectoryLintResult[] = fileLinter.lintDirectories(
    recursive
  );
  if (debug) console.log(JSON.stringify({ lintedDirectories }, null, 2));
  if (!silent) {
    console.log(
      chalk.green.bold(`${pkg.name} [v${pkg.version}](${process.cwd()}):\n`)
    );
  }
  let total = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let previousDirPath = "";
  lintedDirectories.forEach(({ dirName, files }: IDirectoryLintResult) =>
    files.forEach(
      ({ dirPath, fileName, regexAssersion, passed }: IFileLintResult) => {
        total++;
        const currentDirPath = `${dirName}/${
          dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
        }`;
        if (!(currentDirPath === previousDirPath)) {
          if (!silent) {
            console.log(chalk.yellow.bold(`  ${currentDirPath}`));
          }
        }
        if (passed === true) {
          totalPassed++;
          if (!silent) {
            console.log(chalk.green(`    ${fileName} ✓`));
          }
        } else {
          totalFailed++;
          if (!silent) {
            console.log(
              chalk.red(
                `    ${fileName} ✗ ${chalk.bgYellow(
                  chalk.black(`/${regexAssersion}/`)
                )}`
              )
            );
          }
        }
        previousDirPath = currentDirPath;
      }
    )
  );
  if (!silent) {
    console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total}) ✓`));
  }
  if (totalFailed > 0) {
    if (!silent) {
      console.log(chalk.red.bold(`Failed: (${totalFailed}/${total}) ✗`));
    }
    const fileInfoText = `file${totalFailed <= 1 ? "" : "s"}`;
    const fileInfo = chalk.green.bold(
      `Attempting to fix: ${totalFailed} ${fileInfoText}`
    );
    if (fix) {
      if (!silent) console.log(fileInfo);
      const fixedDirectories = fileLinter.fixDirectories(lintedDirectories);
      if (debug) {
        console.log(JSON.stringify({ fixedDirectories }, null, 2));
      }
      if (!silent) {
        console.log(chalk.green.bold(`Successfully linted ${fileInfoText}`));
      }
    } else {
      throw new Error("Failed assersions");
    }
  }
};
