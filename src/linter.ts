import findUp from 'find-up';
import fs from 'fs';
import globby from 'globby';
import cpy from 'cpy';

export interface FileLintRegex {
  [key: string]: string;
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

type FileLinterProps = {
  configPath: string;
};

type FileLinterState = {
  configPath?: string;
  config: FileLintConfig;
};

export type FileLinterType = FileLinterProps & FileLinterState;

export default class FileLinter<FileLinterType> {
  state: FileLinterState = {
    configPath: "",
    config: {
      regex: {
        src: "(^([a-zA-Z0-9]+?[A-Z]?[a-z0-9]*)(\\.[a-z]{1,}){1,}$)"
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
    });
  };
  fixDirectories = (files: string[]) => {
    return files.map((file) => {
      return cpy(file, file, {
        rename: basename => basename,
      })
    })
  };
}
