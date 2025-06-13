import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { errorModalReducer } from './slices/errorModal';
import { exportReducer } from './slices/export';
import { loaderReducer } from './slices/loader';
import { mapFilterReducer } from './slices/mapFilter';
import { mapModalReducer } from './slices/mapModal';
import { mapRouteEditorReducer } from './slices/mapRouteEditor';
import { mapStopAreaEditorReducer } from './slices/mapStopAreaEditor';
import { mapStopEditorReducer } from './slices/mapStopEditor';
import { mapTerminalEditorReducer } from './slices/mapTerminalEditor';
import { modalsReducer } from './slices/modals';
import { timetableReducer } from './slices/timetable';
import { timetableVersionPanelReducer } from './slices/timetableVersionPanel';
import { loginFailedAction, userReducer } from './slices/user';

const appReducer = combineReducers({
  export: exportReducer,
  loader: loaderReducer,
  mapStopAreaEditor: mapStopAreaEditorReducer,
  mapStopEditor: mapStopEditorReducer,
  mapTerminalEditor: mapTerminalEditorReducer,
  mapRouteEditor: mapRouteEditorReducer,
  mapFilter: mapFilterReducer,
  mapModal: mapModalReducer,
  errorModal: errorModalReducer,
  user: userReducer,
  modals: modalsReducer,
  timetable: timetableReducer,
  timetableVersionPanel: timetableVersionPanelReducer,
});

export const rootReducer = (state: ExplicitAny, action: AnyAction) => {
  if (action.type === loginFailedAction.type) {
    // Setting state to undefined is correct way for resetting state:
    // https://stackoverflow.com/a/35641992
    state = undefined; // eslint-disable-line no-param-reassign
  }

  return appReducer(state, action);
};
