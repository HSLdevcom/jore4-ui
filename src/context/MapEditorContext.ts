import React from 'react';

export const MapEditorContext = React.createContext({
  hasRoute: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  setHasRoute: (_: boolean) => {},
});
