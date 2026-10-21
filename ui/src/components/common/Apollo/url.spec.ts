import { mapHttpToWs } from './url';

describe(`${mapHttpToWs.name}()`, () => {
  const testData = [
    ['http://my.url', 'ws://my.url'],
    ['https://my.url', 'wss://my.url'],
  ];
  testData.forEach(([url, expectedResult]) => {
    test(`Should map "${url}" to "${expectedResult}"`, () => {
      expect(mapHttpToWs(url)).toBe(expectedResult);
    });
  });

  test('Should throw on invalid protocol', () => {
    expect(() => mapHttpToWs('file:///test/index.html')).toThrow(
      'Expected url to have protocol of http: or https: but was file:',
    );
  });
});
