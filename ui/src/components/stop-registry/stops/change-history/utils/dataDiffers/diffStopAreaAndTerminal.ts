import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import { TerminalDetailsFragment } from '../../../../../../generated/graphql';
import {
  ChangedValue,
  diffKeyedValues,
} from '../../../../../common/ChangeHistory';
import { HistoricalStopData } from '../../types';

function getTerminal(stop: HistoricalStopData) {
  const parentStopPlace = stop.stop_place.parentStopPlace?.at(0);

  if (!parentStopPlace) {
    return null;
  }

  // eslint-disable-next-line no-underscore-dangle
  if (parentStopPlace.__typename === 'stop_registry_StopPlace') {
    return null;
  }

  return parentStopPlace as TerminalDetailsFragment;
}

export function diffStopAreaAndTerminal(
  t: TFunction,
  previous: HistoricalStopData,
  current: HistoricalStopData,
): Array<ChangedValue> {
  return compact([
    diffKeyedValues({
      key: 'StopAreaNameFin',
      field: t('stopChangeHistory.stopPlace.stopAreaNameFin'),
      oldValue: previous.stop_place.name,
      newValue: current.stop_place.name,
    }),
    diffKeyedValues({
      key: 'StopAreaNameSwe',
      field: t('stopChangeHistory.stopPlace.stopAreaNameSwe'),
      oldValue: previous.stop_place.nameSwe,
      newValue: current.stop_place.nameSwe,
    }),
    diffKeyedValues({
      key: 'TerminalNameFin',
      field: t('stopChangeHistory.stopPlace.terminalNameFin'),
      oldValue: getTerminal(previous)?.name?.value,
      newValue: getTerminal(current)?.name?.value,
    }),
  ]);
}
