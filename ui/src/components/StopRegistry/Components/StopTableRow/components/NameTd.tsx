import { FC, ReactNode } from 'react';
import { Column, Row } from '../../../../common/LayoutComponents';
import { StopRowTdProps } from '../types';

export const NameTd: FC<
  StopRowTdProps & { readonly additionalNameContent?: ReactNode }
> = ({ className, stop, additionalNameContent }) => (
  <td className={className}>
    <Column>
      <Row className="font-bold">
        {stop.nameFin} | {stop.nameSwe}
        {additionalNameContent}
      </Row>
      <Row>{stop.description}</Row>
    </Column>
  </td>
);
