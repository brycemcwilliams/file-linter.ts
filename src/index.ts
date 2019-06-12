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
  ".file-lint",
  ".file-lint.json",
  ".file-lintrc",
  ".file-lintrc.json",
  "file-lint",
  "file-lint.json",
  "file-lintrc",
  "file-lintrc.json"
]);

const config: FileLintConfig = configPath
  ? JSON.parse(fs.readFileSync(configPath).toString("utf8"))
  : {};

require("yargs")
  .option("recursive", {
    alias: "r",
    default: false
  })
  .pkgConf("file-lint")
  .config(config)
  .command(
    "$0",
    "the default command",
    (res: any) => {},
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
            passed: lintResPassed
          };
        });
        return {
          dirName,
          results
        };
      });
      console.log(chalk.green(`file-lint [v${pkg.version}]:\n`));
      res.forEach(({ dirName, results }: any) => {
        console.log(chalk.yellow(`${dirName}/`));
        results.forEach(({ fileName, passed }: any) => {
          console.log(chalk.green(`  ${fileName} ${passed ? "✓" : "✗"}`));
        });
      });
    }
  ).argv;
