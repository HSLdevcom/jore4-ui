import { fireEvent } from '@testing-library/react';

export function sleep<T>(timeout: number) {
  return new Promise<T>((resolve) => {
    setTimeout(resolve, timeout);
  });
}

// mock the current date to be static
Date.now = jest.fn(() => 1487076708000);

export function getAssertedElement<T>(obj: T | null | undefined): T {
  expect(obj).toBeDefined();
  return obj as T;
}

/**
 * Fire a full [mousedown, mouseup, click] event sequence
 *
 * Never versions of Headless UI will require the full,
 * complex mouse event sequence to work correctly.
 *
 * See the git commit, in which this was added for
 * further clarification.
 */
export function fireFullMouseClickSequence(
  element: Document | Element | Window | Node,
) {
  fireEvent.mouseDown(element);
  fireEvent.mouseUp(element);
  fireEvent.click(element);
}
