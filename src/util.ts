const chalk = require("chalk");

import {
    IFileLinter, IFileLinterDirectory, IFileLinterEffect, IFileLinterRegex, Metadata
} from './type';

const pkg = require("../package.json");

/**
 * @param  {boolean} debug
 * @param  {boolean} silent
 */
export const resetCursor = (
  debug: boolean = false,
  silent: boolean = false
) => {
  if (!silent) process.stdout.write("\x1b[2J");
  if (!silent) process.stdout.write("\x1b[0f");
};

/**
 * @param  {Metadata} object
 */
export const print = (object: Metadata) =>
  console.log(JSON.stringify(object, null, 2));

/**
 * @param  {IFileLinter} fileLinter
 * @param  {string} enforce
 * @param  {IFileLinterRegex} regex
 * @param  {boolean} recursive
 * @param  {boolean} fix
 * @param  {boolean} debug
 * @param  {boolean} silent
 */
export const lint = (
  fileLinter: IFileLinter,
  enforce: string,
  regex: IFileLinterRegex,
  recursive: boolean,
  fix: boolean,
  debug: boolean,
  silent: boolean
) => {
  if (debug) print({ args: { enforce, regex, recursive, fix, debug } });

  if (!(typeof regex === "object")) {
    throw new TypeError("Regex values must be of type object");
  }

  const lintedDirectories = fileLinter.lintDirectories(recursive);

  if (debug) print({ lintedDirectories });

  if (!silent) {
    console.log(
      chalk.green.bold(`${pkg.name} [v${pkg.version}](${process.cwd()}):\n`)
    );
  }

  const lintedFiles = lintedDirectories
    .map(({ files }) => files)
    .reduce((a, b) => a.concat(b), []);

  const total = lintedFiles.length;
  const totalPassed = lintedFiles.filter(
    ({ passed }: IFileLinterEffect) => passed === true
  ).length;
  const totalFailed = lintedFiles.filter(
    ({ passed }: IFileLinterEffect) => passed === false
  ).length;

  let previousDirPath = "";
  lintedDirectories.forEach(({ dirName, files }: IFileLinterDirectory) => {
    files.forEach(
      ({ dirPath, fileName, regexAssersion, passed }: IFileLinterEffect) => {
        const currentDirPath = `${dirName}/${
          dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
        }`;

        if (!(currentDirPath === previousDirPath)) {
          if (!silent) {
            console.log(chalk.yellow.bold(`  ${currentDirPath}`));
          }
        }

        if (passed) {
          if (!silent) {
            console.log(chalk.green(`    ${fileName} ✓`));
          }
        } else {
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
    );
  });

  if (!silent && totalPassed > 0) {
    console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total}) ✓`));
  }

  if (totalFailed > 0) {
    if (!silent) {
      console.log(chalk.red.bold(`Failed: (${totalFailed}/${total}) ✗`));
    }

    const fileInfoText = `file${totalFailed <= 1 ? "" : "s"}`;
    const fileInfo = chalk.yellow.bold(
      `Attempting to fix: (${totalFailed} ${fileInfoText}) ⚠`
    );

    if (fix) {
      if (!silent) console.log(fileInfo);

      const fixedDirectories = fileLinter.fixDirectories(
        lintedDirectories,
        enforce
      );

      if (debug) print({ fixedDirectories });

      if (!silent) {
        console.log(
          chalk.green.bold(
            `Successfully linted: (${totalFailed} ${fileInfoText}) ✓`
          )
        );
      }
    } else {
      throw new Error("Failed assersions");
    }
  }

  return lintedDirectories;
};
