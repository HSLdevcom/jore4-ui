import React, { Dispatch } from 'react';
import {
  IModalMapContext,
  initialState,
  ModalMapActions,
} from './ModalMapReducer';

export const ModalMapContext = React.createContext<{
  state: IModalMapContext;
  dispatch: Dispatch<{
    type: ModalMapActions;
    payload?: Partial<IModalMapContext>;
  }>;
}>({
  state: initialState,
  dispatch: () => undefined,
});
