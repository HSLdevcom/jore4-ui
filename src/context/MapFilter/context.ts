import React, { Dispatch } from 'react';
import { initialState } from './reducer';
import { IMapFilterContext, MapFilterActions } from './types';

export const MapFilterContext = React.createContext<{
  state: IMapFilterContext;
  dispatch: Dispatch<MapFilterActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
