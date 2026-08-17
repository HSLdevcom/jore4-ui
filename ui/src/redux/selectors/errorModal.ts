import { RootState } from '../store';

export function selectErrorModal(state: RootState) {
  return state.errorModal;
}
