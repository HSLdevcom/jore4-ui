import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { EditableStopAreaComponentProps } from './StopAreaComponentProps';
import { StopAreaDetails } from './StopAreaDetails';
import { StopAreaMinimap } from './StopAreaMinimap';

export const StopAreaDetailsAndMap: FC<EditableStopAreaComponentProps> = ({
  area,
  className = '',
  refetch,
}) => (
  <div className={twMerge('flex items-stretch gap-2', className)}>
    <StopAreaDetails area={area} refetch={refetch} />
    <StopAreaMinimap area={area} />
  </div>
);
