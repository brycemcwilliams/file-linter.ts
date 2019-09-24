#!/usr/bin/env node
import chalk from 'chalk';
import fs from 'fs';
import yargs from 'yargs';

import FileLinter from './linter';
import { lint } from './util';

const pkg = require("../package.json");

const isCLI = require.main === module;

if (!isCLI) {
  module.exports = FileLinter;
} else {
  const fileLinter = new FileLinter();
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
