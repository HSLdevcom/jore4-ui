import React from 'react';
import { MapEditorContextProvider } from './MapEditor';
import { MapFilterContextProvider } from './MapFilter';
import { ModalMapContextProvider } from './ModalMapContextProvider';
import { UserContextProvider } from './UserContextProvider';

export const ContextProviders: React.FC = ({ children }) => {
  return (
    <UserContextProvider>
      <ModalMapContextProvider>
        <MapEditorContextProvider>
          <MapFilterContextProvider>{children}</MapFilterContextProvider>
        </MapEditorContextProvider>
      </ModalMapContextProvider>
    </UserContextProvider>
  );
};
