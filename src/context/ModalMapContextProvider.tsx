import { FC, useReducer } from 'react';
import { ModalMapContext } from './ModalMapContext';
import { initialState, modalMapReducer } from './ModalMapReducer';

export const ModalMapContextProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(modalMapReducer, initialState);

  return (
    <ModalMapContext.Provider value={{ state, dispatch }}>
      {children}
    </ModalMapContext.Provider>
  );
};
