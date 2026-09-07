import { DateTime } from 'luxon';
import { FC } from 'react';
import { getGeometryPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../../Components';
import { LocatableStop } from '../../../Types';

type StopAreaMemberStopRowProps = {
  readonly member: StopSearchRow;
  readonly observationDate: DateTime;
};

export const StopAreaMemberStopRow: FC<StopAreaMemberStopRowProps> = ({
  member,
  observationDate,
}) => {
  const locatableStop: LocatableStop = {
    label: member.publicCode,
    netexId: member.netexId,
    location: getGeometryPoint(member.location),
    priority: member.priority,
    transportMode: member.transportMode,
  };

  return (
    <StopTableRow
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <OpenDetailsPage key="OpenDetailsPage" stop={locatableStop} />,
        <ShowOnMap key="ShowOnMap" stop={locatableStop} />,
      ]}
      observationDate={observationDate}
      stop={member}
    />
  );
};
