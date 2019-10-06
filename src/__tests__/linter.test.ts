describe("linter", () => {
  const fs = require("fs");
  const FileLinter = require("../linter");
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
              relativePath: failingTestFile,
              relativeLintPath: "src/thisIsNotGoodFileName.js"
            })
          ])
        })
      ]);

      fs.unlinkSync(fixedFiles[1].files[0].relativeLintPath);
    });
  });
});
