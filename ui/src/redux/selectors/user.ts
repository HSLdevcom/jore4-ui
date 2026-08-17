import { RootState } from '../store';

export function selectUser(state: RootState) {
  return state.user;
}
