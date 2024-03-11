import { useEffect } from 'react';

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
