import { FC, ReactNode } from 'react';
import { Column, Row } from '../../../../common/LayoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<StopRowTdProps & { readonly children?: ReactNode }> = ({
  children,
  className,
  stop,
}) => (
  <td className={className}>
    <Column>
      <Row className="font-bold">
        {stop.nameFin} | {stop.nameSwe}
        {children}
      </Row>
      <Row>{stop.description}</Row>
    </Column>
  </td>
);
