import { ApolloClient, gql, useApolloClient } from '@apollo/client';
import { TFunction } from 'i18next';
import compact from 'lodash/compact';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import {
  GetStopForMetaTypeUpdateDataFragment,
  GetStopsForMetaTypeUpdateDocument,
  GetStopsForMetaTypeUpdateQuery,
  GetStopsForMetaTypeUpdateQueryVariables,
  RawQuayKeyValueFragment,
  ResolveLineStopPublicCodesDocument,
  ResolveLineStopPublicCodesQuery,
  ResolveLineStopPublicCodesQueryVariables,
  RouteTypeOfLineEnum,
  StopRegistryKeyValues,
  StopRegistryTransportModeType,
  UpdateQuayMetaTypeDocument,
  UpdateQuayMetaTypeMutation,
  UpdateQuayMetaTypeMutationVariables,
} from '../../../generated/graphql';
import { TError } from '../../../types/TError';
import { KnownValueKey, findKeyValueParsed } from '../../../utils';

const GQL_RESOLVE_LINE_STOP_PUBLIC_CODES = gql`
  query ResolveLineStopPublicCodes($lineId: uuid!) {
    stopPoints: journey_pattern_scheduled_stop_point_in_journey_pattern(
      where: {
        journey_pattern: {
          journey_pattern_route: {
            # Don't update stops on Draft routes
            priority: { _lt: 30 }
            on_line_id: { _eq: $lineId }
          }
        }
      }
    ) {
      journey_pattern_id
      scheduled_stop_point_sequence
      publicCode: scheduled_stop_point_label
    }
  }
`;

const GQL_GET_STOPS_FOR_META_TYPE_UPDATE = gql`
  query GetStopsForMetaTypeUpdate($publicCodes: [String!]!) {
    stopsDb: stops_database {
      quays: stops_database_quay_newest_version(
        where: { public_code: { _in: $publicCodes } }
      ) {
        ...GetStopForMetaTypeUpdateData
      }
    }
  }

  fragment RawQuayKeyValue on stops_database_quay_key_values {
    key_values_id
    key_values_key
    quay_id

    value {
      id
      value_items {
        value_id
        items
      }
    }
  }

  fragment GetStopForMetaTypeUpdateData on stops_database_quay_newest_version {
    netex_id
    stop_place_netex_id
    public_code

    quay_key_values {
      ...RawQuayKeyValue
    }

    stop_place {
      id
      transport_mode
    }
  }
`;

const GQL_UPDATE_QUAY_META_TYPE = gql`
  mutation UpdateQuayMetaType(
    $stopPlaceId: String!
    $quays: [stop_registry_QuayInput!]!
  ) {
    stop_registry {
      mutateStopPlace(StopPlace: { id: $stopPlaceId, quays: $quays }) {
        id
        version

        quays {
          id
          version

          keyValues {
            key
            values
          }
        }
      }
    }
  }
`;

export type StopMetaTypeUpdateInfo = {
  readonly publicCode: string;
  readonly netexId: string;
  readonly stopPlaceNetexId: string;
  readonly transportMode: StopRegistryTransportModeType | null;
  readonly isSpeedTramStop: boolean;
  readonly isTrunkLineStop: boolean;
  readonly keyValues: ReadonlyArray<StopRegistryKeyValues>;
};

async function resolveStopPublicCodesByLineId(
  client: ApolloClient,
  lineId: UUID,
): Promise<ReadonlyArray<string>> {
  const stopPointsResult = await client.query<
    ResolveLineStopPublicCodesQuery,
    ResolveLineStopPublicCodesQueryVariables
  >({
    query: ResolveLineStopPublicCodesDocument,
    variables: { lineId },
    fetchPolicy: 'network-only',
  });

  return uniq(stopPointsResult.data.stopPoints.map((it) => it.publicCode));
}

function mapRawKeyValues(
  rawKeyValues: ReadonlyArray<RawQuayKeyValueFragment>,
): Array<StopRegistryKeyValues> {
  return compact(
    rawKeyValues.map((rawKv) => {
      const value = rawKv.value.value_items.at(0)?.items;

      if (!value) {
        return null;
      }

      return { key: rawKv.key_values_key, values: [value] };
    }),
  );
}

function mapRawQuay(
  rawQuay: GetStopForMetaTypeUpdateDataFragment,
): StopMetaTypeUpdateInfo | null {
  const keyValues = mapRawKeyValues(rawQuay.quay_key_values);

  if (
    !rawQuay.netex_id ||
    !rawQuay.stop_place_netex_id ||
    !rawQuay.public_code
  ) {
    return null;
  }

  return {
    netexId: rawQuay.netex_id,
    stopPlaceNetexId: rawQuay.stop_place_netex_id,
    publicCode: rawQuay.public_code,
    transportMode: (rawQuay.stop_place?.transport_mode?.toLowerCase() ??
      null) as StopRegistryTransportModeType | null,
    isSpeedTramStop:
      findKeyValueParsed({ keyValues }, KnownValueKey.SpeedTramStop, Boolean) ??
      false,
    isTrunkLineStop:
      findKeyValueParsed({ keyValues }, KnownValueKey.TrunkLineStop, Boolean) ??
      false,
    keyValues,
  };
}

