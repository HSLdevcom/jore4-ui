import React, { FC } from 'react';
import { StopAreaEditableBlock } from '../StopAreaEditableBlock';
import { StopAreaMemberStopsEditHeader } from './StopAreaMemberStopsEditHeader';
import { StopAreaMemberStopsViewHeader } from './StopAreaMemberStopsViewHeader';

type StopAreaMemberStopsHeaderProps = {
  readonly areaId: string | null | undefined;
  readonly blockInEdit: StopAreaEditableBlock | null;
  readonly onCancel: () => void;
  readonly onEditStops: () => void;
};

export const StopAreaMemberStopsHeader: FC<StopAreaMemberStopsHeaderProps> = ({
  areaId,
  blockInEdit,
  onCancel,
  onEditStops,
}) => {
  if (blockInEdit === StopAreaEditableBlock.MEMBERS) {
    return (
      <StopAreaMemberStopsEditHeader areaId={areaId} onCancel={onCancel} />
    );
  }

  if (blockInEdit === null) {
    return <StopAreaMemberStopsViewHeader onEditStops={onEditStops} />;
  }

  return null;
};
