import { mapHttpToWs } from './url';

describe(`${mapHttpToWs.name}()`, () => {
  const testData = [
    ['http://my.url', 'ws://my.url'],
    ['https://my.url', 'wss://my.url'],
    ['invalid-protocol://my.url', 'invalid-protocol://my.url'],
    ['http://my.url.with.another.http://', 'ws://my.url.with.another.http://'],
  ];
  testData.forEach(([url, expectedResult]) => {
    test(`Should map "${url}" to "${expectedResult}"`, () => {
      expect(mapHttpToWs(url)).toBe(expectedResult);
    });
  });
});
