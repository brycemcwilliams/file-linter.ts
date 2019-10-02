import chalk from 'chalk';

import {
    IFileLinter, IFileLinterDirectory, IFileLinterEffect, IFileLinterFix, IFileLinterRegex
} from './type';

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
 * @param  {*} object
 */
export const print = (object: any) =>
  console.log(JSON.stringify(object, null, 2));

/**
 * @param  {IFileLinterRegex} regex
 * @param  {boolean} recursive
 * @param  {boolean} fix
 * @param  {boolean} debug
 * @param  {boolean} silent
 */
export const lint = (
  fileLinter: IFileLinter,
  regex: IFileLinterRegex,
  recursive: boolean,
  fix: boolean,
  debug: boolean,
  silent: boolean
) => {
  if (debug) print({ regex, recursive, fix, debug });

  if (!(typeof regex === "object")) {
    throw new TypeError("Regex values must be of type object");
  }

  const lintedDirectories: IFileLinterDirectory[] = fileLinter.lintDirectories(
    recursive
  );

  if (debug) print({ lintedDirectories });

  if (!silent) {
    console.log(
      chalk.green.bold(`${pkg.name} [v${pkg.version}](${process.cwd()}):\n`)
    );
  }

  let total = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let previousDirPath = "";
  lintedDirectories.forEach(({ dirName, files }: IFileLinterDirectory) =>
    files.forEach(
      ({ dirPath, fileName, regexAssersion, passed }: IFileLinterEffect) => {
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

      if (debug) print({ fixedDirectories });

      if (!silent) {
        console.log(chalk.green.bold(`Successfully linted ${fileInfoText}`));
      }
    } else {
      throw new Error("Failed assersions");
    }
  }

  return lintedDirectories;
};