export function lineTypeAffectsMetatypes(
  mode: RouteTypeOfLineEnum | null | undefined,
): mode is
  | RouteTypeOfLineEnum.ExpressBusService
  | RouteTypeOfLineEnum.RegionalTramService {
  return (
    mode === RouteTypeOfLineEnum.ExpressBusService ||
    mode === RouteTypeOfLineEnum.RegionalTramService
  );
}

export function filterNeedUpdateByLineType(
  mode: RouteTypeOfLineEnum,
): (item: StopMetaTypeUpdateInfo) => boolean {
  if (mode === RouteTypeOfLineEnum.ExpressBusService) {
    return (it) => !it.isTrunkLineStop;
  }

  if (mode === RouteTypeOfLineEnum.RegionalTramService) {
    return (it) => !it.isSpeedTramStop;
  }

  return () => false;
}

export async function resolveStopInfoByPublicCodes(
  client: ApolloClient,
  publicCodes: ReadonlyArray<string>,
): Promise<ReadonlyArray<StopMetaTypeUpdateInfo>> {
  const quaysResult = await client.query<
    GetStopsForMetaTypeUpdateQuery,
    GetStopsForMetaTypeUpdateQueryVariables
  >({
    query: GetStopsForMetaTypeUpdateDocument,
    variables: { publicCodes },
    fetchPolicy: 'network-only',
  });

  const mapped = quaysResult.data.stopsDb?.quays.map(mapRawQuay);

  return compact(mapped).sort((a, b) =>
    a.publicCode.localeCompare(b.publicCode),
  );
}

export async function resolveStopInfoByLine(
  client: ApolloClient,
  lineId: UUID,
): Promise<ReadonlyArray<StopMetaTypeUpdateInfo>> {
  const publicCodes = await resolveStopPublicCodesByLineId(client, lineId);
  return resolveStopInfoByPublicCodes(client, publicCodes);
}

class FailedToUpdateStops extends AggregateError implements TError {
  constructor(
    public errors: Array<unknown>,
    public stops: ReadonlyArray<string>,
  ) {
    super(errors, `Failed to update stops: ${stops.join(', ')}`);
  }

  translate(t: TFunction): string {
    return t(($) => $.confirmAutoUpdateStops.failedToUpdate, {
      stops: this.stops.join(', '),
    });
  }
}

const speedTramStopKeyValue: StopRegistryKeyValues = {
  key: KnownValueKey.SpeedTramStop,
  values: [String(true)],
};

const trunkLineStopKeyValue: StopRegistryKeyValues = {
  key: KnownValueKey.TrunkLineStop,
  values: [String(true)],
};

const metatypeKeyValues: ReadonlyArray<KnownValueKey> = [
  KnownValueKey.SpeedTramStop,
  KnownValueKey.TrunkLineStop,
];

function mapStopsToUpdates(
  stops: ReadonlyArray<StopMetaTypeUpdateInfo>,
): Array<UpdateQuayMetaTypeMutationVariables> {
  const byStopPlace = groupBy(stops, (stop) => stop.stopPlaceNetexId);
  const metatypeKeyValue =
    stops.at(0)?.transportMode === StopRegistryTransportModeType.Tram
      ? speedTramStopKeyValue
      : trunkLineStopKeyValue;

  return Object.entries(byStopPlace).map(
    ([stopPlaceId, stopPlaceStops]): UpdateQuayMetaTypeMutationVariables => ({
      stopPlaceId,
      quays: stopPlaceStops.map((stop) => ({
        id: stop.netexId,
        keyValues: stop.keyValues
          .filter((it) => !metatypeKeyValues.includes(it.key as KnownValueKey))
          .concat(metatypeKeyValue),
      })),
    }),
  );
}

async function performUpdates(
  client: ApolloClient,
  updates: ReadonlyArray<UpdateQuayMetaTypeMutationVariables>,
) {
  return Promise.allSettled(
    updates.map((update) =>
      client.mutate<
        UpdateQuayMetaTypeMutation,
        UpdateQuayMetaTypeMutationVariables
      >({
        mutation: UpdateQuayMetaTypeDocument,
        variables: update,
      }),
    ),
  );
}

function assertUpdateSucceeded(
  stops: ReadonlyArray<StopMetaTypeUpdateInfo>,
  results: Awaited<ReturnType<typeof performUpdates>>,
) {
  const failedUpdates = results.filter((r) => r.status === 'rejected');
  if (failedUpdates.length > 0) {
    const errors = failedUpdates.map((r) => r.reason);

    const succeededQuayNetexIds = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value?.data?.stop_registry?.mutateStopPlace ?? [])
      .flatMap((sp) => sp?.quays ?? [])
      .map((q) => q?.id);

    const failedStops = stops
      .filter((s) => !succeededQuayNetexIds.includes(s.netexId))
      .map((s) => s.publicCode);

    throw new FailedToUpdateStops(errors, failedStops);
  }
}

export async function updateStopRegistryStopMetatype(
  client: ApolloClient,
  stops: ReadonlyArray<StopMetaTypeUpdateInfo>,
) {
  const updates = mapStopsToUpdates(stops);
  const results = await performUpdates(client, updates);

  assertUpdateSucceeded(stops, results);

  return true;
}

export function useUpdateStopRegistryStopMetatype() {
  const client = useApolloClient();
  return (stops: ReadonlyArray<StopMetaTypeUpdateInfo>) =>
    updateStopRegistryStopMetatype(client, stops);
}
