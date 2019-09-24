# File Linter

[![Build Status](https://travis-ci.com/brycemcwilliams/file-linter.ts.svg?branch=master)](https://travis-ci.com/brycemcwilliams/file-linter.ts)
[![GZipped Size](https://badgen.net/bundlephobia/minzip/file-linter)](https://bundlephobia.com/result?p=file-linter)
<br/>
[![NPM](https://nodei.co/npm/file-linter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-linter/)

A Simple File Linter that helps your project filenames conform to a predetermined regex pattern.

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
const FileLinter = require('file-linter');

const fileLinter = new FileLinter();

const lintedFiles = fileLinter.lintDirectories(true);

console.log({ lintedFiles });
```
