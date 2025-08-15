import { gql } from 'graphql-tag';
import { getGqlString } from '../builders/mutations/utils';

const GQL_GET_STOP_POINT_BY_LABEL = gql`
  query GetStopPointByLabel($label: String!) {
    service_pattern_scheduled_stop_point(where: { label: { _eq: $label } }) {
      scheduled_stop_point_id
      label
      stop_place_ref
      validity_start
      validity_end
      priority
    }
  }
`;

const GQL_UPDATE_STOP_POINT_STOP_PLACE_REF = gql`
  mutation UpdateScheduledStopPointStopPlaceRef(
    $scheduled_stop_point_id: uuid!
    $stop_place_ref: String!
  ) {
    update_service_pattern_scheduled_stop_point_by_pk(
      pk_columns: { scheduled_stop_point_id: $scheduled_stop_point_id }
      _set: { stop_place_ref: $stop_place_ref }
    ) {
      scheduled_stop_point_id
      stop_place_ref
    }
  }
`;

export const mapToGetStopPointByLabelQuery = (
  scheduledStopPointLabel: string,
) => {
  return {
    query: getGqlString(GQL_GET_STOP_POINT_BY_LABEL),
    variables: {
      label: scheduledStopPointLabel,
    },
  };
};

export const mapToUpdateScheduledStopPointStopPlaceRefMutation = ({
  scheduledStopPointId,
  stopPlaceRef,
}: {
  scheduledStopPointId: UUID;
  stopPlaceRef: string;
}) => {
  return {
    query: getGqlString(GQL_UPDATE_STOP_POINT_STOP_PLACE_REF),
    variables: {
      scheduled_stop_point_id: scheduledStopPointId,
      stop_place_ref: stopPlaceRef,
    },
  };
};
