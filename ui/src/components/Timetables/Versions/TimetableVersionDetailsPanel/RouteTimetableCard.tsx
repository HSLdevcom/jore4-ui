import { DateTime } from 'luxon';
import { FC } from 'react';
import { useGetLocalizedTextFromDbBlob } from '../../../../utils/i18n';
import { VehicleJourneyGroupInfo } from '../../Common/VehicleJourneyGroupInfo';
import { VehicleServiceRow } from '../../VehicleScheduleDetails';
import { ExpandableRouteTimetableRow } from './ExpandableRouteTimetableRow';
import { TimetableHeading } from './TimetableHeading';
import { RouteTimetableRowInfo } from './useVehicleScheduleFrameSchedules';

type RouteTimetableCardProps = {
  readonly routeTimetableRowInfo: RouteTimetableRowInfo;
  readonly dayTypeNameI18n: LocalizedString;
  readonly createdAt: DateTime | null;
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
