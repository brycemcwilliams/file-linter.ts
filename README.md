# File Linter

[![NPM](https://nodei.co/npm/file-linter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-linter/)
</br>

[![Build Status](https://travis-ci.com/brycemcwilliams/file-linter.ts.svg?branch=master)](https://travis-ci.com/brycemcwilliams/file-linter.ts)
[![Total downloads](https://badgen.net/npm/dt/file-linter)](https://badgen.net/npm/dt/file-linter)
[![GZipped Size](https://badgen.net/bundlephobia/minzip/file-linter)](https://bundlephobia.com/result?p=file-linter)

Linter that helps keep Files consistent via Regex

## Help

```sh
file-linter --help
```

Available options:

```sh
--help           Show help                                           [boolean]
--version        Show version number                                 [boolean]
--recursive, -r  Recursively search for files       [boolean] [default: false]
--fix, -f        Fix failing files                  [boolean] [default: false]
--debug, -d      Display JSON objects               [boolean] [default: false]
--silent, -s     Hide all output                    [boolean] [default: false]
--watch, -w      Watch files for change             [boolean] [default: false]
```

## Usage

### Installation

Module || CLI

```sh
npm i file-linter
```

Globally (CLI)

```
npm i -g file-linter
```

Once off execution

```
npx file-linter
```

### Example:

```js
const fileLinter = require("file-linter");

const lintedDirectories = fileLinter.lintDirectories();

console.log({ lintedDirectories });
```

### For the brave

Always current recursive fix watch

```
npx file-linter -rfw
```
