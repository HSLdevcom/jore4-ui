import { FC, useReducer } from 'react';
import { MapEditorContext } from './MapEditorContext';
import { initialState, mapEditorReducer } from './MapEditorReducer';

export const MapEditorContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(mapEditorReducer, initialState);

  return (
    <MapEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </MapEditorContext.Provider>
  );
};
