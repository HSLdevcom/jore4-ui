import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { exportReducer } from './slices/export';
import { loaderReducer } from './slices/loader';
import { mapFilterReducer } from './slices/mapFilter';
import { mapRouteEditorReducer } from './slices/mapRouteEditor';
import { mapStopEditorReducer } from './slices/mapStopEditor';
import { modalMapReducer } from './slices/modalMap';
import { modalsReducer } from './slices/modals';
import { timetableReducer } from './slices/timetable';
import { loginFailedAction, userReducer } from './slices/user';

const appReducer = combineReducers({
  export: exportReducer,
  loader: loaderReducer,
  mapStopEditor: mapStopEditorReducer,
  mapRouteEditor: mapRouteEditorReducer,
  mapFilter: mapFilterReducer,
  modalMap: modalMapReducer,
  user: userReducer,
  modals: modalsReducer,
  timetable: timetableReducer,
});

export const rootReducer = (state: ExplicitAny, action: AnyAction) => {
  if (action.type === loginFailedAction.type) {
    // Setting state to undefined is correct way for resetting state:
    // https://stackoverflow.com/a/35641992
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action);
};
