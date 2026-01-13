import { KeyboardEventHandler, useEffect } from 'react';

export function doOnEscape<E extends HTMLElement>(
  callback: () => void,
): KeyboardEventHandler<E> {
  return (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      callback();
    }
  };
}

export const useCallbackOnKeyEscape = (callback: () => void) => {
  useEffect(() => {
    const onKeyEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        callback();
      }
    };

    document.addEventListener('keydown', onKeyEscape, true);

    return () => document.removeEventListener('keydown', onKeyEscape, true);
  }, [callback]);
};
