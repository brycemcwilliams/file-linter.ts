import fs from 'fs';

const FileLinter = require("./");

const fileLinter = new FileLinter();

describe("linter", () => {
  describe("lintDirectories", () => {
    test("withRecusriveOption_shouldReturnAllLintedFiles", () => {
      expect(fileLinter).toBeDefined();
      const files = fileLinter.lintDirectories(true);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            dirName: "src",
            files: expect.arrayContaining([
              expect.objectContaining({
                baseDir: "src",
                fileName: "index.ts",
                passed: true
              })
            ])
          })
        ])
      );
    });

    test("withoutRecusriveOption_shouldReturnAllLintedFiles", () => {
      expect(fileLinter).toBeDefined();
      const files = fileLinter.lintDirectories(false);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            dirName: "src",
            files: expect.arrayContaining([
              expect.objectContaining({
                baseDir: "src",
                fileName: "index.ts",
                passed: true
              })
            ])
          })
        ])
      );
    });

    test("withConfigPathSet_shouldReturnAllLintedFiles", () => {
      expect(fileLinter).toBeDefined();
      const files = fileLinter.lintDirectories(false);
      expect(files).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            dirName: "src",
            files: expect.arrayContaining([
              expect.objectContaining({
                baseDir: "src",
                fileName: "index.ts",
                passed: true
              })
            ])
          })
        ])
      );
    });
  });

  describe("fixDirectories", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(fileLinter).toBeDefined();
      const failingFileName = "ThisIsNotGood--FileName.js";
      const failingTestFile = `src/${failingFileName}`;
      fs.writeFileSync(failingTestFile, "hello");
      const files = fileLinter.lintDirectories(false);
      const fixedFiles = fileLinter.fixDirectories(files);
      expect(fixedFiles).toEqual([
        {
          absolutePath: failingTestFile,
          absoluteLintedPath: "src/thisIsNotGood-FileName.js"
        }
      ]);
      fs.unlinkSync(fixedFiles[0].absoluteLintedPath);
    });
  });

  describe("toCamelCase", () => {
    test("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(fileLinter).toBeDefined();
      const failingFileName = "ThisIsNotGood--FileName.js";
      const res = fileLinter.toCamelCase(failingFileName);
      expect(res).toEqual("thisIsNotGood-FileName.js");
    });
  });
});
