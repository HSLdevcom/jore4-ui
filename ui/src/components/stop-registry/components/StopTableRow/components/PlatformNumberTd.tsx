import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { StopRowTdProps } from '../types';

export const PlatformNumberTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={twMerge('align-text-top font-bold', className)}>
    {stop.platformNumber}
  </td>
);
