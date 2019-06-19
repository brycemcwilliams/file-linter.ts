#!/usr/bin/env node
"use strict";

import chalk from 'chalk';
import yargs from 'yargs';

import FileLinter, { DirectoryLintResult, FileLintResult } from './linter';

const pkg = require("../package.json");

const fileLinter = new FileLinter();

yargs
  .scriptName(pkg.name)
  .option("recursive", {
    alias: "r",
    type: "boolean",
    describe: "Recursively search for files",
    default: false
  })
  .pkgConf("file-linter")
  .config(fileLinter.state.config)
  .command("$0", pkg.description, {}, (argv: any) => {
    const { regex, recursive } = argv;
    if (!(typeof regex === "object")) {
      throw new TypeError("Regex values must be of type object");
    }
    const lintedDirectories: DirectoryLintResult[] = fileLinter.lintDirectories(
      recursive
    );
    console.log(chalk.green(`${pkg.name} [v${pkg.version}]:\n`));
    let total = 0;
    let totalPassed = 0;
    let totalFailed = 0;
    let previousDirPath = "";
    lintedDirectories.forEach(({ dirName, files }) => {
      files.forEach(
        ({ dirPath, fileName, regexAssersion, passed }: FileLintResult) => {
          total++;
          const currentDirPath = `${dirName}/${dirPath.join("/")}`;
          if (!(currentDirPath === previousDirPath)) {
            console.log(chalk.yellow(`  ${currentDirPath}`));
          }
          if (passed === true) {
            totalPassed++;
            console.log(chalk.green(`    ${fileName} ✓`));
          } else {
            totalFailed++;
            console.log(chalk.red(`    ${fileName} ✗ (${regexAssersion})`));
          }
          previousDirPath = currentDirPath;
        }
      );
    });
    console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total})`));
    if (totalFailed > 0) {
      console.log(chalk.red.bold(`Failed: (${totalFailed}/${total})`));
      throw new Error("Failed assersions");
    }
  }).argv;
