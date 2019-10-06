/*
 * This file is for mapping regex value to predefined functions
 */

/**
 * @param  {string} fileName
 */
export const camel = (fileName: string) =>
  fileName
    .replace(/^(.)/, (x: string) => x.toLowerCase())
    .replace(/\s(.)/g, (x: string) => x.toUpperCase())
    .replace(/\-(.)/g, (x: string) => x.toUpperCase())
    .replace(/\s/g, "")
    .replace(/\-/g, "");

/**
 * @param  {string} fileName
 */
export const pascal = (fileName: string) =>
  fileName
    .replace(/^(.)/, (x: string) => x.toUpperCase())
    .replace(/\s(.)/g, (x: string) => x.toUpperCase())
    .replace(/\-(.)/g, (x: string) => x.toUpperCase())
    .replace(/\s/g, "")
    .replace(/\-/g, "");

/**
 * @param  {string} fileName
 */
export const kebab = (fileName: string) =>
  fileName.toLowerCase().replace(/\s/g, "-");
