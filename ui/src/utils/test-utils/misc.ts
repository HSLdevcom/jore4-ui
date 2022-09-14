export const sleep = <T>(timeout: number) =>
  new Promise<T>((resolve) => setTimeout(resolve, timeout));

// mock the current date to be static
Date.now = jest.fn(() => 1487076708000);

// mock the lodash debounce module to call the function immediately
jest.mock('lodash/debounce', () => jest.fn((fn) => fn));
