import { FC } from 'react';
import { StopRowTdProps } from '../types';
import { Icons } from './Icons';

export const IconsTd: FC<StopRowTdProps> = ({ className, stop }) => {
  return (
    <td className={className}>
      <Icons stop={stop} />
    </td>
  );
};
