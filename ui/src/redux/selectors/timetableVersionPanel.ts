import { RootState } from '../store';

export const selectTimetableVersionPanel = (state: RootState) =>
  state.timetableVersionPanel;
