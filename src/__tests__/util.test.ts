const fileLinter = require("../");
import { lint, toCamelCase } from '../util';

describe("util", () => {
  describe("toCamelCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(toCamelCase).toBeDefined();
      const failingFileName = "ThisIsNotGood--FileName.js";

      const res = toCamelCase(failingFileName);
      expect(res).toEqual("thisIsNotGood-FileName.js");
    });
  });
  describe("lint", () => {
    test("withValidLinterAndDirectory_shouldReturnCorrectlyLintedDirectories", () => {
      const args = {
        regex: {
          build: "^([a-z]+?)([\\w\\-]+?)(\\.[\\w]{1,}){1,}$",
          src: "^([a-z]+?)([\\w\\-]+?)(\\.[\\w]{1,}){1,}$"
        },
        recursive: false,
        fix: false,
        debug: true,
        silent: true
      };

      const res = lint(
        fileLinter,
        args.regex,
        args.recursive,
        args.fix,
        args.debug,
        args.silent
      );

      expect(res).toEqual(
        expect.arrayContaining([expect.objectContaining({ dirName: "src" })])
      );
    });
  });
});
