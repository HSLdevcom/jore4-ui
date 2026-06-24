import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { DateTime } from 'luxon';

const GQL_GET_SCHEDULED_STOP_POINT_BY_STOP_PLACE_REF = gql`
  query GetScheduledStopPointByStopPlaceRef($stopPlaceRef: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $stopPlaceRef } }
      order_by: [{ validity_start: desc }]
      limit: 1
    ) {
      scheduled_stop_point_id
      validity_start
    }
  }
`;

type ScheduledStopPointByRefResult = {
  service_pattern_scheduled_stop_point: ReadonlyArray<{
    scheduled_stop_point_id: string;
    validity_start: string;
  }>;
};

const GQL_DEACTIVATE_SCHEDULED_STOP_POINT = gql`
  mutation DeactivateScheduledStopPoint(
    $scheduledStopPointId: uuid!
    $validityEnd: date!
  ) {
    update_service_pattern_scheduled_stop_point_by_pk(
      pk_columns: { scheduled_stop_point_id: $scheduledStopPointId }
      _set: { validity_end: $validityEnd }
    ) {
      scheduled_stop_point_id
      validity_end
    }
  }
`;

const GQL_REACTIVATE_SCHEDULED_STOP_POINT = gql`
  mutation ReactivateScheduledStopPoint($scheduledStopPointId: uuid!) {
    update_service_pattern_scheduled_stop_point_by_pk(
      pk_columns: { scheduled_stop_point_id: $scheduledStopPointId }
      _set: { validity_end: null }
    ) {
      scheduled_stop_point_id
      validity_end
    }
  }
`;

type DeactivateParams = {
  readonly stopPlaceRef: string;
  readonly inactiveStart: DateTime;
};

export const useDeactivateScheduledStopPoint = () => {
  const [getStopPoint] = useLazyQuery<ScheduledStopPointByRefResult>(
    GQL_GET_SCHEDULED_STOP_POINT_BY_STOP_PLACE_REF,
  );
  const [deactivate] = useMutation(GQL_DEACTIVATE_SCHEDULED_STOP_POINT);

  return async ({ stopPlaceRef, inactiveStart }: DeactivateParams) => {
    const { data } = await getStopPoint({
      variables: { stopPlaceRef },
    });

    const ssp = data?.service_pattern_scheduled_stop_point?.[0];
    if (!ssp) {
      return;
    }

    const dayBeforeInactive = inactiveStart.minus({ days: 1 });

    await deactivate({
      variables: {
        scheduledStopPointId: ssp.scheduled_stop_point_id,
        validityEnd: dayBeforeInactive.toISODate(),
      },
      refetchQueries: ['GetStopDetails'],
    });
  };
};

export const useReactivateScheduledStopPoint = () => {
  const [getStopPoint] = useLazyQuery<ScheduledStopPointByRefResult>(
    GQL_GET_SCHEDULED_STOP_POINT_BY_STOP_PLACE_REF,
  );
  const [reactivate] = useMutation(GQL_REACTIVATE_SCHEDULED_STOP_POINT);

  return async (stopPlaceRef: string) => {
    const { data } = await getStopPoint({
      variables: { stopPlaceRef },
    });

    const ssp = data?.service_pattern_scheduled_stop_point?.[0];
    if (!ssp) {
      return;
    }

    await reactivate({
      variables: {
        scheduledStopPointId: ssp.scheduled_stop_point_id,
      },
      refetchQueries: ['GetStopDetails'],
    });
  };
};
