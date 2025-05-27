import { FC } from 'react';
import { Link } from 'react-router-dom';
import { VehicleScheduleFrameInfo } from '../../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { routeDetails } from '../../../../router/routeDetails';
import { DirectionBadge } from '../../../routes-and-lines/line-details/DirectionBadge';

type RouteDeviationLinkProps = {
  readonly deviation: VehicleScheduleFrameInfo;
  readonly isLast?: boolean;
  readonly testIdPrefix: string;
};

const testIds = {
  link: (testIdPrefix: string) => `${testIdPrefix}::link`,
  label: (testIdPrefix: string) => `${testIdPrefix}::label`,
};

export const RouteDeviationLink: FC<RouteDeviationLinkProps> = ({
  deviation,
  isLast,
  testIdPrefix,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const { lineId, uniqueLabel, direction } = deviation;

  return (
    <Link
      to={routeDetails['/timetables/lines/:id'].getLink(lineId, uniqueLabel)}
      title={getLocalizedTextFromDbBlob(deviation.routeName)}
      data-testid={testIds.link(testIdPrefix)}
    >
      <div className="flex items-center">
        <DirectionBadge
          direction={direction}
          className="mx-1 !h-4 !w-4 text-sm"
        />
        <span
          className="mr-1 font-bold text-black underline"
          data-testid={testIds.label(testIdPrefix)}
        >
          {uniqueLabel}
          {!isLast && ','}
        </span>
      </div>
    </Link>
  );
};
