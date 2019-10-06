#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const yargs = require("yargs");

const FileLinter = require("./linter");
const { lint, resetCursor } = require("./util");

const pkg = require("../package.json");

const isCLI = require.main === module;
const fileLinter = new FileLinter(isCLI);

if (!isCLI) {
  module.exports = fileLinter;
} else {
  yargs
    .scriptName(pkg.name)
    .option("enforce", {
      alias: "e",
      type: "string",
      describe: "Filename function",
      default: "camel"
    })
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
      ({ regex, enforce, recursive, fix, debug, silent, watch }: any) => {
        if (watch) {
          resetCursor(debug, silent);

          fs.watch(
            process.cwd(),
            { recursive: recursive || false },
            (type: string, fileName: string) => {
              if (!silent) {
                console.log(chalk.yellow.bold(`File: ${fileName} (${type}) ⚠`));
              }

              resetCursor(debug, silent);
              lint(fileLinter, enforce, regex, recursive, fix, debug, silent);
            }
          );
        } else {
          lint(fileLinter, enforce, regex, recursive, fix, debug, silent);
        }
      }
    ).argv;
}
