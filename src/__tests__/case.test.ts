describe("case", () => {
  const { camel, pascal, kebab } = require("../case");

  describe("camelCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(camel).toBeDefined();
      const failingFileName = "ThisIs-notGood fileName--.js";

      const res = camel(failingFileName);
      expect(res).toEqual("thisIsNotGoodFileName.js");
    });
  });

  describe("pascalCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(pascal).toBeDefined();
      const failingFileName = "thisIs-notGood fileName--.js";

      const res = pascal(failingFileName);
      expect(res).toEqual("ThisIsNotGoodFileName.js");
    });
  });

  describe("kebabCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(kebab).toBeDefined();
      const failingFileName = "thisIs-notGood fileName.js";

      const res = kebab(failingFileName);
      expect(res).toEqual("thisis-notgood-filename.js");
    });
  });
});
