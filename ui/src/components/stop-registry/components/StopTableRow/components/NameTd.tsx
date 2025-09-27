import { FC } from 'react';
import { Row } from '../../../../../layoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={className}>
    <div>
      <Row>{stop.nameFin}</Row>
      <Row>{stop.nameSwe}</Row>
    </div>
  </td>
);
