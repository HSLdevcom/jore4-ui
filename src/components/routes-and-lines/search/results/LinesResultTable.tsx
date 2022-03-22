import React from 'react';
import { RouteLine } from '../../../../generated/graphql';
import { LineTableRow } from '../../../LineTableRow'; // eslint-disable-line import/no-cycle
import { RoutesTable } from '../../../RoutesTable';

export const LinesResultTable = ({
  lines,
}: {
  lines: RouteLine[] | undefined;
}) =>
  lines && lines.length > 0 ? (
    <RoutesTable>
      {lines?.map((item: RouteLine) => (
        <LineTableRow key={item.line_id} line={item} />
      ))}
    </RoutesTable>
  ) : (
    <></>
  );
