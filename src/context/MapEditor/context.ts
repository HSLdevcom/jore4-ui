import React, { Dispatch } from 'react';
import { IMapEditorContext, initialState, MapEditorActions } from './reducer';

export const MapEditorContext = React.createContext<{
  state: IMapEditorContext;
  dispatch: Dispatch<{
    type: MapEditorActions;
    payload?: Partial<IMapEditorContext>;
  }>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
