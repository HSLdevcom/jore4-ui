import React from 'react';
import { MapEditorContextProvider } from './MapEditor';
import { MapFilterContextProvider } from './MapFilter';

export const ContextProviders: React.FC = ({ children }) => {
  return (
    <MapEditorContextProvider>
      <MapFilterContextProvider>{children}</MapFilterContextProvider>
    </MapEditorContextProvider>
  );
};
