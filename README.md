# File Linter

[![Build Status](https://travis-ci.com/brycemcwilliams/file-linter.ts.svg?branch=master)](https://travis-ci.com/brycemcwilliams/file-linter.ts)
[![TypeScript](https://badgen.net/badge/icon/typescript?icon=typescript&label)](https://badgen.net/badge/icon/typescript?icon=typescript&label)
[![Total downloads](https://badgen.net/npm/dt/file-linter)](https://badgen.net/npm/dt/file-linter)
[![GZipped Size](https://badgen.net/bundlephobia/minzip/file-linter)](https://bundlephobia.com/result?p=file-linter)
<br/>
[![NPM](https://nodei.co/npm/file-linter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-linter/)

A simple file linter that helps keep filenames consistent via regex.

## CLI Usage

Run the following commands in your terminal emulator;

Default config:

```sh
npx file-linter
```

Help:

```sh
npx file-linter --help
```

Recursive fix:

```sh
npx file-linter -rf
```

Watch for changes:

```sh
npx file-linter -w
```

Silent:

```sh
npx file-linter -s
```

JSON output:

```sh
npx file-linter -j
```

## Module Usage

Install the module:

```sh
npm i file-linter
```

Code example:

```js
const FileLinter = require("file-linter");

const fileLinter = new FileLinter();

const lintedFiles = fileLinter.lintDirectories();

console.log({ lintedFiles });
```
