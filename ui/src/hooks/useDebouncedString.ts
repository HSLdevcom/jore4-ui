import debounce from 'lodash/debounce';
import { useEffect, useMemo, useState } from 'react';

/**
 * Takes string as input, debounces and returns it after given delay
 */
export const useDebouncedString = (string: string, delay: number) => {
  const [debouncedString, setDebouncedString] = useState('');
  const debouncedSetString = useMemo(
    () => debounce(setDebouncedString, delay),
    [delay],
  );

  useEffect(() => {
    debouncedSetString(string);
  }, [debouncedSetString, string]);

  return [debouncedString];
};
