import { DateTime } from 'luxon';
import { FC } from 'react';
import { RouteTimetableRowInfo } from '../../../../hooks';
import { useGetLocalizedTextFromDbBlob } from '../../../../i18n/utils';
import { VehicleJourneyGroupInfo } from '../../common/VehicleJourneyGroupInfo';
import { VehicleServiceRow } from '../../vehicle-schedule-details';
import { ExpandableRouteTimetableRow } from './ExpandableRouteTimetableRow';
import { TimetableHeading } from './TimetableHeading';

type RouteTimetableCardProps = {
  readonly routeTimetableRowInfo: RouteTimetableRowInfo;
  readonly dayTypeNameI18n: LocalizedString;
  readonly createdAt?: DateTime;
};

export const RouteTimetableCard: FC<RouteTimetableCardProps> = ({
  routeTimetableRowInfo,
  dayTypeNameI18n,
  createdAt,
}) => {
  const getLocalizedTextFromDbBlob = useGetLocalizedTextFromDbBlob();

  const sectionIdentifier = `ExpandableRouteTimetableRow.${routeTimetableRowInfo.label}.${routeTimetableRowInfo.direction}`;

  return (
    <ExpandableRouteTimetableRow
      className="mb-4"
      key={`${routeTimetableRowInfo.label}.${routeTimetableRowInfo.direction}`}
      routeLabel={routeTimetableRowInfo.label}
      direction={routeTimetableRowInfo.direction}
      routeName={getLocalizedTextFromDbBlob(routeTimetableRowInfo.nameI18n)}
      sectionIdentifier={sectionIdentifier}
    >
      <div className="mt-4 space-y-2" id={sectionIdentifier}>
        <TimetableHeading
          priority={routeTimetableRowInfo.priority}
          dayTypeI18n={dayTypeNameI18n}
          createdAt={createdAt}
        />
        <VehicleJourneyGroupInfo
          vehicleJourneys={routeTimetableRowInfo.vehicleJourneys}
          validityStart={routeTimetableRowInfo.validity.validityStart}
          validityEnd={routeTimetableRowInfo.validity.validityEnd}
          vehicleScheduleFrameId={routeTimetableRowInfo.vehicleScheduleFrameId}
          dayTypeNameI18n={dayTypeNameI18n}
        />
        <div>
          {routeTimetableRowInfo.vehicleServiceRowData.map((item) => (
            <VehicleServiceRow key={item.hours} data={item} />
          ))}
        </div>
      </div>
    </ExpandableRouteTimetableRow>
  );
};
