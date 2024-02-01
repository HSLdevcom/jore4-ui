import { gql } from '@apollo/client';
import {
  ScheduledStopPointDefaultFieldsFragment,
  useGetStopDetailsByIdQuery,
} from '../../generated/graphql';
import { useRequiredParams } from '../useRequiredParams';

const GQL_GET_STOP_DETAILS_BY_ID = gql`
  query GetStopDetailsById($scheduled_stop_point_id: uuid!) {
    service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $scheduled_stop_point_id
    ) {
      ...scheduled_stop_point_default_fields
    }
  }
`;

/** Gets the stop details depending on query parameters. */
export const useGetStopDetails = (): {
  stopDetails: ScheduledStopPointDefaultFieldsFragment | null | undefined;
} => {
  const { id } = useRequiredParams<{ id: string }>();

  // TODO: observation date?

  const result = useGetStopDetailsByIdQuery({
    variables: { scheduled_stop_point_id: id },
  });

  const stopDetails = result.data?.service_pattern_scheduled_stop_point_by_pk;

  return { stopDetails };
};
