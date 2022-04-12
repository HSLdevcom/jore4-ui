import React from 'react';
import { MapFilterContextProvider } from './MapFilter';

export const ContextProviders: React.FC = ({ children }) => {
  return <MapFilterContextProvider>{children}</MapFilterContextProvider>;
};
