import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Column, Row } from '../../../../common/LayoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<
  StopRowTdProps & {
    readonly children?: ReactNode;
    readonly nameDetails?: ReactNode;
    readonly sideContent?: ReactNode;
  }
> = ({ children, nameDetails, sideContent, className, stop }) => (
  <>
    <td className={className}>
      <Column>
        <Row className="font-bold">
          {stop.nameFin} | {stop.nameSwe}
          {children}
        </Row>
        {nameDetails}
        <Row>{stop.description}</Row>
      </Column>
    </td>
    {sideContent && (
      <td className={twMerge(className, 'border-l-0 align-middle')}>
        {sideContent}
      </td>
    )}
  </>
);
