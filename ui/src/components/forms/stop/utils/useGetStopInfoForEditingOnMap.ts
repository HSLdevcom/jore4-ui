import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  GetStopInfoForEditingOnMapQuery,
  StopInfoTimingPlaceInfoFragment,
  useGetStopInfoForEditingOnMapQuery,
} from '../../../../generated/graphql';
import { RequiredNonNullableKeys } from '../../../../types';
import { getGeometryPoint, requireValue } from '../../../../utils';
import { StopFormState } from '../types';
import {
  RawName,
  findName,
  parseStopFormStopAreaInfo,
} from './parseStopFormStopAreaInfo';

const GQL_GET_STOP_INFO_FOR_EDITING_ON_MAP = gql`
  query GetStopInfoForEditingOnMap($quayNetexId: String!) {
    stops_database {
      quay: stops_database_quay_newest_version(
        where: { netex_id: { _eq: $quayNetexId } }
      ) {
        id
        netexId: netex_id

        label: public_code

        centroid

        locationValue: description_value
        locationLang: description_lang

        alternativeLocations: quay_alternative_names {
          location: alternative_name {
            type: name_type
            lang: name_lang
            value: name_value
          }
        }

        priority
        validityStart: validity_start
        validityEnd: validity_end

        keyValues: quay_key_values {
          key: key_values_key
          values: value {
            valueItems: value_items {
              items
            }
          }
        }

        stopPlace: stop_place_newest_version {
          ...StopFormStopAreaInfo
        }

        stopPoint: scheduled_stop_point_instance {
          id: scheduled_stop_point_id
          closestPointOnInfraLink: closest_point_on_infrastructure_link

          timingPlace: timing_place {
            ...StopInfoTimingPlaceInfo
          }
        }
      }
    }
  }

  fragment StopInfoTimingPlaceInfo on timing_pattern_timing_place {
    id: timing_place_id
    label
  }
`;

type ExistingStopFormState = RequiredNonNullableKeys<
  StopFormState,
  | 'publicCode'
  | 'quayId'
  | 'stopId'
  | 'stopArea'
  | 'latitude'
  | 'longitude'
  | 'priority'
  | 'validityStart'
>;

export type StopInfoForEditingOnMap = {
  readonly formState: ExistingStopFormState;
  readonly timingPlaceInfo: StopInfoTimingPlaceInfoFragment | null;
  readonly closestPointOnInfraLink: GeoJSON.Point | null;
};

function parseResult(
  data: GetStopInfoForEditingOnMapQuery,
  quayNetexId: string,
): StopInfoForEditingOnMap {
  const rawQuay = data.stops_database?.quay?.at(0);

  if (!rawQuay) {
    throw new Error(`Quay not found for id: ${quayNetexId}!`);
  }

  if (!rawQuay.stopPoint) {
    throw new Error(
      `Scheduled Stop Point not found for Quay id: ${quayNetexId}!`,
    );
  }

  const point = getGeometryPoint(rawQuay.centroid);
  const locationNames: ReadonlyArray<RawName> = [
    ...rawQuay.alternativeLocations.map((it) => it.location),
    {
      type: 'OTHER',
      lang: rawQuay.locationLang,
      value: rawQuay.locationValue,
    },
  ];

  const timingPlaceInfo = rawQuay.stopPoint.timingPlace ?? null;
  const closestPointOnInfraLink =
    rawQuay.stopPoint.closestPointOnInfraLink ?? null;

  const formState: ExistingStopFormState = {
    publicCode: {
      value: requireValue(rawQuay.label),
      municipality: null,
      expectedPrefix: null,
    },
    quayId: requireValue(rawQuay.netexId),
    stopId: requireValue(rawQuay.stopPoint.id),
    stopArea: requireValue(parseStopFormStopAreaInfo(rawQuay.stopPlace)),

    latitude: requireValue(point?.latitude),
    longitude: requireValue(point?.longitude),

    locationFin: findName(locationNames, 'OTHER', 'fin'),
    locationSwe: findName(locationNames, 'OTHER', 'swe'),

    reasonForChange: null, // We don't want to pre fill the previous version comment

    timingPlaceId: timingPlaceInfo?.id ?? null,

    priority: Number(requireValue(rawQuay.priority)),
    validityStart: requireValue(rawQuay.validityStart),
    validityEnd: rawQuay.validityEnd ?? undefined,
    indefinite: !rawQuay.validityEnd,

    keyValues: rawQuay.keyValues.map((rawKeyValue) => ({
      key: rawKeyValue.key,
      values: compact(rawKeyValue.values.valueItems.map((it) => it.items)),
    })),
  };

  return { formState, timingPlaceInfo, closestPointOnInfraLink };
}

export function useGetStopInfoForEditingOnMap(
  quayNetexId: string | null | undefined,
) {
  const { data, ...rest } = useGetStopInfoForEditingOnMapQuery(
    quayNetexId
      ? // nextFetchPolicy: Only refetch the data on mount.
        // Prevents parsing errors when queries start to re-evaluate during
        // stop deletion -> Stop Point not available anymore.
        { variables: { quayNetexId }, nextFetchPolicy: 'cache-only' }
      : { skip: true },
  );

  const stopInfo: StopInfoForEditingOnMap | null = useMemo(() => {
    if (!quayNetexId || !data) {
      return null;
    }

    return parseResult(data, quayNetexId);
  }, [data, quayNetexId]);

  return { ...rest, stopInfo };
}
