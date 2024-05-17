import { gql } from '@apollo/client';
import {
  ScheduledStopPointDetailFieldsFragment,
  StopPlaceDetailsFragment,
  useGetStopDetailsByIdQuery,
} from '../../generated/graphql';
import {
  StopPlaceEnrichmentProperties,
  getStopPlaceDetailsForEnrichment,
  getStopPlaceFromQueryResult,
} from '../../utils';
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
  }
`;

const GQL_GET_STOP_DETAILS_BY_ID = gql`
  query GetStopDetailsById($scheduled_stop_point_id: uuid!) {
    service_pattern_scheduled_stop_point_by_pk(
      scheduled_stop_point_id: $scheduled_stop_point_id
    ) {
      ...scheduled_stop_point_detail_fields
      stop_place {
        ...stop_place_details
      }
    }
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
      shelterEquipment {
        enclosed
        stepFree
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
  }
`;

const GQL_STOP_PLACE_DETAILS = gql`
  fragment stop_place_details on stop_registry_StopPlace {
    id
    name {
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
    weighting
    submode
    publicCode
    privateCode {
      value
      type
    }
    description {
      lang
      value
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
  }
`;

export type StopPlace = StopPlaceDetailsFragment;
export type EnrichedStopPlace = StopPlace & StopPlaceEnrichmentProperties;

const getEnrichedStopPlace = (
  stopPlace: StopPlace | null,
): EnrichedStopPlace | null => {
  if (!stopPlace) {
    return null;
  }

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(stopPlace),
  };
};

/** Gets the stop details, including the stop place, depending on query parameters. */
export type StopWithDetails = ScheduledStopPointDetailFieldsFragment & {
  stop_place: EnrichedStopPlace | null;
};

export const useGetStopDetails = (): {
  stopDetails: StopWithDetails | null | undefined;
} => {
  const { id } = useRequiredParams<{ id: string }>();
  // TODO: observation date?

  const result = useGetStopDetailsByIdQuery({
    variables: { scheduled_stop_point_id: id },
  });
  const stopDetails = result.data?.service_pattern_scheduled_stop_point_by_pk;

  return {
    stopDetails: stopDetails && {
      ...stopDetails,
      stop_place: getEnrichedStopPlace(
        getStopPlaceFromQueryResult<StopPlace>(stopDetails.stop_place),
      ),
    },
  };
};
