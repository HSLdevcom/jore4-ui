import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopAreaComponentProps } from '../types';
import { StopAreaDetails } from './StopAreaDetails';
import { StopAreaMinimap } from './StopAreaMinimap';

export const StopAreaDetailsAndMap: FC<StopAreaComponentProps> = ({
  area,
  className,
}) => (
  <div
    className={twMerge(
      'flex flex-col items-stretch gap-3 lg:flex-row',
      className,
    )}
  >
    <StopAreaDetails area={area} />
    <StopAreaMinimap area={area} />
  </div>
);
