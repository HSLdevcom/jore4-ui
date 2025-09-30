import { gql } from '@apollo/client';
import compact from 'lodash/compact';
import maxBy from 'lodash/maxBy';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import {
  AccessibilityAssessmentDetailsFragment,
  GetStopDetailsQuery,
  InfoSpotDetailsFragment,
  ServicePatternScheduledStopPointBoolExp,
  StopRegistryPosterInput,
  StopRegistryQuayInput,
  StopRegistryStopPlaceInterface,
  useGetStopDetailsQuery,
} from '../../../../generated/graphql';
import {
  useObservationDateQueryParam,
  useUrlQuery,
} from '../../../../hooks/urlQuery';
import { useRequiredParams } from '../../../../hooks/useRequiredParams';
import {
  EnrichedQuay,
  EnrichedStopPlace,
  Quay,
  StopPlace,
  StopPlaceInfoSpots,
  StopWithDetails,
} from '../../../../types';
import { Priority } from '../../../../types/enums';
import {
  findKeyValue,
  getQuayDetailsForEnrichment,
  getStopPlaceDetailsForEnrichment,
  getStopPlacesFromQueryResult,
} from '../../../../utils';

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

const GQL_GET_STOP_DETAILS = gql`
  query GetStopDetails($where: service_pattern_scheduled_stop_point_bool_exp) {
    service_pattern_scheduled_stop_point(
      where: $where
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
    shelterNumber
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
    shelterExternalId
  }
`;

const GQL_HSL_ACCESSIBILITY_ASSESSMENT_DETAILS = gql`
  fragment accessibility_assessment_details on stop_registry_AccessibilityAssessment {
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
`;

const GQL_QUAY_DETAILS = gql`
  fragment quay_details on stop_registry_Quay {
    id
    publicCode
    privateCode {
      type
      value
    }
    description {
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
    geometry {
      coordinates
      type
    }
    accessibilityAssessment {
      ...accessibility_assessment_details
    }
    keyValues {
      key
      values
    }
    infoSpots {
      ...info_spot_details
    }
    placeEquipments {
      id
      shelterEquipment {
        ...shelter_equipment_details
      }
      cycleStorageEquipment {
        cycleStorageType
      }
      generalSign {
        privateCode {
          value
          type
        }
        content {
          value
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
    scheduled_stop_point {
      ...scheduled_stop_point_detail_fields
    }
    externalLinks {
      ...external_links_details
    }
  }
`;

const GQL_EXTERNAL_LINKS_DETAILS = gql`
  fragment external_links_details on stop_registry_externalLink {
    quayId
    orderNum
    name
    location
  }
`;

const GQL_TOPOGRAPHIC_PLACE_DETAILS = gql`
  fragment topographic_place_details on stop_registry_TopographicPlace {
    id
    topographicPlaceType
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
    width
    height
    infoSpotLocations
    infoSpotType
    purpose
    railInformation
    speechProperty
    zoneLabel
    poster {
      label
      width
      height
      lines
    }
    geometry {
      type
      coordinates
    }
  }
`;

function sortInfoSpots(
  infoSpots: ReadonlyArray<InfoSpotDetailsFragment | null> | undefined | null,
): Array<StopPlaceInfoSpots> {
  return compact(infoSpots).sort((a, b) =>
    (a.label ?? '').localeCompare(b.label ?? ''),
  );
}

function sortPosters(
  posters: ReadonlyArray<StopRegistryPosterInput | null> | undefined | null,
): Array<StopRegistryPosterInput> {
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

  const transformedStopPlace = {
    ...stopPlace,
    parentStopPlace: stopPlace.parentStopPlace
      ? [stopPlace.parentStopPlace as StopRegistryStopPlaceInterface]
      : undefined,
  };

  return {
    ...stopPlace,
    ...getStopPlaceDetailsForEnrichment(transformedStopPlace),
  };
};

const getEnrichedQuay = (
  quay: Quay | null | undefined,
  accessibilityAssessment:
    | AccessibilityAssessmentDetailsFragment
    | null
    | undefined,
): EnrichedQuay | null => {
  if (!quay) {
    return null;
  }
  return {
    ...quay,
    ...getQuayDetailsForEnrichment(quay, accessibilityAssessment),
  };
};

