import { TFunction } from 'i18next';
import { FC } from 'react';
import { Link } from 'react-router';
import { Path, routeDetails } from '../../../router/routeDetails';

type StopsListProps = {
  readonly t: TFunction;
  readonly stopLabels: ReadonlyArray<string>;
  readonly getLinkTestId: (stopLabel: string) => string;
};

export const StopsList: FC<StopsListProps> = ({
  t,
  stopLabels,
  getLinkTestId,
}) => {
  return (
    <ol className="flex list-none flex-wrap gap-x-3 gap-y-1">
      {stopLabels.map((stopLabel) => (
        <li key={stopLabel}>
          <Link
            className="flex"
            data-testid={getLinkTestId(stopLabel)}
            title={t(($) => $.accessibility.stops.showStopDetails, {
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
