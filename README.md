# File Linter

[![Build Status](https://travis-ci.com/brycemcwilliams/file-linter.ts.svg?branch=master)](https://travis-ci.com/brycemcwilliams/file-linter.ts)
[![Latest Tag](https://badgen.net/github/tag/brycemcwilliams/file-linter.ts)](https://badgen.net/github/tag/brycemcwilliams/file-linter.ts)
[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Total downloads](https://badgen.net/npm/dt/file-linter)](https://badgen.net/npm/dt/file-linter)
[![GZipped Size](https://badgen.net/bundlephobia/minzip/file-linter)](https://bundlephobia.com/result?p=file-linter)
<br/>
[![NPM](https://nodei.co/npm/file-linter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-linter/)
<br/>

File System aware Linter that helps keep files consistent via regex.

## CLI Usage

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

## Module Usage

Installation:

```sh
npm i file-linter --save

# -- OR GLOBALLY --

npm i -g file-linter

# -- OR ONCE OFF --

npx file-linter
```

Example:

```js
const fileLinter = require("file-linter");

const lintedDirectories = fileLinter.lintDirectories();

console.log({ lintedDirectories });
```
