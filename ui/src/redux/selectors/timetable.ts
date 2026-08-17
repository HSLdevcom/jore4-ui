import { RootState } from '../store';

export function selectTimetable(state: RootState) {
  return state.timetable;
}
