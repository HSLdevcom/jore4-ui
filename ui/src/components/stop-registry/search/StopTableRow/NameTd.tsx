import { FC } from 'react';
import { Row } from '../../../../layoutComponents';
import { StopRowTdProps } from './StopRowTdProps';

export const NameTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={className}>
    <div className="border-l border-l-background pl-3">
      <Row>{stop.stop_place?.nameFin}</Row>
      <Row>{stop.stop_place?.nameSwe}</Row>
    </div>
  </td>
);
