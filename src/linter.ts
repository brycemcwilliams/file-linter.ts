import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';

import {
    IFileLinter, IFileLinterDirectory, IFileLinterEffect, IFileLinterFix, IFileLinterRegex,
    TFileLinter, TFileLinterState
} from './type';
import { print, toCamelCase } from './util';

export default class FileLinter<TFileLinter> implements IFileLinter {
  state: TFileLinterState = {
    isCLI: false,
    configPath: "",
    config: {
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
    this.state.config = this.state.configPath
      ? JSON.parse(fs.readFileSync(this.state.configPath).toString("utf8"))
      : this.state.config;
  }

  /**
   * @param  {boolean} recursive
   */
  lintDirectories = (recursive?: boolean) =>
    Object.keys(this.state.config.regex).map((dirName: string) => {
      return {
        dirName,
        files: globby
          .sync([dirName], {
            deep: recursive ? true : false
          })
          .map((file: string) => {
            const relativePath = file;
            const dirPath = file.split("/");
            const fileName = dirPath.pop() || "";
            const baseDir = dirPath.shift() || "";
            const regexAssersion = this.state.config.regex[dirName];
            const passed = fileName
              ? new RegExp(regexAssersion).test(fileName)
              : false;

            return {
              relativePath,
              dirPath,
              fileName,
              baseDir,
              regexAssersion,
              passed
            };
          })
      };
    });

  /**
   * @param  {IDirectory[]} directories
   */
  fixDirectories = (directories: IFileLinterDirectory[]) => {
    let fixedFiles: IFileLinterFix[] = [];

    directories.forEach(({ files }: IFileLinterDirectory) => {
      files
        .filter(({ passed }: IFileLinterEffect) => passed === false)
        .forEach(
          ({ fileName, relativePath, baseDir, dirPath }: IFileLinterEffect) => {
            // TODO: Allow for external rename function
            const lintedFileName = toCamelCase(fileName);
            const relativeLintPath = `${baseDir}/${
              dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
            }${lintedFileName}`;

            fs.renameSync(relativePath, relativeLintPath);

            fixedFiles.push({
              relativePath,
              relativeLintPath
            });
          }
        );
    });

    return fixedFiles;
  };
}
