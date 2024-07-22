// This needs to be registered trough proper import.
// jest.config.js setupFilesAfterEnv is no longer enough.
import '@testing-library/jest-dom';

// Will be needed for Headless UI V2
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
