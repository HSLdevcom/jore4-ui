import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { EditableStopAreaComponentProps } from '../types';
import { StopAreaDetails } from './StopAreaDetails';
import { StopAreaMinimap } from './StopAreaMinimap';

export const StopAreaDetailsAndMap: FC<EditableStopAreaComponentProps> = ({
  area,
  className = '',
  blockInEdit,
  onEditBlock,
  refetch,
}) => (
  <div className={twMerge('flex items-stretch gap-2', className)}>
    <StopAreaDetails
      area={area}
      blockInEdit={blockInEdit}
      onEditBlock={onEditBlock}
      refetch={refetch}
    />
    <StopAreaMinimap area={area} />
  </div>
);
