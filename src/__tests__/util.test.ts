import * as fileLinter from "../";
import { resetCursor, print, lint } from "../util";

describe("util", () => {
  describe("resetCursor", () => {
    test("withSilentAndNotDebug_shouldResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(false);
      expect(process.stdout.write).toHaveBeenCalledTimes(2);
    });

    test("withSilentAndDebug_shouldNotResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(true);
      expect(process.stdout.write).toHaveBeenCalledTimes(0);
    });

    test("withNotSilentAndDebug_shouldNotResetCursor", () => {
      process.stdout.write = jest.fn();
      resetCursor(true);
      expect(process.stdout.write).toHaveBeenCalledTimes(0);
    });
  });

  describe("print", () => {
    test("withValidMetaObject_shouldPrintToStandardOut", () => {
      console.log = jest.fn();
      print({ hello: { a: 1 } });
      expect(console.log).toHaveBeenCalledTimes(1);
      expect(console.log).toHaveBeenCalledWith(
        JSON.stringify({ hello: { a: 1 } }, null, 2)
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

      expect(() => {
        lint(
          fileLinter,
          args.enforce,
          args.regex,
          args.recursive,
          args.fix,
          args.debug,
          args.silent
        );
      }).toEqual(expect.arrayContaining([]));
    });
  });
});
