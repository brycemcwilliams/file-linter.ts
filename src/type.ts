export interface IFileLinter {
  lintDirectories(recursive: boolean): IFileLinterDirectory[];
  fixDirectories(directories: IFileLinterDirectory[]): IFileLinterFix[];
}

export interface IFileLinterRegex {
  [key: string]: string;
}

export interface IFileLinterConfig {
  regex: IFileLinterRegex;
}

export interface IFileLinterEffect {
  relativePath: string;
  dirPath: string[];
  baseDir: string;
  fileName: string;
  regexAssersion: string;
  passed: boolean;
}

export interface IFileLinterDirectory {
  dirName: string;
  files: IFileLinterEffect[];
}

export interface IFileLinterFix {
  relativePath: string;
  relativeLintPath: string;
}

export type TFileLinterProps = {
  configPath: string;
};

export type TFileLinterState = {
  isCLI: boolean;
  configPath: string;
  config: IFileLinterConfig;
};

export type TFileLinter = TFileLinterProps & TFileLinterState;
