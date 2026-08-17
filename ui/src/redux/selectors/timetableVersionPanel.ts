import { RootState } from '../store';

export function selectTimetableVersionPanel(state: RootState) {
  return state.timetableVersionPanel;
}
