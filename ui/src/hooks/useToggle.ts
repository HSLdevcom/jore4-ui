import { useReducer } from 'react';

export const useToggle = (initialState = false): [boolean, () => void] => {
  const [state, toggle] = useReducer((s) => !s, initialState);
  return [state, toggle];
};
