/*
 * This file is for mapping regex value to predefined functions
 */

/**
 * @param  {string} fileName
 */
const camel = (fileName: string) =>
  fileName
    .replace(/^(.)/, (x: string) => x.toLowerCase())
    .replace(/\s(.)/g, (x: string) => x.toUpperCase())
    .replace(/\-(.)/g, (x: string) => x.toUpperCase())
    .replace(/\s/g, "")
    .replace(/\-/g, "");

/**
 * @param  {string} fileName
 */
const pascal = (fileName: string) =>
  fileName
    .replace(/^(.)/, (x: string) => x.toUpperCase())
    .replace(/\s(.)/g, (x: string) => x.toUpperCase())
    .replace(/\-(.)/g, (x: string) => x.toUpperCase())
    .replace(/\s/g, "")
    .replace(/\-/g, "");

/**
 * @param  {string} fileName
 */
const kebab = (fileName: string) => fileName.toLowerCase().replace(/\s/g, "-");

export default (selectedCase: string, fileName: string) => {
  switch (selectedCase) {
    case "camel": {
      return camel(fileName);
    }
    case "pascal": {
      return pascal(fileName);
    }
    case "kebab": {
      return kebab(fileName);
    }
    default: {
      return camel(fileName);
    }
  }
};
