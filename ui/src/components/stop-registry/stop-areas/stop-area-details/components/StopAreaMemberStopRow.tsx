import { DateTime } from 'luxon';
import { FC } from 'react';
import { mapLngLatToPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../../components';
import { StopSearchRow, StopTableRow } from '../../../search';
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
    label: member.label,
    netextId: member.quay.netexId ?? '',
    location: mapLngLatToPoint(member.measured_location.coordinates),
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
