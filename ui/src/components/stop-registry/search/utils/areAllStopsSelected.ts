import { none } from '../../../../utils';
import { ResultSelection } from '../types';

export function areAllStopsSelected(
  selection: ResultSelection,
  stopIds: ReadonlyArray<string>,
) {
  if (selection.selectionState === 'ALL_SELECTED') {
    return true;
  }

  if (selection.selectionState === 'NONE_SELECTED') {
    return false;
  }

  if (stopIds.length === 0) {
    return false;
  }

  if (selection.included.length) {
    return stopIds.every((stopId) => selection.included.includes(stopId));
  }

  return none((stopId) => selection.excluded.includes(stopId), stopIds);
}
