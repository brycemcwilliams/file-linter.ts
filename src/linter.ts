const findUp = require("find-up");
const fs = require("fs");
const globby = require("globby");

import {
    IFileLinter, IFileLinterDirectory, IFileLinterEffect, IFileLinterRegex, TFileLinter,
    TFileLinterState
} from './type';

const toCase = require("./case");

module.exports = class FileLinter<TFileLinter> implements IFileLinter {
  state: TFileLinterState = {
    isCLI: false,
    configPath: "",
    config: {
      enforce: "camel",
      regex: {
        build: "^([a-z]+?)([\\w\\-]+?)(\\.[\\w]{1,}){1,}$",
        src: "^([a-z]+?)([\\w\\-]+?)(\\.[\\w]{1,}){1,}$"
      }
    }
  };

  constructor(isCLI?: boolean) {
    this.state.isCLI = isCLI || false;
    this.state.configPath =
      findUp.sync([
        ".file-linter",
        ".file-linter.json",
        "file-linter",
        "file-linter.json"
      ]) || "";
    this.state.config =
      JSON.parse(fs.readFileSync(this.state.configPath).toString("utf8")) ||
      this.state.config;
  }

  /**
   * @param  {boolean} recursive
   */
  lintDirectories = (recursive?: boolean) =>
    Object.keys(this.state.config.regex).map((dirName: string) => ({
      dirName,
      files: globby
        .sync([dirName], {
          deep: recursive || false
        })
        .map((filePath: string) => ({
          relativePath: filePath,
          dirPath: filePath.split("/")
        }))
        .map((props: IFileLinterEffect) => ({
          ...props,
          fileName: props.dirPath.pop() || "",
          baseDir: props.dirPath.shift() || ""
        }))
        .map((props: IFileLinterEffect) => ({
          ...props,
          regexAssersion: this.state.config.regex[dirName]
        }))
        .map((props: IFileLinterEffect) => ({
          ...props,
          passed: props.fileName
            ? new RegExp(props.regexAssersion).test(props.fileName)
            : false
        }))
    }));

  /**
   * @param  {IFileLinterDirectory[]} directories
   * @param  {string} enforce?
   */
  fixDirectories = (directories: IFileLinterDirectory[], enforce?: string) =>
    directories.map(({ files, dirName }: IFileLinterDirectory) => ({
      dirName,
      files: files
        .filter(({ passed }: IFileLinterEffect) => passed === false)
        .map((props: IFileLinterEffect) => ({
          ...props,
          lintedFileName: toCase[enforce || "camel"](props.fileName)
        }))
        .map((props: IFileLinterEffect) => ({
          ...props,
          relativeLintPath: `${props.baseDir}/${
            props.dirPath.length > 0 ? `${props.dirPath.join("/")}/` : ""
          }${props.lintedFileName}`
        }))
        .map((props: IFileLinterEffect) => ({
          ...props,
          result: fs.renameSync(props.relativePath, props.relativeLintPath)
        }))
    }));
};
