import { FC, useReducer } from 'react';
import { MapFilterContext } from './context';
import { initialState, mapFilterReducer } from './reducer';

export const MapFilterContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(mapFilterReducer, initialState);

  return (
    <MapFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </MapFilterContext.Provider>
  );
};
