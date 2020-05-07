import findUp from "find-up";
import fs from "fs";
import globby from "globby";

import {
  IFileLinter,
  IFileLinterDirectory,
  IFileLinterEffect,
  TFileLinter as _TFileLinter,
  TFileLinterState
} from "./type";

import toCase from "./case";

export default class FileLinter<_TFileLinter> implements IFileLinter {
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
  lintDirectories = (recursive?: boolean) => {
    return Object.keys(this.state.config.regex).map((dirName: string) => {
      return {
        dirName,
        files: globby
          .sync([dirName], {
            deep: recursive || false
          })
          .map((filePath: string) => {
            return {
              relativePath: filePath,
              dirPath: filePath.split("/")
            };
          })
          .map((props: Partial<IFileLinterEffect>) => {
            const cProps = Object.assign({}, props);
            return {
              ...props,
              fileName: props.dirPath
                ? cProps && cProps.dirPath && cProps.dirPath.pop()
                : "",
              baseDir: props.dirPath
                ? cProps && cProps.dirPath && cProps.dirPath.shift()
                : ""
            };
          })
          .map((props: Partial<IFileLinterEffect>) => {
            return {
              ...props,
              regexAssersion: this.state.config.regex[dirName]
            };
          })
          .map((props: Partial<IFileLinterEffect>) => {
            return {
              ...props,
              passed:
                props.fileName && props.regexAssersion
                  ? new RegExp(props.regexAssersion).test(props.fileName)
                  : false
            };
          })
      };
    });
  };

  /**
   * @param  {IFileLinterDirectory[]} directories
   * @param  {string} enforce?
   */
  fixDirectories = (directories: IFileLinterDirectory[], enforce?: string) => {
    return directories.map(({ files, dirName }: IFileLinterDirectory) => {
      return {
        dirName,
        files: files
          .filter(({ passed }: IFileLinterEffect) => passed === false)
          .map((props: IFileLinterEffect) => {
            return {
              ...props,
              lintedFileName: toCase(enforce || "camel", props.fileName || "")
            };
          })
          .map((props: IFileLinterEffect) => {
            return {
              ...props,
              relativeLintPath:
                props.dirPath && props.dirPath.length > 0
                  ? `${props.baseDir}/${props.dirPath.join("/")}/${
                      props.lintedFileName
                    }`
                  : undefined
            };
          })
          .map((props: IFileLinterEffect) => {
            return {
              ...props,
              result:
                props.relativePath && props.relativeLintPath
                  ? fs.renameSync(props.relativePath, props.relativeLintPath)
                  : undefined
            };
          })
      };
    });
  };
}
