import { FC } from 'react';
import { Column, Row } from '../../../../../layoutComponents';
import { StopRowTdProps } from '../types';
import { Icons } from './Icons';

export const NameAndIconsTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={className}>
    <Column>
      <Row className="font-bold">
        {stop.nameFin} | {stop.nameSwe}
      </Row>
      <Row>{stop.description}</Row>
      <Row>
        <Icons stop={stop} />
      </Row>
    </Column>
  </td>
);
