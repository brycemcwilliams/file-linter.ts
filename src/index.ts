#!/usr/bin/env node
import chalk from 'chalk';
import yargs from 'yargs';

import FileLinter, { IDirectoryLintResult, IFileLintResult } from './linter';

const pkg = require("../package.json");

const fileLinter = new FileLinter();

export default FileLinter;

yargs
  .scriptName(pkg.name)
  .option("recursive", {
    alias: "r",
    type: "boolean",
    describe: "Recursively search for files",
    default: false
  })
  .option("fix", {
    alias: "f",
    type: "boolean",
    describe: "Fix failing files",
    default: false
  })
  .option("debug", {
    alias: "d",
    type: "boolean",
    describe: "Display JSON objects",
    default: false
  })
  .pkgConf(pkg.name)
  .config(fileLinter.state.config)
  .command(
    "$0",
    pkg.description,
    {},
    ({ regex, recursive, fix, debug }: any) => {
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
      console.log(
        chalk.green.bold(`${pkg.name} [v${pkg.version}](${process.cwd()}):\n`)
      );
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
              console.log(chalk.yellow.bold(`  ${currentDirPath}`));
            }
            if (passed === true) {
              totalPassed++;
              console.log(chalk.green(`    ${fileName} ✓`));
            } else {
              totalFailed++;
              console.log(
                chalk.red(
                  `    ${fileName} ✗ ${chalk.bgYellow(
                    chalk.black(`/${regexAssersion}/`)
                  )}`
                )
              );
            }
            previousDirPath = currentDirPath;
          }
        )
      );
      console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total}) ✓`));
      if (totalFailed > 0) {
        console.log(chalk.red.bold(`Failed: (${totalFailed}/${total}) ✗`));
        const fileInfoText = `file${totalFailed <= 1 ? "" : "s"}`;
        const fileInfo = chalk.green.bold(
          `Attempting to fix: ${totalFailed} ${fileInfoText}`
        );
        if (fix) {
          console.log(fileInfo);
          const fixedDirectories = fileLinter.fixDirectories(lintedDirectories);
          if (debug) console.log(JSON.stringify({ fixedDirectories }, null, 2));
          console.log(chalk.green.bold(`Successfully linted ${fileInfoText}`));
        } else {
          throw new Error("Failed assersions");
        }
      }
    }
  ).argv;
