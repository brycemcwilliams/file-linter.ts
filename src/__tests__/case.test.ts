import toCase from "../case";

describe("case", () => {
  describe("camelCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(toCase).toBeDefined();
      const failingFileName = "ThisIs-notGood fileName--.js";

      const res = toCase("camel", failingFileName);
      expect(res).toEqual("thisIsNotGoodFileName.js");
    });
  });

  describe("pascalCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(toCase).toBeDefined();
      const failingFileName = "thisIs-notGood fileName--.js";

      const res = toCase("pascal", failingFileName);
      expect(res).toEqual("ThisIsNotGoodFileName.js");
    });
  });

  describe("kebabCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(toCase).toBeDefined();
      const failingFileName = "thisIs-notGood fileName.js";

      const res = toCase("kebab", failingFileName);
      expect(res).toEqual("thisis-notgood-filename.js");
    });
  });
});
