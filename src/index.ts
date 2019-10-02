#!/usr/bin/env node

const chalk = require("chalk");
const fs = require("fs");
const yargs = require("yargs");

const FileLinter = require("./linter").default;
const { lint } = require("./util");

const pkg = require("../package.json");

const isCLI = require.main === module;
const fileLinter = new FileLinter(isCLI);

if (!isCLI) {
  module.exports = fileLinter;
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
        if (watch) {
          fs.watch(process.cwd(), (type: string, fileName: string) => {
            if (!silent) {
              console.log(chalk.yellow(`File: ${fileName} (${type})`));
            }
            lint(fileLinter, regex, recursive, fix, debug, silent);
          });
        } else {
          lint(fileLinter, regex, recursive, fix, debug, silent);
        }
      }
    ).argv;
}
