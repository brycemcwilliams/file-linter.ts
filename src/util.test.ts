import { toCamelCase } from './util';

describe("util", () => {
  describe("toCamelCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(toCamelCase).toBeDefined();
      const failingFileName = "ThisIsNotGood--FileName.js";
      const res = toCamelCase(failingFileName);
      expect(res).toEqual("thisIsNotGood-FileName.js");
    });
  });
});
