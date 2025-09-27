import { DateTime } from 'luxon';
import { FC } from 'react';
import { getGeometryPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
} from '../../../components';
import { LocatableStop } from '../../../types';

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
    netextId: member.netexId,
    location: getGeometryPoint(member.location),
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
