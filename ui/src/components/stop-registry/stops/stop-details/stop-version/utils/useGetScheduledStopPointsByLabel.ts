import { gql } from '@apollo/client';
import { DateTime } from 'luxon';
import { useScheduledStopPointsByLabelBetweenDatesQuery } from '../../../../../../generated/graphql';

const GQL_GET_SCHEDULED_STOP_POINTS_BY_LABEL_QUERY = gql`
  query ScheduledStopPointsByLabelBetweenDates(
    $stopLabel: String!
    $fromDate: date!
    $toDate: date!
  ) {
    service_pattern_scheduled_stop_point(
      where: {
        label: { _eq: $stopLabel }
        validity_start: { _lte: $toDate }
        _or: [
          { validity_end: { _gte: $fromDate } }
          { validity_end: { _is_null: true } }
        ]
      }
    ) {
      label
      priority
      stop_place_ref
      validity_start
      validity_end
    }
  }
`;

export function useGetScheduledStopPointsByLabel({
  stopLabel,
  fromDate,
  toDate,
  skip,
}: {
  readonly stopLabel: string | null | undefined;
  readonly fromDate: DateTime;
  readonly toDate: DateTime;
  readonly skip: boolean;
}) {
  const { data, ...rest } = useScheduledStopPointsByLabelBetweenDatesQuery(
    stopLabel
      ? {
          variables: { stopLabel, fromDate, toDate },
          fetchPolicy: 'network-only',
          skip,
        }
      : { skip: true },
  );

  return { asd: data, ...rest };

  // Mitä tämän oikeasti halutaan palauttavan?
  // Halutaan tietää tarvitseeko leikata edellistä tai jälkeistä
}
