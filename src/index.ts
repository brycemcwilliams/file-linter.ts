#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs';
import yargs from 'yargs';

import FileLinter, { IDirectoryLintResult, IFileLintResult } from './linter';

const pkg = require("../package.json");

const fileLinter = new FileLinter();

const isCLI = require.main === module;

if (!isCLI) {
  module.exports = FileLinter;
} else {
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
    .option("silent", {
      alias: "s",
      type: "boolean",
      describe: "Hide all output",
      default: false
    })
    .option("watch", {
      alias: "w",
      type: "boolean",
      describe: "Watch files for change",
      default: false
    })
    .pkgConf(pkg.name)
    .config(fileLinter.state.config)
    .command(
      "$0",
      pkg.description,
      {},
      ({ regex, recursive, fix, debug, silent, watch }: any) => {
        const lint = () => {
          if (debug) {
            console.log(
              JSON.stringify({ regex, recursive, fix, debug }, null, 2)
            );
          }
          if (!(typeof regex === "object")) {
            throw new TypeError("Regex values must be of type object");
          }
          const lintedDirectories: IDirectoryLintResult[] = fileLinter.lintDirectories(
            recursive
          );
          if (debug)
            console.log(JSON.stringify({ lintedDirectories }, null, 2));
          if (!silent) {
            console.log(
              chalk.green.bold(
                `${pkg.name} [v${pkg.version}](${process.cwd()}):\n`
              )
            );
          }
          let total = 0;
          let totalPassed = 0;
          let totalFailed = 0;
          let previousDirPath = "";
          lintedDirectories.forEach(
            ({ dirName, files }: IDirectoryLintResult) =>
              files.forEach(
                ({
                  dirPath,
                  fileName,
                  regexAssersion,
                  passed
                }: IFileLintResult) => {
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
            console.log(
              chalk.green.bold(`\nPassed: (${totalPassed}/${total}) ✓`)
            );
          }
          if (totalFailed > 0) {
            if (!silent) {
              console.log(
                chalk.red.bold(`Failed: (${totalFailed}/${total}) ✗`)
              );
            }
            const fileInfoText = `file${totalFailed <= 1 ? "" : "s"}`;
            const fileInfo = chalk.green.bold(
              `Attempting to fix: ${totalFailed} ${fileInfoText}`
            );
            if (fix) {
              if (!silent) console.log(fileInfo);
              const fixedDirectories = fileLinter.fixDirectories(
                lintedDirectories
              );
              if (debug) {
                console.log(JSON.stringify({ fixedDirectories }, null, 2));
              }
              if (!silent) {
                console.log(
                  chalk.green.bold(`Successfully linted ${fileInfoText}`)
                );
              }
            } else {
              throw new Error("Failed assersions");
            }
          }
        };
        if (watch) {
          fs.watch(process.cwd(), (type, fileName) => {
            console.log(chalk.yellow(`File: ${fileName} (${type})`));
            lint();
          });
        } else {
          lint();
        }
      }
    ).argv;
}
