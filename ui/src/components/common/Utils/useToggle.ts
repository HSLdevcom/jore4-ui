import { useReducer } from 'react';

export function useToggle(initialState = false): [boolean, () => void] {
  const [state, toggle] = useReducer((s) => !s, initialState);
  return [state, toggle];
}
