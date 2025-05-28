// This needs to be registered trough proper import.
// jest.config.js setupFilesAfterEnv is no longer enough.
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'node:util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

// Will be needed for Headless UI V2
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
