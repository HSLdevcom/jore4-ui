import { FC, ReactNode } from 'react';
import { Column, Row } from '../../../../common/LayoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<
  StopRowTdProps & {
    readonly children?: ReactNode;
    readonly nameDetails?: ReactNode;
    readonly sideContent?: ReactNode;
  }
> = ({ children, nameDetails, sideContent, className, stop }) => (
  <td className={className}>
    <Row className="h-full">
      <Column>
        <Row className="font-bold">
          {stop.nameFin} | {stop.nameSwe}
          {children}
        </Row>
        {nameDetails}
        <Row>{stop.description}</Row>
      </Column>
      {sideContent}
    </Row>
  </td>
);
