#!/usr/bin/env node
"use strict";

import chalk from 'chalk';
import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';
import yargs from 'yargs';

const pkg = require("../package.json");

interface FileLintRegex {
  [key: string]: string[];
}

interface FileLintConfig {
  regex: FileLintRegex;
}

interface FileLintResult {
  fileName: string;
  regexAssersion: string;
  passed: boolean;
}

interface DirectoryLintResult {
  dirName: string;
  results: FileLintResult[];
}

const configPath = findUp.sync([
  ".file-linter",
  ".file-linter.json",
  "file-linter",
  "file-linter.json"
]);

const config: FileLintConfig = configPath
  ? JSON.parse(fs.readFileSync(configPath).toString("utf8"))
  : {};

const displayTotalAssersionResults = (
  lintedDirectories: DirectoryLintResult[]
) => {
  let total = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  lintedDirectories.filter(({ results }: DirectoryLintResult) => {
    results.map(({ passed }: FileLintResult) => {
      total++;
      if (passed === true) {
        totalPassed++;
      } else {
        totalFailed++;
      }
    });
  });
  console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total})`));
  if (totalFailed > 0) {
    console.log(chalk.red.bold(`Failed: (${totalFailed}/${total})`));
    process.exit(1);
  }
  process.exit(0);
};

yargs
  .option("recursive", {
    alias: "r",
    type: "boolean",
    describe: "Recursively search for files",
    default: false
  })
  .pkgConf("file-linter")
  .config(config)
  .command("$0", pkg.description, {}, (argv: any) => {
    const { regex, recursive } = argv;
    if (!(typeof regex === "object")) {
      throw new TypeError("Regex values must be of type object");
    }
    const lintedDirectories = Object.keys(regex).map((dirName: string) => {
      const regexAssersion = regex[dirName];
      if (!(typeof (regexAssersion && dirName) === "string")) {
        throw new TypeError(
          "regexAssersion and dirName values must be of type string"
        );
      }
      const filesToLint = globby.sync([dirName], {
        deep: recursive ? true : false
      });
      const results = filesToLint.map((file: string) => {
        const dirSegments = file.split("/");
        const fileName = dirSegments[dirSegments.length - 1];
        const passed = new RegExp(regexAssersion).test(fileName);
        return {
          fileName,
          regexAssersion,
          passed
        };
      });
      return {
        dirName,
        results
      };
    });
    console.log(chalk.green(`${pkg.name} [v${pkg.version}]:\n`));
    lintedDirectories.forEach(({ dirName, results }: DirectoryLintResult) => {
      console.log(chalk.yellow(`  ${dirName}/`));
      results.forEach(
        ({ fileName, regexAssersion, passed }: FileLintResult) => {
          console.log(
            passed
              ? chalk.green(`    ${fileName} ✓`)
              : chalk.red(`    ${fileName} ✗ (${regexAssersion})`)
          );
        }
      );
    });
    displayTotalAssersionResults(lintedDirectories);
  }).argv;
