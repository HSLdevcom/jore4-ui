import { useState } from 'react';

export const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = () => setState((value) => !value);
  return [state, toggle];
};
