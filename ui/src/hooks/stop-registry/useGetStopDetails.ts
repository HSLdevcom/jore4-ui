import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import { useMemo } from 'react';
import {
  GetHighestPriorityStopDetailsByLabelAndDateQuery,
  InfoSpotDetailsFragment,
  ScheduledStopPointDetailFieldsFragment,
  StopPlaceDetailsFragment,
  StopRegistryPosterInput,
  useGetHighestPriorityStopDetailsByLabelAndDateQuery,
} from '../../generated/graphql';
import {
  StopPlaceEnrichmentProperties,
  getStopPlaceDetailsForEnrichment,
  getStopPlacesFromQueryResult,
} from '../../utils';
import { useObservationDateQueryParam } from '../urlQuery';
import { useRequiredParams } from '../useRequiredParams';

const GQL_SCHEDULED_STOP_POINT_DETAIL_FIELDS = gql`
  fragment scheduled_stop_point_detail_fields on service_pattern_scheduled_stop_point {
    priority
    direction
    scheduled_stop_point_id
    label
    timing_place_id
    timing_place {
      timing_place_id
      label
    }
    validity_start
    validity_end
    located_on_infrastructure_link_id
    stop_place_ref
    measured_location
    vehicle_mode_on_scheduled_stop_point {
      vehicle_mode
    }
  }
`;

const GQL_GET_HIGHEST_PRIORITY_STOP_DETAILS_BY_LABEL_AND_DATE = gql`
  query GetHighestPriorityStopDetailsByLabelAndDate(
    $label: String!
    $observationDate: date!
  ) {
    service_pattern_scheduled_stop_point(
      where: {
        _and: [
          { label: { _eq: $label } }
          {
            _and: [
              {
                _or: [
                  { validity_start: { _lte: $observationDate } }
                  { validity_start: { _is_null: true } }
                ]
              }
              {
                _or: [
                  { validity_end: { _gte: $observationDate } }
                  { validity_end: { _is_null: true } }
                ]
              }
            ]
          }
        ]
      }
      order_by: { priority: desc }
      limit: 1
    ) {
      ...scheduled_stop_point_detail_fields
      stop_place(onlyMonomodalStopPlaces: true) {
        ...stop_place_details
      }
    }
  }
`;

const GQL_SHELTER_EQUIPMENT_DETAILS = gql`
  fragment shelter_equipment_details on stop_registry_ShelterEquipment {
    id
    enclosed
    stepFree
    shelterType
    shelterElectricity
    shelterLighting
    shelterCondition
    timetableCabinets
    trashCan
    shelterHasDisplay
    bicycleParking
    leaningRail
    outsideBench
    shelterFasciaBoardTaping
  }
`;

const GQL_QUAY_DETAILS = gql`
  fragment quay_details on stop_registry_Quay {
    id
    publicCode
    alternativeNames {
      name {
        lang
        value
      }
      nameType
    }
    placeEquipments {
      id
      shelterEquipment {
        ...shelter_equipment_details
      }
      cycleStorageEquipment {
        cycleStorageType
      }
    }
  }
`;

const GQL_TOPOGRAPHIC_PLACE_DETAILS = gql`
  fragment topographic_place_details on stop_registry_TopographicPlace {
    id
    name {
      value
      lang
    }
  }
`;

const GQL_FARE_ZONE_DETAILS = gql`
  fragment fare_zone_details on stop_registry_FareZone {
    id
    name {
      value
      lang
    }
  }
`;

const GQL_HSL_ACCESSIBILITY_PROPERTIES_DETAILS = gql`
  fragment hsl_accessibility_properties_details on stop_registry_HslAccessibilityProperties {
    id
    stopAreaSideSlope
    stopAreaLengthwiseSlope
    endRampSlope
    shelterLaneDistance
    curbBackOfRailDistance
    curbDriveSideOfRailDistance
    structureLaneDistance
    stopElevationFromRailTop
    stopElevationFromSidewalk
    lowerCleatHeight
    serviceAreaWidth
    serviceAreaLength
    platformEdgeWarningArea
    guidanceTiles
    guidanceStripe
    serviceAreaStripes
    sidewalkAccessibleConnection
    stopAreaSurroundingsAccessible
    curvedStop
    stopType
    shelterType
    guidanceType
    mapType
    pedestrianCrossingRampType
    accessibilityLevel
  }
`;

