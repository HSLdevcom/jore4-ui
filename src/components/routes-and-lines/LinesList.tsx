import React from 'react';
import { RouteLine } from '../../generated/graphql';
import { Visible } from '../../layoutComponents';
import { LineTableRow } from '../LineTableRow'; // eslint-disable-line import/no-cycle
import { RoutesTable } from '../RoutesTable';

type Props = {
  lines?: RouteLine[];
};

export const LinesList = ({ lines }: Props): JSX.Element => (
  <Visible visible={!!lines?.length}>
    <RoutesTable>
      {lines?.map((item: RouteLine) => (
        <LineTableRow key={item.line_id} line={item} />
      ))}
    </RoutesTable>
  </Visible>
);
