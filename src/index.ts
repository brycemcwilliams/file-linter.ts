#!/usr/bin/env node
"use strict";

import chalk from 'chalk';
import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';
import yargs from 'yargs';

const pkg = require("../package.json");

export interface FileLintRegex {
  [key: string]: string[];
}

export interface FileLintConfig {
  regex: FileLintRegex;
}

export interface FileLintResult {
  dirPath: string[];
  baseDir?: string;
  fileName?: string;
  regexAssersion: string;
  passed: boolean;
}

export interface DirectoryLintResult {
  dirName: string;
  files: FileLintResult[];
}

type OwnFileLinterProps = {
  configPath: string;
};

type OwnFileLinterState = {
  configPath?: string;
  config: FileLintConfig;
};

export type FileLinterType = OwnFileLinterProps & OwnFileLinterState;

export default class FileLinter<FileLinterType> {
  state: OwnFileLinterState = {
    configPath: "",
    config: {
      regex: {
        src: ["(^([a-zA-Z0-9]+?[A-Z]?[a-z0-9]*)(\\.[a-z]{1,}){1,}$)"]
      }
    }
  };
  constructor(configPath?: string) {
    this.state.configPath =
      configPath ||
      findUp.sync([
        ".file-linter",
        ".file-linter.json",
        "file-linter",
        "file-linter.json"
      ]);
    this.state.config = this.state.configPath
      ? JSON.parse(fs.readFileSync(this.state.configPath).toString("utf8"))
      : this.state.config;
    yargs
      .option("recursive", {
        alias: "r",
        type: "boolean",
        describe: "Recursively search for files",
        default: false
      })
      .pkgConf("file-linter")
      .config(this.state.config)
      .command("$0", pkg.description, {}, (argv: any) => {
        const { regex, recursive } = argv;
        if (!(typeof regex === "object")) {
          throw new TypeError("Regex values must be of type object");
        }
        const lintedDirectories: DirectoryLintResult[] = Object.keys(regex).map(
          (dirName: string) => {
            const regexAssersion = regex[dirName];
            if (!(typeof (regexAssersion && dirName) === "string")) {
              throw new TypeError(
                "regexAssersion and dirName values must be of type string"
              );
            } else {
              return {
                dirName,
                files: globby
                  .sync([dirName], {
                    deep: recursive ? true : false
                  })
                  .map((file: string) => {
                    const dirSegments = file.split("/");
                    const baseDir = dirSegments.shift();
                    const fileName = dirSegments.pop();
                    const dirPath = dirSegments;
                    const passed = fileName
                      ? new RegExp(regexAssersion).test(fileName)
                      : false;
                    return {
                      fileName,
                      baseDir,
                      dirPath,
                      regexAssersion,
                      passed
                    };
                  })
              };
            }
          }
        );
        console.log(chalk.green(`${pkg.name} [v${pkg.version}]:\n`));
        let total = 0;
        let totalPassed = 0;
        let totalFailed = 0;
        lintedDirectories.forEach(({ dirName, files }) => {
          files.forEach(
            ({ dirPath, fileName, regexAssersion, passed }: FileLintResult) => {
              total++;
              console.log(
                chalk.yellow(
                  `  ${dirName}/${
                    dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
                  }`
                )
              );
              if (passed === true) {
                totalPassed++;
                console.log(chalk.green(`    ${fileName} ✓`));
              } else {
                totalFailed++;
                console.log(chalk.red(`    ${fileName} ✗ (${regexAssersion})`));
              }
            }
          );
        });
        console.log(chalk.green.bold(`\nPassed: (${totalPassed}/${total})`));
        if (totalFailed > 0) {
          console.log(chalk.red.bold(`Failed: (${totalFailed}/${total})`));
          throw new Error("Failed assersions");
        }
      }).argv;
  }
}

new FileLinter();
