import FileLinter from './linter';

const fileLinter = new FileLinter();

describe("linter", () => {
  test("lintDirectories_withRecusriveOption_returnsAllLintedFiles", () => {
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
  test("lintDirectories_withoutRecusriveOption_returnsAllLintedFiles", () => {
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
  test("lintDirectories_withConfigPathSet_returnsAllLintedFiles", () => {
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
