import { gql } from '@apollo/client';
import uniqBy from 'lodash/uniqBy';
import { DateTime } from 'luxon';
import { useState } from 'react';
import {
  LineForComboboxFragment,
  useGetLineDetailsByIdQuery,
  useGetLinesForComboboxQuery,
} from '../../generated/graphql';
import { mapLineDetailsResult } from '../../graphql';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GET_LINES_FOR_COMBOBOX = gql`
  query GetLinesForCombobox($label: String!, $date: timestamptz!) {
    route_line(
      limit: 10
      where: {
        label: { _ilike: $label }
        _or: [
          { validity_end: { _gte: $date } }
          { validity_end: { _is_null: true } }
        ]
      }
      order_by: [{ label: asc }, { validity_start: asc }]
    ) {
      ...line_for_combobox
    }
  }
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LINE_FOR_COMBOBOX = gql`
  fragment line_for_combobox on route_line {
    line_id
    name_i18n
    label
    validity_start
    validity_end
  }
`;

export const useChooseLineDropdown = (
  query: string,
  lineId?: string,
  observationDate?: DateTime,
): LineForComboboxFragment[] => {
  const [today] = useState(DateTime.now());

  const linesResult = useGetLinesForComboboxQuery(
    mapToVariables({
      label: `${mapToSqlLikeValue(query)}%`,
      date: observationDate || today.toISO(),
    }),
  );

  const selectedLineResult = useGetLineDetailsByIdQuery(
    mapToVariables({ line_id: lineId }),
  );

  const selectedLine = mapLineDetailsResult(selectedLineResult);

  const queriedlines = (linesResult.data?.route_line ||
    []) as LineForComboboxFragment[];

  // Make selected line always appear in the line list (first)
  const allLines = [...(selectedLine ? [selectedLine] : []), ...queriedlines];

  return uniqBy(allLines, 'line_id');
};
