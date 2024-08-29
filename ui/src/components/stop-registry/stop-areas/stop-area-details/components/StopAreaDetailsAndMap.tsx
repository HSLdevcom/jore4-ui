import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopAreaComponentProps } from './StopAreaComponentProps';
import { StopAreaDetails } from './StopAreaDetails';
import { StopAreaMinimap } from './StopAreaMinimap';

export const StopAreaDetailsAndMap: FC<StopAreaComponentProps> = ({
  area,
  className = '',
}) => (
  <div className={twMerge('flex items-stretch gap-2', className)}>
    <StopAreaDetails area={area} />
    <StopAreaMinimap area={area} />
  </div>
);
