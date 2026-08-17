import { RootState } from '../store';

export function selectExport(state: RootState) {
  return state.export;
}
