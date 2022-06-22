import './i18n'; // workaround for ts error: 'example.spec.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.ts(1208)

describe('Example test suite', () => {
  test('Example test', () => {
    expect(1 + 2).toBe(3);
  });
  test('Example snapshot test', () => {
    expect(1 + 2).toMatchInlineSnapshot(`3`);
  });
});
