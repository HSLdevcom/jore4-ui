import React from 'react';
import { MapEditorContextProvider } from './MapEditor';
import { MapFilterContextProvider } from './MapFilter';
import { UserContextProvider } from './UserContextProvider';

export const ContextProviders: React.FC = ({ children }) => {
  return (
    <UserContextProvider>
      <MapEditorContextProvider>
        <MapFilterContextProvider>{children}</MapFilterContextProvider>
      </MapEditorContextProvider>
    </UserContextProvider>
  );
};
