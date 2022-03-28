import { FC, useReducer } from 'react';
import { MapEditorContext } from './context';
import { initialState, mapEditorReducer } from './reducer';

export const MapEditorContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(mapEditorReducer, initialState);

  return (
    <MapEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </MapEditorContext.Provider>
  );
};
