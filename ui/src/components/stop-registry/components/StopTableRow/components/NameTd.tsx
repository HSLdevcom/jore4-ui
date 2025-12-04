import { FC } from 'react';
import { Column, Row } from '../../../../../layoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<StopRowTdProps> = ({ className, stop }) => (
  <td className={className}>
    <Row className="gap-3">
      <Column className="w-8 border-r border-background text-base font-bold">
        {stop.platformNumber}
      </Column>
      <Column>
        <Row className="font-bold">
          {stop.nameFin} | {stop.nameSwe}
        </Row>
        <Row>{stop.description}</Row>
      </Column>
    </Row>
  </td>
);
