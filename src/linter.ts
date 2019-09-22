import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';

export interface IFileLintRegex {
  [key: string]: string;
}

export interface IFileLintConfig {
  regex: IFileLintRegex;
}

export interface IFileLintResult {
  absolutePath: string;
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
  absolutePath: string;
  absoluteLintedPath: string;
}

export type TFileLinterProps = {
  configPath: string;
};

export type TFileLinterState = {
  configPath?: string;
  config: IFileLintConfig;
};

export type TFileLinter = TFileLinterProps & TFileLinterState;

export default class FileLinter<TFileLinter> {
  state: TFileLinterState = {
    configPath: "",
    config: {
      regex: {
        build: "(^([a-z]+?)([A-Z]?[a-zA-Z0-9]*)(\\.[a-z]{1,}){1,}$)",
        src: "(^([a-z]+?)([A-Z]?[a-zA-Z0-9]*)(\\.[a-z]{1,}){1,}$)"
      }
    }
  };

  constructor() {
    this.state.configPath = findUp.sync([
      ".file-linter",
      ".file-linter.json",
      "file-linter",
      "file-linter.json"
    ]);
    this.state.config = this.state.configPath
      ? JSON.parse(fs.readFileSync(this.state.configPath).toString("utf8"))
      : this.state.config;
  }

  /**
   * @param  {boolean} recursive
   */
  lintDirectories = (recursive: boolean) => {
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
            const absolutePath = file;
            const dirSegments = file.split("/");
            const baseDir = dirSegments.shift() || "";
            const fileName = dirSegments.pop() || "";
            const dirPath = dirSegments;
            const passed = fileName
              ? new RegExp(regexAssersion).test(fileName)
              : false;
            return {
              absolutePath,
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
    directories.forEach(({ files }: IDirectoryLintResult) => {
      files
        .filter(({ passed }: IFileLintResult) => passed === false)
        .forEach(
          ({ fileName, absolutePath, baseDir, dirPath }: IFileLintResult) => {
            const lowerCaseFirstLetter =
              fileName.charAt(0).toLowerCase() + fileName.slice(1);
            // TODO: Allow for external rename function
            const lintedFileName = lowerCaseFirstLetter
              .replace(new RegExp("-", "g"), "")
              .replace(new RegExp(" ", "g"), "");
            const absoluteLintedPath = `${baseDir}/${
              dirPath.length > 0 ? `${dirPath.join("/")}/` : ""
            }${lintedFileName}`;
            fs.renameSync(absolutePath, absoluteLintedPath);
            fixedDirectories.push({
              absolutePath,
              absoluteLintedPath
            });
          }
        );
    });
    return fixedDirectories;
  };
}