const GQL_STOP_PLACE_ORGANISATION_FIELDS = gql`
  fragment stop_place_organisation_fields on stop_registry_Organisation {
    id
    name
    privateContactDetails {
      id
      email
      phone
    }
  }
`;

const GQL_STOP_PLACE_DETAILS = gql`
  fragment stop_place_details on stop_registry_StopPlace {
    id
    name {
      lang
      value
    }
    description {
      lang
      value
    }
    shortName {
      lang
      value
    }
    alternativeNames {
      name {
        lang
        value
      }
      nameType
    }
    keyValues {
      key
      values
    }
    transportMode
    stopPlaceType
    weighting
    submode
    publicCode
    privateCode {
      value
      type
    }
    geometry {
      coordinates
      type
    }
    topographicPlace {
      ...topographic_place_details
    }
    fareZones {
      ...fare_zone_details
    }
    placeEquipments {
      generalSign {
        privateCode {
          value
          type
        }
        signContentType
        numberOfFrames
        lineSignage
        mainLineSign
        replacesRailSign
        note {
          lang
          value
        }
      }
    }
    quays {
      ...quay_details
    }
    accessibilityAssessment {
      id
      hslAccessibilityProperties {
        ...hsl_accessibility_properties_details
      }
      limitations {
        id
        version
        audibleSignalsAvailable
        escalatorFreeAccess
        liftFreeAccess
        stepFreeAccess
        wheelchairAccess
      }
    }
    organisations {
      relationshipType
      organisationRef
      organisation {
        ...stop_place_organisation_fields
      }
    }
    infoSpots {
      ...info_spot_details
    }
    groups {
      id
    }
    adjacentSites {
      ref
    }
    tariffZones {
      id
    }
  }
`;

const GQL_INFO_SPOT_DETAILS = gql`
  fragment info_spot_details on stop_registry_infoSpot {
    id
    backlight
    description {
      lang
      value
    }
    displayType
    floor
    label
    posterPlaceSize
    infoSpotLocations
    infoSpotType
    purpose
    railInformation
    speechProperty
    zoneLabel
    maintenance
    poster {
      label
      posterSize
      lines
    }
  }
`;

export type StopPlace = StopPlaceDetailsFragment;
export type StopPlaceInfoSpots = InfoSpotDetailsFragment;
export type EnrichedStopPlace = StopPlace & StopPlaceEnrichmentProperties;

function sortInfoSpots(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment | null> | undefined | null,
): Array<StopPlaceInfoSpots> | null {
  if (!infoSpots) {
    return null;
  }

  return compact(infoSpots).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

function sortPosters(
  posters: ReadonlyArray<StopRegistryPosterInput | null> | undefined | null,
): Array<StopRegistryPosterInput> | null {
  if (!posters) {
    return null;
  }

  return compact(posters).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

const getEnrichedStopPlace = (
  stopPlace: StopPlace | null,
): EnrichedStopPlace | null => {
  if (!stopPlace) {
    return null;
  }

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(stopPlace),
    infoSpots: sortInfoSpots(stopPlace.infoSpots)?.map((spot) => ({
      ...spot,
      poster: spot.poster ? sortPosters(spot.poster) : null,
    })),
  };
};

/** Gets the stop details, including the stop place, depending on query parameters. */
export type StopWithDetails = ScheduledStopPointDetailFieldsFragment & {
  stop_place: EnrichedStopPlace | null;
};

const getStopDetails = (
  data: GetHighestPriorityStopDetailsByLabelAndDateQuery | undefined,
): StopWithDetails | null => {
  const stopPoint = data?.service_pattern_scheduled_stop_point[0];
  if (!stopPoint) {
    return null;
  }

  const [stopPlace] = getStopPlacesFromQueryResult<StopPlace>(
    stopPoint.stop_place,
  );
  return {
    ...stopPoint,
    stop_place: getEnrichedStopPlace(stopPlace),
  };
};

export const useGetStopDetails = () => {
  const { label } = useRequiredParams<{ label: string }>();
  const { observationDate } = useObservationDateQueryParam();

  const { data, ...rest } = useGetHighestPriorityStopDetailsByLabelAndDateQuery(
    {
      variables: { label, observationDate },
    },
  );

  const stopDetails = useMemo(() => getStopDetails(data), [data]);

  return { ...rest, stopDetails };
};
