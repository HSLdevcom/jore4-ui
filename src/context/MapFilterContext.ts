import React, { Dispatch } from 'react';
import {
  IMapFilterContext,
  initialState,
  MapFilterActions,
} from './MapFilterReducer';

export const MapFilterContext = React.createContext<{
  state: IMapFilterContext;
  dispatch: Dispatch<{
    type: MapFilterActions;
    payload?: Partial<IMapFilterContext>;
  }>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
