// This needs to be registered trough proper import.
// jest.config.js setupFilesAfterEnv is no longer enough.
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import {
  configMocks,
  mockAnimationsApi,
  mockResizeObserver,
} from 'jsdom-testing-mocks';
import 'cross-fetch/polyfill';

import { TextEncoder, TextDecoder } from 'node:util';

if (!global.TextEncoder) {
  global.TextEncoder = TextEncoder;
}

if (!global.TextDecoder) {
  // @ts-ignore
  global.TextDecoder = TextDecoder;
}

configMocks({ act });

mockAnimationsApi();
mockResizeObserver();

// Latest version of Apollo 3 introduced some warning messages about deprecated
// features. We are no longer relying on any of those features, but the implementation
// of the warnings is not the best, and we still get spam in console logs when
// running the unit tests.
// @ts-ignore
global[Symbol.for('apollo.deprecations')] = true;
