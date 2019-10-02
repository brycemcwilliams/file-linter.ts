import fs from 'fs';

import FileLinter from '../linter';

describe("linter", () => {
  const fileLinter = new FileLinter();
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
      const files = fileLinter.lintDirectories();

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
      const files = fileLinter.lintDirectories();

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

      const files = fileLinter.lintDirectories();
      const fixedFiles = fileLinter.fixDirectories(files);

      expect(fixedFiles).toEqual([
        {
          relativePath: failingTestFile,
          relativeLintPath: "src/thisIsNotGood-FileName.js"
        }
      ]);

      fs.unlinkSync(fixedFiles[0].relativeLintPath);
    });
  });
});
