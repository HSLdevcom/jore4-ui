import { gql, useApolloClient } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  DeactivateScheduledStopPointDocument,
  DeactivateScheduledStopPointMutation,
  DeactivateScheduledStopPointMutationVariables,
  EditKeyValuesOfQuayDocument,
  EditKeyValuesOfQuayMutation,
  EditKeyValuesOfQuayMutationVariables,
  GetScheduledStopPointByStopPlaceRefDocument,
  GetScheduledStopPointByStopPlaceRefQuery,
  GetScheduledStopPointByStopPlaceRefQueryVariables,
  ReactivateScheduledStopPointDocument,
  ReactivateScheduledStopPointMutation,
  ReactivateScheduledStopPointMutationVariables,
  StopRegistryKeyValues,
} from '../../../../../generated/graphql';
import { KnownValueKey, patchKeyValues } from '../../../../../utils';

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
  mutation ReactivateScheduledStopPoint(
    $scheduledStopPointId: uuid!
    $validityEnd: date
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

type DeactivateParams = {
  readonly stopPlaceRef: string;
  readonly stopPlaceNetexId: string;
  readonly quayKeyValues: ReadonlyArray<StopRegistryKeyValues | null>;
  readonly inactiveStart: DateTime;
};

export function useDeactivateScheduledStopPoint() {
  const apollo = useApolloClient();

  return async ({
    stopPlaceRef,
    stopPlaceNetexId,
    quayKeyValues,
    inactiveStart,
  }: DeactivateParams) => {
    const { data } = await apollo.query<
      GetScheduledStopPointByStopPlaceRefQuery,
      GetScheduledStopPointByStopPlaceRefQueryVariables
    >({
      query: GetScheduledStopPointByStopPlaceRefDocument,
      variables: { stopPlaceRef },
    });

    const ssp = data.service_pattern_scheduled_stop_point[0];
    if (!ssp) {
      return;
    }

    const dayBeforeInactive = inactiveStart.minus({ days: 1 });

    await apollo.mutate<
      DeactivateScheduledStopPointMutation,
      DeactivateScheduledStopPointMutationVariables
    >({
      mutation: DeactivateScheduledStopPointDocument,
      variables: {
        scheduledStopPointId: ssp.scheduled_stop_point_id,
        validityEnd: dayBeforeInactive,
      },
    });

    const validityEndDate = dayBeforeInactive.toISODate();
    if (!validityEndDate) {
      return;
    }

    const updatedKeyValues = patchKeyValues({ keyValues: quayKeyValues }, [
      {
        key: KnownValueKey.ValidityEnd,
        values: [validityEndDate],
      },
    ]);

    await apollo.mutate<
      EditKeyValuesOfQuayMutation,
      EditKeyValuesOfQuayMutationVariables
    >({
      mutation: EditKeyValuesOfQuayDocument,
      variables: {
        stopId: stopPlaceNetexId,
        quayId: stopPlaceRef,
        keyValues: updatedKeyValues,
      },
      refetchQueries: ['GetStopDetails'],
    });
  };
}

type ReactivateParams = {
  readonly stopPlaceRef: string;
  readonly stopPlaceNetexId: string;
  readonly quayKeyValues: ReadonlyArray<StopRegistryKeyValues | null>;
  readonly quayValidityEnd: DateTime | null;
};

export function useReactivateScheduledStopPoint() {
  const apollo = useApolloClient();

  return async ({
    stopPlaceRef,
    stopPlaceNetexId,
    quayKeyValues,
    quayValidityEnd,
  }: ReactivateParams) => {
    const { data } = await apollo.query<
      GetScheduledStopPointByStopPlaceRefQuery,
      GetScheduledStopPointByStopPlaceRefQueryVariables
    >({
      query: GetScheduledStopPointByStopPlaceRefDocument,
      variables: { stopPlaceRef },
    });

    const ssp = data.service_pattern_scheduled_stop_point[0];
    if (!ssp) {
      return;
    }

    await apollo.mutate<
      ReactivateScheduledStopPointMutation,
      ReactivateScheduledStopPointMutationVariables
    >({
      mutation: ReactivateScheduledStopPointDocument,
      variables: {
        scheduledStopPointId: ssp.scheduled_stop_point_id,
        validityEnd: quayValidityEnd,
      },
    });

    const updatedKeyValues = patchKeyValues({ keyValues: quayKeyValues }, [
      {
        key: KnownValueKey.ValidityEnd,
        values: quayValidityEnd ? [quayValidityEnd.toISODate() ?? ''] : [],
      },
    ]);

    await apollo.mutate<
      EditKeyValuesOfQuayMutation,
      EditKeyValuesOfQuayMutationVariables
    >({
      mutation: EditKeyValuesOfQuayDocument,
      variables: {
        stopId: stopPlaceNetexId,
        quayId: stopPlaceRef,
        keyValues: updatedKeyValues,
      },
      refetchQueries: ['GetStopDetails'],
    });
  };
}