function validOn(observationDateTs: number) {
  return (quay: Quay) => {
    const validityStart = quay.scheduled_stop_point?.validity_start;
    const validityEnd = quay.scheduled_stop_point?.validity_end;

    if (!validityStart || validityStart.valueOf() > observationDateTs) {
      return false;
    }

    if (validityEnd && validityEnd.valueOf() < observationDateTs) {
      return false;
    }

    return true;
  };
}

function getCorrectQuay(
  quays: ReadonlyArray<Quay | null | undefined> | null | undefined,
  requestedPublicCode: string,
  observationDateTs: number,
  priority: number,
): Quay | null {
  const validQuays = compact(quays)
    .filter((it) => it.publicCode === requestedPublicCode)
    .filter(validOn(observationDateTs));

  if (Number.isFinite(priority)) {
    return (
      validQuays.find(
        (quay) => findKeyValue(quay, 'priority') === String(priority),
      ) ?? null
    );
  }

  // Ignore drafts by default. Only show if requested separately by priority query param.
  // This is to align the behaviour of the page with how the map works.
  const nonDraftQuays = validQuays.filter(
    (quay) => Number(findKeyValue(quay, 'priority')) !== Priority.Draft,
  );
  return (
    maxBy(nonDraftQuays, (quay) => Number(findKeyValue(quay, 'priority'))) ??
    null
  );
}

function sortQuayInfoSpots(quay: Quay | null): Quay | null {
  if (!quay) {
    return null;
  }

  return {
    ...quay,
    infoSpots: sortInfoSpots(quay.infoSpots).map((infoSpot) => ({
      ...infoSpot,
      poster: sortPosters(infoSpot.poster),
    })),
  };
}

const getStopDetails = (
  data: GetStopDetailsQuery | undefined,
  observationDateTs: number,
  priority: number,
): StopWithDetails | null => {
  const stopPoint = data?.service_pattern_scheduled_stop_point[0];
  if (!stopPoint) {
    return null;
  }

  const [stopPlace] = getStopPlacesFromQueryResult<StopPlace>(
    stopPoint.stop_place,
  );

  const selectedQuay = getCorrectQuay(
    stopPlace.quays,
    stopPoint.label,
    observationDateTs,
    priority,
  );

  const selectedQuayWithSortedInfoSpots = sortQuayInfoSpots(selectedQuay);

  return {
    ...stopPoint,
    stop_place: getEnrichedStopPlace(stopPlace),
    quay: getEnrichedQuay(
      selectedQuayWithSortedInfoSpots,
      stopPlace?.accessibilityAssessment,
    ),
  };
};

function getWhereCondition(
  label: string,
  observationDate: DateTime,
  priority: number,
): ServicePatternScheduledStopPointBoolExp {
  const labelCondition: ServicePatternScheduledStopPointBoolExp = {
    label: { _eq: label },
  };

  const observationDateCondition: ServicePatternScheduledStopPointBoolExp = {
    _and: [
      { validity_start: { _lte: observationDate } },
      {
        _or: [
          { validity_end: { _gte: observationDate } },
          { validity_end: { _is_null: true } },
        ],
      },
    ],
  };

  // Ignore drafts by default. Only show if requested separately by priority query param.
  // This is to align the behaviour of the page with how the map works.
  const priorityCondition: ServicePatternScheduledStopPointBoolExp =
    Number.isFinite(priority)
      ? { priority: { _eq: priority } }
      : { priority: { _neq: Priority.Draft } };

  return {
    _and: [labelCondition, observationDateCondition, priorityCondition],
  };
}

export const useGetStopDetails = () => {
  const { label } = useRequiredParams<{ label: string }>();
  const { observationDate } = useObservationDateQueryParam();
  const { queryParams } = useUrlQuery();
  const priority = Number(queryParams.priority);

  const where = getWhereCondition(label, observationDate, priority);
  const { data, ...rest } = useGetStopDetailsQuery({ variables: { where } });

  const observationDateTs = observationDate.valueOf();
  const stopDetails = useMemo(
    () => getStopDetails(data, observationDateTs, priority),
    [data, observationDateTs, priority],
  );

  return { ...rest, stopDetails };
};

export const getQuayIdsFromStopExcept = (
  stop: StopWithDetails | null,
  quayId: string | null | undefined,
): Array<StopRegistryQuayInput> =>
  stop?.stop_place?.quays
    ?.map((quay) => quay?.id)
    .filter((id) => id !== quayId)
    .map((id) => ({ id })) ?? [];
