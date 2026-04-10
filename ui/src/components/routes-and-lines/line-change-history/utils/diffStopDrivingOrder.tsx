import { TFunction } from 'i18next';
import {
  KeyedChangedValue,
  StopsList,
  diffKeyedValues,
} from '../../../common/ChangeHistory';
import { RouteData } from '../types';
import { getRouteStopLinkTestId } from './getRouteStopLinkTestId';

export function diffStopDrivingOrder(
  t: TFunction,
  previous: RouteData,
  current: RouteData,
): Array<KeyedChangedValue | null> {
  return [
    diffKeyedValues({
      key: 'DrivingOrder',
      field: t(($) => $.lineChangeHistory.extraFields.drivingOrder),
      oldValue: previous.stops.map((it) => it.scheduled_stop_point_label),
      newValue: current.stops.map((it) => it.scheduled_stop_point_label),
      mapper: (stopLabels) => (
        <StopsList
          t={t}
          stopLabels={stopLabels}
          getLinkTestId={getRouteStopLinkTestId}
        />
      ),
    }),
  ];
}
