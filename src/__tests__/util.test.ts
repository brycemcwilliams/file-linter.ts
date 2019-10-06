describe("util", () => {
  const fileLinter = require("../");
  const { resetCursor, print, lint } = require("../util");

  describe("resetCursor", () => {
    test("withSilentAndNotDebug_shouldResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(false, false);
      expect(process.stdout.write).toHaveBeenCalledTimes(2);
    });

    test("withSilentAndDebug_shouldNotResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(false, true);
      expect(process.stdout.write).toHaveBeenCalledTimes(0);
    });

    test("withNotSilentAndDebug_shouldNotResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(true, true);
      expect(process.stdout.write).toHaveBeenCalledTimes(0);
    });
  });

  describe("print", () => {
    test("withValidMetaObject_shouldPrintToStandardOut", () => {
      console.log = jest.fn();
      print({ hello: "world" });
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ hello: "world" }, null, 2)
      );
    });
  });

  describe("lint", () => {
    test("withValidLinterAndDirectory_shouldReturnCorrectlyLintedDirectories", () => {
      const args = {
        enforce: "camel",
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
        args.enforce,
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
