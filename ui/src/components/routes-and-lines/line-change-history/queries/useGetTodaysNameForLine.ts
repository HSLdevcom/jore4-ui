import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useGetTodaysNameForLineQuery } from '../../../../generated/graphql';
import { Priority } from '../../../../types/enums';

const GQL_GET_TODAYS_NAME_FOR_LINE = gql`
  query GetTodaysNameForLine($label: String!, $priority: Int!, $today: date!) {
    route_line(
      where: {
        label: { _eq: $label }
        priority: { _eq: $priority }
        validity_start: { _lte: $today }
        _or: [
          { validity_end: { _gte: $today } }
          { validity_end: { _is_null: true } }
        ]
      }
      limit: 1
    ) {
      line_id
      name_i18n
    }
  }
`;

export function useGetTodaysNameForLine(label: string, priority: Priority) {
  const { data, ...rest } = useGetTodaysNameForLineQuery({
    variables: { label, priority, today: DateTime.now().startOf('day') },
  });

  const todaysNameForLine = data?.route_line.at(0)?.name_i18n ?? null;
  return { ...rest, todaysNameForLine };
}
