import fs from "fs";
import FileLinter from "../linter";

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
    test.only("withFailedFilename_shouldReturnCorrectlyLintedFilename", () => {
      expect(fileLinter).toBeDefined();
      const failingFileName = "ThisIsNotGood--FileName.js";
      const failingTestFile = `src/${failingFileName}`;

      fs.writeFileSync(failingTestFile, "hello");

      const files = fileLinter.lintDirectories();
      const fixedFiles = fileLinter.fixDirectories(files, "camel");

      expect(fixedFiles).toEqual([
        expect.objectContaining({
          dirName: "build",
          files: expect.arrayContaining([])
        }),
        expect.objectContaining({
          dirName: "src",
          files: expect.arrayContaining([
            expect.objectContaining({
              result: undefined,
              relativePath: failingTestFile
              // relativeLintPath: "src/thisIsNotGoodFileName.js"
            })
          ])
        })
      ]);

      if (fixedFiles[1]) {
        fs.unlinkSync(failingTestFile);
      }
    });
  });
});
