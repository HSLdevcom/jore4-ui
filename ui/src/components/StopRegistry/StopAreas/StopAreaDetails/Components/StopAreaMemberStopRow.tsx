import { FC } from 'react';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
  StopSearchRow,
  StopTableRow,
  mapStopSearchRowToLocatableStop,
} from '../../../Components';

type StopAreaMemberStopRowProps = {
  readonly member: StopSearchRow;
  readonly observationDate: Temporal.PlainDate;
};

export const StopAreaMemberStopRow: FC<StopAreaMemberStopRowProps> = ({
  member,
  observationDate,
}) => {
  const locatableStop = mapStopSearchRowToLocatableStop(member);

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
