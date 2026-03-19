import { TFunction } from 'i18next';
import { FC } from 'react';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../../router/routeDetails';
import {
  KeyedChangedValue,
  diffKeyedValues,
} from '../../../common/ChangeHistory';
import { RouteData } from '../types';

type RouteStopsListProps = {
  readonly t: TFunction;
  readonly stopLabels: ReadonlyArray<string>;
};

export const RouteStopsList: FC<RouteStopsListProps> = ({ t, stopLabels }) => {
  return (
    <ol className="flex list-none flex-wrap gap-y-1">
      {stopLabels.map((stopLabel) => (
        <li key={stopLabel} className="basis-1/3 px-1.5">
          <Link
            className="flex"
            title={t('accessibility:stops.showStopDetails', {
              stopLabel,
            })}
            to={routeDetails[Path.stopDetails].getLink(stopLabel)}
          >
            {stopLabel}
            <i className="icon-open-in-new" aria-hidden />
          </Link>
        </li>
      ))}
    </ol>
  );
};

export function diffStopDrivingOrder(
  t: TFunction,
  previous: RouteData,
  current: RouteData,
): Array<KeyedChangedValue | null> {
  return [
    diffKeyedValues({
      key: 'Stops',
      field: t('lineChangeHistory.extraFields.drivingOrder'),
      oldValue: previous.stops.map((it) => it.scheduled_stop_point_label),
      newValue: current.stops.map((it) => it.scheduled_stop_point_label),
      mapper: (stopLabels) => <RouteStopsList t={t} stopLabels={stopLabels} />,
    }),
  ];
}
