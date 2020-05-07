import chalk from "chalk";

import {
  IFileLinter,
  IFileLinterDirectory,
  IFileLinterEffect,
  IFileLinterRegex,
  Metadata
} from "./type";

import * as pkg from "../package.json";

/**
 * @param  {boolean} debug
 * @param  {boolean} silent
 */
export const resetCursor = (silent: boolean = false) => {
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
  fileLinter: Partial<IFileLinter>,
  enforce: string,
  regex: IFileLinterRegex,
  recursive: boolean,
  fix: boolean,
  debug: boolean,
  silent: boolean
) => {
  if (debug) print({ args: { enforce, regex, recursive, fix, debug } });

  if (!(typeof regex === "object")) {
    throw new TypeError("Regex values must be of type Object");
  }

  const lintedDirectories =
    fileLinter && fileLinter.lintDirectories
      ? fileLinter.lintDirectories(recursive)
      : [];

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
          dirPath ? (dirPath.length > 0 ? `${dirPath.join("/")}` : "") : ""
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
    console.log(
      chalk.green.bold(
        `\nPassed: ${Number(
          (totalPassed / total) * 100
        ).toFixed()}% (${totalPassed}/${total}) ✓`
      )
    );
  }

  if (totalFailed > 0) {
    if (!silent) {
      console.log(
        chalk.red.bold(
          `Failed: ${Number(
            (totalFailed / total) * 100
          ).toFixed()}% (${totalFailed}/${total}) ✗`
        )
      );
    }

    const fileInfo = chalk.yellow.bold(
      `Fixing Files: ${Number(
        (totalFailed / total) * 100
      ).toFixed()}% (${totalFailed}/${total}) ⚠`
    );

    if (fix) {
      if (!silent) console.log(fileInfo);

      const fixedDirectories =
        fileLinter && fileLinter.fixDirectories
          ? fileLinter.fixDirectories(lintedDirectories, enforce)
          : [];

      if (debug) print({ fixedDirectories });

      if (!silent) {
        console.log(
          chalk.green.bold(
            `Fixed Files: ${Number(
              (totalFailed / total) * 100
            ).toFixed()}% (${totalFailed}/${total}) ✓`
          )
        );
      }

      lint(fileLinter, enforce, regex, recursive, fix, debug, silent);
    } else {
      throw new Error("Failed assersions");
    }
  }

  return lintedDirectories;
};
