import { FC, useReducer } from 'react';
import { MapFilterContext } from './MapFilterContext';
import { initialState, mapFilterReducer } from './MapFilterReducer';

export const MapFilterContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(mapFilterReducer, initialState);

  return (
    <MapFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </MapFilterContext.Provider>
  );
};
