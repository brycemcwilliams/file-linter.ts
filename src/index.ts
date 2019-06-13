#!/usr/bin/env node
"use strict";

const findUp = require("find-up");
import fs from 'fs';

const chalk = require("chalk");
const globby = require("globby");

const pkg = require("../package.json");

interface FileLintRegex {
  [key: string]: string[];
}

interface FileLintConfig {
  regex: FileLintRegex;
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

const displayTotalAssersionResults = (res: any) => {
  let totalPassed = 0;
  let totalFailed = 0;
  let total = 0;
  res.filter(({ dirName, results }: any) => {
    results.map(({ fileName, regexAssersion, passed }: any) => {
      total++;
    });
  });
  res.filter(({ dirName, results }: any) => {
    results.map(({ fileName, regexAssersion, passed }: any) => {
      if (passed === true) {
        totalPassed++;
      }
    });
  });
  res.filter(({ dirName, results }: any) => {
    results.map(({ fileName, regexAssersion, passed }: any) => {
      if (passed === false) {
        totalPassed--;
      }
    });
  });
  console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total})`));
  if (totalFailed > 0) {
    console.log(chalk.red.bold(`Failed: (${totalFailed}/${total})`));
    throw new Error("Files failed assersion");
  }
};

require("yargs")
  .option("recursive", {
    alias: "r",
    default: false
  })
  .pkgConf("file-linter")
  .config(config)
  .command(
    "$0",
    "the default command",
    () => {},
    (argv: any) => {
      const { regex, recursive } = argv;
      if (!(typeof regex === "object")) {
        throw new TypeError("Regex values must be of type object");
      }
      const res = Object.keys(regex).map((dirName: string) => {
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
          const lintResPassed = new RegExp(regexAssersion).test(
            file.split("/")[1]
          );
          return {
            fileName: file.split("/")[1],
            regexAssersion,
            passed: lintResPassed
          };
        });
        return {
          dirName,
          results
        };
      });
      console.log(chalk.green(`${pkg.name} [v${pkg.version}]:\n`));
      res.forEach(({ dirName, results }: any) => {
        console.log(chalk.yellow(`  ${dirName}/`));
        results.forEach(({ fileName, regexAssersion, passed }: any) => {
          console.log(
            passed
              ? chalk.green(`    ${fileName} ✓`)
              : chalk.red(`    ${fileName} ✗ (${regexAssersion})`)
          );
        });
      });
      displayTotalAssersionResults(res);
    }
  ).argv;
