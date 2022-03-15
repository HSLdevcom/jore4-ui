import React, { Dispatch } from 'react';
import {
  IMapFilterContext,
  initialState,
  MapFilterActions,
} from './MapFilterReducer';

export const MapFilterContext = React.createContext<{
  state: IMapFilterContext;
  dispatch: Dispatch<MapFilterActions>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
