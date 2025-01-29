import { FC } from 'react';
import { Row } from '../../../../layoutComponents';
import { StopRowTdProps } from './StopRowTdProps';

export const NameTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={className}>
    <div>
      <Row>{stop.quay?.nameFin}</Row>
      <Row>{stop.quay?.nameSwe}</Row>
    </div>
  </td>
);
