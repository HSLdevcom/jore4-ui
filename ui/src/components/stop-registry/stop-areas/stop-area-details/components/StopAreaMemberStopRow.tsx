import { FC } from 'react';
import { mapLngLatToPoint } from '../../../../../utils';
import { StopAreaFormMember } from '../../../../forms/stop-area';
import {
  LocatorActionButton,
  OpenDetailsPage,
  ShowOnMap,
} from '../../../components';
import { StopTableRow } from '../../../search';
import { LocatableStop } from '../../../types';
import { StopAreaMemberRow } from '../types';
import { EditModeActionButton } from './MemberStopMenuActionButtons/EditModeActionButton';
import { RemoveMemberStop } from './MemberStopMenuItems/RemoveMemberStop';

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
  readonly inEditMode: boolean;
  readonly member: StopAreaMemberRow;
  readonly onRemove: (stopId: string) => void;
  readonly onAddBack: (member: StopAreaFormMember) => void;
};

export const StopAreaMemberStopRow: FC<StopAreaMemberStopRowProps> = ({
  inEditMode,
  member: { quay, selected, added },
  onAddBack,
  onRemove,
}) => {
  const locatableStop: LocatableStop = {
    label: quay.label,
    netextId: quay.quay.netexId ?? null,
    location: mapLngLatToPoint(quay.measured_location.coordinates),
  };

  return (
    <StopTableRow
      className={getRowBgClassName(added, selected)}
      inEditMode={inEditMode}
      stop={quay}
      actionButtons={
        inEditMode ? (
          <EditModeActionButton
            onAddBack={onAddBack}
            onRemove={onRemove}
            selected={selected}
            stop={quay}
          />
        ) : (
          <LocatorActionButton stop={locatableStop} />
        )
      }
      menuItems={[
        <OpenDetailsPage key="OpenDetailsPage" stop={locatableStop} />,
        <RemoveMemberStop
          key="RemoveMemberStop"
          stop={quay}
          onRemove={onRemove}
        />,
        <ShowOnMap key="ShowOnMap" stop={locatableStop} />,
      ]}
    />
  );
};
