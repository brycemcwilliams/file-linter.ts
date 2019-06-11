#!/usr/bin/env node
"use strict";

const findUp = require("find-up");
const fs = require("fs");
const _ = require("lodash");
const chalk = require("chalk");
const globby = require("globby");
const path = require("path");

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
  ? JSON.parse(fs.readFileSync(configPath))
  : {};

const argv = require("yargs")
  .pkgConf("file-lint")
  .config(config)
  .command(
    "$0",
    "the default command",
    (res: any) => {},
    (argv: any) => {
      const { regex } = argv;
      _.mapKeys(regex, async (regexAssersion: string, dirName: string) => {
        console.log(chalk.green(dirName));
        console.log(chalk.green(regexAssersion));
        console.log(chalk.green(__dirname));
        console.log(chalk.green(__filename));
        const rec = true;
        const filesToLint = await globby([dirName], {
          deep: rec ? true : false
        });
        console.log({ filesToLint });
        const lintResPassed = new RegExp(regexAssersion).test(
          filesToLint[0].split("/")[1]
        );
        console.log({ lintResPassed });
      });
      console.log(chalk.green("this command will be run by default"));
    }
  ).argv;
