import FileLinter from '../src';

test("class does mount", () => {
  const fl = new FileLinter();
  console.log({ fl });
  expect(fl).toBeDefined();
});
