import { gql, useApolloClient } from '@apollo/client';
import { DateTime } from 'luxon';
import {
  EditKeyValuesOfQuayDocument,
  EditKeyValuesOfQuayMutation,
  EditKeyValuesOfQuayMutationVariables,
  GetScheduledStopPointByQuayNetexIdDocument,
  GetScheduledStopPointByQuayNetexIdQuery,
  GetScheduledStopPointByQuayNetexIdQueryVariables,
  StopRegistryKeyValues,
  useDeactivateScheduledStopPointMutation,
  useEditKeyValuesOfQuayMutation,
  useReactivateScheduledStopPointMutation,
} from '../../../../../generated/graphql';
import { KnownValueKey, patchKeyValues } from '../../../../../utils';

const GQL_GET_SCHEDULED_STOP_POINT_BY_QUAY_NETEX_ID = gql`
  query GetScheduledStopPointByQuayNetexId($quayNetexId: String!) {
    service_pattern_scheduled_stop_point(
      where: { stop_place_ref: { _eq: $quayNetexId } }
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
  readonly quayNetexId: string;
  readonly stopPlaceNetexId: string;
  readonly quayKeyValues: ReadonlyArray<StopRegistryKeyValues | null>;
  readonly inactiveStart: DateTime;
};

export function useDeactivateScheduledStopPoint() {
  const apollo = useApolloClient();
  const [deactivateScheduledStopPoint] =
    useDeactivateScheduledStopPointMutation();

  return async ({
    quayNetexId,
    stopPlaceNetexId,
    quayKeyValues,
    inactiveStart,
  }: DeactivateParams) => {
    const { data } = await apollo.query<
      GetScheduledStopPointByQuayNetexIdQuery,
      GetScheduledStopPointByQuayNetexIdQueryVariables
    >({
      query: GetScheduledStopPointByQuayNetexIdDocument,
      variables: { quayNetexId },
    });

    const ssp = data.service_pattern_scheduled_stop_point[0];
    if (!ssp) {
      return;
    }

    const dayBeforeInactive = inactiveStart.minus({ days: 1 });

    await deactivateScheduledStopPoint({
      variables: {
        scheduledStopPointId: ssp.scheduled_stop_point_id,
        validityEnd: dayBeforeInactive,
      },
    });

    const validityEndDate = dayBeforeInactive.toISODate();

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
        quayId: quayNetexId,
        keyValues: updatedKeyValues,
      },
      refetchQueries: ['GetStopDetails'],
    });
  };
}

type ReactivateParams = {
  readonly quayNetexId: string;
  readonly stopPlaceNetexId: string;
  readonly quayKeyValues: ReadonlyArray<StopRegistryKeyValues | null>;
  readonly quayValidityEnd: DateTime | null;
};

export function useReactivateScheduledStopPoint() {
  const apollo = useApolloClient();
  const [reactivateScheduledStopPoint] =
    useReactivateScheduledStopPointMutation();
  const [editKeyValuesOfQuay] = useEditKeyValuesOfQuayMutation({
    refetchQueries: ['GetStopDetails'],
  });

  return async ({
    quayNetexId,
    stopPlaceNetexId,
    quayKeyValues,
    quayValidityEnd,
  }: ReactivateParams) => {
    const { data } = await apollo.query<
      GetScheduledStopPointByQuayNetexIdQuery,
      GetScheduledStopPointByQuayNetexIdQueryVariables
    >({
      query: GetScheduledStopPointByQuayNetexIdDocument,
      variables: { quayNetexId },
    });

    const ssp = data.service_pattern_scheduled_stop_point[0];
    if (!ssp) {
      return;
    }

    await reactivateScheduledStopPoint({
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

    await editKeyValuesOfQuay({
      variables: {
        stopId: stopPlaceNetexId,
        quayId: quayNetexId,
        keyValues: updatedKeyValues,
      },
    });
  };
}
