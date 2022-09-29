import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { exportReducer } from './slices/export';
import { loaderReducer } from './slices/loader';
import { mapReducer } from './slices/map';
import { mapEditorReducer } from './slices/mapEditor';
import { mapFilterReducer } from './slices/mapFilter';
import { modalMapReducer } from './slices/modalMap';
import { modalsReducer } from './slices/modals';
import { loginFailedAction, userReducer } from './slices/user';

const appReducer = combineReducers({
  export: exportReducer,
  loader: loaderReducer,
  map: mapReducer,
  mapEditor: mapEditorReducer,
  mapFilter: mapFilterReducer,
  modalMap: modalMapReducer,
  user: userReducer,
  modals: modalsReducer,
});

export const rootReducer = (state: ExplicitAny, action: AnyAction) => {
  if (action.type === loginFailedAction.type) {
    // Setting state to undefined is correct way for resetting state:
    // https://stackoverflow.com/a/35641992
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action);
};
