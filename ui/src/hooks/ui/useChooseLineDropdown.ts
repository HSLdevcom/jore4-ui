import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useState } from 'react';
import {
  LineForComboboxFragment,
  useGetLinesForComboboxQuery,
  useGetSelectedLineDetailsByIdQuery,
} from '../../generated/graphql';
import { mapToSqlLikeValue, mapToVariables } from '../../utils';
import { useDebouncedString } from '../useDebouncedString';

const GQL_GET_LINES_FOR_COMBOBOX = gql`
  query GetLinesForCombobox($labelPattern: String!, $date: date!) {
    route_line(
      limit: 10
      where: {
        label: { _ilike: $labelPattern }
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

const GQL_GET_SELECTED_LINE_DETAILS_BY_ID = gql`
  query GetSelectedLineDetailsById($line_id: uuid!) {
    route_line_by_pk(line_id: $line_id) {
      ...line_for_combobox
    }
  }
`;

const GQL_LINE_FOR_COMBOBOX = gql`
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
): {
  lines: ReadonlyArray<LineForComboboxFragment>;
  selectedLine?: LineForComboboxFragment;
} => {
  const [today] = useState(DateTime.now());

  const [debouncedQuery] = useDebouncedString(query, 300);

  const [lines, setLines] =
    useState<ReadonlyArray<LineForComboboxFragment>>(Array);

  const linesResult = useGetLinesForComboboxQuery(
    mapToVariables({
      labelPattern: `${mapToSqlLikeValue(debouncedQuery)}%`,
      date: observationDate ?? today.toISO(),
    }),
  );

  // It is possible that the selected line is not in the line search results,
  // fetch it separately by id here.
  const selectedLineResult = useGetSelectedLineDetailsByIdQuery({
    skip: !lineId,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    variables: { line_id: lineId! },
  });

  const selectedLine = selectedLineResult.data?.route_line_by_pk as
    | LineForComboboxFragment
    | undefined;

  if (
    !linesResult.loading &&
    linesResult.data &&
    linesResult.data.route_line !== lines
  ) {
    setLines(linesResult.data.route_line);
  }

  // While fetching the selected line, we can use the data from lines
  const displayedSelectedLine = selectedLineResult.loading
    ? lines.find((line) => line.line_id === lineId)
    : selectedLine;

  return {
    lines,
    selectedLine: displayedSelectedLine,
  };
};
