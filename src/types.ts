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
  fileName: string;
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
