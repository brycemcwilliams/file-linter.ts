export interface IFileLinter {
  lintDirectories(recursive: boolean): IFileLinterDirectory[];
  fixDirectories(
    directories: IFileLinterDirectory[],
    enforce?: string
  ): IFileLinterDirectoryFix[];
}

export type Metadata = { [key: string]: object };

export interface IFileLinterRegex {
  [key: string]: string;
}

export interface IFileLinterConfig {
  enforce: string;
  regex: IFileLinterRegex;
}

export interface IFileLinterEffect {
  relativePath: string;
  dirPath: string[];
  baseDir: string;
  fileName: string;
  regexAssersion: string;
  passed: boolean;
  relativeLintPath: string;
  lintedFileName: string;
}

export interface IFileLinterDirectory {
  dirName: string;
  files: IFileLinterEffect[];
}

export interface IFileLinterDirectoryFix {
  dirName: string;
  files: IFileLinterFix[];
}

export interface IFileLinterFix {
  result: any;
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
