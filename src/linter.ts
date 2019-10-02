import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';

import { toCamelCase } from './util';

export interface IFileLinter {
  lintDirectories(recursive: boolean): IDirectoryLintResult[];
  fixDirectories(directories: IDirectoryLintResult[]): IFixedDirectoryLint[];
}

export interface IFileLintRegex {
  [key: string]: string;
}

export interface IFileLintConfig {
  regex: IFileLintRegex;
}

export interface IFileLintResult {
  relativePath: string;
  dirPath: string[];
  baseDir: string;
  fileName: string;
  regexAssersion: string;
  passed: boolean;
}

export interface IDirectoryLintResult {
  dirName: string;
  files: IFileLintResult[];
}

export interface IFixedDirectoryLint {
  relativePath: string;
  relativeLintPath: string;
}

export type TFileLinterProps = {
  configPath: string;
};

export type TFileLinterState = {
  isCLI: boolean;
  configPath: string;
  config: IFileLintConfig;
};

export type TFileLinter = TFileLinterProps & TFileLinterState;

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
    this.state.isCLI = isCLI ? true : false;
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
  lintDirectories = (recursive?: boolean) => {
    const { regex } = this.state.config;
    return Object.keys(regex).map((dirName: string) => {
      const regexAssersion = regex[dirName];
      return {
        dirName,
        files: globby
          .sync([dirName], {
            deep: recursive ? true : false
          })
          .map((file: string) => {
            const relativePath = file;
            const dirSegments = file.split("/");
            const baseDir = dirSegments.shift() || "";
            const fileName = dirSegments.pop() || "";
            const dirPath = dirSegments;
            const passed = fileName
              ? new RegExp(regexAssersion).test(fileName)
              : false;
            return {
              relativePath,
              fileName,
              baseDir,
              dirPath,
              regexAssersion,
              passed
            };
          })
      };
    });
  };

  /**
   * @param  {IDirectoryLintResult[]} directories
   */
  fixDirectories = (directories: IDirectoryLintResult[]) => {
    let fixedDirectories: IFixedDirectoryLint[] = [];
    directories.map(({ files }: IDirectoryLintResult) => {
      files
        .filter(({ passed }: IFileLintResult) => passed === false)
        .map(
          ({ fileName, relativePath, baseDir, dirPath }: IFileLintResult) => {
            // TODO: Allow for external rename function
            const lintedFileName = toCamelCase(fileName);
            const relativeLintPath = `${baseDir}/${
              dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
            }${lintedFileName}`;
            fs.renameSync(relativePath, relativeLintPath);
            fixedDirectories.push({
              relativePath,
              relativeLintPath
            });
          }
        );
    });
    return fixedDirectories;
  };
}
