// This is lazily typed (not really typed at all)
// as this will be replaced with proper selectors in the close future
// TODO: Use state management library's selectors
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, useContext } from 'react';

export function useContextStateSelector<T>(
  context: Context<any>,
  selectorFunction: (state: any) => T,
) {
  const { state } = useContext(context);

  return selectorFunction(state);
}
