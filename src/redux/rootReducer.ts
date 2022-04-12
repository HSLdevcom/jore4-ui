import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { mapReducer } from './slices/map';
import { mapEditorReducer } from './slices/mapEditor';
import { modalMapReducer } from './slices/modalMap';
import { loginFailedAction, userReducer } from './slices/user';

const appReducer = combineReducers({
  map: mapReducer,
  mapEditor: mapEditorReducer,
  modalMap: modalMapReducer,
  user: userReducer,
});

export const rootReducer = (state: ExplicitAny, action: AnyAction) => {
  if (action.type === loginFailedAction.type) {
    // Setting state to undefined is correct way for resetting state:
    // https://stackoverflow.com/a/35641992
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action);
};
