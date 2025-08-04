import { DateTime } from 'luxon';
import { FC } from 'react';
import { mapLngLatToPoint } from '../../../../../utils';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../../components';
import { StopTableRow } from '../../../search';
import { LocatableStop } from '../../../types';
import { StopAreaMemberRow } from '../types';

function getRowBgClassName(added: boolean, selected: boolean) {
  if (added) {
    return 'bg-background-hsl-green-10';
  }

  if (!selected) {
    return 'bg-background text-grey';
  }

  return '';
}

type StopAreaMemberStopRowProps = {
  readonly member: StopAreaMemberRow;
  readonly observationDate: DateTime;
};

export const StopAreaMemberStopRow: FC<StopAreaMemberStopRowProps> = ({
  member: { quay, selected, added },
  observationDate,
}) => {
  const locatableStop: LocatableStop = {
    label: quay.label,
    netextId: quay.quay.netexId ?? null,
    location: mapLngLatToPoint(quay.measured_location.coordinates),
  };

  return (
    <StopTableRow
      className={getRowBgClassName(added, selected)}
      actionButtons={<LocatorActionButton stop={locatableStop} />}
      menuItems={[
        <OpenDetailsPage key="OpenDetailsPage" stop={locatableStop} />,
        <ShowOnMap key="ShowOnMap" stop={locatableStop} />,
      ]}
      observationDate={observationDate}
      stop={quay}
    />
  );
};
