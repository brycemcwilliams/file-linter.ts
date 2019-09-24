# File Linter

[![Build Status](https://travis-ci.com/brycemcwilliams/file-linter.ts.svg?branch=master)](https://travis-ci.com/brycemcwilliams/file-linter.ts)
[![GZipped Size](https://badgen.net/bundlephobia/minzip/file-linter)](https://bundlephobia.com/result?p=file-linter)
[![NPM](https://nodei.co/npm/file-linter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/file-linter/)

A Simple File Linter that helps your project filenames conform to a predetermined regex pattern.

## CLI Usage

Run the following commands in your terminal emulator;

Default config:

```
npx file-linter
```

Help:

```
npx file-linter --help
```

Recursive fix:

```
npx file-linter -rf
```

Watch for changes:

```
npx file-linter -w
```

Silent:

```
npx file-linter -s
```

JSON output:

```
npx file-linter -j
```

## Module Usage

Install the module:

```
npm i file-linter
```

Code example:

```
const FileLinter = require('file-linter');

const fileLinter = new FileLinter();

const lintedFiles = fileLinter.lintDirectories(true);

console.log({ lintedFiles });
```
